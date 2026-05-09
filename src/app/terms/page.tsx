import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border-2 border-[#d4d4d4]">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2 text-slate-500 font-bold uppercase text-xs tracking-widest hover:bg-slate-100">
            <ChevronLeft size={16} /> Volver al Inicio
          </Button>
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-black text-[#cb0617] mb-2 uppercase tracking-tight">Términos y Condiciones de Uso</h1>
          <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">Última actualización: Mayo 2025</p>

          <hr className="my-8" />

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">1. Aceptación de los Términos</h2>
            <p className="text-slate-600 leading-relaxed">
              Al acceder y utilizar esta plataforma educativa interactiva sobre cadena de suministro (en adelante, "la Plataforma"), aceptas de manera expresa estos Términos y Condiciones de Uso (en adelante, "los Términos"). Si no estás de acuerdo con alguno de estos Términos, te pedimos que no utilices la Plataforma.
            </p>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">2. Descripción del Servicio</h2>
            <p className="text-slate-600 leading-relaxed">
              La Plataforma es un recurso educativo digital <strong>sin fines de lucro</strong> diseñado para enseñar conceptos de cadena de suministro a estudiantes universitarios. Ofrece:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Módulos de aprendizaje interactivos sobre logística y cadena de suministro.</li>
              <li>Actividades, simulaciones y ejercicios prácticos.</li>
              <li>Materiales de estudio de acceso libre para fines académicos.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              La Plataforma es de <strong>uso estrictamente educativo</strong> y no genera ingresos económicos de ningún tipo.
            </p>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">3. Registro y Acceso</h2>
            <h3 className="text-xl font-bold text-slate-700">3.1 Datos requeridos</h3>
            <p className="text-slate-600 leading-relaxed">
              Para acceder a la Plataforma únicamente se solicitará:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Tu <strong>nombre completo</strong>.</li>
              <li>El nombre de tu <strong>universidad</strong>.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              No se requiere correo electrónico, contraseña ni ningún otro dato personal adicional.
            </p>

            <h3 className="text-xl font-bold text-slate-700">3.2 Veracidad de la información</h3>
            <p className="text-slate-600 leading-relaxed">
              Al proporcionar tus datos de acceso, declaras que la información es <strong>verídica y precisa</strong>. La Plataforma no se hace responsable por el uso indebido derivado de información falsa proporcionada por el usuario.
            </p>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">4. Uso Permitido</h2>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="text-green-500 font-bold">✅</span> Usar la Plataforma exclusivamente con fines educativos y académicos.
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="text-green-500 font-bold">✅</span> Respetar los derechos de propiedad intelectual sobre el contenido publicado.
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="text-green-500 font-bold">✅</span> Comportarte de manera ética y respetuosa dentro de la Plataforma.
              </li>
            </ul>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">5. Uso Prohibido</h2>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-600">
                <span className="text-red-500 font-bold">❌</span> Usar la Plataforma con fines comerciales, publicitarios o de lucro.
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="text-red-500 font-bold">❌</span> Intentar vulnerar la seguridad, integridad o disponibilidad de la Plataforma.
              </li>
              <li className="flex gap-3 text-slate-600">
                <span className="text-red-500 font-bold">❌</span> Realizar ingeniería inversa o intentar extraer el código fuente.
              </li>
            </ul>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">6. Propiedad Intelectual</h2>
            <p className="text-slate-600 leading-relaxed">
              Todo el contenido educativo disponible en la Plataforma —incluyendo textos, gráficos, simulaciones, diagramas y código— es propiedad de sus respectivos autores y está protegido por las leyes aplicables.
            </p>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">7. Naturaleza sin Fines de Lucro</h2>
            <p className="text-slate-600 leading-relaxed">
              La Plataforma opera sin fines de lucro. No se venden datos ni se genera publicidad. El único objetivo es apoyar la formación académica.
            </p>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">8. Infraestructura Tecnológica (Vercel)</h2>
            <p className="text-slate-600 leading-relaxed">
              La Plataforma está alojada en Vercel Inc. El servicio depende de su disponibilidad técnica. Puedes consultar sus términos en vercel.com/legal/terms.
            </p>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">13. Legislación Aplicable</h2>
            <p className="text-slate-600 leading-relaxed">
              Estos Términos se rigen por las leyes de los <strong>Estados Unidos Mexicanos</strong>.
            </p>

            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">15. Contacto</h2>
            <p className="text-slate-600 leading-relaxed">
              Si tienes dudas, contáctanos a través de la plataforma.
            </p>
          </section>

          <hr className="my-12" />
          <p className="text-xs text-slate-400 italic">
            Estos Términos y Condiciones han sido redactados de conformidad con la legislación vigente en México.
          </p>
        </article>
      </div>
    </div>
  );
}
