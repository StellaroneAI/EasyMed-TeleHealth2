// OpenAI API integration for EasyMedPro
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function getHealthAdvice(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
  });
  return response.choices[0].message?.content;
}

// Example usage:
// getHealthAdvice('What should I do for high blood pressure?').then(console.log);
