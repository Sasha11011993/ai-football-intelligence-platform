import { NextResponse } from "next/server";
import { runAiAgent } from "@/lib/ai-service";
import type { AiRequestBody } from "@/lib/ai-types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AiRequestBody;
  const result = await runAiAgent("evaluate", body);
  return NextResponse.json(result);
}

