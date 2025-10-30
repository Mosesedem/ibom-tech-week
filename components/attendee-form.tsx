"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface AttendeeFormProps {
  onSubmit: (data: any) => void
  onBack: () => void
}

export function AttendeeForm({ onSubmit, onBack }: AttendeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData)
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendee Information</CardTitle>
        <CardDescription>Please provide your details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name *</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Last Name *</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Phone *</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+234 800 000 0000"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Your Company"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <Input
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="Your Position"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} type="button">
              Back
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
