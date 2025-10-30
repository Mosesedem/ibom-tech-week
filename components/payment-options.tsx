"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EtegramPayment } from "@/components/etegram-payment"
import { PaystackPayment } from "@/components/paystack-payment"

interface PaymentOptionsProps {
  onSuccess: () => void
  onBack: () => void
}

export function PaymentOptions({ onSuccess, onBack }: PaymentOptionsProps) {
  const [selectedPayment, setSelectedPayment] = useState<"etegram" | "paystack" | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Payment Method</h2>
        <p className="text-muted-foreground">Select how you'd like to pay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            selectedPayment === "etegram" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
          }`}
          onClick={() => setSelectedPayment("etegram")}
        >
          <CardHeader>
            <CardTitle className="text-lg">Etegram</CardTitle>
            <CardDescription>Bank Transfer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Pay via bank transfer</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedPayment === "paystack" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
          }`}
          onClick={() => setSelectedPayment("paystack")}
        >
          <CardHeader>
            <CardTitle className="text-lg">Paystack</CardTitle>
            <CardDescription>Card, USSD & More</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Pay with card, USSD, or other methods</p>
          </CardContent>
        </Card>
      </div>

      {selectedPayment === "etegram" && <EtegramPayment onSuccess={onSuccess} onBack={onBack} />}

      {selectedPayment === "paystack" && <PaystackPayment onSuccess={onSuccess} onBack={onBack} />}

      {!selectedPayment && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Back
          </Button>
        </div>
      )}
    </div>
  )
}
