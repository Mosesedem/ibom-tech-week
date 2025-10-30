# IBOM Tech Week 2025 - Quick Start Guide

## 🎯 All Features Implemented

✅ **Primary/Secondary Color Theme** - Orange/Amber branding throughout  
✅ **Reset Button** - Clears session except successful purchases  
✅ **Editable Order Summary** - Modify quantities and remove items  
✅ **Hero Section** - Engaging design for desktop with H1 and description  
✅ **Geocoding API** - Real address lookup instead of hardcoded coordinates  
✅ **Prisma + PostgreSQL** - Database tracking for attempted and successful purchases

## 🚀 Quick Setup (2 minutes)

### Step 1: Run Setup Script

```bash
./setup.sh
```

This will:

- Create `.env` from template
- Install dependencies
- Generate Prisma client
- Guide you through database setup

### Step 2: Manual Setup (Alternative)

If you prefer manual setup:

```bash
# 1. Create .env file
cp .env.example .env

# 2. Update DATABASE_URL in .env with your PostgreSQL connection string

# 3. Install dependencies
pnpm install

# 4. Generate Prisma client
pnpm exec prisma generate

# 5. Run database migration
pnpm exec prisma migrate dev --name init

# 6. Start development server
pnpm dev
```

## 📝 Environment Variables

Update these in your `.env` file:

```env
# Required: Database
DATABASE_URL="postgresql://user:password@localhost:5432/ibom_tech_week?schema=public"

# Required: Payment
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
ETEGRAM_PUBLIC_KEY=etg_public_xxx

# Required: App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza_xxx
```

## 🗄️ Database Options

### Option 1: Supabase (Recommended - Free)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string (Settings → Database → Connection String → URI)
4. Paste into `DATABASE_URL` in `.env`
5. Run `pnpm exec prisma migrate dev --name init`

### Option 2: Local PostgreSQL

1. Install PostgreSQL
2. Create database: `createdb ibom_tech_week`
3. Update `DATABASE_URL` with local credentials
4. Run `pnpm exec prisma migrate dev --name init`

### Option 3: Other Cloud Providers

- Railway (railway.app)
- Neon (neon.tech)
- Vercel Postgres
- AWS RDS

## 🎨 New Features Overview

### 1. Editable Order Summary

- Click "Edit" button in order summary
- Use +/- buttons or type quantity directly
- Remove items with trash icon
- Changes update totals instantly

### 2. Reset Session

- Desktop: Reset button in hero section
- Mobile: Reset button above ticket selection
- Clears cart and form data
- Preserves successful purchases in database

### 3. Hero Section

- Only visible on desktop (screens ≥1024px)
- Gradient background with primary colors
- Large title and description
- Smooth scroll to ticket selection

### 4. Smart Geocoding

- Enter any address in EventMap component
- With Google Maps API: Real-time geocoding
- Without API: Falls back to known locations
- Supports "Ceedapeg Hotels" and "Uyo, Nigeria"

### 5. Database Purchase Tracking

All purchases are saved to database:

- **Status: attempted** - When payment initiated
- **Status: successful** - When payment verified
- **Status: failed** - When payment fails

View purchases:

```bash
pnpm exec prisma studio
```

## 🎨 Color Theme

The app now uses CSS variables for theming:

- **Primary**: Orange (#EA580C) - Buttons, headers, emphasis
- **Secondary**: Amber (#F59E0B) - Accents, secondary actions
- **Accent**: Light orange - Subtle backgrounds

All components automatically adjust for dark mode.

## 🧪 Testing Checklist

- [ ] Select a ticket package
- [ ] Verify order summary shows correctly
- [ ] Click "Edit" and modify quantities
- [ ] Remove an item from cart
- [ ] Fill attendee form
- [ ] Click "Reset Session" button
- [ ] Verify geocoding works for different addresses
- [ ] Test payment flow (with test API keys)
- [ ] Check database in Prisma Studio

## 📊 View Database

```bash
pnpm exec prisma studio
```

Opens browser at http://localhost:5555 to view/edit data.

## 🐛 Troubleshooting

### "Module '@prisma/client' has no exported member 'PrismaClient'"

**Solution**: Run `pnpm exec prisma generate`

### Map not showing

**Solution**:

- Check if Google Maps API key is set
- App falls back to showing address without API key
- Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for live maps

### Database connection error

**Solution**:

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check username/password/database name
- For cloud databases, check IP whitelist

### Payment not working

**Solution**:

- Verify payment API keys in `.env`
- Use test keys for development
- Check `NEXT_PUBLIC_BASE_URL` is correct

## 📁 Key Files Changed

```
app/
  ├── page.tsx                  → Added hero & reset button
  ├── globals.css               → Primary/secondary colors
  └── api/
      ├── maps/geocode/         → Enhanced geocoding
      └── payment/
          ├── process/          → Saves attempted purchases
          └── verify/           → Updates successful purchases

components/
  ├── order-summary.tsx         → Editable with +/- controls
  ├── header.tsx                → Uses primary colors
  └── event-map.tsx             → Uses geocoding API

lib/
  └── prisma.ts                 → Prisma client singleton

prisma/
  └── schema.prisma             → Purchase model definition

hooks/
  └── use-session.ts            → Added resetSession()
```

## 🚀 Deploy to Production

### Vercel (Recommended)

```bash
# 1. Connect to Vercel
vercel

# 2. Set environment variables in Vercel dashboard
# 3. Deploy
vercel --prod
```

### Environment Variables for Production

Set these in your hosting platform:

- All variables from `.env.example`
- Use production payment API keys
- Use production database URL
- Update `NEXT_PUBLIC_BASE_URL` to your domain

## 📚 Additional Resources

- `IMPLEMENTATION_SUMMARY.md` - Detailed technical documentation
- `PAYMENT_SETUP.md` - Payment integration guide
- `QUICKSTART.md` - Original quick start guide

## 💡 Tips

1. **Development**: Use Prisma Studio to inspect database
2. **Testing Payments**: Use test API keys from payment providers
3. **Geocoding**: Optional - app works without Google Maps API
4. **Reset Button**: Only clears current session, DB data persists
5. **Order Edit**: Changes are temporary until new ticket selected

## ✅ All Done!

Your IBOM Tech Week registration system is now ready with:

- ✨ Beautiful primary/secondary color theme
- 🔄 Session reset functionality
- ✏️ Editable order summary
- 🎨 Engaging hero section
- 📍 Smart address geocoding
- 💾 Complete purchase tracking

Run `pnpm dev` and visit http://localhost:3000 to see it in action!
