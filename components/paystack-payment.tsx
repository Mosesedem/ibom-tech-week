"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSession } from "@/hooks/use-session"

interface PaystackPaymentProps {
  onSuccess: () => void
  onBack: () => void
}

export function PaystackPayment({ onSuccess, onBack }: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })
  const { cart, attendee, completePayment } = useSession()

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save payment to session
      completePayment("paystack", {
        transactionId: `PSK-${Date.now()}`,
        amount: total,
        method: "paystack",
      })

      // Send emails
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
        <CardTitle>Card Payment</CardTitle>
        <CardDescription>Enter your card details to complete payment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Card Number</label>
          <Input
            placeholder="1234 5678 9012 3456"
            value={cardData.cardNumber}
            onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Expiry Date</label>
            <Input
              placeholder="MM/YY"
              value={cardData.expiryDate}
              onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">CVV</label>
            <Input
              placeholder="123"
              value={cardData.cvv}
              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold text-primary">₦{total.toLocaleString()}</p>
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
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
