import { NextRequest, NextResponse } from "next/server";
import { processNaturalLanguageEvent } from "@/lib/ai/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Event prompt string is required." },
        { status: 400 }
      );
    }

    const aiResult = await processNaturalLanguageEvent(prompt);

    return NextResponse.json({
      success: true,
      data: aiResult.extractedData,
      provider: aiResult.provider,
      reasoningNotes: aiResult.reasoningNotes,
      executionTimeMs: aiResult.executionTimeMs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
