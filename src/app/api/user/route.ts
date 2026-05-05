import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, universidad } = body;

    if (!universidad) {
      return NextResponse.json({ error: "Universidad es obligatoria" }, { status: 400 });
    }

    const result = await db.execute({
      sql: "INSERT INTO Usuario (nombre, universidad) VALUES (?, ?) RETURNING id",
      args: [nombre || null, universidad],
    });

    const insertedId = result.rows[0].id as number;

    console.log("Nuevo usuario insertado:", { id: insertedId, nombre, universidad });

    return NextResponse.json({ 
      user_id: insertedId, 
      message: "Usuario registrado exitosamente" 
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
