import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const futurePlans = [
  {
    name: "Individual",
    description: "Acesso ao catálogo completo para estudo, pesquisa e programação independente.",
  },
  {
    name: "Profissional",
    description: "Recursos avançados para regentes, curadores, professores e pesquisadores.",
  },
  {
    name: "Institucional",
    description: "Gestão de acesso para orquestras, universidades, festivais, bibliotecas e acervos.",
  },
];

export default function PlansPage() {
  return (
    <div className="grid gap-8">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm text-[var(--accent)]">Acesso futuro</p>
        <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)] sm:text-4xl md:text-5xl">
          Assinatura
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
          Página preparada para assinatura futura. No MVP, o super admin cria assinantes manualmente.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {futurePlans.map((plan) => (
          <Card className="grid gap-3" key={plan.name}>
            <CheckCircle2 className="text-[var(--primary)]" size={20} aria-hidden="true" />
            <h2 className="text-xl font-normal">{plan.name}</h2>
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">{plan.description}</p>
          </Card>
        ))}
      </div>
      <Card className="border-dashed text-sm leading-6 text-[var(--muted-foreground)]">
        A fundação já separa papéis públicos, assinantes e equipe editorial. O próximo passo técnico
        será escolher o provedor de pagamento e ligar assinaturas reais aos papéis do usuário.
        <div className="mt-4">
          <Button asChild size="sm" variant="secondary">
            <Link href="/entrar">Entrar</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
