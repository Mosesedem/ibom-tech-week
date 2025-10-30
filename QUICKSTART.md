# 🚀 Quick Start Guide - Payment Integration

## Step 1: Install Dependencies

The required packages are already in package.json, but make sure they're installed:

```bash
pnpm install
# or
npm install
```

## Step 2: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your API keys:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Get from https://dashboard.paystack.com/#/settings/developer
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# Get from your Etegram dashboard
ETEGRAM_SECRET_KEY=your_etegram_secret_key
NEXT_PUBLIC_ETEGRAM_PUBLIC_KEY=your_etegram_public_key
```

## Step 3: Get Your API Keys

### Paystack:

1. Go to https://dashboard.paystack.com
2. Sign up or log in
3. Navigate to **Settings** → **API Keys & Webhooks**
4. Copy your **Test Public Key** (pk*test*...)
5. Copy your **Test Secret Key** (sk*test*...)

### Etegram:

1. Go to your Etegram dashboard
2. Navigate to Developer/API settings
3. Copy your public and secret keys

## Step 4: Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Payment Flow

### Test Paystack Payment:

1. Select tickets and fill in attendee information
2. Choose **Paystack** as payment method
3. Click **Pay Now**
4. Use these test card details:
   - **Card:** 4084084084084081
   - **CVV:** 408
   - **Expiry:** 12/25 (any future date)
   - **PIN:** 0000
   - **OTP:** 123456

### Test Etegram Payment:

1. Select tickets and fill in attendee information
2. Choose **Etegram** as payment method
3. Click **Pay Now**
4. Follow the Etegram test payment flow

## Step 6: Verify Everything Works

✅ Payment popup/iframe opens  
✅ Test payment completes  
✅ Success message appears  
✅ Order summary shows correct amount  
✅ No errors in browser console

## Common Issues & Solutions

### ❌ "Payment system not ready"

**Solution:** Check that the Paystack/Etegram scripts are loading. Check browser console for script loading errors.

### ❌ "Failed to initialize payment"

**Solution:** Verify your API keys are correct in `.env.local`. Make sure you're using **test keys** (pk*test*..., sk*test*...).

### ❌ Payment popup doesn't open

**Solution:**

1. Check browser console for errors
2. Ensure `.env.local` file exists and has the correct keys
3. Restart the dev server after adding environment variables

### ❌ "Paystack configuration missing"

**Solution:** Your `PAYSTACK_SECRET_KEY` is not set or is incorrect. Check `.env.local`.

### ❌ "Etegram configuration missing"

**Solution:** Your `ETEGRAM_SECRET_KEY` is not set. Check `.env.local`.

## File Structure

```
ibom-tech-week/
├── app/
│   ├── api/
│   │   └── payment/
│   │       ├── process/
│   │       │   └── route.ts          # Initialize payments
│   │       └── verify/
│   │           └── route.ts          # Verify payments
│   ├── layout.tsx                    # Added Toaster
│   └── page.tsx                      # Main page with callback handling
├── components/
│   ├── etegram-payment.tsx           # Etegram payment UI
│   └── paystack-payment.tsx          # Paystack payment UI
├── lib/
│   └── payment-utils.ts              # Payment helper functions
├── .env.local                        # Your API keys (git-ignored)
├── .env.example                      # Template for environment variables
├── PAYMENT_SETUP.md                  # Detailed documentation
└── PAYMENT_CHANGES.md                # Summary of changes
```

## What's Next?

Once you've tested successfully:

1. **Production Setup:**

   - Replace test keys with live keys
   - Update `NEXT_PUBLIC_BASE_URL` to your domain
   - Test thoroughly before going live

2. **Optional Enhancements:**

   - Set up webhook handlers for payment notifications
   - Add email confirmations
   - Implement database persistence
   - Add admin dashboard for viewing payments

3. **Documentation:**
   - Read `PAYMENT_SETUP.md` for complete documentation
   - Read `PAYMENT_CHANGES.md` for detailed changes

## Need Help?

1. Check `PAYMENT_SETUP.md` for detailed docs
2. Check browser console for errors
3. Verify environment variables are correct
4. Make sure you restarted the dev server after adding env vars
5. Check Paystack/Etegram documentation

---

**Happy Testing! 🎉**
