"use client";
import { useEffect } from "react";
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
//Original, Stockholm
// const fallbackCenter: [number, number] = [59.3293, 18.0686];
const fallbackCenter: [number, number] = [
  57.975706336525484, 19.170970916748047,
];

function MapViewSync({ position }: { position: Position | null }) {
  const map = useMap();
  console.log("Usemap ", map);

  useEffect(() => {
    if (position === null) {
      return;
    }

    map.flyTo([position.lat, position.lng], map.getZoom());
  }, [map, position]);

  return null;
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
        //How to set up a click event on the marker to update the position? I want the user to both be able to drag the marker and click on the map to move the marker.
      }}
    >
      <Popup>Selected location</Popup>
    </Marker>
  );
}
function UpdateMapPositionOnPress({
  onPositionChange,
}: {
  onPositionChange: (position: Position) => void;
}) {
  useMapEvents({
    contextmenu(event) {
      const { lat, lng } = event.latlng;
      console.log("Map clicked at: ", lat, lng);
      onPositionChange({ lat, lng });
    },
  });
  return null;
}

export default function LeafletMap() {
  const { position, error, loading, requestLocation, updatePosition } =
    useLocation();

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
        <MapViewSync position={position} />
        <LocationMarker position={position} onPositionChange={updatePosition} />
        <UpdateMapPositionOnPress onPositionChange={updatePosition} />
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
