# Preparacao para assinatura e paywall

Assinatura ainda nao esta implementada. A fundacao ja separa papéis que permitem evoluir para planos pagos sem reestruturar o banco imediatamente.

## Estado atual

- `lib/billing/access.ts` centraliza uma decisao simples de acesso ao catalogo completo.
- `components/ui/content-lock.tsx` exibe o bloqueio visual de conteudo completo.
- `/planos` mostra planos futuros sem checkout.
- Papéis de assinante ja existem no enum `app_role`.
- `sql/migrations/0003_subscription_foundation.sql` cria `subscription_plans` e `subscriptions` para receber checkout/webhooks no futuro.
- No MVP, o acesso de assinante e concedido manualmente pelo super admin em `/admin/usuarios`.

## Papéis planejados

- `subscriber_individual`
- `subscriber_professional`
- `institution_user`
- `institution_admin`

## Estrategia futura

1. Escolher provedor de pagamento.
2. Criar tabelas de assinatura se necessario.
3. Mapear os planos do provedor para `subscription_plans.external_price_id`.
4. Implementar checkout.
5. Implementar webhooks server-side.
6. Atualizar `subscriptions` e o entitlement do usuario a partir dos webhooks.
7. Usar `getCatalogAccessDecision` para liberar dados completos.

## Regras de seguranca

- Segredos de pagamento nunca devem ir para arquivos client-side.
- Webhooks devem validar assinatura.
- Acesso pago nao deve depender apenas de UI; precisa ser validado no servidor e em RLS quando aplicavel.
