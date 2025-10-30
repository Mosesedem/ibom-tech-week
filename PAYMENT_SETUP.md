# Payment Integration Setup Guide

This document explains how the payment system works for both Etegram and Paystack payment providers.

## Overview

The payment flow has been redesigned to properly handle payment initialization, processing, and verification for both Etegram (bank transfer) and Paystack (card, USSD, etc.) payment methods.

## Payment Flow

### 1. Payment Initialization (Frontend)

- User selects payment method (Etegram or Paystack)
- Frontend calls `/api/payment/process` to initialize payment
- Backend generates unique payment reference
- Payment-specific initialization happens

### 2. Payment Processing

- **Paystack**: Opens Paystack Popup for card/USSD payment
- **Etegram**: Opens Etegram iframe for bank transfer
- User completes payment on the payment provider's interface

### 3. Payment Verification

- After payment completion, the callback triggers
- Frontend calls `/api/payment/verify` with payment reference
- Backend verifies payment with the payment provider's API
- On success, payment is saved to session

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key

# Etegram Configuration
ETEGRAM_SECRET_KEY=your_etegram_secret_key
NEXT_PUBLIC_ETEGRAM_PUBLIC_KEY=your_etegram_public_key
```

### Getting Your API Keys

#### Paystack

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
2. Navigate to Settings > API Keys & Webhooks
3. Copy your **Test Public Key** (starts with `pk_test_`)
4. Copy your **Test Secret Key** (starts with `sk_test_`)
5. For production, use live keys (starts with `pk_live_` and `sk_live_`)

#### Etegram

1. Log into your Etegram dashboard
2. Navigate to Developer Settings or API Keys
3. Copy your public and secret keys
4. Add them to your environment variables

## API Routes

### POST /api/payment/process

Initializes payment with the selected provider.

**Request Body:**

```json
{
  "sessionId": "session_123456",
  "method": "paystack", // or "etegram"
  "amount": 50000,
  "attendeeEmail": "user@example.com",
  "attendeeName": "John Doe",
  "attendeePhone": "08012345678",
  "tickets": [
    {
      "ticketType": "early-bird",
      "quantity": 2
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "reference": "PSK-1234567890-ABC123",
  "authorization_url": "https://checkout.paystack.com/...", // Paystack only
  "access_code": "abc123def456" // Paystack only
}
```

### POST /api/payment/verify

Verifies payment after completion.

**Request Body:**

```json
{
  "reference": "PSK-1234567890-ABC123",
  "method": "paystack" // optional, auto-detected from reference
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "success",
    "amount": 50000,
    "reference": "PSK-1234567890-ABC123",
    "paidAt": "2025-10-30T12:00:00Z",
    "channel": "card",
    "metadata": { ... }
  }
}
```

### GET /api/payment/verify?reference=xxx

Handles Paystack callback redirects. Automatically redirects to home page with payment status.

## Frontend Components

### PaystackPayment Component

Uses Paystack Popup to handle card payments.

**Features:**

- Loads Paystack script dynamically
- Initializes payment with backend
- Opens Paystack Popup
- Verifies payment on success callback
- Shows appropriate toast notifications

### EtegramPayment Component

Uses Etegram SDK for bank transfer payments.

**Features:**

- Loads Etegram script dynamically
- Initializes payment with backend
- Opens Etegram iframe
- Verifies payment on success callback
- Allows manual verification with transaction reference

## Payment Reference Format

Each payment gets a unique reference:

- **Paystack**: `PSK-{timestamp}-{random}`
- **Etegram**: `ETG-{timestamp}-{random}`

Examples:

- `PSK-1730286400000-ABC123`
- `ETG-1730286400000-XYZ789`

## Testing

### Test Cards (Paystack)

**Successful Transaction:**

- Card: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Transaction:**

- Card: `5060666666666666666`
- CVV: Any 3 digits
- Expiry: Any future date
- PIN: `0000`

### Test Etegram Payments

1. Use Etegram test mode credentials
2. Follow the test payment flow in Etegram dashboard
3. Verify using the transaction reference

## Error Handling

The system handles various error scenarios:

1. **Missing Configuration**: Shows error if API keys are not set
2. **Payment Initialization Failure**: Shows error message to user
3. **Payment Cancelled**: Shows info message when user closes popup
4. **Verification Failure**: Shows error and allows retry

## Security Best Practices

1. **Never expose secret keys** - Only use public keys in frontend
2. **Always verify on backend** - Don't trust client-side payment confirmations
3. **Use HTTPS in production** - Required by payment providers
4. **Validate webhook signatures** - If implementing webhooks
5. **Log all transactions** - Keep audit trail of all payments

## Production Checklist

Before going live:

- [ ] Replace test API keys with live keys
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production URL
- [ ] Test payment flow end-to-end
- [ ] Set up webhook endpoints (optional but recommended)
- [ ] Configure proper error logging
- [ ] Test error scenarios
- [ ] Verify email notifications work
- [ ] Set up payment confirmation page
- [ ] Add terms and conditions
- [ ] Implement refund handling (if needed)

## Troubleshooting

### Payment Popup Not Opening

- Check browser console for errors
- Verify Paystack/Etegram script loaded successfully
- Check API keys are correct and not expired

### Payment Verification Failing

- Check network tab for API errors
- Verify secret keys are correct
- Check payment provider's dashboard for transaction status
- Ensure callback URL is correct

### Environment Variables Not Working

- Restart Next.js dev server after adding new variables
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Check `.env.local` file is in root directory

## Support

For payment provider specific issues:

- **Paystack**: support@paystack.com or [Documentation](https://paystack.com/docs)
- **Etegram**: Check Etegram support documentation

For integration issues, check the code comments or contact the development team.
