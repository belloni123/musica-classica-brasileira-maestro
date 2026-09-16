"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return <Button aria-label="Imprimir" size="sm" type="button" variant="secondary" onClick={() => window.print()}>
    <Printer size={18} aria-hidden="true" />
  </Button>;
}
