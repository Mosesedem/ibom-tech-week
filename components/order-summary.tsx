"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EventMap } from "@/components/event-map"

interface OrderSummaryProps {
  cart: Array<{
    ticketType: string
    quantity: number
    price: number
  }>
}

const TICKET_NAMES: Record<string, string> = {
  "early-bird": "Early Bird",
  regular: "Regular",
  vip: "VIP",
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.075)
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tickets selected</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {TICKET_NAMES[item.ticketType]} × {item.quantity}
                    </span>
                    <span className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold text-primary">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                Get Directions
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <EventMap
        latitude={4.9465}
        longitude={8.6753}
        eventName="IBOM Tech Week 2025"
        eventAddress="Ceedapeg Hotels, Uyo"
      />
    </div>
  )
}
