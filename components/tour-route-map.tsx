"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const TOUR_HIGHLIGHTS = [
  { name: "Ocean Drive", lat: 25.7799, lng: -80.1300, description: "Art Deco architecture & vibrant nightlife" },
  { name: "Brickell", lat: 25.7617, lng: -80.1918, description: "Miami's financial district skyline" },
  { name: "Venetian Causeway", lat: 25.7925, lng: -80.1560, description: "Scenic bridge with bay views" },
  { name: "Star Island", lat: 25.7811, lng: -80.1500, description: "Celebrity mansions & luxury estates" },
  { name: "South Beach", lat: 25.7826, lng: -80.1341, description: "Iconic beach & photo opportunities" },
]

const ROUTE_PATH: [number, number][] = [
  [25.7617, -80.1918],
  [25.7700, -80.1750],
  [25.7799, -80.1560],
  [25.7811, -80.1500],
  [25.7826, -80.1341],
  [25.7799, -80.1300],
]

export default function TourRouteMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [25.7799, -80.1560],
      zoom: 13,
      scrollWheelZoom: false,
      zoomControl: true,
    })

    mapInstanceRef.current = map

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map)

    const goldIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background: #ECAC36; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #000; display: flex; align-items: center; justify-content: center;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    TOUR_HIGHLIGHTS.forEach((point) => {
      L.marker([point.lat, point.lng], { icon: goldIcon })
        .addTo(map)
        .bindPopup(`
          <div style="background: #111; color: #fff; padding: 8px 12px; border-radius: 4px; min-width: 150px;">
            <strong style="color: #ECAC36; font-size: 14px;">${point.name}</strong>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #ccc;">${point.description}</p>
          </div>
        `, {
          className: "custom-popup",
        })
    })

    L.polyline(ROUTE_PATH, {
      color: "#ECAC36",
      weight: 4,
      opacity: 0.8,
      dashArray: "10, 10",
    }).addTo(map)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[400px] rounded-lg overflow-hidden" />
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: #111;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  )
}
