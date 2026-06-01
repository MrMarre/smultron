"use client";

import dynamic from "next/dynamic";

const LeafletMapNoSSR = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center text-sm text-gray-500">
      Loading map...
    </div>
  ),
});

export default function MapClient() {
  return <LeafletMapNoSSR />;
}
