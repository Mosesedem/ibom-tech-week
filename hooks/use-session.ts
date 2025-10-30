"use client"

import { useState, useCallback } from "react"

interface CartItem {
  ticketType: string
  quantity: number
  price: number
}

interface AttendeeData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
}

interface PaymentData {
  transactionId: string
  amount: number
  method: "etegram" | "paystack"
  timestamp: string
}

interface SessionData {
  cart: CartItem[]
  attendee: AttendeeData | null
  payment: PaymentData | null
  sessionId: string
}

const SESSION_STORAGE_KEY = "ticket_booking_session"

export function useSession() {
  const [sessionData, setSessionData] = useState<SessionData>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          // If parsing fails, return default
        }
      }
    }
    return {
      cart: [],
      attendee: null,
      payment: null,
      sessionId: generateSessionId(),
    }
  })

  // Persist to localStorage whenever sessionData changes
  const updateSession = useCallback((newData: SessionData) => {
    setSessionData(newData)
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newData))
    }
  }, [])

  const addToCart = useCallback(
    (ticketType: string, quantity: number, price: number) => {
      const newCart = [...sessionData.cart]
      const existingItem = newCart.find((item) => item.ticketType === ticketType)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        newCart.push({ ticketType, quantity, price })
      }

      updateSession({
        ...sessionData,
        cart: newCart,
      })
    },
    [sessionData, updateSession],
  )

  const removeFromCart = useCallback(
    (ticketType: string) => {
      const newCart = sessionData.cart.filter((item) => item.ticketType !== ticketType)
      updateSession({
        ...sessionData,
        cart: newCart,
      })
    },
    [sessionData, updateSession],
  )

  const updateCartQuantity = useCallback(
    (ticketType: string, quantity: number) => {
      const newCart = sessionData.cart.map((item) =>
        item.ticketType === ticketType ? { ...item, quantity: Math.max(0, quantity) } : item,
      )
      updateSession({
        ...sessionData,
        cart: newCart.filter((item) => item.quantity > 0),
      })
    },
    [sessionData, updateSession],
  )

  const updateAttendee = useCallback(
    (attendeeData: AttendeeData) => {
      updateSession({
        ...sessionData,
        attendee: attendeeData,
      })
    },
    [sessionData, updateSession],
  )

  const completePayment = useCallback(
    (method: "etegram" | "paystack", paymentInfo: { transactionId: string; amount: number; method: string }) => {
      updateSession({
        ...sessionData,
        payment: {
          transactionId: paymentInfo.transactionId,
          amount: paymentInfo.amount,
          method: method,
          timestamp: new Date().toISOString(),
        },
      })
    },
    [sessionData, updateSession],
  )

  const clearSession = useCallback(() => {
    const clearedSession: SessionData = {
      cart: [],
      attendee: null,
      payment: null,
      sessionId: generateSessionId(),
    }
    updateSession(clearedSession)
  }, [updateSession])

  const getSession = useCallback(() => {
    return sessionData
  }, [sessionData])

  return {
    cart: sessionData.cart,
    attendee: sessionData.attendee,
    payment: sessionData.payment,
    sessionId: sessionData.sessionId,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateAttendee,
    completePayment,
    clearSession,
    getSession,
  }
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
