"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";
import { payWithEtegram } from "etegram-pay";

interface EtegramPaymentProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function EtegramPayment({ onSuccess, onBack }: EtegramPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  // Removed manual verification input
  const { cart, attendee, completePayment, sessionId } = useSession();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + tax;

  const handlePayment = async () => {
    if (!attendee) {
      toast.error("Attendee information is missing");
      return;
    }

    setIsProcessing(true);
    try {
      const publicKey = process.env.NEXT_PUBLIC_ETEGRAM_PUBLIC_KEY || "";
      if (!publicKey) {
        throw new Error(
          "Etegram public key not configured. Set NEXT_PUBLIC_ETEGRAM_PUBLIC_KEY."
        );
      }

      // Initialize payment with backend
      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          method: "etegram",
          amount: total,
          attendeeEmail: attendee.email,
          attendeeName: `${attendee.firstName} ${attendee.lastName}`,
          attendeePhone: attendee.phone,
          tickets: cart.map((item) => ({
            ticketType: item.ticketType,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();
      if (!result?.success) {
        throw new Error(result?.error || "Failed to initialize payment");
      }

      const reference: string = result.reference as string;

      // SDK-only mode: verify by reference on server after success

      const handleSdkSuccess = async (sdkResponse: any) => {
        try {
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference: sdkResponse?.reference || reference,
              method: "etegram",
              // SDK-only: verify by reference (server will use secret key fallback)
            }),
          });
          const verifyResult = await verifyResponse.json();

          if (verifyResult.success && verifyResult.data.status === "success") {
            completePayment("etegram", {
              transactionId: sdkResponse?.reference || reference,
              amount: total,
              method: "etegram",
            });
            toast.success("Payment successful!");
            onSuccess();
          } else {
            toast.error("Payment verification failed");
          }
        } catch (err) {
          console.error("Payment verification error:", err);
          toast.error("Failed to verify payment");
        } finally {
          setIsProcessing(false);
        }
      };

      const handleSdkClose = () => {
        toast.info("Payment cancelled");
        setIsProcessing(false);
      };

      // Open Etegram checkout modal via SDK
      try {
        // Some SDKs don't return a promise; avoid relying on await
        (payWithEtegram as any)({
          key: publicKey,
          email: attendee.email,
          amount: Number(total),
          ref: reference,
          firstname: attendee.firstName,
          lastname: attendee.lastName,
          phone: attendee.phone,
          onSuccess: handleSdkSuccess,
          onClose: handleSdkClose,
        });
      } catch (sdkErr) {
        console.error("[Etegram] SDK error", sdkErr);
        throw new Error("Failed to launch Etegram checkout. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Transfer Payment</CardTitle>
        <CardDescription>
          Complete your payment via bank transfer using Etegram
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-accent/10 p-4 rounded-lg space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-semibold">Etegram Bank Transfer</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-semibold text-lg text-primary">
              ₦{total.toLocaleString()}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            You will be redirected to complete the payment
          </div>
        </div>

        {/* Manual verification section removed per requirements */}

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
  );
}
