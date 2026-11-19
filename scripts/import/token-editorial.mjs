import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

async function main() {
  try {
    process.loadEnvFile(".env.local");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Configure a chave pública do Supabase em .env.local.");
  if (url.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) {
    throw new Error("Use uma URL HTTPS do Supabase.");
  }

  // Open the terminal directly so stdout can be captured by command substitution.
  const prompt = [
    "import getpass, json, sys",
    "with open('/dev/tty', 'r') as terminal_input, open('/dev/tty', 'w') as terminal_output:",
    "    terminal_output.write('E-mail editorial: '); terminal_output.flush()",
    "    email = terminal_input.readline().strip()",
    "    password = getpass.getpass('Senha: ', stream=terminal_output)",
    "json.dump({'email': email, 'password': password}, sys.stdout)",
  ].join("\n");
  const credentials = JSON.parse(execFileSync("python3", ["-c", prompt], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }));
  const db = createClient(url.href, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.auth.signInWithPassword(credentials);
  if (error || !data.session) throw new Error("Login recusado. Confira a conta de editor e a URL do projeto.");
  const { data: profile } = await db.from("profiles").select("role,status").eq("id", data.user.id).maybeSingle();
  if (profile?.status !== "active" || !["editor", "admin"].includes(profile.role)) {
    throw new Error("A conta precisa estar ativa com o papel editor ou admin.");
  }
  process.stderr.write(`Token editorial válido até ${new Date(data.session.expires_at * 1000).toLocaleString("pt-BR")}\n`);
  process.stdout.write(data.session.access_token);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
