import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, nivel, puntuacion, tiempo_total } = body;

    if (!user_id || !nivel || puntuacion === undefined || tiempo_total === undefined) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const result = await db.execute({
      sql: "INSERT INTO Partida (user_id, nivel, puntuacion, tiempo_total) VALUES (?, ?, ?, ?) RETURNING id",
      args: [user_id, nivel, puntuacion, tiempo_total],
    });

    const insertedId = result.rows[0].id as number;

    console.log("Nueva partida registrada:", { id: insertedId, user_id, nivel, puntuacion, tiempo_total });

    return NextResponse.json({ 
      partida_id: insertedId, 
      message: "Partida registrada exitosamente" 
    });
  } catch (error) {
    console.error("Error al registrar partida:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
