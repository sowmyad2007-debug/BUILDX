import { NextRequest, NextResponse } from "next/server";
import { generateOperationalPlan } from "@/lib/planner/planning-engine";
import { parseNaturalLanguageRequirements } from "@/lib/planner/intake-parser";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let requirements = body.requirements;
    if (!requirements && body.prompt) {
      requirements = parseNaturalLanguageRequirements(body.prompt);
    }

    if (!requirements || !requirements.name) {
      return NextResponse.json(
        { success: false, error: "Valid event requirements or prompt string is required." },
        { status: 400 }
      );
    }

    const plan = generateOperationalPlan(requirements);

    return NextResponse.json({
      success: true,
      data: plan,
      message: `Operational plan created successfully for ${plan.event.name}.`,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
