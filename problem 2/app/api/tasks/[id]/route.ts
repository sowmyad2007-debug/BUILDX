import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const task = db.tasks.get(id);

    if (!task) {
      return NextResponse.json({ success: false, error: `Task with id '${id}' not found.` }, { status: 404 });
    }

    const body = await req.json();

    if (body.status !== undefined) task.status = body.status;
    if (body.priority !== undefined) task.priority = body.priority;
    if (body.assignedTo !== undefined) task.assignedTo = body.assignedTo;
    if (body.assignedSquad !== undefined) task.assignedSquad = body.assignedSquad;
    if (body.deadline !== undefined) task.deadline = body.deadline;
    if (body.title !== undefined) task.title = body.title;
    if (body.description !== undefined) task.description = body.description;

    task.updatedAt = new Date().toISOString();

    calculateEventReadiness(task.eventId);

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const task = db.tasks.get(id);

    if (!task) {
      return NextResponse.json({ success: false, error: `Task with id '${id}' not found.` }, { status: 404 });
    }

    db.tasks.delete(id);
    calculateEventReadiness(task.eventId);

    return NextResponse.json({ success: true, message: `Task '${id}' deleted.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
