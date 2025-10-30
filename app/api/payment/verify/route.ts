import { type NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

interface VerifyRequest {
  reference: string;
  method?: "etegram" | "paystack";
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();

    if (!body.reference) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing payment reference",
        },
        { status: 400 }
      );
    }

    // Determine payment method from reference prefix
    const method =
      body.method ||
      (body.reference.startsWith("ETG") ? "etegram" : "paystack");

    // Verify payment based on method
    let verificationResult;
    if (method === "etegram") {
      verificationResult = await verifyEtegramPayment(body.reference);
    } else if (method === "paystack") {
      verificationResult = await verifyPaystackPayment(body.reference);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment method",
        },
        { status: 400 }
      );
    }

    // Log successful verification
    if (verificationResult.success) {
      console.log("[Payment] Verified:", {
        reference: body.reference,
        method,
        amount: verificationResult.amount,
        status: verificationResult.status,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: verificationResult.success,
      data: verificationResult,
    });
  } catch (error) {
    console.error("[Payment] Verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment verification failed",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for Paystack callback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");

  if (!reference) {
    return redirect("/?payment=failed");
  }

  try {
    const verificationResult = await verifyPaystackPayment(reference);

    if (verificationResult.success && verificationResult.status === "success") {
      // Redirect to success page with reference
      return redirect(`/?payment=success&reference=${reference}`);
    } else {
      return redirect(`/?payment=failed&reference=${reference}`);
    }
  } catch (error) {
    console.error("[Payment] Callback verification error:", error);
    return redirect("/?payment=failed");
  }
}

async function verifyEtegramPayment(reference: string) {
  try {
    const etegramSecretKey = process.env.ETEGRAM_SECRET_KEY;

    if (!etegramSecretKey) {
      throw new Error("Etegram configuration missing");
    }

    // Verify with Etegram API
    const response = await fetch(
      `https://api.etegram.com/api/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${etegramSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Etegram verification failed");
    }

    return {
      success: result.status === "success",
      status: result.status,
      amount: result.amount / 100, // Convert from kobo to naira
      reference: result.reference,
      paidAt: result.paid_at,
      channel: result.channel,
      metadata: result.metadata,
    };
  } catch (error) {
    console.error("[Etegram] Verification error:", error);
    return {
      success: false,
      status: "failed",
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

async function verifyPaystackPayment(reference: string) {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      throw new Error("Paystack configuration missing");
    }

    // Verify with Paystack API
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.status || !result.data) {
      throw new Error(result.message || "Paystack verification failed");
    }

    return {
      success: result.data.status === "success",
      status: result.data.status,
      amount: result.data.amount / 100, // Convert from kobo to naira
      reference: result.data.reference,
      paidAt: result.data.paid_at,
      channel: result.data.channel,
      customer: result.data.customer,
      metadata: result.data.metadata,
    };
  } catch (error) {
    console.error("[Paystack] Verification error:", error);
    return {
      success: false,
      status: "failed",
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}
