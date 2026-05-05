import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          p.nivel,
          u.nombre,
          p.puntuacion,
          p.tiempo_total
        FROM Partida p
        JOIN Usuario u ON p.user_id = u.id
        ORDER BY p.nivel ASC, p.puntuacion DESC, p.tiempo_total ASC
      `,
      args: [],
    });

    // Group by level
    const grouped: Record<string, { nombre: string; puntuacion: number; tiempo_total: number }[]> = {};
    for (const row of result.rows) {
      const nivel = row.nivel as string;
      if (!grouped[nivel]) grouped[nivel] = [];
      grouped[nivel].push({
        nombre: row.nombre as string,
        puntuacion: row.puntuacion as number,
        tiempo_total: row.tiempo_total as number,
      });
    }

    return NextResponse.json({ rankings: grouped });
  } catch (error) {
    console.error("Error al obtener rankings:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
