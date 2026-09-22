import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Maestro Thiago Santos | Proposta para Vinícola Aurora</title>
        <meta name="description" content="Proposta personalizada do Maestro Thiago Santos para a Vinícola Aurora." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <iframe
        src="/media.html"
        title="Proposta Maestro Thiago Santos para Vinícola Aurora"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          border: 0,
          display: "block",
          background: "#0b0b0a"
        }}
      />
      <style jsx global>{`
        html, body, #__next { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #0b0b0a; }
      `}</style>
    </>
  );
}
