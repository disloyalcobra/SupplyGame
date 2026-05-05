export interface QuizOption {
  id: string; // A, B, C, D
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  icon: string;
  questions: QuizQuestion[];
}

export const QUIZZES: Quiz[] = [
  {
    id: "quiz_1",
    title: "Fundamentos de procesos y ERP",
    icon: "🧠",
    questions: [
      {
        id: 1,
        question: "¿Qué es un proceso de negocio?",
        options: [
          { id: "A", text: "Un sistema informático", isCorrect: false },
          { id: "B", text: "Un conjunto de actividades que generan un resultado", isCorrect: true },
          { id: "C", text: "Un departamento", isCorrect: false },
          { id: "D", text: "Un tipo de empresa", isCorrect: false },
        ]
      },
      {
        id: 2,
        question: "¿Cuál es la principal característica de los procesos de negocio?",
        options: [
          { id: "A", text: "Son independientes", isCorrect: false },
          { id: "B", text: "Son repetitivos únicamente", isCorrect: false },
          { id: "C", text: "Son transversales a varias áreas", isCorrect: true },
          { id: "D", text: "Solo pertenecen a finanzas", isCorrect: false },
        ]
      },
      {
        id: 3,
        question: "¿Qué problema genera la estructura funcional?",
        options: [
          { id: "A", text: "Falta de liderazgo", isCorrect: false },
          { id: "B", text: "Efecto silo", isCorrect: true },
          { id: "C", text: "Exceso de integración", isCorrect: false },
          { id: "D", text: "Baja tecnología", isCorrect: false },
        ]
      },
      {
        id: 4,
        question: "El efecto silo ocurre cuando:",
        options: [
          { id: "A", text: "Los procesos se automatizan", isCorrect: false },
          { id: "B", text: "Las áreas trabajan aisladas", isCorrect: true },
          { id: "C", text: "Se reducen costos", isCorrect: false },
          { id: "D", text: "Se mejora la comunicación", isCorrect: false },
        ]
      },
      {
        id: 5,
        question: "¿Qué significa “pensar horizontalmente”?",
        options: [
          { id: "A", text: "Ignorar procesos", isCorrect: false },
          { id: "B", text: "Ver solo tu área", isCorrect: false },
          { id: "C", text: "Ver el proceso completo de inicio a fin", isCorrect: true },
          { id: "D", text: "Trabajar menos", isCorrect: false },
        ]
      },
      {
        id: 6,
        question: "¿Qué son los sistemas ERP?",
        options: [
          { id: "A", text: "Sistemas de recursos humanos", isCorrect: false },
          { id: "B", text: "Sistemas que integran procesos empresariales", isCorrect: true },
          { id: "C", text: "Software de contabilidad únicamente", isCorrect: false },
          { id: "D", text: "Sistemas de producción", isCorrect: false },
        ]
      },
      {
        id: 7,
        question: "¿Cuál es el principal beneficio de un ERP?",
        options: [
          { id: "A", text: "Reducir empleados", isCorrect: false },
          { id: "B", text: "Integrar información en tiempo real", isCorrect: true },
          { id: "C", text: "Eliminar procesos", isCorrect: false },
          { id: "D", text: "Aumentar ventas directamente", isCorrect: false },
        ]
      },
      {
        id: 8,
        question: "¿Qué permiten los ERP en los procesos?",
        options: [
          { id: "A", text: "Fragmentarlos", isCorrect: false },
          { id: "B", text: "Gestionarlos de forma aislada", isCorrect: false },
          { id: "C", text: "Ejecutarlos de extremo a extremo", isCorrect: true },
          { id: "D", text: "Eliminarlos", isCorrect: false },
        ]
      },
      {
        id: 9,
        question: "¿Por qué son importantes los datos en un ERP?",
        options: [
          { id: "A", text: "Solo almacenan información", isCorrect: false },
          { id: "B", text: "Permiten monitoreo y mejora de procesos", isCorrect: true },
          { id: "C", text: "No tienen importancia", isCorrect: false },
          { id: "D", text: "Solo los usa contabilidad", isCorrect: false },
        ]
      },
      {
        id: 10,
        question: "¿Qué relación existe entre procesos y ERP?",
        options: [
          { id: "A", text: "No tienen relación", isCorrect: false },
          { id: "B", text: "ERP automatiza procesos aislados", isCorrect: false },
          { id: "C", text: "ERP integra y soporta procesos", isCorrect: true },
          { id: "D", text: "ERP reemplaza procesos", isCorrect: false },
        ]
      },
      {
        id: 11,
        question: "¿Qué dificulta la ejecución eficiente de procesos?",
        options: [
          { id: "A", text: "Uso de tecnología", isCorrect: false },
          { id: "B", text: "Falta de coordinación entre áreas", isCorrect: true },
          { id: "C", text: "Demasiados empleados", isCorrect: false },
          { id: "D", text: "Exceso de datos", isCorrect: false },
        ]
      },
      {
        id: 12,
        question: "¿Qué mejora un ERP principalmente?",
        options: [
          { id: "A", text: "Diseño gráfico", isCorrect: false },
          { id: "B", text: "Comunicación y eficiencia operativa", isCorrect: true },
          { id: "C", text: "Marketing", isCorrect: false },
          { id: "D", text: "Publicidad", isCorrect: false },
        ]
      }
    ]
  },
  {
    id: "quiz_2",
    title: "Procesos clave de negocio",
    icon: "🏭",
    questions: [
      {
        id: 1,
        question: "¿Qué significa procurement?",
        options: [
          { id: "A", text: "Venta", isCorrect: false },
          { id: "B", text: "Compra de materiales", isCorrect: true },
          { id: "C", text: "Producción", isCorrect: false },
          { id: "D", text: "Servicio", isCorrect: false },
        ]
      },
      {
        id: 2,
        question: "¿Qué proceso crea productos internamente?",
        options: [
          { id: "A", text: "Procurement", isCorrect: false },
          { id: "B", text: "Fulfillment", isCorrect: false },
          { id: "C", text: "Producción", isCorrect: true },
          { id: "D", text: "IWM", isCorrect: false },
        ]
      },
      {
        id: 3,
        question: "¿Qué proceso entrega productos al cliente?",
        options: [
          { id: "A", text: "Producción", isCorrect: false },
          { id: "B", text: "Fulfillment", isCorrect: true },
          { id: "C", text: "Planeación", isCorrect: false },
          { id: "D", text: "HCM", isCorrect: false },
        ]
      },
      {
        id: 4,
        question: "¿Qué proceso se activa cuando hay baja de inventario?",
        options: [
          { id: "A", text: "Fulfillment", isCorrect: false },
          { id: "B", text: "Procurement o Producción", isCorrect: true },
          { id: "C", text: "HCM", isCorrect: false },
          { id: "D", text: "Controlling", isCorrect: false },
        ]
      },
      {
        id: 5,
        question: "¿Qué hace el material planning?",
        options: [
          { id: "A", text: "Diseña productos", isCorrect: false },
          { id: "B", text: "Equilibra oferta y demanda", isCorrect: true },
          { id: "C", text: "Vende productos", isCorrect: false },
          { id: "D", text: "Contrata empleados", isCorrect: false },
        ]
      },
      {
        id: 6,
        question: "¿Qué ocurre si hay exceso de inventario?",
        options: [
          { id: "A", text: "Aumenta eficiencia", isCorrect: false },
          { id: "B", text: "Disminuyen costos", isCorrect: false },
          { id: "C", text: "Aumentan costos de almacenamiento", isCorrect: true },
          { id: "D", text: "Mejora ventas", isCorrect: false },
        ]
      },
      {
        id: 7,
        question: "¿Qué es un stock-out?",
        options: [
          { id: "A", text: "Exceso de inventario", isCorrect: false },
          { id: "B", text: "Falta de productos para satisfacer demanda", isCorrect: true },
          { id: "C", text: "Venta rápida", isCorrect: false },
          { id: "D", text: "Producción alta", isCorrect: false },
        ]
      },
      {
        id: 8,
        question: "¿Qué proceso gestiona almacenamiento y movimiento?",
        options: [
          { id: "A", text: "Producción", isCorrect: false },
          { id: "B", text: "IWM", isCorrect: true },
          { id: "C", text: "Procurement", isCorrect: false },
          { id: "D", text: "CO", isCorrect: false },
        ]
      },
      {
        id: 9,
        question: "¿Qué proceso gestiona el ciclo de vida del producto?",
        options: [
          { id: "A", text: "Fulfillment", isCorrect: false },
          { id: "B", text: "Lifecycle Data Management", isCorrect: true },
          { id: "C", text: "HCM", isCorrect: false },
          { id: "D", text: "Project Management", isCorrect: false },
        ]
      },
      {
        id: 10,
        question: "¿Qué proceso se encarga del mantenimiento?",
        options: [
          { id: "A", text: "Procurement", isCorrect: false },
          { id: "B", text: "Asset Management", isCorrect: true },
          { id: "C", text: "Fulfillment", isCorrect: false },
          { id: "D", text: "Producción", isCorrect: false },
        ]
      },
      {
        id: 11,
        question: "¿Qué proceso maneja empleados?",
        options: [
          { id: "A", text: "HCM", isCorrect: true },
          { id: "B", text: "FI", isCorrect: false },
          { id: "C", text: "IWM", isCorrect: false },
          { id: "D", text: "Producción", isCorrect: false },
        ]
      },
      {
        id: 12,
        question: "¿Qué proceso gestiona proyectos temporales?",
        options: [
          { id: "A", text: "Fulfillment", isCorrect: false },
          { id: "B", text: "Project Management", isCorrect: true },
          { id: "C", text: "Procurement", isCorrect: false },
          { id: "D", text: "Planeación", isCorrect: false },
        ]
      }
    ]
  },
  {
    id: "quiz_3",
    title: "Integración y contabilidad",
    icon: "💰",
    questions: [
      {
        id: 1,
        question: "¿Qué tienen en común todos los procesos?",
        options: [
          { id: "A", text: "No generan ingresos", isCorrect: false },
          { id: "B", text: "Impactan las finanzas", isCorrect: true },
          { id: "C", text: "Son independientes", isCorrect: false },
          { id: "D", text: "No usan datos", isCorrect: false },
        ]
      },
      {
        id: 2,
        question: "¿Qué hace la contabilidad financiera (FI)?",
        options: [
          { id: "A", text: "Reportes internos", isCorrect: false },
          { id: "B", text: "Reportes legales externos", isCorrect: true },
          { id: "C", text: "Producción", isCorrect: false },
          { id: "D", text: "Recursos humanos", isCorrect: false },
        ]
      },
      {
        id: 3,
        question: "¿Qué hace la contabilidad de gestión (CO)?",
        options: [
          { id: "A", text: "Cumple leyes", isCorrect: false },
          { id: "B", text: "Apoya decisiones internas", isCorrect: true },
          { id: "C", text: "Vende productos", isCorrect: false },
          { id: "D", text: "Diseña procesos", isCorrect: false },
        ]
      },
      {
        id: 4,
        question: "¿Qué registra el general ledger?",
        options: [
          { id: "A", text: "Clientes", isCorrect: false },
          { id: "B", text: "Impactos financieros", isCorrect: true },
          { id: "C", text: "Inventario", isCorrect: false },
          { id: "D", text: "Producción", isCorrect: false },
        ]
      },
      {
        id: 5,
        question: "¿Qué es accounts payable?",
        options: [
          { id: "A", text: "Dinero que deben los clientes", isCorrect: false },
          { id: "B", text: "Dinero que la empresa debe a proveedores", isCorrect: true },
          { id: "C", text: "Ventas", isCorrect: false },
          { id: "D", text: "Costos", isCorrect: false },
        ]
      },
      {
        id: 6,
        question: "¿Qué es accounts receivable?",
        options: [
          { id: "A", text: "Deudas a proveedores", isCorrect: false },
          { id: "B", text: "Dinero que deben los clientes", isCorrect: true },
          { id: "C", text: "Inventario", isCorrect: false },
          { id: "D", text: "Producción", isCorrect: false },
        ]
      },
      {
        id: 7,
        question: "¿Qué permite la integración de procesos?",
        options: [
          { id: "A", text: "Aislamiento", isCorrect: false },
          { id: "B", text: "Mejor coordinación", isCorrect: true },
          { id: "C", text: "Más errores", isCorrect: false },
          { id: "D", text: "Menos datos", isCorrect: false },
        ]
      },
      {
        id: 8,
        question: "¿Qué pasa si no hay integración?",
        options: [
          { id: "A", text: "Mejora eficiencia", isCorrect: false },
          { id: "B", text: "Hay retrasos y errores", isCorrect: true },
          { id: "C", text: "Baja complejidad", isCorrect: false },
          { id: "D", text: "Menos costos", isCorrect: false },
        ]
      },
      {
        id: 9,
        question: "¿Qué empresa se usa como ejemplo?",
        options: [
          { id: "A", text: "Apple", isCorrect: false },
          { id: "B", text: "Global Bike Inc.", isCorrect: true },
          { id: "C", text: "Amazon", isCorrect: false },
          { id: "D", text: "IBM", isCorrect: false },
        ]
      },
      {
        id: 10,
        question: "¿Qué sistema usa GBI?",
        options: [
          { id: "A", text: "Excel", isCorrect: false },
          { id: "B", text: "SAP ERP", isCorrect: true },
          { id: "C", text: "Oracle básico", isCorrect: false },
          { id: "D", text: "CRM", isCorrect: false },
        ]
      },
      {
        id: 11,
        question: "¿Por qué es importante la integración?",
        options: [
          { id: "A", text: "Reduce empleados", isCorrect: false },
          { id: "B", text: "Mejora toma de decisiones", isCorrect: true },
          { id: "C", text: "Elimina procesos", isCorrect: false },
          { id: "D", text: "Reduce clientes", isCorrect: false },
        ]
      },
      {
        id: 12,
        question: "¿Qué permite el monitoreo en ERP?",
        options: [
          { id: "A", text: "Solo almacenar datos", isCorrect: false },
          { id: "B", text: "Mejorar procesos continuamente", isCorrect: true },
          { id: "C", text: "Eliminar áreas", isCorrect: false },
          { id: "D", text: "Evitar reportes", isCorrect: false },
        ]
      }
    ]
  }
];

export function getQuizById(id: string): Quiz | undefined {
  return QUIZZES.find(q => q.id === id);
}
