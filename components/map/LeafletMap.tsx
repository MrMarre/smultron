"use client";

import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

type Position = [number, number];

function LocationMarker() {
  const [position, setPosition] = useState<Position | null>(null);

  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      const nextPosition: Position = [e.latlng.lat, e.latlng.lng];
      setPosition(nextPosition);
      map.flyTo(nextPosition, map.getZoom());
    },
  });

  if (position === null) {
    return null;
  }

  return (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default function LeafletMap() {
  return (
    <MapContainer
      className="h-screen w-full"
      center={[51.505, -0.09]}
      zoom={13}
      // scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
