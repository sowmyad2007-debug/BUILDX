import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "CampusFlow AI API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    aiProvider: process.env.AI_PROVIDER || "deterministic",
    database: "connected",
  });
}
