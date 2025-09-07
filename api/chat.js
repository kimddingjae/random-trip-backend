// api/chat.js
import OpenAI from "openai";

// ✅ 페이지 도메인만 명시적으로 허용 (보안용)
const ALLOW_ORIGIN = "https://kimddingjae.github.io"; 
const ALLOW_METHODS = "POST, OPTIONS";
const ALLOW_HEADERS = "Content-Type";

export default async function handler(req, res) {
  // 공통 CORS 헤더
  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", ALLOW_METHODS);
  res.setHeader("Access-Control-Allow-Headers", ALLOW_HEADERS);

  // ✅ 프리플라이트(OPTIONS) 처리
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages is required" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const content = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e?.message || "Server Error");
  }
}
