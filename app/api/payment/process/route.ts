import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PaymentRequest {
  sessionId: string;
  method: "etegram" | "paystack";
  amount: number;
  attendeeEmail: string;
  attendeeName: string;
  attendeePhone?: string;
  attendeeCompany?: string;
  attendeeJobTitle?: string;
  tickets: Array<{
    ticketType: string;
    quantity: number;
    price?: number;
  }>;
}

// Generate unique payment reference
const generateReference = (method: "etegram" | "paystack") => {
  const prefix = method === "etegram" ? "ETG" : "PSK";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    // Validate payment request
    if (
      !body.sessionId ||
      !body.method ||
      !body.amount ||
      !body.attendeeEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment amount",
        },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = generateReference(body.method);

    // Save attempted purchase to database
    try {
      await prisma.purchase.create({
        data: {
          sessionId: body.sessionId,
          reference,
          status: "attempted",
          paymentMethod: body.method,
          amount: body.amount,
          attendeeEmail: body.attendeeEmail,
          attendeeName: body.attendeeName,
          attendeePhone: body.attendeePhone,
          attendeeCompany: body.attendeeCompany,
          attendeeJobTitle: body.attendeeJobTitle,
          tickets: body.tickets,
          metadata: {
            userAgent: request.headers.get("user-agent"),
            ip:
              request.headers.get("x-forwarded-for") ||
              request.headers.get("x-real-ip"),
          },
        },
      });
    } catch (dbError) {
      console.error("[Payment] Database save error:", dbError);
      // Continue with payment initialization even if DB save fails
    }

    // Initialize payment based on method
    let paymentResult;
    if (body.method === "etegram") {
      paymentResult = await initializeEtegramPayment(body, reference);
    } else if (body.method === "paystack") {
      paymentResult = await initializePaystackPayment(body, reference);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment method",
        },
        { status: 400 }
      );
    }

    console.log("[Payment] Initialized:", {
      sessionId: body.sessionId,
      method: body.method,
      reference,
      amount: body.amount,
      email: body.attendeeEmail,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      reference,
      ...paymentResult,
    });
  } catch (error) {
    console.error("[Payment] Initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment initialization failed",
      },
      { status: 500 }
    );
  }
}

async function initializeEtegramPayment(
  data: PaymentRequest,
  reference: string
) {
  // Etegram uses client-side SDK, so we just return the necessary data
  // The actual payment will be initiated on the client with etegram-pay
  return {
    method: "etegram",
    amount: data.amount,
    metadata: {
      sessionId: data.sessionId,
      attendeeEmail: data.attendeeEmail,
      attendeeName: data.attendeeName,
      tickets: data.tickets,
      reference,
    },
  };
}

async function initializePaystackPayment(
  data: PaymentRequest,
  reference: string
) {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      throw new Error("Paystack configuration missing");
    }

    // Initialize Paystack transaction
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.attendeeEmail,
          amount: data.amount * 100, // Convert to kobo
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify`,
          metadata: {
            sessionId: data.sessionId,
            attendeeName: data.attendeeName,
            tickets: data.tickets,
            custom_fields: [
              {
                display_name: "Attendee Name",
                variable_name: "attendee_name",
                value: data.attendeeName,
              },
            ],
          },
        }),
      }
    );

    const result = await response.json();

    if (!result.status || !result.data) {
      throw new Error(
        result.message || "Failed to initialize Paystack payment"
      );
    }

    return {
      method: "paystack",
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
      amount: data.amount,
    };
  } catch (error) {
    console.error("[Paystack] Initialization error:", error);
    throw error;
  }
}
