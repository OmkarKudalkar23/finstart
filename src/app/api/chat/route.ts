import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Messages are required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are Finstart AI, a helpful and professional financial technology assistant. You help users with onboarding, account setup, and understanding financial services offered by Finstart. Keep your responses concise, professional, and helpful.",
        });

        // Convert history format and ensure it starts with a 'user' message
        const formattedMessages = messages.slice(0, -1).map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        // Gemini requires the first message in history to be from 'user'
        let history = formattedMessages;
        const firstUserIndex = history.findIndex(m => m.role === "user");
        if (firstUserIndex !== -1) {
            history = history.slice(firstUserIndex);
        } else {
            history = [];
        }

        const chat = model.startChat({ history });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch response" }, { status: 500 });
    }
}
