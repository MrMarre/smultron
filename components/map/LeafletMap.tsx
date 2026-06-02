"use client";

import { useEffect } from "react";
import useLocation, { type Position } from "@/hooks/useLocationHook";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const fallbackCenter: [number, number] = [59.3293, 18.0686];

function MapViewSync({ position }: { position: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (position === null) {
      return;
    }

    map.flyTo([position.lat, position.lng], map.getZoom());
  }, [map, position]);

  return null;
}

function LocationMarker({ position }: { position: Position | null }) {
  if (position === null) {
    return null;
  }

  return (
    <Marker position={[position.lat, position.lng]}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default function LeafletMap() {
  const { position, error, loading, requestLocation } = useLocation();

  //Todo move this call behind a "Locate me" button.
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        className="h-full w-full"
        center={fallbackCenter}
        zoom={15}
        // scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewSync position={position} />
        <LocationMarker position={position} />
      </MapContainer>

      {(loading || error) && (
        <div className="absolute left-4 top-4 z-[1000] rounded bg-white px-3 py-2 text-sm shadow">
          {loading ? "Finding your location..." : error}
        </div>
      )}
    </div>
  );
}
