"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="grid gap-4 py-12" role="alert">
    <h1 className="text-2xl font-semibold">Não foi possível carregar esta página</h1>
    <p>O serviço pode estar temporariamente indisponível. Seus dados não foram apagados.</p>
    <button className="w-fit rounded border px-4 py-2" onClick={reset}>Tentar novamente</button>
  </section>;
}
