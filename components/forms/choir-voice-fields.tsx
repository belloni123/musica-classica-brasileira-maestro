"use client";

import { useState } from "react";
import { choirVoices } from "@/lib/catalog/options";

export function ChoirVoiceFields({ hasChoir = false, selectedVoices = [] }: {
  hasChoir?: boolean | null;
  selectedVoices?: string[];
}) {
  const [enabled, setEnabled] = useState(Boolean(hasChoir));

  return <div className="grid gap-3">
    <label className="grid gap-2 text-sm font-medium">
      Coro
      <select className="h-10 rounded-md border border-[var(--border)] bg-white px-3 text-sm" name="has_choir"
        value={enabled ? "yes" : "no"} onChange={event => setEnabled(event.target.value === "yes")}>
        <option value="no">Não</option>
        <option value="yes">Sim</option>
      </select>
    </label>
    {enabled && <fieldset className="grid gap-2 text-sm">
      <legend className="font-medium">Vozes do coro</legend>
      <div className="grid grid-cols-2 gap-2">
        {choirVoices.map(voice => <label className="flex items-center gap-2" key={voice}>
          <input defaultChecked={selectedVoices.includes(voice)} name="choir_voice" type="checkbox" value={voice} />
          {voice}
        </label>)}
      </div>
    </fieldset>}
  </div>;
}
