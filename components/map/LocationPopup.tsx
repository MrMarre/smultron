"use client";

import { useEffect, useRef, useState } from "react";
import { Popup } from "react-leaflet";
import type { Position } from "@/hooks/useLocationHook";

export type SavedLocationInput = {
  name: string;
  position: Position;
  description?: string;
};

type LocationPopupProps = {
  position: Position;
  onSave: (location: SavedLocationInput) => Promise<void>;
};

export default function LocationPopup({
  position,
  onSave,
}: LocationPopupProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (detailsOpen) {
      descriptionRef.current?.focus();
    }
  }, [detailsOpen]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSaving(true);
    setError(null);
    try {
      const trimmedDescription = description.trim();
      await onSave({
        name: trimmedName,
        position,
        description: trimmedDescription || undefined,
      });
      console.log("Location saved:", {
        name: trimmedName,
        position,
        description,
      });
      setName("");
      setDescription("");
      setDetailsOpen(false);
    } catch {
      setError("Could not save this place. Try again.");
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
          className="rounded p-2"
        />

        {detailsOpen && (
          <div id="place-details" className="flex flex-col gap-1">
            <label htmlFor="place-description">Description</label>
            <textarea
              ref={descriptionRef}
              name="description"
              id="place-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>
        )}

        {error && (
          <p role="alert" className="text-red-500">
            {error}
          </p>
        )}
        <button
          type="button"
          aria-expanded={detailsOpen}
          aria-controls="place-details"
          onClick={() => setDetailsOpen((open) => !open)}
          className="rounded bg-gray-300 px-4 py-2 text-black"
        >
          {detailsOpen ? "Hide details" : "Add details"}
        </button>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </Popup>
  );
}
