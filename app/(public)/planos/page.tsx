import { CheckCircle2 } from "lucide-react";
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
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Planos</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Página preparada para assinatura futura. Checkout, cobrança e webhooks ainda não estão ativos.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {futurePlans.map((plan) => (
          <Card className="grid gap-3" key={plan.name}>
            <CheckCircle2 className="text-[var(--primary)]" size={20} aria-hidden="true" />
            <h2 className="font-semibold">{plan.name}</h2>
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">{plan.description}</p>
          </Card>
        ))}
      </div>
      <Card className="border-dashed text-sm leading-6 text-[var(--muted-foreground)]">
        A fundação já separa papéis públicos, assinantes e equipe editorial. O próximo passo técnico
        será escolher o provedor de pagamento e ligar assinaturas reais aos papéis do usuário.
      </Card>
    </div>
  );
}
