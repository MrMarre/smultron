"use client";
import { useEffect, useState } from "react";
import useLocation, { type Position } from "@/hooks/useLocationHook";
import {
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Marker } from "react-leaflet/Marker";
import "../ui/Marker";

const fallbackCenter: [number, number] = [
  57.975706336525484, 19.170970916748047,
];

function MapViewSync({ userLocation }: { userLocation: Position | null }) {
  const map = useMap();
  console.log("Usemap ", map);

  useEffect(() => {
    if (userLocation === null) return;

    map.flyTo([userLocation.lat, userLocation.lng], map.getZoom());
  }, [map, userLocation]);

  return null;
}
function PopupDialog() {
  return (
    <Popup>
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Click the map to choose a location
        </p>
      </div>
    </Popup>
  );
}
function LocationMarker({
  position,
  onPositionChange,
}: {
  position: Position | null;
  onPositionChange: (position: Position) => void;
}) {
  if (position === null) {
    return null;
  }

  return (
    <Marker
      draggable
      position={[position.lat, position.lng]}
      eventHandlers={{
        dragend(event) {
          const marker = event.target;
          const { lat, lng } = marker.getLatLng();
          console.log("Marker dragged to: ", lat, lng);
          onPositionChange({ lat, lng });
        },
      }}
    >
      <PopupDialog />
    </Marker>
  );
}

function UpdateMarkerPositionOnPress({
  onPositionChange,
}: {
  onPositionChange: (position: Position) => void;
}) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      console.log("Map clicked at: ", lat, lng);
      onPositionChange({ lat, lng });
    },
  });
  return null;
}

export default function LeafletMap() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const { userLocation, error, loading, requestLocation } = useLocation();

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        className="h-full w-full"
        center={fallbackCenter}
        zoom={14}
        // scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewSync userLocation={userLocation} />
        <LocationMarker
          position={selectedPosition}
          onPositionChange={setSelectedPosition}
        />
        <UpdateMarkerPositionOnPress onPositionChange={setSelectedPosition} />
      </MapContainer>
      <button
        className="h-10 w-20 absolute bottom-4 right-4 z-1000 rounded bg-blue-500 text-white shadow"
        onClick={requestLocation}
      >
        {loading ? "Locating..." : "Locate me"}
      </button>

      {(loading || error) && (
        <div className="absolute left-4 top-4 z-1000 rounded bg-white px-3 py-2 text-sm shadow">
          {loading ? "Finding your location..." : error}
        </div>
      )}
    </div>
  );
}
