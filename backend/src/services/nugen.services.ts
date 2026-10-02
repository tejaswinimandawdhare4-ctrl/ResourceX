import axios from "axios";

const NUGEN_API_URL = "https://api.nugen.in/api/v3";

export async function parseResourceRequest(userRequest: string) {
  const apiKey = process.env["NUGEN_API_KEY"];
  const modelId = process.env["NUGEN_MODEL_ID"];

  if (!apiKey) {
    throw new Error("NUGEN_API_KEY is missing");
  }

  if (!modelId) {
    throw new Error("NUGEN_MODEL_ID is missing");
  }

  const response = await axios.post(
    `${NUGEN_API_URL}/inference/completions`,
    {
      model: modelId,
      prompt: userRequest
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}