"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSession } from "@/hooks/use-session"

interface EtegramPaymentProps {
  onSuccess: () => void
  onBack: () => void
}

export function EtegramPayment({ onSuccess, onBack }: EtegramPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { cart, attendee, completePayment } = useSession()

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save payment to session
      completePayment("etegram", {
        transactionId: `ETG-${Date.now()}`,
        amount: total,
        method: "etegram",
      })

      // Send emails (in production, this would be a server action)
      await sendEmails()

      onSuccess()
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const sendEmails = async () => {
    // This would be a server action in production
    console.log("Sending emails...")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Transfer Details</CardTitle>
        <CardDescription>Complete your payment via bank transfer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-accent/10 p-4 rounded-lg space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Bank Name</p>
            <p className="font-semibold">Etegram Bank</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Number</p>
            <p className="font-semibold font-mono">1234567890</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Name</p>
            <p className="font-semibold">IBOM Tech Week 2025</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-semibold text-lg text-primary">₦{total.toLocaleString()}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Transaction Reference</label>
          <Input placeholder="Enter your transaction reference" className="mt-2" />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} disabled={isProcessing}>
            Back
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
          >
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
