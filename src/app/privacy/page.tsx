import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border-2 border-[#d4d4d4]">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2 text-slate-500 font-bold uppercase text-xs tracking-widest hover:bg-slate-100">
            <ChevronLeft size={16} /> Volver al Inicio
          </Button>
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-black text-[#cb0617] mb-2 uppercase tracking-tight">Aviso de Privacidad</h1>
          <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">Última actualización: Mayo 2025</p>

          <hr className="my-8" />

          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide mb-4">1. Responsable del Tratamiento de Datos</h2>
              <p className="text-slate-600 leading-relaxed">
                Este Aviso de Privacidad describe cómo se recopila, usa y protege la información personal de los usuarios de esta plataforma educativa interactiva dedicada a la enseñanza de la cadena de suministro (en adelante, "la Plataforma").
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide mb-4">2. Datos Personales que Recopilamos</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 mb-4">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-black text-slate-700 uppercase tracking-widest text-[10px]">Dato</th>
                      <th className="px-6 py-4 font-black text-slate-700 uppercase tracking-widest text-[10px]">Propósito</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-800">Nombre completo</td>
                      <td className="px-6 py-4 text-slate-600">Identificarte dentro de la plataforma y personalizar tu experiencia educativa.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-800">Universidad</td>
                      <td className="px-6 py-4 text-slate-600">Contextualizar el uso académico y generar estadísticas agregadas de uso por institución.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-sm text-primary font-bold">
                  ⚠️ No recopilamos correos electrónicos, contraseñas, números de teléfono ni datos de pago.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide mb-4">3. Finalidad del Tratamiento</h2>
              <p className="text-slate-600 leading-relaxed">
                Tus datos son utilizados exclusivamente para identificación en la plataforma, seguimiento de progreso educativo y generación de estadísticas académicas anónimas.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide mb-4">5. No Venta de Datos</h2>
              <ul className="space-y-4">
                <li className="flex gap-3 text-slate-600">
                  <span className="text-red-500 font-bold">❌</span> No vendemos tus datos a terceros.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="text-red-500 font-bold">❌</span> No compartimos datos con fines publicitarios.
                </li>
                <li className="flex gap-3 text-slate-600">
                  <span className="text-green-500 font-bold">✅</span> Solo compartimos datos por requerimiento legal o por funcionamiento técnico necesario (Vercel).
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide mb-4">6. Uso de Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                Utilizamos cookies estrictamente necesarias para el funcionamiento de la sesión y el registro del progreso. No utilizamos cookies de rastreo publicitario.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide mb-4">10. Derechos ARCO</h2>
              <p className="text-slate-600 leading-relaxed">
                De conformidad con la ley mexicana, tienes derecho al Acceso, Rectificación, Cancelación y Oposición de tus datos personales.
              </p>
            </div>
          </section>

          <hr className="my-12" />
          <p className="text-xs text-slate-400 italic">
            Este Aviso de Privacidad ha sido redactado de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.
          </p>
        </article>
      </div>
    </div>
  );
}
