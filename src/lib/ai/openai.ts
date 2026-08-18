type OpenAITextResult =
  | {
      ok: true;
      model: string;
      text: string;
    }
  | {
      ok: false;
      model: string;
      error: string;
    };

type GenerateOpenAITextOptions = {
  instructions: string;
  input: string;
  metadata?: Record<string, string>;
};

type OpenAIResponsesPayload = {
  output_text?: string;
  error?: {
    message?: string;
  };
};

const getEnv = (key: string) => process.env[key]?.trim() || "";

const getOpenAIModel = () => getEnv("OPENAI_MODEL") || "gpt-5.6-terra";

const getMaxOutputTokens = () => {
  const configuredValue = Number.parseInt(
    getEnv("OPENAI_MAX_OUTPUT_TOKENS") || "500",
    10,
  );

  return Number.isFinite(configuredValue) && configuredValue > 0
    ? configuredValue
    : 500;
};

export const generateOpenAIText = async ({
  instructions,
  input,
  metadata,
}: GenerateOpenAITextOptions): Promise<OpenAITextResult> => {
  const apiKey = getEnv("OPENAI_API_KEY");
  const model = getOpenAIModel();

  if (!apiKey) {
    return {
      ok: false,
      model,
      error: "OPENAI_API_KEY is not configured.",
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        max_output_tokens: getMaxOutputTokens(),
        metadata,
      }),
    });

    const payload = (await response
      .json()
      .catch(() => ({}))) as OpenAIResponsesPayload;

    if (!response.ok) {
      return {
        ok: false,
        model,
        error: payload.error?.message || "OpenAI response request failed.",
      };
    }

    const text = payload.output_text?.trim();

    if (!text) {
      return {
        ok: false,
        model,
        error: "OpenAI response did not include output text.",
      };
    }

    return {
      ok: true,
      model,
      text,
    };
  } catch (error) {
    return {
      ok: false,
      model,
      error:
        error instanceof Error
          ? error.message
          : "OpenAI response request failed.",
    };
  }
};
