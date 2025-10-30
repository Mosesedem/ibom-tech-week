import { type NextRequest, NextResponse } from "next/server"

interface PaymentRequest {
  sessionId: string
  method: "etegram" | "paystack"
  amount: number
  attendeeEmail: string
  attendeeName: string
  tickets: Array<{
    ticketType: string
    quantity: number
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json()

    // Validate payment request
    if (!body.sessionId || !body.method || !body.amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process payment based on method
    let paymentResult
    if (body.method === "etegram") {
      paymentResult = await processEtegramPayment(body)
    } else if (body.method === "paystack") {
      paymentResult = await processPaystackPayment(body)
    } else {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    // Save payment record (in production, save to database)
    const paymentRecord = {
      sessionId: body.sessionId,
      method: body.method,
      amount: body.amount,
      attendeeEmail: body.attendeeEmail,
      transactionId: paymentResult.transactionId,
      status: "completed",
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Payment processed:", paymentRecord)

    return NextResponse.json({
      success: true,
      transactionId: paymentResult.transactionId,
      message: "Payment processed successfully",
    })
  } catch (error) {
    console.error("[v0] Payment processing error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}

async function processEtegramPayment(data: PaymentRequest) {
  // In production, integrate with Etegram API
  // For now, simulate successful payment
  return {
    transactionId: `ETG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: "success",
  }
}

async function processPaystackPayment(data: PaymentRequest) {
  // In production, integrate with Paystack API
  // For now, simulate successful payment
  return {
    transactionId: `PSK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: "success",
  }
}
