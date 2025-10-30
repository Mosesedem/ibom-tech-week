"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventMap } from "@/components/event-map";
import { MapPin, Calendar, Ticket, Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface OrderSummaryProps {
  cart: Array<{
    ticketType: string;
    quantity: number;
    price: number;
  }>;
  onUpdateQuantity?: (ticketType: string, quantity: number) => void;
  onRemoveItem?: (ticketType: string) => void;
}

const TICKET_NAMES: Record<string, string> = {
  regular: "Regular",
  vip: "VIP",
  vvip: "VVIP",
  corporate: "Corporate",
  premium: "Premium",
};

export function OrderSummary({
  cart,
  onUpdateQuantity,
  onRemoveItem,
}: OrderSummaryProps) {
  const [editMode, setEditMode] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + tax;

  const handleQuantityChange = (ticketType: string, newQuantity: number) => {
    if (newQuantity >= 0 && onUpdateQuantity) {
      onUpdateQuantity(ticketType, newQuantity);
    }
  };

  const handleRemoveItem = (ticketType: string) => {
    if (onRemoveItem) {
      onRemoveItem(ticketType);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Compact Summary */}
      <Card className="lg:sticky lg:top-8 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Order Summary
            </CardTitle>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className="text-xs"
              >
                {editMode ? "Done" : "Edit"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No tickets selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Select a ticket package to continue
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start text-sm border-b pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="font-semibold text-primary">
                            {TICKET_NAMES[item.ticketType]}
                          </span>
                          {!editMode && (
                            <span className="text-muted-foreground">
                              {" "}
                              × {item.quantity}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {editMode && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center gap-1 border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleQuantityChange(
                                  item.ticketType,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.ticketType,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="h-7 w-12 text-center border-0 p-0 text-xs"
                              min="1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleQuantityChange(
                                  item.ticketType,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.ticketType)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (7.5%)</span>
                  <span className="font-medium">₦{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-3 bg-accent -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base">Total</span>
                  <span className="text-xl md:text-2xl font-bold text-primary">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Event Details Card */}
      <Card className="border-primary/20 hidden lg:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-1">Date</p>
            <p className="font-semibold">03 - 08 November 2025</p>
            <p className="text-xs text-muted-foreground">10:00 AM Daily</p>
          </div>
          <div className="border-t pt-3">
            <p className="text-muted-foreground text-xs mb-1">Location</p>
            <p className="font-semibold">Ceedapeg Hotels</p>
            <p className="text-xs text-muted-foreground">
              Chief Odiong Street, Uyo, Nigeria
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full mt-3 border-primary text-primary hover:bg-accent"
            onClick={() =>
              window.open(
                "https://maps.google.com/?q=Ceedapeg+Hotels+Uyo",
                "_blank"
              )
            }
          >
            <MapPin className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </CardContent>
      </Card>

      {/* Map */}
      <div className="hidden lg:block">
        <EventMap
          eventName="IBOM Tech Week 2025"
          eventAddress="Ceedapeg Hotels, Chief Odiong Street, Uyo, Nigeria"
        />
      </div>
    </div>
  );
}
