import { NextRequest, NextResponse } from "next/server";
import { db, TaskRecord } from "@/lib/database/db";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");
    const assignedSquad = searchParams.get("squad");

    let tasks = Array.from(db.tasks.values());

    if (eventId) {
      tasks = tasks.filter((t) => t.eventId === eventId);
    }
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (assignedSquad) {
      tasks = tasks.filter((t) => t.assignedSquad === assignedSquad);
    }

    return NextResponse.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: "Task title is required." }, { status: 400 });
    }

    const eventId = body.eventId || Array.from(db.events.keys())[0] || "evt-demo-hackfest-2026";
    const id = body.id || `tsk-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newTask: TaskRecord = {
      id,
      eventId,
      title: body.title,
      description: body.description || "",
      assignedSquad: body.assignedSquad || "GENERAL",
      assignedTo: body.assignedTo || "Unassigned",
      deadline: body.deadline || nowIso,
      priority: body.priority || "MEDIUM",
      status: body.status || "PENDING",
      dependencies: Array.isArray(body.dependencies) ? body.dependencies : [],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    db.tasks.set(id, newTask);
    calculateEventReadiness(eventId);

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
