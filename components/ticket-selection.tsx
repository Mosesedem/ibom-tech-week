"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TicketSelectionProps {
  onSelect: (ticketType: string, quantity: number, price: number) => void
}

const TICKET_TYPES = [
  {
    id: "early-bird",
    name: "Early Bird",
    price: 15000,
    originalPrice: 25000,
    description: "Limited early bird tickets",
    features: ["All sessions", "Networking lunch", "Certificate"],
  },
  {
    id: "regular",
    name: "Regular",
    price: 25000,
    originalPrice: 25000,
    description: "Standard access to all events",
    features: ["All sessions", "Networking lunch", "Certificate"],
  },
  {
    id: "vip",
    name: "VIP",
    price: 50000,
    originalPrice: 50000,
    description: "Premium experience with exclusive access",
    features: ["All sessions", "VIP lounge access", "Networking lunch", "Certificate", "Merchandise"],
  },
]

export function TicketSelection({ onSelect }: TicketSelectionProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleSelect = () => {
    if (!selectedTicket) return
    const ticket = TICKET_TYPES.find((t) => t.id === selectedTicket)
    if (ticket) {
      onSelect(selectedTicket, quantity, ticket.price)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Your Tickets</h2>
        <p className="text-muted-foreground">Choose the ticket type that suits you best</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TICKET_TYPES.map((ticket) => (
          <Card
            key={ticket.id}
            className={`cursor-pointer transition-all ${
              selectedTicket === ticket.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedTicket(ticket.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{ticket.name}</CardTitle>
              <CardDescription>{ticket.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-primary">₦{ticket.price.toLocaleString()}</div>
                {ticket.originalPrice > ticket.price && (
                  <div className="text-sm text-muted-foreground line-through">
                    ₦{ticket.originalPrice.toLocaleString()}
                  </div>
                )}
              </div>
              <ul className="space-y-2">
                {ticket.features.map((feature, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTicket && (
        <Card className="bg-accent/10 border-accent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border rounded hover:bg-muted"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border rounded hover:bg-muted">
                    +
                  </button>
                </div>
              </div>
              <Button
                onClick={handleSelect}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
