"use client";

import { useState, useEffect } from "react";
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
import Script from "next/script";

interface PaystackPaymentProps {
  onSuccess: () => void;
  onBack: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  ref: string;
  callback: (response: any) => void;
  onClose: () => void;
  metadata?: any;
}

export function PaystackPayment({ onSuccess, onBack }: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
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

    // Enhanced ready check
    if (!paystackReady || !window.PaystackPop) {
      toast.error(
        "Payment system not ready. Please wait a moment and try again."
      );
      return;
    }

    // Validate public key with better error handling
    const publicKey = (
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KE ||
      "pk_test_966417844239ce59118c53dcd6c184411116f88d"
    ).trim();

    if (!publicKey) {
      console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set");
      toast.error(
        "Payment system configuration error. Please contact support."
      );
      return;
    }

    if (
      !publicKey.startsWith("pk_test_") &&
      !publicKey.startsWith("pk_live_")
    ) {
      console.error(
        "Invalid Paystack public key format. Must start with pk_test_ or pk_live_"
      );
      toast.error(
        "Payment system configuration error. Please contact support."
      );
      return;
    }

    // Log for debugging (only first 15 chars for security)
    console.log(
      "Initializing payment with key:",
      publicKey.substring(0, 15) + "..."
    );

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
          method: "paystack",
          amount: total,
          attendeeEmail: attendee.email,
          attendeeName: `${attendee.firstName} ${attendee.lastName}`,
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

      const reference = result.reference as string;
      console.log("Payment reference generated:", reference);

      // Double-check PaystackPop availability
      if (!window.PaystackPop) {
        throw new Error("Paystack SDK not loaded. Please refresh the page.");
      }

      // Define callback as a normal function
      function paymentCallback(response: any) {
        (async () => {
          try {
            console.log("Payment callback received:", response.reference);

            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                reference: response.reference,
                method: "paystack",
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (
              verifyResult.success &&
              verifyResult.data.status === "success"
            ) {
              // Save payment to session
              completePayment("paystack", {
                transactionId: response.reference,
                amount: total,
                method: "paystack",
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
        })();
      }

      // Define onClose function explicitly
      const paymentOnClose = function () {
        console.log("Payment modal closed by user");
        toast.info("Payment cancelled");
        setIsProcessing(false);
      };

      // Initialize Paystack Popup with validated config
      const config: PaystackConfig = {
        key: publicKey,
        email: attendee.email,
        amount: total * 100, // Convert to kobo
        ref: reference,
        metadata: {
          sessionId,
          custom_fields: [
            {
              display_name: "Attendee Name",
              variable_name: "attendee_name",
              value: `${attendee.firstName} ${attendee.lastName}`,
            },
            {
              display_name: "Phone Number",
              variable_name: "phone",
              value: attendee.phone,
            },
          ],
        },
        callback: paymentCallback,
        onClose: paymentOnClose,
      };

      console.log("Opening Paystack modal...");
      const handler = window.PaystackPop.setup(config);
      handler.openIframe();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Paystack SDK loaded successfully");
          setPaystackReady(true);
        }}
        onError={(e) => {
          console.error("Failed to load Paystack SDK:", e);
          toast.error(
            "Failed to load payment system. Please refresh the page."
          );
          setPaystackReady(false);
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>Card Payment</CardTitle>
          <CardDescription>
            Pay securely with your card using Paystack
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-accent/10 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-semibold">Paystack - Card, USSD & More</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="font-semibold">₦{subtotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tax (7.5%)</p>
              <p className="font-semibold">₦{tax.toLocaleString()}</p>
            </div>
            <div className="border-t pt-2 mt-2">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-primary">
                ₦{total.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              🔒 Secure payment powered by Paystack. Your card details are safe
              and encrypted.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} disabled={isProcessing}>
              Back
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !paystackReady}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              {isProcessing
                ? "Processing..."
                : !paystackReady
                ? "Loading Payment System..."
                : "Pay Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
