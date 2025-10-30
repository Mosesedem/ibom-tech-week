"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { TicketSelection } from "@/components/ticket-selection";
import { AttendeeForm } from "@/components/attendee-form";
import { PaymentOptions } from "@/components/payment-options";
import { OrderSummary } from "@/components/order-summary";
import { SuccessModal } from "@/components/success-modal";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

export default function Home() {
  const [step, setStep] = useState<
    "tickets" | "attendee" | "payment" | "success"
  >("tickets");
  const { cart, addToCart, updateAttendee, getSession } = useSession();
  const [showSuccess, setShowSuccess] = useState(false);
  const searchParams = useSearchParams();

  // Handle payment callback from URL
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const reference = searchParams.get("reference");

    if (paymentStatus === "success" && reference) {
      toast.success("Payment successful!");
      setShowSuccess(true);
      setTimeout(() => {
        setStep("tickets");
        setShowSuccess(false);
        // Clear URL parameters
        window.history.replaceState({}, "", "/");
      }, 3000);
    } else if (paymentStatus === "failed") {
      toast.error("Payment failed. Please try again.");
      setStep("payment");
      // Clear URL parameters
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  const handleTicketSelect = (
    ticketType: string,
    quantity: number,
    price: number
  ) => {
    addToCart(ticketType, quantity, price);
    setStep("attendee");
  };

  const handleAttendeeSubmit = (data: any) => {
    updateAttendee(data);
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setStep("tickets");
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 dark:from-background dark:via-background dark:to-background">
      <Header />

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {step === "tickets" && (
              <TicketSelection onSelect={handleTicketSelect} />
            )}
            {step === "attendee" && (
              <AttendeeForm
                onSubmit={handleAttendeeSubmit}
                onBack={() => setStep("tickets")}
              />
            )}
            {step === "payment" && (
              <PaymentOptions
                onSuccess={handlePaymentSuccess}
                onBack={() => setStep("attendee")}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>

      {showSuccess && <SuccessModal />}
    </main>
  );
}
