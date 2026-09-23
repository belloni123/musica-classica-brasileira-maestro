import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Sobre</h1>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          Brasil Orquestral é uma plataforma de catalogação, pesquisa e difusão da música
          brasileira de concerto, com metodologia própria e base relacional estruturada.
        </p>
      </Card>
    </div>
  );
}
