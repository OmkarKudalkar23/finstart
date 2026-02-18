import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const docType = formData.get("docType") as "id" | "address"; // "id" or "address"

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Mistral API Key not configured" }, { status: 500 });
        }

        const bytes = await file.arrayBuffer();
        const base64File = Buffer.from(bytes).toString("base64");
        const isPdf = file.type === "application/pdf";

        let rawOcrText = "";

        if (isPdf) {
            // Step 1: Use Mistral OCR for PDFs
            const ocrResponse = await fetch("https://api.mistral.ai/v1/ocr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "mistral-ocr-latest",
                    document: {
                        type: "document_url",
                        document_url: `data:application/pdf;base64,${base64File}`,
                    },
                }),
            });

            if (!ocrResponse.ok) {
                const errText = await ocrResponse.text();
                console.error("Mistral OCR Error:", errText);
                return NextResponse.json({ error: "OCR failed for PDF" }, { status: ocrResponse.status });
            }

            const ocrData = await ocrResponse.json();
            rawOcrText = ocrData.pages?.map((p: { markdown?: string }) => p.markdown || "").join("\n") || "";
        }

        // Step 2: Extract fields + validate document in one AI call
        const validationPrompt = docType === "id"
            ? `You are a KYC document verification engine. Analyze this ${isPdf ? "OCR text" : "image"} of an identity document.

${isPdf ? `OCR Text:\n${rawOcrText}` : ""}

Return a JSON object with these exact keys:
- "is_valid": boolean — true if this is a legitimate government-issued identity proof (Aadhaar, PAN, Passport, Driving Licence, Voter ID)
- "document_type": string — detected document type (e.g. "Aadhaar Card", "PAN Card", "Passport") or "Unknown"
- "rejection_reason": string — if is_valid is false, explain why (e.g. "Document appears to be a utility bill, not an identity proof", "Image is too blurry", "Document type not accepted"). Empty string if valid.
- "name": string
- "id_number": string
- "dob": string
- "gender": string
- "expiry_date": string
- "issuing_authority": string
- "address": string

Only include fields that are clearly visible. Be strict — reject non-ID documents, screenshots of websites, blank images, or unrecognizable content.`
            : `You are a KYC document verification engine. Analyze this ${isPdf ? "OCR text" : "image"} of an address proof document.

${isPdf ? `OCR Text:\n${rawOcrText}` : ""}

Return a JSON object with these exact keys:
- "is_valid": boolean — true if this is a legitimate address proof (Utility Bill, Bank Statement, Rental Agreement, Government Letter, Aadhaar with address)
- "document_type": string — detected document type (e.g. "Electricity Bill", "Bank Statement") or "Unknown"
- "rejection_reason": string — if is_valid is false, explain why (e.g. "This appears to be an ID card, not an address proof", "Address is not clearly visible"). Empty string if valid.
- "name": string
- "address": string
- "pincode": string
- "city": string
- "state": string
- "document_date": string
- "issuer": string

Only include fields that are clearly visible. Be strict — reject identity cards (PAN/Aadhaar without address), screenshots, or unrecognizable content.`;

        let extractedText = "";

        if (isPdf) {
            const parseResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [{ role: "user", content: validationPrompt }],
                    response_format: { type: "json_object" },
                }),
            });

            if (!parseResponse.ok) {
                const errText = await parseResponse.text();
                console.error("Mistral Parse Error:", errText);
                return NextResponse.json({ error: "Failed to parse OCR text" }, { status: parseResponse.status });
            }

            const parseData = await parseResponse.json();
            extractedText = parseData.choices[0].message.content;
        } else {
            const visionResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "pixtral-12b-2409",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: validationPrompt },
                                {
                                    type: "image_url",
                                    image_url: `data:${file.type};base64,${base64File}`,
                                },
                            ],
                        },
                    ],
                    response_format: { type: "json_object" },
                }),
            });

            if (!visionResponse.ok) {
                const errText = await visionResponse.text();
                console.error("Mistral Vision Error:", errText);
                return NextResponse.json({ error: "Failed to process image" }, { status: visionResponse.status });
            }

            const visionData = await visionResponse.json();
            extractedText = visionData.choices[0].message.content;
        }

        const parsed = JSON.parse(extractedText);

        return NextResponse.json({
            success: true,
            is_valid: parsed.is_valid ?? false,
            document_type: parsed.document_type ?? "Unknown",
            rejection_reason: parsed.rejection_reason ?? "",
            data: Object.fromEntries(
                Object.entries(parsed).filter(([k]) => !["is_valid", "document_type", "rejection_reason"].includes(k))
            ),
        });

    } catch (error) {
        console.error("OCR API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
