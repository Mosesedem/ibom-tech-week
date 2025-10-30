"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EventMapProps {
  latitude?: number
  longitude?: number
  eventName?: string
  eventAddress?: string
}

export function EventMap({
  latitude = 4.9465,
  longitude = 8.6753,
  eventName = "IBOM Tech Week 2025",
  eventAddress = "Ceedapeg Hotels, Uyo",
}: EventMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google) {
      console.warn("[v0] Google Maps API not loaded. Add your API key to enable maps.")
      return
    }

    if (mapContainer.current && !map.current) {
      try {
        map.current = new window.google.maps.Map(mapContainer.current, {
          zoom: 15,
          center: { lat: latitude, lng: longitude },
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
        })

        // Add marker for event location
        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map.current,
          title: eventName,
          animation: window.google.maps.Animation.DROP,
        })

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 5px 0; font-size: 16px;">${eventName}</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">${eventAddress}</p>
            </div>
          `,
        })

        const marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map.current,
          title: eventName,
        })

        marker.addListener("click", () => {
          infoWindow.open(map.current, marker)
        })

        // Open info window by default
        infoWindow.open(map.current, marker)
      } catch (error) {
        console.error("[v0] Error initializing map:", error)
      }
    }

    return () => {
      // Cleanup if needed
    }
  }, [latitude, longitude, eventName, eventAddress])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Location</CardTitle>
        <CardDescription>Find us at Ceedapeg Hotels, Uyo</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={mapContainer}
          style={{
            width: "100%",
            height: "300px",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          className="bg-muted"
        >
          {!window.google && (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              <div className="text-center">
                <p className="font-semibold mb-2">Map not available</p>
                <p className="text-sm">Add your Google Maps API key to enable the map</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p className="font-semibold">{eventAddress}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
            <p className="font-mono text-sm">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(eventAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Open in Google Maps
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
