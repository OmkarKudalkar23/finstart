import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { transcript, step, context } = await req.json();

        // Select a fast model for real-time responsiveness
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are Finstart's Voice AI Agent conducting a KYC onboarding.
        
        CURRENT STEP: ${step}
        CONTEXT: ${JSON.stringify(context)}
        USER SAID: "${transcript}"

        Your goal is to extract the user's intent and data to update the form or navigate.
        
        Return a JSON object with:
        1. "intent": One of "fill_data", "next_step", "prev_step", "confirm", "edit", "general_query".
        2. "data": Key-value pairs of extracted data (if intent is fill_data). Keys must match the context fields provided.
        3. "ai_response": A concise, professional, friendly, spoken-style response to the user. Keep it short (1-2 sentences).
        4. "action_trigger": Optional boolean true if an immediate action (like submitting) is requested.

        Rules:
        - If the user provides data (e.g. "My name is John"), map it to the closest field in CONTEXT.
        - If the user confirms (e.g. "Yes", "Correct"), intent is "confirm" or "next_step".
        - If the user denies or wants to change, intent is "edit".
        - Convert numbers/currencies to standard formats (e.g. "12 lakhs" -> 1200000).
        - For addresses, extract the full string.
        - If the user asks a general finance question or about Finstart features (e.g. "Is this safe?", "What are the fees?"), provide a helpful, reassuring answer in "ai_response" and set intent to "general_query".
        - Always maintain a professional, helpful banking persona.

        JSON Response:
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Intent Error:", error);
        return NextResponse.json({
            intent: "error",
            ai_response: "I didn't quite catch that. Could you repeat?",
            error: error.message
        });
    }
}
