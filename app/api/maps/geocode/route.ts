import { type NextRequest, NextResponse } from "next/server"

interface GeocodeRequest {
  address: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GeocodeRequest = await request.json()

    if (!body.address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // In production, use Google Maps Geocoding API
    // For now, return hardcoded coordinates for Ceedapeg Hotels, Uyo
    if (body.address.toLowerCase().includes("ceedapeg") || body.address.toLowerCase().includes("uyo")) {
      return NextResponse.json({
        success: true,
        latitude: 4.9465,
        longitude: 8.6753,
        address: "Ceedapeg Hotels, Uyo, Nigeria",
      })
    }

    // Fallback for other addresses
    return NextResponse.json({
      success: true,
      latitude: 4.9465,
      longitude: 8.6753,
      address: body.address,
    })
  } catch (error) {
    console.error("[v0] Geocoding error:", error)
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 })
  }
}
