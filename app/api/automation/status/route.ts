import { NextResponse } from "next/server";
import { automationWorkflows } from "@/lib/automation";

export async function GET() {
  const workflows = automationWorkflows.map((workflow) => ({
    ...workflow,
    configured: Boolean(process.env[workflow.envVar])
  }));

  return NextResponse.json({
    projectId: "7lyi7rNly1Va6dXy",
    mode: workflows.some((workflow) => workflow.configured) ? "webhook" : "mock",
    workflows,
    recentRuns: [
      {
        workflowKey: "weekly-report",
        status: "mocked",
        summary: "Щотижневий звіт готовий для dashboard preview.",
        finishedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString()
      },
      {
        workflowKey: "anomaly-alert",
        status: "completed",
        summary: "Виявлено контрольований watch-сигнал transition risk.",
        finishedAt: new Date(Date.now() - 1000 * 60 * 47).toISOString()
      }
    ]
  });
}
