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
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN is not configured");
    }

    const { amount, description, payer_email, payment_method } = await req.json();

    if (!amount || !description || !payer_email) {
      return new Response(
        JSON.stringify({ error: "amount, description e payer_email são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (payment_method === "pix") {
      // Create Pix payment
      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          transaction_amount: Number(amount),
          description,
          payment_method_id: "pix",
          payer: { email: payer_email },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Mercado Pago Pix error:", JSON.stringify(data));
        return new Response(
          JSON.stringify({ error: data.message || "Erro ao gerar Pix", details: data }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          payment_id: data.id,
          status: data.status,
          pix_qr_code: data.point_of_interaction?.transaction_data?.qr_code,
          pix_qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
          pix_copy_paste: data.point_of_interaction?.transaction_data?.qr_code,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (payment_method === "card") {
      // Create a preference for card payment (Checkout Pro)
      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              title: description,
              quantity: 1,
              unit_price: Number(amount),
              currency_id: "BRL",
            },
          ],
          payer: { email: payer_email },
          back_urls: {
            success: `${req.headers.get("origin") || "https://i-escolas-platform.lovable.app"}/onboarding/success`,
            failure: `${req.headers.get("origin") || "https://i-escolas-platform.lovable.app"}/onboarding/failure`,
          },
          auto_return: "approved",
          payment_methods: {
            excluded_payment_types: [{ id: "ticket" }],
            installments: 12,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Mercado Pago preference error:", JSON.stringify(data));
        return new Response(
          JSON.stringify({ error: data.message || "Erro ao criar preferência", details: data }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          preference_id: data.id,
          init_point: data.init_point,
          sandbox_init_point: data.sandbox_init_point,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "payment_method deve ser 'pix' ou 'card'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
