import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "risk_analysis":
        systemPrompt = `Você é um especialista em análise pedagógica escolar brasileira. Analise os dados dos alunos e identifique riscos de reprovação. Responda SEMPRE em português brasileiro. Seja direto e objetivo. Formate com markdown.`;
        userPrompt = `Analise os seguintes dados de alunos e identifique os que estão em risco de reprovação. Para cada aluno em risco, explique o motivo e sugira ações de recuperação.\n\nDados:\n${JSON.stringify(data.students, null, 2)}`;
        break;

      case "performance_analysis":
        systemPrompt = `Você é um analista pedagógico especializado no sistema educacional brasileiro. Analise o desempenho por disciplina e gere insights. Responda em português brasileiro com markdown.`;
        userPrompt = `Analise o desempenho dos alunos nas seguintes disciplinas e gere insights pedagógicos, identificando pontos fortes e fracos:\n\n${JSON.stringify(data.subjects, null, 2)}`;
        break;

      case "recommendations":
        systemPrompt = `Você é um coordenador pedagógico experiente do ensino brasileiro. Gere recomendações pedagógicas personalizadas. Responda em português brasileiro com markdown.`;
        userPrompt = `Com base nos seguintes dados do aluno, gere recomendações pedagógicas detalhadas para melhorar seu desempenho:\n\nAluno: ${data.studentName}\nNotas: ${JSON.stringify(data.grades)}\nFrequência: ${data.attendance}%\nObservações: ${data.observations || "Nenhuma"}`;
        break;

      case "generate_report":
        systemPrompt = `Você é um especialista em relatórios pedagógicos escolares brasileiros. Gere relatórios detalhados e profissionais. Responda em português brasileiro com markdown.`;
        userPrompt = `Gere um relatório pedagógico completo com base nos seguintes dados da turma:\n\nTurma: ${data.className}\nPeríodo: ${data.period}\nDados: ${JSON.stringify(data.classData, null, 2)}`;
        break;

      case "generate_exercises":
        systemPrompt = `Você é um professor experiente do ensino brasileiro. Crie exercícios e atividades pedagógicas de alta qualidade. Responda em português brasileiro com markdown. Inclua gabarito ao final.`;
        userPrompt = `Crie ${data.quantity || 5} exercícios de ${data.subject} para alunos do ${data.grade}. Nível de dificuldade: ${data.difficulty || "médio"}. Tema: ${data.topic || "conteúdo geral da disciplina"}.`;
        break;

      case "generate_exam":
        systemPrompt = `Você é um professor experiente do ensino brasileiro. Crie provas completas e bem estruturadas. Responda em português brasileiro com markdown. Inclua cabeçalho da prova, instruções, questões e gabarito separado.`;
        userPrompt = `Crie uma prova de ${data.subject} para o ${data.grade} com ${data.questionCount || 10} questões. ${data.includeMultipleChoice ? "Inclua questões de múltipla escolha." : ""} ${data.includeEssay ? "Inclua questões dissertativas." : ""} Tema: ${data.topic || "conteúdo geral"}.`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Tipo de análise não suportado" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes para IA. Entre em contato com o suporte." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-educational error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
