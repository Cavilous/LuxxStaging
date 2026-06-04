"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

interface RouteData {
  name: string
  duration: string
  coordinates: [number, number][]
  color: string
}

const ROUTES: Record<string, RouteData> = {
  "1h": {
    name: "1 Hour Miami Tour",
    duration: "1 hour",
    coordinates: [
      [25.7617, -80.1918], // Brickell starting point
      [25.7689, -80.1850], // Brickell Ave North
      [25.7753, -80.1865], // MacArthur Causeway start
      [25.7780, -80.1750], // Crossing causeway
      [25.7850, -80.1500], // Port of Miami area
      [25.7900, -80.1350], // South Beach - 5th Street
      [25.7950, -80.1320], // South Beach - 10th Street
      [25.8000, -80.1300], // South Beach - Lincoln Road
      [25.8050, -80.1310], // South Beach - 21st Street
      [25.8000, -80.1320], // Return south on Ocean Drive
      [25.7920, -80.1340], // South Pointe area
      [25.7850, -80.1380], // Back towards causeway
      [25.7780, -80.1650], // MacArthur Causeway return
      [25.7720, -80.1820], // Downtown
      [25.7650, -80.1900], // Brickell return
      [25.7617, -80.1918], // Back to start
    ],
    color: "#ECAC36",
  },
  "2h": {
    name: "2 Hour Extended Miami Tour",
    duration: "2 hours",
    coordinates: [
      [25.7617, -80.1918], // Brickell starting point
      [25.7689, -80.1850], // Brickell Ave North
      [25.7753, -80.1865], // MacArthur Causeway start
      [25.7780, -80.1750], // Crossing causeway
      [25.7850, -80.1500], // Port of Miami area
      [25.7900, -80.1350], // South Beach - 5th Street
      [25.7950, -80.1320], // South Beach - 10th Street
      [25.8000, -80.1300], // South Beach - Lincoln Road
      [25.8050, -80.1310], // South Beach - 21st Street
      [25.8100, -80.1300], // Mid Beach
      [25.8150, -80.1290], // North Beach
      [25.8200, -80.1280], // Bal Harbour area
      [25.8180, -80.1350], // Return inland
      [25.8120, -80.1450], // Julia Tuttle Causeway
      [25.8050, -80.1650], // Back to mainland
      [25.8010, -80.1990], // Wynwood Arts District
      [25.8050, -80.1950], // Wynwood Walls
      [25.8157, -80.1920], // Design District
      [25.8100, -80.1940], // Midtown
      [25.7950, -80.1950], // Edgewater
      [25.7850, -80.1920], // Downtown
      [25.7720, -80.1880], // Brickell City Centre
      [25.7650, -80.1900], // Brickell
      [25.7617, -80.1918], // Back to start
    ],
    color: "#e6c766",
  },
}

function AnimatedPolyline({
  coordinates,
  color,
  duration = 3000,
}: {
  coordinates: [number, number][]
  color: string
  duration?: number
}) {
  const [visibleCoordinates, setVisibleCoordinates] = useState<[number, number][]>([])
  const map = useMap()

  useEffect(() => {
    setVisibleCoordinates([])
    let index = 0
    const totalPoints = coordinates.length
    const intervalTime = duration / totalPoints

    const interval = setInterval(() => {
      if (index < totalPoints) {
        setVisibleCoordinates(coordinates.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, intervalTime)

    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates)
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    return () => clearInterval(interval)
  }, [coordinates, duration, map])

  if (visibleCoordinates.length < 2) return null

  return (
    <Polyline
      positions={visibleCoordinates}
      pathOptions={{
        color,
        weight: 4,
        opacity: 0.8,
      }}
    />
  )
}

function MapContent({ route }: { route: RouteData }) {
  const map = useMap()
  const startPoint = route.coordinates[0]
  
  useEffect(() => {
    if (map) {
      map.setView(startPoint, 12)
    }
  }, [map, startPoint])
  
  return null
}

interface AnimatedRouteMapProps {
  selectedRoute: "1h" | "2h"
  className?: string
}

export function AnimatedRouteMap({ selectedRoute, className = "" }: AnimatedRouteMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const route = ROUTES[selectedRoute]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`bg-black/50 border border-[#ECAC36]/20 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-400">Loading map...</p>
      </div>
    )
  }

  const startPoint = route.coordinates[0]

  return (
    <div className={`relative overflow-hidden rounded-lg border border-[#ECAC36]/20 ${className}`}>
      <MapContainer
        key={selectedRoute}
        center={startPoint}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        <AnimatedPolyline coordinates={route.coordinates} color={route.color} duration={3000} />
        <Marker position={startPoint}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-black">Starting Point</p>
              <p className="text-sm text-gray-600">Brickell, Miami</p>
            </div>
          </Popup>
        </Marker>
        <MapContent route={route} />
      </MapContainer>

      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#ECAC36]/30 z-10">
        <p className="text-white font-semibold">{route.name}</p>
        <p className="text-[#ECAC36] text-sm">{route.duration}</p>
      </div>
    </div>
  )
}
