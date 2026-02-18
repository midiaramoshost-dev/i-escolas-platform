import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      escola_nome,
      cnpj,
      cidade,
      uf,
      email_diretor,
      nome_diretor,
      telefone,
      plano_id,
      payment_id,
    } = await req.json();

    // Validate required fields
    if (!escola_nome || !cnpj || !cidade || !uf || !email_diretor || !nome_diretor || !plano_id) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: escola_nome, cnpj, cidade, uf, email_diretor, nome_diretor, plano_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a random password
    const password = generatePassword();

    // Create user with admin API (auto-confirms email)
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: email_diretor,
      password,
      email_confirm: true,
      user_metadata: {
        name: nome_diretor,
        role: "escola",
        phone: telefone || null,
      },
    });

    if (createError) {
      console.error("Error creating user:", createError);
      if (createError.message?.includes("already been registered")) {
        return new Response(
          JSON.stringify({ error: "Este e-mail já está cadastrado no sistema" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = newUser.user.id;

    // Generate slug for access link
    const slug = escola_nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const linkAcesso = `/escola/dashboard?escola=${slug}-${userId.slice(0, 8)}`;

    // Create school record
    const { error: escolaError } = await adminClient.from("escolas").insert({
      nome: escola_nome,
      cnpj,
      cidade,
      uf,
      email_diretor,
      plano: plano_id,
      status: "ativo",
      user_id: userId,
      link_acesso: linkAcesso,
      modulos: ["dashboard", "alunos", "turmas", "comunicados"],
    });

    if (escolaError) {
      console.error("Error creating school:", escolaError);
      // Try to clean up user
      await adminClient.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Erro ao criar escola: " + escolaError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If there's a payment_id, record it
    if (payment_id) {
      const { data: escola } = await adminClient
        .from("escolas")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (escola) {
        await adminClient.from("pagamentos").insert({
          escola_id: escola.id,
          valor: 0, // Will be updated with actual amount
          data_vencimento: new Date().toISOString().split("T")[0],
          data_pagamento: new Date().toISOString().split("T")[0],
          status: "pago",
          metodo_pagamento: "mercadopago",
          referencia: payment_id,
          observacoes: "Pagamento de adesão via Mercado Pago",
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        credentials: {
          email: email_diretor,
          password,
          link_acesso: linkAcesso,
        },
        message: "Escola cadastrada com sucesso!",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generatePassword(): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const specialChars = "!@#$%";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  password += Math.floor(Math.random() * 10);
  return password;
}
