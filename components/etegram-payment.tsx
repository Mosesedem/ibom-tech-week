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
import { Input } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

interface EtegramPaymentProps {
  onSuccess: () => void;
  onBack: () => void;
}

// Declare Etegram types
declare global {
  interface Window {
    EtegramPay?: {
      setup: (config: EtegramConfig) => {
        openIframe: () => void;
      };
    };
  }
}

interface EtegramConfig {
  key: string;
  email: string;
  amount: number;
  ref: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  onSuccess?: (response: any) => void;
  onClose?: () => void;
}

export function EtegramPayment({ onSuccess, onBack }: EtegramPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
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
      // Initialize payment with backend
      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      if (!result.success) {
        throw new Error(result.error || "Failed to initialize payment");
      }

      const reference = result.reference;

      // Check if Etegram SDK is loaded
      if (typeof window.EtegramPay === "undefined") {
        toast.error("Payment system not loaded. Please refresh the page.");
        setIsProcessing(false);
        return;
      }

      // Initialize Etegram payment
      const handler = window.EtegramPay.setup({
        key: process.env.NEXT_PUBLIC_ETEGRAM_PUBLIC_KEY || "",
        email: attendee.email,
        amount: total,
        ref: reference,
        firstname: attendee.firstName,
        lastname: attendee.lastName,
        phone: attendee.phone,
        onSuccess: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                reference: response.reference || reference,
                method: "etegram",
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (
              verifyResult.success &&
              verifyResult.data.status === "success"
            ) {
              // Save payment to session
              completePayment("etegram", {
                transactionId: reference,
                amount: total,
                method: "etegram",
              });

              toast.success("Payment successful!");
              onSuccess();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Failed to verify payment");
          } finally {
            setIsProcessing(false);
          }
        },
        onClose: () => {
          toast.info("Payment cancelled");
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  const handleManualVerification = async () => {
    if (!transactionRef.trim()) {
      toast.error("Please enter a transaction reference");
      return;
    }

    setIsProcessing(true);
    try {
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference: transactionRef,
          method: "etegram",
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success && verifyResult.data.status === "success") {
        completePayment("etegram", {
          transactionId: transactionRef,
          amount: total,
          method: "etegram",
        });

        toast.success("Payment verified successfully!");
        onSuccess();
      } else {
        toast.error(
          "Payment verification failed. Please check your reference."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to verify payment");
    } finally {
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

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Already made payment?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Enter your transaction reference below to verify
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter transaction reference"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              disabled={isProcessing}
            />
            <Button
              onClick={handleManualVerification}
              disabled={isProcessing || !transactionRef.trim()}
              variant="outline"
            >
              Verify
            </Button>
          </div>
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
  );
}
