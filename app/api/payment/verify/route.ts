import { type NextRequest, NextResponse } from "next/server"

interface VerifyRequest {
  transactionId: string
  method: "etegram" | "paystack"
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json()

    if (!body.transactionId || !body.method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify payment based on method
    let verificationResult
    if (body.method === "etegram") {
      verificationResult = await verifyEtegramPayment(body.transactionId)
    } else if (body.method === "paystack") {
      verificationResult = await verifyPaystackPayment(body.transactionId)
    } else {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      verified: verificationResult.verified,
      status: verificationResult.status,
    })
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}

async function verifyEtegramPayment(transactionId: string) {
  // In production, call Etegram API to verify payment
  return {
    verified: true,
    status: "completed",
  }
}

async function verifyPaystackPayment(transactionId: string) {
  // In production, call Paystack API to verify payment
  return {
    verified: true,
    status: "completed",
  }
}
