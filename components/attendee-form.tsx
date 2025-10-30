"use client";

import type React from "react";

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
import { User, Mail, Phone, Building2, Briefcase } from "lucide-react";

interface AttendeeFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export function AttendeeForm({ onSubmit, onBack }: AttendeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl text-orange-600">
          Attendee Information
        </CardTitle>
        <CardDescription className="text-sm">
          Please provide your details to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium flex items-center gap-1">
                <User className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                First Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="John"
                className={`text-sm md:text-base ${
                  errors.firstName ? "border-destructive" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium flex items-center gap-1">
                <User className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                Last Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Doe"
                className={`text-sm md:text-base ${
                  errors.lastName ? "border-destructive" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium flex items-center gap-1">
              <Mail className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
              Email Address <span className="text-destructive">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
              className={`text-sm md:text-base ${
                errors.email ? "border-destructive" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium flex items-center gap-1">
              <Phone className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
              Phone Number <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+234 800 000 0000"
              className={`text-sm md:text-base ${
                errors.phone ? "border-destructive" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium flex items-center gap-1">
                <Building2 className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                Company{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </label>
              <Input
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Your Company"
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium flex items-center gap-1">
                <Briefcase className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                Job Title{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </label>
              <Input
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                placeholder="Your Position"
                className="text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onBack}
              type="button"
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold order-1 sm:order-2"
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
