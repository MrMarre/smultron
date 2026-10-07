"use client";

import { useState } from "react";
import { Popup } from "react-leaflet";
import type { Position } from "@/hooks/useLocationHook";

export type SavedLocationInput = {
  name: string;
  position: Position;
};

type LocationPopupProps = {
  position: Position;
  onSave: (location: SavedLocationInput) => Promise<void>;
};

export default function LocationPopup({
  position,
  onSave,
}: LocationPopupProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) return;
    console.log("Saving location:", { name: trimmedName, position });
    setSaving(true);
    try {
      await onSave({ name: trimmedName, position });
      setName("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Popup>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col gap-2"
      >
        <label htmlFor="location-name">Save this location</label>
        <input
          id="location-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Location name"
          required
          className="rounded "
        />
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-70 cursor-pointer"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </Popup>
  );
}
