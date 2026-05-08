// ── Banco de preguntas por perfil × competencia ───────────────────────────────
// Cada pregunta: { q, options: [string], correct: index, explanation? }
// 3 preguntas por competencia = score 0-3 → mapeado a 1-5

export const QUIZ_BANK = {

  // ── UX Research ─────────────────────────────────────────────────────────────
  'UX Research': {
    'Research Planning & Strategy': [
      {
        q: '¿Cuál es el primer paso al diseñar un plan de investigación?',
        options: [
          'Reclutar participantes',
          'Definir las research questions y objetivos',
          'Elegir el método de investigación',
          'Crear el discussion guide',
        ],
        correct: 1,
        explanation: 'Las preguntas de investigación definen qué necesitas saber y condicionan todas las decisiones posteriores.',
      },
      {
        q: 'Un stakeholder pide resultados en 5 días con presupuesto mínimo. ¿Qué approach es más adecuado?',
        options: [
          'Estudio longitudinal con diario',
          'Guerrilla usability testing con 5 usuarios',
          'Encuesta con n=500',
          'Focus group de 2 horas',
        ],
        correct: 1,
        explanation: 'Guerrilla testing es rápido, barato y genera insights accionables sobre usabilidad.',
      },
      {
        q: '¿Qué distingue una research question de una business question?',
        options: [
          'La research question se enfoca en métricas de negocio',
          'La research question indaga comportamientos y actitudes de usuarios',
          'Son equivalentes en un proceso de diseño',
          'La business question siempre tiene más prioridad',
        ],
        correct: 1,
      },
    ],

    'Qualitative Methods': [
      {
        q: '¿Cuál de estos NO es un método cualitativo?',
        options: ['Entrevista en profundidad', 'A/B testing', 'Contextual inquiry', 'Diary study'],
        correct: 1,
        explanation: 'A/B testing es un método cuantitativo que mide diferencias estadísticas entre variantes.',
      },
      {
        q: 'Durante una entrevista, el usuario responde "Sí, lo uso bastante". ¿Cuál es la mejor respuesta?',
        options: [
          'Pasar a la siguiente pregunta del guion',
          'Preguntar: "¿Puedes contarme la última vez que lo usaste?"',
          'Confirmar: "¿O sea que te gusta?"',
          'Anotar y continuar',
        ],
        correct: 1,
        explanation: 'Las preguntas de incident crítico (última vez que…) obtienen comportamiento real, no actitudes declaradas.',
      },
      {
        q: '¿Para qué sirve el contextual inquiry frente a una entrevista tradicional?',
        options: [
          'Para obtener datos estadísticamente representativos',
          'Para observar comportamiento real en el contexto natural del usuario',
          'Para reducir el tiempo de investigación',
          'Para evitar sesgos del entrevistador',
        ],
        correct: 1,
      },
    ],

    'Quantitative Methods': [
      {
        q: '¿Cuántos participantes se necesitan típicamente para que un A/B test tenga significancia estadística?',
        options: ['5-10', '20-30', 'Depende del tamaño del efecto esperado y el poder estadístico', '100 exactamente'],
        correct: 2,
        explanation: 'El sample size se calcula con power analysis: efecto mínimo detectable, α (0.05) y poder (0.8).',
      },
      {
        q: 'Una encuesta tiene 60% de tasa de respuesta y el NPS resultante es 42. ¿Qué debes considerar?',
        options: [
          'El dato es válido, 60% es suficiente',
          'Posible sesgo de no-respuesta: los que no respondieron pueden tener opiniones distintas',
          'Nada, el NPS siempre es representativo',
          'Repetir la encuesta hasta llegar al 100%',
        ],
        correct: 1,
      },
      {
        q: '¿Qué mide el Single Ease Question (SEQ)?',
        options: [
          'La satisfacción general con el producto',
          'La dificultad percibida de una tarea específica',
          'El Net Promoter Score de una feature',
          'El tiempo en tarea',
        ],
        correct: 1,
      },
    ],

    'Synthesis & Artifacts': [
      {
        q: 'Tienes 8 transcripciones de entrevistas. ¿Cuál es el proceso de síntesis más riguroso?',
        options: [
          'Leer y escribir un resumen ejecutivo',
          'Codificación temática: fragmentar, etiquetar y agrupar por patrones',
          'Extraer las 3 quotes más representativas',
          'Crear un journey map directamente desde las notas',
        ],
        correct: 1,
        explanation: 'La codificación temática garantiza que los insights emergen de los datos, no de suposiciones previas.',
      },
      {
        q: '¿Cuándo es más útil un "How Might We" (HMW)?',
        options: [
          'Para documentar hallazgos de investigación',
          'Para reencuadrar problemas de usuario en oportunidades de diseño',
          'Para priorizar features con stakeholders',
          'Para validar prototipos',
        ],
        correct: 1,
      },
      {
        q: 'Un insight es:',
        options: [
          'Una observación directa de lo que hace el usuario',
          'Una comprensión profunda sobre por qué el usuario se comporta de cierta manera',
          'Una feature request del usuario',
          'Un dato estadístico sobre el comportamiento',
        ],
        correct: 1,
      },
    ],

    'Communication & Storytelling': [
      {
        q: '¿Cuál estructura es más efectiva para presentar hallazgos a un C-level?',
        options: [
          'Metodología → datos → conclusiones',
          'Problema clave → evidencia → impacto → recomendación',
          'Cronología del proceso de research',
          'Lista completa de hallazgos ordenados por fecha',
        ],
        correct: 1,
        explanation: 'La estructura "pyramid principle" pone la conclusión primero para audiencias ejecutivas.',
      },
      {
        q: 'Un stakeholder rechaza los hallazgos diciendo "mis usuarios son diferentes". ¿Cómo respondes?',
        options: [
          'Aceptar y repetir el estudio',
          'Mostrar citas directas de usuarios + patrones repetidos + proponer validación adicional',
          'Insistir en que la metodología es correcta',
          'Escalar el conflicto al director',
        ],
        correct: 1,
      },
      {
        q: '¿Qué hace a un persona de usuario (persona document) accionable para el equipo de diseño?',
        options: [
          'Foto realista y nombre ficticio memorable',
          'Goals, frustraciones y comportamientos respaldados por datos reales',
          'Datos demográficos detallados',
          'Muchas citas textuales del research',
        ],
        correct: 1,
      },
    ],

    'AI Tool Fluency': [
      {
        q: '¿Para qué tarea de research es más útil un LLM como herramienta de apoyo?',
        options: [
          'Reemplazar entrevistas con usuarios',
          'Síntesis preliminar de notas y generación de códigos temáticos para revisión humana',
          'Calcular significancia estadística de encuestas',
          'Reclutar participantes automáticamente',
        ],
        correct: 1,
      },
      {
        q: 'Al usar IA para analizar transcripciones, ¿cuál es el riesgo principal?',
        options: [
          'Que procese el texto demasiado rápido',
          'Alucinaciones o interpretaciones sesgadas que el investigador debe verificar',
          'Que no entienda el idioma',
          'Que el costo sea muy alto',
        ],
        correct: 1,
      },
      {
        q: '¿Cuál es un uso apropiado de IA generativa en el proceso de research?',
        options: [
          'Generar insights sin leer las transcripciones',
          'Crear draft de discussion guides para iterar y validar con el equipo',
          'Decidir qué método usar sin análisis previo',
          'Sintetizar datos sin supervisión y presentarlos directamente',
        ],
        correct: 1,
      },
    ],

    'AI Applied to Research': [
      {
        q: '¿Qué herramienta de IA es más adecuada para transcribir y analizar entrevistas?',
        options: ['DALL-E', 'Otter.ai o Grain con resumen automático', 'Midjourney', 'GitHub Copilot'],
        correct: 1,
      },
      {
        q: 'Usas IA para generar un affinity diagram desde 50 notas. ¿Cuál es el paso crítico siguiente?',
        options: [
          'Presentar el diagrama directamente al equipo',
          'Revisar, corregir y validar cada cluster con el equipo antes de usarlo',
          'Añadir más notas para mejorar la precisión',
          'Repetir el proceso con otro modelo',
        ],
        correct: 1,
      },
      {
        q: '¿Qué limitación tienen los modelos de IA para el análisis de research cualitativo?',
        options: [
          'Solo procesan texto en inglés',
          'No tienen acceso al contexto cultural, tono emocional y lenguaje no verbal',
          'No pueden procesar más de 10 respuestas',
          'Solo funcionan con datos estructurados',
        ],
        correct: 1,
      },
    ],

    'AI Critical Judgment': [
      {
        q: 'Un LLM genera 5 insights desde tus entrevistas. ¿Cómo los validas?',
        options: [
          'Confiar en el modelo si el prompt fue bien construido',
          'Contrastar cada insight con citas textuales y frecuencia de aparición en los datos',
          'Validar con el stakeholder sin revisar los datos originales',
          'Publicarlos si parecen coherentes con las hipótesis iniciales',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo NO deberías usar IA para síntesis de research?',
        options: [
          'Cuando tienes más de 20 entrevistas',
          'Cuando los datos contienen información sensible o confidencial de usuarios',
          'Cuando el proyecto es de producto digital',
          'Cuando el plazo es ajustado',
        ],
        correct: 1,
      },
      {
        q: 'Un modelo de IA afirma que "el 80% de usuarios prefiere el flujo A". Esto proviene de tus notas cualitativas. ¿Qué problema hay?',
        options: [
          'Ninguno, los porcentajes siempre son válidos',
          'Cuantificar datos cualitativos es engañoso: la frecuencia en notas no equivale a prevalencia real',
          'El porcentaje debería ser mayor para ser significativo',
          'Solo es válido si hay más de 100 participantes',
        ],
        correct: 1,
      },
    ],
  },

  // ── UX Design ───────────────────────────────────────────────────────────────
  'UX Design': {
    'User Research & Empathy': [
      {
        q: '¿Cuál es la diferencia entre empatía y simpatía en el contexto de UX?',
        options: [
          'Son sinónimos en diseño',
          'Empatía es entender la perspectiva del usuario desde su experiencia; simpatía es proyectar la propia',
          'Empatía es un método de investigación; simpatía es una técnica de prototipado',
          'La simpatía es más útil en diseño de servicios',
        ],
        correct: 1,
      },
      {
        q: 'Tienes 1 semana para validar un concepto antes de diseño. ¿Qué haces?',
        options: [
          'Encuesta de 200 personas',
          '5 entrevistas de concepto con usuarios del segmento objetivo',
          'Revisión heurística interna',
          'Análisis de métricas de la app actual',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es un mapa de empatía y para qué sirve?',
        options: [
          'Un mapa de navegación del producto',
          'Una herramienta para sintetizar qué piensa, siente, dice y hace el usuario',
          'Un diagrama de flujo de pantallas',
          'Una matriz de priorización de features',
        ],
        correct: 1,
      },
    ],

    'Interaction Design & Flows': [
      {
        q: '¿Qué principio de Fitts Law implica para el diseño de botones de acción primaria?',
        options: [
          'Deben ser de color rojo para atraer atención',
          'Deben ser grandes y estar ubicados cerca de donde se encuentra el cursor/pulgar',
          'Deben estar siempre en la esquina superior derecha',
          'El tamaño no importa si el color es correcto',
        ],
        correct: 1,
      },
      {
        q: 'Un flujo de onboarding tiene 8 pasos. Los datos muestran abandono masivo en el paso 3. ¿Cuál es tu primer paso?',
        options: [
          'Rediseñar el paso 3 con mejor visual',
          'Analizar qué acción se pide en el paso 3 y si es esencial o puede diferirse',
          'Cambiar el copy del paso 3',
          'Añadir una barra de progreso',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo es preferible un progressive disclosure pattern?',
        options: [
          'Cuando todos los usuarios son expertos',
          'Cuando la interfaz tiene mucha información y se quiere reducir la carga cognitiva inicial',
          'Cuando el producto es un dashboard ejecutivo',
          'Siempre, en cualquier tipo de interfaz',
        ],
        correct: 1,
      },
    ],

    'Information Architecture': [
      {
        q: '¿Para qué sirve un card sorting?',
        options: [
          'Para validar el visual design de una interfaz',
          'Para entender cómo los usuarios agrupan y etiquetan contenido mentalmente',
          'Para priorizar el backlog de producto',
          'Para medir el tiempo en tarea',
        ],
        correct: 1,
      },
      {
        q: 'La diferencia entre card sorting abierto y cerrado es:',
        options: [
          'El abierto usa tarjetas físicas; el cerrado, digitales',
          'En el abierto los usuarios crean sus propias categorías; en el cerrado las categorías están predefinidas',
          'El cerrado tiene más participantes',
          'No hay diferencia práctica',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es un tree test?',
        options: [
          'Un test de usabilidad con prototipos de alta fidelidad',
          'Una técnica para evaluar si los usuarios encuentran contenido dentro de una jerarquía de navegación',
          'Un método para testear el flujo de onboarding',
          'Una prueba de accesibilidad visual',
        ],
        correct: 1,
      },
    ],

    'Design Systems & Consistency': [
      {
        q: '¿Cuál es la principal ventaja de un design system sobre una guía de estilos?',
        options: [
          'Es más bonito visualmente',
          'Incluye componentes reutilizables con comportamiento y reglas de uso, no solo estilos',
          'Es obligatorio en todas las empresas tech',
          'Reemplaza la necesidad de hacer research',
        ],
        correct: 1,
      },
      {
        q: 'Un desarrollador dice que un componente del design system "no funciona" para su caso. ¿Qué haces?',
        options: [
          'Crear un componente ad-hoc para ese caso',
          'Entender el caso de uso, evaluar si el sistema debe evolucionar y documentar la decisión',
          'Obligar al dev a usar el componente existente',
          'Eliminar el componente del sistema',
        ],
        correct: 1,
      },
      {
        q: '¿Qué son los design tokens?',
        options: [
          'Los iconos del sistema de diseño',
          'Variables que almacenan decisiones de diseño (color, tipografía, espaciado) para uso en código y diseño',
          'Los permisos de acceso al archivo de Figma',
          'Las versiones publicadas del design system',
        ],
        correct: 1,
      },
    ],

    'Prototyping & Fidelity': [
      {
        q: '¿Cuándo es más apropiado un prototipo de baja fidelidad?',
        options: [
          'Para presentar a inversores',
          'En fases tempranas para explorar y validar conceptos rápidamente sin sesgar por el visual',
          'Justo antes del handoff a desarrollo',
          'Para testear micro-interacciones',
        ],
        correct: 1,
      },
      {
        q: 'En un test de usabilidad con prototipo, un usuario dice "esto no funciona bien porque es un prototipo". ¿Qué haces?',
        options: [
          'Cancelar la sesión',
          'Reconocer la limitación y pedirle que imagine cómo se comportaría; enfocarse en el flujo, no el pulido',
          'Mejorar el prototipo a alta fidelidad antes de continuar',
          'Ignorar el comentario y seguir',
        ],
        correct: 1,
      },
      {
        q: '¿Qué mide principalmente un test de usabilidad con prototipo?',
        options: [
          'El atractivo estético del diseño',
          'Si los usuarios pueden completar tareas clave y dónde encuentran fricciones',
          'La velocidad de carga del producto final',
          'La opinión general sobre la marca',
        ],
        correct: 1,
      },
    ],

    'Accessibility (WCAG)': [
      {
        q: '¿Qué ratio de contraste mínimo requiere WCAG 2.1 nivel AA para texto normal?',
        options: ['2:1', '3:1', '4.5:1', '7:1'],
        correct: 2,
        explanation: 'WCAG 2.1 AA exige 4.5:1 para texto normal y 3:1 para texto grande (18pt+ o 14pt+ bold).',
      },
      {
        q: 'Un usuario navega tu interfaz solo con teclado. ¿Cuál es el indicador visual más importante?',
        options: [
          'El color de fondo',
          'El focus indicator visible en cada elemento interactivo',
          'El tamaño de la fuente',
          'Las animaciones de transición',
        ],
        correct: 1,
      },
      {
        q: '¿Qué significa que una imagen sea "decorativa" en términos de accesibilidad?',
        options: [
          'Que tiene colores llamativos',
          'Que no aporta información y debe tener alt="" para que los lectores de pantalla la ignoren',
          'Que es un ícono del sistema',
          'Que tiene alta resolución',
        ],
        correct: 1,
      },
    ],

    'Design-to-Code Collaboration': [
      {
        q: '¿Qué información es crítica incluir en las specs de handoff para un desarrollador?',
        options: [
          'Solo los colores en HEX',
          'Estados de componentes (default, hover, focus, disabled, error), espaciados exactos y comportamiento responsive',
          'El número de versión de Figma',
          'La fuente de inspiración del diseño',
        ],
        correct: 1,
      },
      {
        q: 'Un developer implementa un componente diferente al diseño. ¿Cuál es la causa más común?',
        options: [
          'Los developers no entienden diseño',
          'Falta de especificación de estados, comportamiento y edge cases en el handoff',
          'El diseño era incorrecto',
          'El developer usó un framework equivocado',
        ],
        correct: 1,
      },
      {
        q: '¿Para qué sirve entender CSS básico como UX Designer?',
        options: [
          'Para reemplazar al developer',
          'Para comunicar con precisión constraints técnicas, negociar soluciones y especificar animaciones',
          'Para crear el design system directamente en código',
          'Solo sirve si el equipo no usa Figma',
        ],
        correct: 1,
      },
    ],

    'AI Tool Fluency': [
      {
        q: '¿Qué tarea de UX Design se beneficia más del uso de IA generativa hoy?',
        options: [
          'Definir la estrategia de producto',
          'Generar variantes de copy, explorar conceptos visuales y acelerar la exploración de ideas',
          'Tomar decisiones de IA sobre qué features priorizar',
          'Reemplazar las pruebas de usuario',
        ],
        correct: 1,
      },
      {
        q: '¿Cómo puede Figma AI mejorar tu flujo de trabajo de diseño?',
        options: [
          'Tomando todas las decisiones de diseño de forma automática',
          'Generando variantes, renombrando capas, sugiriendo componentes y acelerando tareas repetitivas',
          'Realizando tests de usuario automatizados',
          'Escribiendo el código de los componentes',
        ],
        correct: 1,
      },
      {
        q: '¿Cuál es el límite más importante de las herramientas de IA para UX Design?',
        options: [
          'Son demasiado lentas',
          'No tienen comprensión del contexto del usuario, el negocio ni las restricciones técnicas reales',
          'Solo funcionan en inglés',
          'No pueden abrir archivos de Figma',
        ],
        correct: 1,
      },
    ],

    'AI Applied to Design': [
      {
        q: '¿Qué herramienta usa IA para generar interfaces a partir de prompts de texto?',
        options: ['InVision', 'Galileo AI o Uizard', 'Zeplin', 'Abstract'],
        correct: 1,
      },
      {
        q: 'Usas IA para generar 20 variantes de un hero section. ¿Cuál es el valor real de este proceso?',
        options: [
          'Elegir la primera variante y usarla directamente',
          'Explorar un espacio de soluciones amplio en minutos para informar la dirección creativa',
          'Evitar hacer research previo',
          'Demostrar que el equipo usa tecnología avanzada',
        ],
        correct: 1,
      },
      {
        q: '¿Cómo integrarías una herramienta de IA en el proceso de design critique?',
        options: [
          'Dejando que la IA decida si el diseño es correcto',
          'Usando IA para generar preguntas de critique, identificar inconsistencias con el design system o sugerir alternativas para discutir',
          'Reemplazando las sesiones de critique con análisis de IA',
          'Solo para documentar las decisiones de critique',
        ],
        correct: 1,
      },
    ],

    'AI Critical Judgment': [
      {
        q: 'Una IA genera un flujo de onboarding "optimizado". ¿Cuál es tu primer criterio de evaluación?',
        options: [
          'Si visualmente se ve moderno',
          'Si el flujo refleja las necesidades reales de usuarios validadas con research',
          'Si el código generado es limpio',
          'Si el stakeholder lo aprueba sin verlo',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo es problemático usar IA para generar imágenes de usuarios en presentaciones de research?',
        options: [
          'Siempre es problemático',
          'Cuando las imágenes perpetúan sesgos demográficos o no representan la diversidad real de los usuarios',
          'Solo si el cliente lo prohíbe',
          'Cuando la resolución es baja',
        ],
        correct: 1,
      },
      {
        q: 'Un sistema de IA propone rediseñar el flujo de checkout basándose en "mejores prácticas". ¿Qué debes hacer?',
        options: [
          'Implementarlo directamente ya que viene de datos',
          'Validar que las "mejores prácticas" aplican al contexto específico de tus usuarios y negocio',
          'Rechazarlo porque la IA no entiende diseño',
          'Pedir al developer que lo implemente y medir después',
        ],
        correct: 1,
      },
    ],
  },

  // ── UI Design ────────────────────────────────────────────────────────────────
  'UI Design': {
    'Visual Hierarchy & Aesthetics': [
      {
        q: '¿Qué principio gestáltico explica por qué agrupamos elementos cercanos como relacionados?',
        options: ['Similitud', 'Proximidad', 'Continuidad', 'Cierre'],
        correct: 1,
      },
      {
        q: 'Tienes un dashboard con 12 elementos de igual peso visual. ¿Cuál es el problema principal?',
        options: [
          'Hay demasiados colores',
          'Ausencia de jerarquía: el usuario no sabe qué mirar primero',
          'El layout no es responsive',
          'Falta una barra de navegación',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es el "visual weight" de un elemento?',
        options: [
          'Su tamaño en píxeles',
          'La atención visual que atrae relativa a otros elementos, determinada por tamaño, color, contraste y posición',
          'El número de colores que usa',
          'Su posición en el z-index',
        ],
        correct: 1,
      },
    ],

    'Design Systems & Tokens': [
      {
        q: '¿Cuál es la diferencia entre un token de color "primitivo" y uno "semántico"?',
        options: [
          'Son lo mismo con distintos nombres',
          'El primitivo define el color en sí (#3B5BDB); el semántico define su uso (color-primary-action)',
          'Los semánticos solo se usan en dark mode',
          'Los primitivos son para developers; los semánticos para diseñadores',
        ],
        correct: 1,
      },
      {
        q: '¿Por qué es preferible usar espaciados de una escala fija (4, 8, 16, 24, 32…) en lugar de valores arbitrarios?',
        options: [
          'Por razones de rendimiento técnico',
          'Genera ritmo visual consistente y facilita la implementación predecible en código',
          'Es un requisito de WCAG',
          'Solo aplica en interfaces móviles',
        ],
        correct: 1,
      },
      {
        q: 'Un componente tiene 4 variantes: primary, secondary, ghost y destructive. ¿Cuándo usarías "ghost"?',
        options: [
          'Para la acción principal de la página',
          'Para acciones secundarias de baja prioridad donde el botón no debe competir visualmente',
          'Para acciones irreversibles',
          'Solo en modales',
        ],
        correct: 1,
      },
    ],

    'Interaction Feedback': [
      {
        q: '¿Cuáles son los 4 estados básicos que debe tener un componente interactivo?',
        options: [
          'Rojo, verde, azul, gris',
          'Default, hover, active/pressed, disabled',
          'Small, medium, large, xlarge',
          'Light, dark, color, outline',
        ],
        correct: 1,
      },
      {
        q: 'Un formulario envía datos al servidor. ¿Qué feedback visual es indispensable?',
        options: [
          'Un confetti animation',
          'Estado de loading durante el envío + confirmación de éxito o mensaje de error específico',
          'Solo el mensaje de éxito final',
          'Cambiar el color de todos los campos',
        ],
        correct: 1,
      },
      {
        q: '¿Cuánto tiempo máximo puede durar una micro-animación de feedback sin percibirse como lenta?',
        options: ['50ms', '200-300ms', '1 segundo', '2 segundos'],
        correct: 1,
        explanation: 'Las animaciones entre 200-300ms se perciben como responsivas. Más de 500ms se sienten lentas.',
      },
    ],

    'Accessibility & Inclusion': [
      {
        q: '¿Cuál es el error de accesibilidad más común en formularios?',
        options: [
          'Usar demasiados campos',
          'No asociar labels con inputs, dependiendo solo del placeholder como etiqueta',
          'Usar colores corporativos',
          'Tener campos opcionales',
        ],
        correct: 1,
      },
      {
        q: '¿Por qué no se debe usar solo el color para comunicar un error?',
        options: [
          'Porque los colores no se imprimen bien',
          'Porque usuarios con daltonismo no pueden distinguir el error del estado normal',
          'Porque WCAG lo prohíbe explícitamente en todos los casos',
          'Por razones de rendimiento',
        ],
        correct: 1,
      },
      {
        q: 'Un ícono sin texto acompañante en una barra de herramientas. ¿Qué atributo ARIA es esencial?',
        options: ['aria-hidden="true"', 'aria-label con descripción de la acción', 'role="button"', 'tabindex="-1"'],
        correct: 1,
      },
    ],

    'Responsive Design': [
      {
        q: '¿Qué significa "mobile-first" en el diseño responsive?',
        options: [
          'Que la app solo funciona en móvil',
          'Diseñar y definir CSS desde la pantalla más pequeña y ampliar progresivamente',
          'Que el equipo de móvil tiene prioridad',
          'Que se usa un framework de móvil como React Native',
        ],
        correct: 1,
      },
      {
        q: 'En un grid de 12 columnas desktop, ¿cómo adaptarías una tarjeta de 4 columnas en tablet?',
        options: [
          'Mantener 4 columnas siempre',
          'Ampliar a 6 columnas (2 tarjetas por fila) o 12 (1 tarjeta full-width) según el contenido',
          'Ocultar la tarjeta en tablet',
          'Usar píxeles fijos en lugar de columnas',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es un "fluid layout" vs. un layout "fixed"?',
        options: [
          'Fluid usa animaciones; fixed no',
          'Fluid usa unidades relativas (%, vw) y se adapta al viewport; fixed tiene un ancho estático en px',
          'Fixed es más moderno',
          'No hay diferencia práctica',
        ],
        correct: 1,
      },
    ],

    'AI Tool Fluency': [
      {
        q: '¿Cómo puede la IA acelerar la creación de variantes en un design system?',
        options: [
          'Generando el design system completo sin intervención',
          'Proponiendo variantes de color, tipografía y spacing basadas en tokens existentes para revisión humana',
          'Publicando los componentes automáticamente en producción',
          'Reemplazando las design reviews',
        ],
        correct: 1,
      },
      {
        q: '¿Para qué tarea de UI es más útil usar un modelo de visión (vision AI)?',
        options: [
          'Para escribir el código CSS',
          'Para analizar capturas de pantalla e identificar inconsistencias visuales o problemas de contraste',
          'Para diseñar la arquitectura del sistema',
          'Para gestionar versiones del archivo de Figma',
        ],
        correct: 1,
      },
      {
        q: '¿Cuál de estas herramientas usa IA específicamente para UI design?',
        options: ['Notion AI', 'Locofy o Anima para generar código desde diseños de Figma', 'Linear', 'Confluence AI'],
        correct: 1,
      },
    ],

    'AI Applied to Design Systems': [
      {
        q: '¿Cómo puede la IA ayudar en la auditoría de un design system existente?',
        options: [
          'Rediseñando todos los componentes automáticamente',
          'Escaneando el producto en búsqueda de inconsistencias con los tokens y componentes definidos',
          'Eliminando componentes sin uso',
          'Creando la documentación del sistema sin intervención humana',
        ],
        correct: 1,
      },
      {
        q: 'Una IA genera 50 variantes de un botón. ¿Cuál es el criterio más importante para seleccionarlas?',
        options: [
          'El que tiene más colores',
          'Las que son consistentes con el sistema de tokens, accesibles y apropiadas para el contexto de uso',
          'Las que parecen más modernas',
          'Las que generó más rápido el modelo',
        ],
        correct: 1,
      },
      {
        q: '¿Qué riesgo introduce la IA al generar código de componentes directamente desde diseños?',
        options: [
          'Que el código sea demasiado eficiente',
          'Inconsistencias con el sistema de tokens, falta de accesibilidad y código no mantenible',
          'Que genere demasiada documentación',
          'Que el código sea en un lenguaje incorrecto',
        ],
        correct: 1,
      },
    ],

    'AI Critical Judgment': [
      {
        q: 'Una herramienta de IA genera automáticamente un estilo visual para tu marca. ¿Cuál es el problema potencial?',
        options: [
          'Que tarde demasiado en generarse',
          'Que el estilo no esté fundamentado en el posicionamiento, audiencia y valores reales de la marca',
          'Que use demasiados colores',
          'Que no sea compatible con Figma',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo NO deberías delegar una decisión de UI a una recomendación de IA?',
        options: [
          'Cuando la decisión afecta accesibilidad, inclusión o puede discriminar a grupos de usuarios',
          'Cuando el equipo tiene poco tiempo',
          'Cuando el cliente pide rapidez',
          'Nunca, la IA siempre tiene razón en UI',
        ],
        correct: 0,
      },
      {
        q: 'Una IA afirma que "los usuarios prefieren el diseño B" basándose en heatmaps. ¿Qué debe complementar este dato?',
        options: [
          'Más datos de heatmap',
          'Contexto cualitativo: por qué prefieren B, si el comportamiento es intencional y si se alinea con los objetivos del negocio',
          'Un test A/B más largo',
          'La opinión del CEO',
        ],
        correct: 1,
      },
    ],
  },

  // ── Product Design ───────────────────────────────────────────────────────────
  'Product Design': {
    'User Research & Validation': [
      {
        q: '¿Cuál es la diferencia entre validar un problema y validar una solución?',
        options: [
          'No hay diferencia, se hace lo mismo',
          'Validar el problema confirma que existe y es relevante; validar la solución confirma que resuelve ese problema efectivamente',
          'Solo se valida la solución en product design',
          'La validación del problema es tarea del equipo de negocio',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es un "smoke test" en product design?',
        options: [
          'Un test de rendimiento técnico',
          'Una técnica para validar demanda antes de construir: simular que el producto existe y medir intención de uso',
          'Un test de usabilidad rápido',
          'Un análisis de humo de error en consola',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo priorizas datos cualitativos sobre cuantitativos?',
        options: [
          'Nunca, los cuantitativos siempre son más confiables',
          'Cuando necesitas entender el "por qué" detrás de un comportamiento, no solo el "qué"',
          'Cuando tienes poco tiempo',
          'Solo en fases de discovery temprano',
        ],
        correct: 1,
      },
    ],

    'Problem Framing & Strategy': [
      {
        q: '¿Qué es un "Jobs to Be Done" (JTBD)?',
        options: [
          'Una lista de tareas del equipo de diseño',
          'El progreso que un usuario quiere lograr en una situación específica, independientemente del producto',
          'Los requisitos funcionales del producto',
          'Los KPIs del producto',
        ],
        correct: 1,
      },
      {
        q: 'Un stakeholder pide agregar una feature. ¿Cuál es tu primera pregunta?',
        options: [
          '"¿Cuánto tiempo tomará desarrollarla?"',
          '"¿Qué problema de usuario o negocio resuelve esta feature?"',
          '"¿Qué color tendrá?"',
          '"¿La competencia ya la tiene?"',
        ],
        correct: 1,
      },
      {
        q: '¿Para qué sirve un "opportunity solution tree"?',
        options: [
          'Para gestionar el roadmap de desarrollo',
          'Para conectar outcomes de negocio con oportunidades de usuario y explorar soluciones de forma estructurada',
          'Para documentar el proceso de diseño',
          'Para priorizar bugs',
        ],
        correct: 1,
      },
    ],

    'Interaction Design & Prototyping': [
      {
        q: '¿Cuál es el valor de un prototipo "Wizard of Oz"?',
        options: [
          'Es el prototipo más fiel a la implementación final',
          'Permite simular funcionalidades complejas (como IA) con operación humana para validar la experiencia antes de construir',
          'Solo funciona para apps móviles',
          'Reduce el tiempo de development',
        ],
        correct: 1,
      },
      {
        q: 'Diseñas un flujo de pago. ¿En qué momento incluirías un prototipo de alta fidelidad?',
        options: [
          'En el primer sprint, siempre',
          'Cuando la lógica del flujo está validada y se necesita testear detalles de micro-interacción y confianza',
          'Solo para la presentación al cliente',
          'Alta fidelidad nunca es necesaria en etapas previas al lanzamiento',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es un "desirability test"?',
        options: [
          'Un test para medir qué tan rápido los usuarios completan tareas',
          'Un método para evaluar las respuestas emocionales y percepciones de un diseño usando tarjetas de palabras',
          'Un A/B test de conversión',
          'Una evaluación heurística interna',
        ],
        correct: 1,
      },
    ],

    'Metrics & Analytics': [
      {
        q: '¿Qué mide el framework HEART de Google?',
        options: [
          'La velocidad de carga del producto',
          'Happiness, Engagement, Adoption, Retention, Task success — métricas centradas en la experiencia del usuario',
          'El rendimiento del equipo de diseño',
          'El ROI de la inversión en UX',
        ],
        correct: 1,
      },
      {
        q: '¿Cuál es la diferencia entre una métrica "vanity" y una métrica "accionable"?',
        options: [
          'Las vanity son más difíciles de medir',
          'Las vanity (ej: page views) se ven bien pero no informan decisiones; las accionables revelan causa-efecto y guían el diseño',
          'No hay diferencia, ambas son útiles',
          'Las accionables solo existen en productos maduros',
        ],
        correct: 1,
      },
      {
        q: 'El churn rate de tu producto sube un 15%. ¿Cuál es tu proceso para investigarlo desde diseño?',
        options: [
          'Rediseñar el onboarding inmediatamente',
          'Analizar en qué momento del ciclo de vida ocurre el churn, hacer entrevistas de "exit" y cruzar con datos de uso',
          'Lanzar una encuesta de satisfacción general',
          'Añadir más features para retener usuarios',
        ],
        correct: 1,
      },
    ],

    'Design Systems Thinking': [
      {
        q: '¿Cómo contribuye un Product Designer al design system de forma diferente a un UI Designer?',
        options: [
          'No hay diferencia',
          'El Product Designer garantiza que los componentes soporten flujos y necesidades del producto, no solo la consistencia visual',
          'El Product Designer crea los tokens; el UI Designer los componentes',
          'El Product Designer gestiona los accesos al sistema',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo es apropiado crear un componente "one-off" fuera del design system?',
        options: [
          'Siempre que sea más rápido',
          'Cuando el caso de uso es verdaderamente único, documentando la decisión y evaluando si debe entrar al sistema después',
          'Nunca, el design system debe cubrir todos los casos',
          'Cuando el stakeholder lo pide con urgencia',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es "governance" en el contexto de un design system?',
        options: [
          'Los permisos de Figma',
          'El proceso para proponer, revisar, aprobar y deprecar componentes de forma estructurada y compartida',
          'El equipo que diseña los componentes',
          'La documentación del sistema',
        ],
        correct: 1,
      },
    ],

    'Stakeholder Management': [
      {
        q: 'Un stakeholder cambia los requisitos después del kick-off. ¿Cómo lo gestionas?',
        options: [
          'Aceptar y rediseñar todo',
          'Evaluar el impacto, comunicarlo con claridad, negociar alcance y documentar el cambio',
          'Rechazar el cambio por principio',
          'Escalar al manager sin conversar con el stakeholder',
        ],
        correct: 1,
      },
      {
        q: '¿Cuál es la mejor forma de alinear a stakeholders con múltiples opiniones contradictorias sobre el diseño?',
        options: [
          'Votar el diseño favorito',
          'Anclar la conversación en los objetivos del usuario y del negocio, usando datos de research como árbitro',
          'Hacer el diseño que prefiere el stakeholder más senior',
          'Mezclar todas las ideas en un solo diseño',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo es apropiado empujar back a un stakeholder sobre una decisión de diseño?',
        options: [
          'Nunca, el stakeholder siempre tiene razón',
          'Cuando hay evidencia de research que indica que la decisión perjudicará la experiencia o los objetivos del negocio',
          'Solo si el manager respalda tu posición',
          'Siempre que el diseñador tenga una opinión diferente',
        ],
        correct: 1,
      },
    ],

    'Business Acumen & ROI': [
      {
        q: '¿Qué es el "design ROI" y cómo se demuestra?',
        options: [
          'El salario del equipo de diseño vs. el presupuesto',
          'El impacto económico del diseño medido en métricas como conversión, retención y reducción de costos de soporte',
          'El número de pantallas diseñadas por sprint',
          'La puntuación del design system',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es un "north star metric" para un producto?',
        options: [
          'El KPI que más le gusta al CEO',
          'La métrica única que mejor captura el valor central que el producto entrega a sus usuarios',
          'El número de usuarios activos mensuales siempre',
          'El NPS del producto',
        ],
        correct: 1,
      },
      {
        q: 'Para defender la inversión en UX research ante el CFO, ¿qué argumento es más efectivo?',
        options: [
          '"El research mejora la experiencia de usuario"',
          '"Cada problema detectado en research cuesta 10x menos resolverlo que si llega a producción"',
          '"Todas las empresas top hacen research"',
          '"Los diseñadores necesitan datos para trabajar"',
        ],
        correct: 1,
      },
    ],

    'AI Tool Fluency': [
      {
        q: '¿Cómo puede la IA acelerar el proceso de discovery en product design?',
        options: [
          'Reemplazando completamente las entrevistas de usuario',
          'Analizando datos de uso, generando hipótesis preliminares y sintetizando competitive analysis para informar el research',
          'Diseñando las pantallas desde el inicio',
          'Automatizando la aprobación de stakeholders',
        ],
        correct: 1,
      },
      {
        q: '¿Para qué es útil un LLM en la fase de problem framing?',
        options: [
          'Para tomar la decisión de qué problema resolver',
          'Para generar múltiples reencuadres del problema, explorar HMWs y anticipar edge cases',
          'Para escribir el PRD completo sin revisión',
          'Para validar el problema con usuarios',
        ],
        correct: 1,
      },
      {
        q: '¿Qué herramienta de IA sería más útil para analizar un gran volumen de tickets de soporte y encontrar patrones?',
        options: [
          'Midjourney',
          'Un LLM con capacidad de análisis de texto (GPT-4, Claude) para clasificar y agrupar temáticamente',
          'Figma AI',
          'GitHub Copilot',
        ],
        correct: 1,
      },
    ],

    'AI Applied to Product': [
      {
        q: '¿Qué es un "AI-powered feature" y qué responsabilidades de diseño implica?',
        options: [
          'Una feature que usa algoritmos básicos de ordenamiento',
          'Una funcionalidad que usa ML/IA; implica diseñar para la incertidumbre, explicabilidad y manejo de errores del modelo',
          'Cualquier feature moderna de producto digital',
          'Una feature que automatiza tareas del equipo de diseño',
        ],
        correct: 1,
      },
      {
        q: '¿Cómo diseñarías el estado de error de una recomendación de IA que falla?',
        options: [
          'Ocultar el error para no preocupar al usuario',
          'Comunicar con claridad que la IA no pudo completar la tarea, ofrecer alternativas manuales y no culpar al usuario',
          'Mostrar el error técnico del modelo',
          'Reintentar automáticamente sin avisar',
        ],
        correct: 1,
      },
      {
        q: '¿Qué principio de diseño es más crítico en interfaces que incluyen IA?',
        options: [
          'Velocidad de carga',
          'Transparencia: el usuario debe entender qué hace la IA, por qué y cómo puede corregirla',
          'Animaciones fluidas',
          'Compatibilidad con IE11',
        ],
        correct: 1,
      },
    ],

    'AI Critical Judgment': [
      {
        q: 'Una IA recomienda priorizar una feature basándose en datos históricos. ¿Qué sesgo puede haber?',
        options: [
          'Ninguno si los datos son suficientes',
          'El modelo puede perpetuar patrones pasados que no reflejan necesidades futuras o de segmentos sub-representados',
          'Solo hay sesgo si el dataset es pequeño',
          'El sesgo solo importa en algoritmos de contratación',
        ],
        correct: 1,
      },
      {
        q: '¿Cuál es el riesgo de usar IA para personalizar la experiencia del producto sin auditoría ética?',
        options: [
          'Que la personalización sea demasiado precisa',
          'Discriminación algorítmica, creación de filter bubbles y erosión de la autonomía del usuario',
          'Solo que aumente el costo de infraestructura',
          'Que los usuarios se acostumbren demasiado al producto',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo debe un Product Designer cuestionar la recomendación de un modelo de ML?',
        options: [
          'Siempre, la IA nunca es confiable',
          'Cuando la recomendación no está explicada, no puede ser auditada o puede afectar negativamente a grupos vulnerables',
          'Solo cuando el modelo es experimental',
          'Cuando la recomendación va en contra de la opinión del stakeholder',
        ],
        correct: 1,
      },
    ],
  },

  // ── Service Design ───────────────────────────────────────────────────────────
  'Service Design': {
    'Service Blueprinting & Journey Mapping': [
      {
        q: '¿Cuál es la diferencia entre un Customer Journey Map y un Service Blueprint?',
        options: [
          'Son el mismo artefacto con distinto nombre',
          'El Journey Map se enfoca en la experiencia del cliente; el Blueprint añade los procesos internos, personas y sistemas que la soportan',
          'El Blueprint es una versión simplificada del Journey Map',
          'El Journey Map incluye los sistemas backend; el Blueprint no',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es la "línea de visibilidad" en un service blueprint?',
        options: [
          'El logo de la empresa en el blueprint',
          'La frontera entre lo que el cliente ve y experimenta vs. los procesos que ocurren entre bastidores',
          'La línea de tiempo del journey',
          'El nivel de detalle del mapa',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo priorizarías un "future state" blueprint sobre el "current state"?',
        options: [
          'Siempre, el futuro es más importante',
          'Cuando ya tienes suficiente entendimiento del estado actual y el equipo necesita alinearse en la visión de cambio',
          'Al inicio de cualquier proyecto',
          'Solo si el cliente lo pide explícitamente',
        ],
        correct: 1,
      },
    ],

    'Facilitation & Co-design': [
      {
        q: '¿Cuál es la diferencia entre facilitación y consultoría en un workshop?',
        options: [
          'El facilitador da las respuestas; el consultor hace preguntas',
          'El facilitador guía el proceso para que el grupo llegue a sus propias conclusiones; el consultor aporta la expertise',
          'Son roles intercambiables',
          'El facilitador es siempre externo al proyecto',
        ],
        correct: 1,
      },
      {
        q: 'En un co-design workshop, un participante domina la conversación. ¿Cómo lo gestionas?',
        options: [
          'Dejarlo hablar porque tiene más experiencia',
          'Usar dinámicas de votación individual, turnos de palabra y técnicas como "1-2-4-All" para democratizar la participación',
          'Pedirle que se calle directamente',
          'Ignorar el problema y seguir',
        ],
        correct: 1,
      },
      {
        q: '¿Qué hace a un workshop de co-diseño "generativo" vs. "evaluativo"?',
        options: [
          'El número de participantes',
          'Generativo crea nuevas ideas y soluciones; evaluativo analiza y valida opciones existentes',
          'El tiempo de duración',
          'Si es presencial o remoto',
        ],
        correct: 1,
      },
    ],

    'Systems Thinking': [
      {
        q: '¿Qué es un "feedback loop" en un sistema de servicio?',
        options: [
          'La encuesta de satisfacción post-servicio',
          'Un mecanismo donde los outputs de un proceso influyen en sus inputs futuros, creando dinámicas de amplificación o estabilización',
          'El proceso de revisión de diseño',
          'Las notificaciones push de la app',
        ],
        correct: 1,
      },
      {
        q: '¿Por qué es importante identificar los "puntos de palanca" en un sistema?',
        options: [
          'Para justificar el presupuesto del proyecto',
          'Porque son los lugares donde una pequeña intervención puede producir el mayor cambio sistémico',
          'Para documentar el proceso actual',
          'Para identificar quién tiene más poder en la organización',
        ],
        correct: 1,
      },
      {
        q: '¿Qué riesgo presenta "optimizar una parte del sistema" sin considerar el sistema completo?',
        options: [
          'Que el proyecto tarde más tiempo',
          'Que mejoras locales causen problemas en otras partes del sistema (suboptimización)',
          'Que los usuarios no noten la mejora',
          'Que el costo sea mayor',
        ],
        correct: 1,
      },
    ],

    'Research Integration': [
      {
        q: '¿Cómo integras hallazgos de investigación etnográfica en el diseño de un servicio?',
        options: [
          'Usándolos directamente como requisitos',
          'Sintetizándolos en patrones de comportamiento, necesidades y tensiones que informan las decisiones de diseño del servicio',
          'Presentándolos al cliente y dejando que decida',
          'Ignorándolos si contradicen las hipótesis del proyecto',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es una "research repository" y por qué es crítica en service design?',
        options: [
          'Una carpeta de Figma con los artefactos',
          'Un sistema centralizado de insights de investigación que evita repetir estudios y permite acumular conocimiento organizacional',
          'El informe final del proyecto',
          'El archivo de grabaciones de entrevistas',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo es apropiado usar "desk research" (secondary research) en un proyecto de service design?',
        options: [
          'Solo al inicio del proyecto',
          'Para construir hipótesis, entender el contexto y complementar research primario, especialmente cuando el acceso a usuarios es limitado',
          'Solo si el cliente no tiene presupuesto para research primario',
          'Nunca, el research primario siempre es superior',
        ],
        correct: 1,
      },
    ],

    'Service Measurement & KPIs': [
      {
        q: '¿Cuál es la diferencia entre un KPI de servicio y una métrica de producto?',
        options: [
          'Son equivalentes',
          'Los KPIs de servicio miden el outcome completo de la experiencia (incluyendo canales físicos y humanos); las de producto miden el comportamiento digital',
          'Los KPIs de servicio son siempre cualitativos',
          'Las métricas de producto las mide el equipo de data; las de servicio, los diseñadores',
        ],
        correct: 1,
      },
      {
        q: '¿Qué mide el "Customer Effort Score" (CES)?',
        options: [
          'Cuánto esfuerzo pone la empresa en atender al cliente',
          'Cuánto esfuerzo tiene que hacer el cliente para resolver su necesidad con el servicio',
          'El tiempo de respuesta del servicio de atención',
          'La satisfacción general con la empresa',
        ],
        correct: 1,
      },
      {
        q: '¿Por qué es problemático usar solo el NPS como medida del éxito de un servicio?',
        options: [
          'Porque es difícil de calcular',
          'Porque es un indicador lagging que no revela dónde ni por qué ocurren los problemas en el servicio',
          'Porque los usuarios no entienden la escala del 0 al 10',
          'Porque no se puede usar en servicios B2B',
        ],
        correct: 1,
      },
    ],

    'Organizational Design & Change': [
      {
        q: '¿Qué es la "Conway\'s Law" y cómo afecta al service design?',
        options: [
          'Una ley de copyright sobre diseño de servicios',
          'Los sistemas que diseña una organización tienden a replicar su estructura comunicacional; los silos organizacionales producen experiencias fragmentadas',
          'Una metodología de diseño organizacional',
          'El principio de que el diseño siempre sigue a la estrategia',
        ],
        correct: 1,
      },
      {
        q: 'Identificas que un punto de dolor del cliente se debe a un conflicto entre dos departamentos internos. ¿Qué haces?',
        options: [
          'Diseñar una solución digital que evite el conflicto',
          'Hacer visible el impacto del conflicto en la experiencia del cliente y facilitar un proceso de alineación entre los departamentos',
          'Escalar al CEO directamente',
          'Ignorarlo ya que es fuera del alcance del proyecto de diseño',
        ],
        correct: 1,
      },
      {
        q: '¿Cuál es el rol del service designer en la gestión del cambio organizacional?',
        options: [
          'Implementar los cambios directamente',
          'Co-diseñar la transición, identificar resistencias, crear prototipos del nuevo estado y construir capacidades internas',
          'Solo documentar el estado futuro deseado',
          'Contratar consultores de change management externos',
        ],
        correct: 1,
      },
    ],

    'AI Tool Fluency': [
      {
        q: '¿Cómo puede la IA apoyar la síntesis de un proyecto de service design con múltiples fuentes de datos?',
        options: [
          'Reemplazando al investigador en el análisis',
          'Procesando grandes volúmenes de entrevistas, surveys y datos de uso para identificar patrones iniciales que el equipo valida',
          'Generando el service blueprint automáticamente',
          'Decidiendo qué cambios hacer en el servicio',
        ],
        correct: 1,
      },
      {
        q: '¿Qué limitación tiene la IA para el trabajo de facilitación en service design?',
        options: [
          'No puede procesar texto',
          'No puede leer la dinámica humana del grupo, gestionar conflictos emocionales ni crear el ambiente de confianza necesario para la co-creación',
          'No puede trabajar en remoto',
          'Solo funciona en inglés',
        ],
        correct: 1,
      },
      {
        q: '¿Para qué parte del proceso de service design es más útil usar IA hoy?',
        options: [
          'Para facilitar workshops de co-diseño',
          'Para síntesis de research, generación de escenarios futuros y análisis de datos de servicio a gran escala',
          'Para tomar decisiones de diseño estratégico',
          'Para reemplazar el trabajo de campo etnográfico',
        ],
        correct: 1,
      },
    ],

    'AI Applied to Service Design': [
      {
        q: '¿Cómo puede la IA transformar el monitoreo continuo de un servicio?',
        options: [
          'Eliminando la necesidad de investigación cualitativa',
          'Analizando en tiempo real datos de múltiples touchpoints (app, call center, redes sociales) para detectar puntos de dolor emergentes',
          'Diseñando las mejoras automáticamente',
          'Solo procesando datos estructurados de CRM',
        ],
        correct: 1,
      },
      {
        q: '¿Qué es un "AI touchpoint" en un servicio y qué implicaciones de diseño tiene?',
        options: [
          'Una pantalla táctil en un punto de venta',
          'Cualquier punto de contacto del servicio mediado por IA (chatbot, recomendación, triaje automático); requiere diseñar handoffs humano-máquina y gestión de expectativas',
          'Un sensor IoT en el servicio',
          'La app móvil del servicio',
        ],
        correct: 1,
      },
      {
        q: '¿Cómo diseñarías el "handoff" entre un chatbot de IA y un agente humano en un servicio de atención?',
        options: [
          'El chatbot simplemente transfiere sin contexto',
          'El handoff incluye resumen del contexto, estado emocional detectado y acciones previas, para que el agente continúe sin fricción',
          'El usuario debe explicar el problema desde cero al agente',
          'Evitar el handoff haciendo que el chatbot resuelva todo',
        ],
        correct: 1,
      },
    ],

    'AI Critical Judgment': [
      {
        q: '¿Qué riesgo ético específico introduce la IA en servicios públicos o de alto impacto social?',
        options: [
          'Que el servicio sea más rápido de lo necesario',
          'Discriminación algorítmica que puede negar acceso a servicios críticos a grupos vulnerables sin transparencia ni recurso',
          'Que los costos del servicio suban',
          'Que los empleados pierdan sus puestos de trabajo en el corto plazo',
        ],
        correct: 1,
      },
      {
        q: '¿Cómo evalúas si una solución de IA en un servicio es éticamente apropiada?',
        options: [
          'Si técnicamente funciona',
          'Analizando impacto en grupos vulnerables, transparencia del proceso, existencia de recurso humano y alineación con derechos del usuario',
          'Si el cliente la aprueba',
          'Si está dentro del presupuesto',
        ],
        correct: 1,
      },
      {
        q: '¿Cuándo es apropiado rechazar la implementación de IA en un touchpoint del servicio?',
        options: [
          'Nunca, la IA siempre mejora los servicios',
          'Cuando el touchpoint requiere juicio ético humano, empatía en situaciones difíciles o cuando la IA crearía exclusión digital',
          'Cuando el equipo técnico no está listo',
          'Solo si el regulador lo prohíbe explícitamente',
        ],
        correct: 1,
      },
    ],
  },
}

// ── Afirmaciones conductuales para manager y peer ─────────────────────────────
export const BEHAVIOR_BANK = {
  'UX Research': {
    'Research Planning & Strategy': {
      manager: [
        'Define research questions claras y alineadas con los objetivos del proyecto antes de elegir metodología',
        'Adapta el plan de investigación a los constraints de tiempo, presupuesto y acceso a usuarios',
        'Gestiona el proceso de investigación de forma autónoma, anticipando riesgos y ajustando sobre la marcha',
      ],
      peer: [
        'Comunica claramente los objetivos y método del research al equipo antes de empezar',
        'Pide y aplica feedback de compañeros para mejorar sus planes de investigación',
      ],
    },
    'Qualitative Methods': {
      manager: [
        'Conduce entrevistas y sesiones cualitativas que generan insights genuinos, no confirmaciones de hipótesis',
        'Selecciona el método cualitativo apropiado según el tipo de pregunta de investigación',
        'Identifica y mitiga sesgos del investigador durante la recolección de datos',
      ],
      peer: [
        'Comparte sus hallazgos cualitativos de forma comprensible para todo el equipo',
        'Invita a compañeros a observar sesiones para construir empatía colectiva con el usuario',
      ],
    },
    'Quantitative Methods': {
      manager: [
        'Diseña encuestas y estudios cuantitativos con rigor metodológico adecuado al contexto',
        'Interpreta datos estadísticos sin sobreextender conclusiones más allá de lo que los datos soportan',
        'Sabe cuándo combinar métodos cuantitativos y cualitativos para responder preguntas complejas',
      ],
      peer: [
        'Explica los datos cuantitativos de forma accesible al equipo sin jerga innecesaria',
        'Cuestiona interpretaciones apresuradas de datos cuando detecta limitaciones metodológicas',
      ],
    },
    'Synthesis & Artifacts': {
      manager: [
        'Sintetiza hallazgos en artefactos claros (insights, personas, journeys) que el equipo usa activamente',
        'Distingue entre observaciones, interpretaciones e insights en sus entregables',
        'Los artefactos que produce tienen vida útil más allá del proyecto inmediato',
      ],
      peer: [
        'Sus artefactos de síntesis son comprensibles y útiles para personas fuera del equipo de research',
        'Actualiza y mantiene los artefactos vivos conforme avanza el proyecto',
      ],
    },
    'Communication & Storytelling': {
      manager: [
        'Presenta hallazgos de research adaptando el nivel de detalle y el foco según la audiencia (equipo, stakeholders, C-level)',
        'Construye narrativas con los datos que generan acción, no solo comprensión',
        'Gestiona objeciones a los hallazgos de research con evidencia y apertura al diálogo',
      ],
      peer: [
        'Sus presentaciones de research son claras, concretas y generan conversaciones útiles',
        'Comparte hallazgos proactivamente con el equipo sin esperar a ser solicitado',
      ],
    },
    'AI Tool Fluency': {
      manager: [
        'Usa herramientas de IA para acelerar tareas de research sin comprometer la calidad metodológica',
        'Evalúa críticamente los outputs de IA antes de incorporarlos en su trabajo',
        'Identifica proactivamente nuevas herramientas de IA aplicables al research y las comparte con el equipo',
      ],
      peer: [
        'Comparte aprendizajes sobre herramientas de IA aplicadas al research con el equipo',
        'Usa IA como asistente en su proceso sin generar dependencia que limite su juicio profesional',
      ],
    },
    'AI Applied to Research': {
      manager: [
        'Integra herramientas de IA en el proceso de research de forma que aumenta la escala sin sacrificar rigor',
        'Documenta cómo usa IA en sus procesos para que el equipo pueda replicarlo',
        'Audita los outputs de IA aplicados al research para detectar errores o sesgos',
      ],
      peer: [
        'Comparte workflows concretos de cómo usa IA en research que otros pueden adoptar',
        'Señala riesgos o limitaciones del uso de IA en research cuando los detecta en el trabajo del equipo',
      ],
    },
    'AI Critical Judgment': {
      manager: [
        'Cuestiona outputs de IA con base en los datos originales antes de presentarlos como hallazgos',
        'Establece criterios claros para decidir cuándo y cómo usar IA en el proceso de research',
        'Identifica y comunica los límites éticos del uso de IA en investigación con usuarios',
      ],
      peer: [
        'Levanta la mano cuando detecta que un output de IA puede ser incorrecto o sesgado',
        'Contribuye a construir criterios compartidos de uso responsable de IA en el equipo',
      ],
    },
  },

  'UX Design': {
    'User Research & Empathy': {
      manager: [
        'Inicia o solicita research antes de diseñar, no como validación posterior',
        'Sus diseños reflejan de forma visible los insights del research en decisiones concretas',
        'Construye empatía con el usuario en el equipo más allá de su trabajo individual',
      ],
      peer: [
        'Comparte contexto de usuario con el equipo para que las decisiones de diseño sean más informadas',
        'Invita a otros a participar en sesiones de research o síntesis',
      ],
    },
    'Interaction Design & Flows': {
      manager: [
        'Diseña flujos que minimizan la fricción y carga cognitiva del usuario',
        'Anticipa y diseña edge cases, estados de error y flujos alternativos',
        'Justifica sus decisiones de interacción con principios de diseño y evidencia de usuario',
      ],
      peer: [
        'Sus flujos son fáciles de entender para otros diseñadores y developers en revisiones',
        'Señala problemas de flujo en el trabajo de compañeros de forma constructiva',
      ],
    },
    'Information Architecture': {
      manager: [
        'Estructura la información y la navegación desde la perspectiva mental del usuario, no de la organización interna',
        'Valida la arquitectura con usuarios (card sorting, tree testing) antes de escalar',
        'Mantiene la coherencia de la arquitectura a medida que el producto crece',
      ],
      peer: [
        'Explica las decisiones de arquitectura de forma que el equipo las entiende y puede defenderlas',
        'Detecta inconsistencias de arquitectura en el trabajo del equipo y las señala',
      ],
    },
    'Design Systems & Consistency': {
      manager: [
        'Usa el design system de forma consistente y contribuye a su evolución cuando detecta gaps',
        'Documenta las decisiones de diseño para que otros las puedan reutilizar',
        'Promueve la adopción del design system en el equipo con guías y ejemplos',
      ],
      peer: [
        'Cuando no usa un componente del sistema, explica la razón y propone una solución reutilizable',
        'Señala inconsistencias con el design system en revisiones de forma útil',
      ],
    },
    'Prototyping & Fidelity': {
      manager: [
        'Elige el nivel de fidelidad apropiado para el objetivo de cada iteración, sin sobre-invertir en pulido prematuro',
        'Sus prototipos permiten pruebas de usuario efectivas que generan aprendizaje real',
        'Itera rápido basándose en feedback, sin apego al diseño anterior',
      ],
      peer: [
        'Sus prototipos son lo suficientemente claros para que otros los usen en tests sin necesidad de explicación extensa',
        'Comparte prototipos temprano para recibir feedback antes de invertir más tiempo',
      ],
    },
    'Accessibility (WCAG)': {
      manager: [
        'Incorpora accesibilidad como criterio de diseño desde el inicio, no como corrección posterior',
        'Sus entregas incluyen especificaciones de accesibilidad (contraste, roles ARIA, estados de focus)',
        'Evangeliza la accesibilidad en el equipo y con stakeholders',
      ],
      peer: [
        'Señala problemas de accesibilidad en revisiones de diseño del equipo',
        'Comparte recursos y aprendizajes sobre accesibilidad con el equipo',
      ],
    },
    'Design-to-Code Collaboration': {
      manager: [
        'Sus handoffs a desarrollo son completos, incluyendo todos los estados y edge cases necesarios para la implementación',
        'Se involucra en la implementación para asegurar la calidad de la experiencia final',
        'Comunica y negocia constraints técnicas con el equipo de desarrollo de forma efectiva',
      ],
      peer: [
        'Sus archivos de diseño están bien organizados y son fáciles de navegar para developers y otros diseñadores',
        'Está disponible para resolver dudas del equipo de desarrollo durante la implementación',
      ],
    },
    'AI Tool Fluency': {
      manager: [
        'Integra herramientas de IA en su flujo de trabajo de diseño de forma que aumenta su velocidad y calidad',
        'Experimenta con nuevas herramientas de IA y comparte aprendizajes con el equipo',
        'Usa IA para exploración y aceleración, manteniendo el juicio de diseño humano en las decisiones clave',
      ],
      peer: [
        'Comparte tips y workflows de IA aplicados al diseño que otros pueden adoptar',
        'No usa IA como excusa para saltarse pasos de investigación o validación',
      ],
    },
    'AI Applied to Design': {
      manager: [
        'Usa herramientas de IA para generar, explorar y evaluar variantes de diseño de forma sistemática',
        'Integra IA en el proceso de design critique para ampliar la perspectiva del equipo',
        'Documenta casos de uso de IA en diseño para el aprendizaje del equipo',
      ],
      peer: [
        'Enseña a otros cómo usar IA en su proceso de diseño con ejemplos concretos',
        'Identifica cuándo la IA genera salidas inadecuadas y lo comunica al equipo',
      ],
    },
    'AI Critical Judgment': {
      manager: [
        'Evalúa críticamente los diseños generados por IA con los mismos criterios de calidad que aplica a diseños humanos',
        'Define cuándo y cómo usar IA en el proceso de diseño con criterios claros y compartidos',
        'Identifica y comunica los límites éticos del uso de IA en diseño de experiencias',
      ],
      peer: [
        'Cuestiona diseños generados por IA cuando no se validan con research de usuario real',
        'Contribuye a la discusión del equipo sobre uso responsable de IA en el proceso de diseño',
      ],
    },
  },

  'UI Design': {
    'Visual Hierarchy & Aesthetics': {
      manager: [
        'Sus diseños tienen una jerarquía visual clara que guía al usuario sin ambigüedad',
        'Las decisiones estéticas están fundamentadas en principios de diseño y en el contexto de la marca y el usuario',
        'Produce trabajo visual de alta calidad de forma consistente bajo constraints de tiempo',
      ],
      peer: [
        'Puede explicar sus decisiones de jerarquía visual con principios concretos en las revisiones',
        'Da feedback de diseño visual específico y útil en las revisiones de compañeros',
      ],
    },
    'Design Systems & Tokens': {
      manager: [
        'Construye y mantiene componentes del design system con alta calidad técnica y de documentación',
        'Sus componentes cubren todos los estados necesarios y están preparados para escalar',
        'Hace evolucionar el design system de forma sistemática, no ad-hoc',
      ],
      peer: [
        'Documenta los componentes que crea de forma que otros los pueden usar sin preguntar',
        'Contribuye activamente a las decisiones sobre el design system en las reuniones del equipo',
      ],
    },
    'Interaction Feedback': {
      manager: [
        'Sus diseños incluyen feedback visual para todos los estados de interacción relevantes',
        'Las micro-interacciones que diseña tienen propósito funcional, no solo estético',
        'Especifica tiempos, curvas de animación y comportamientos de transición con precisión',
      ],
      peer: [
        'Sus prototipos de interacción son lo suficientemente precisos para que los developers los implementen correctamente',
        'Señala cuando un diseño del equipo carece de estados de feedback necesarios',
      ],
    },
    'Accessibility & Inclusion': {
      manager: [
        'Todos sus diseños cumplen WCAG 2.1 AA como mínimo en contraste, tamaño de toque y jerarquía',
        'Considera la diversidad de usuarios (daltonismo, baja visión, motor) como criterio de diseño estándar',
        'Impulsa la inclusión en el equipo más allá del cumplimiento mínimo de estándares',
      ],
      peer: [
        'Señala proactivamente problemas de accesibilidad en las revisiones de diseño',
        'Comparte herramientas y técnicas de verificación de accesibilidad con el equipo',
      ],
    },
    'Responsive Design': {
      manager: [
        'Sus diseños contemplan todos los breakpoints necesarios con soluciones apropiadas para cada contexto',
        'Entiende y aplica las constraints de implementación responsive en sus decisiones de diseño',
        'Sus entregas incluyen especificaciones claras del comportamiento responsive',
      ],
      peer: [
        'Sus diseños son fáciles de implementar de forma responsive por el equipo de desarrollo',
        'Comparte soluciones de diseño responsive que ha aprendido o inventado con el equipo',
      ],
    },
    'AI Tool Fluency': {
      manager: [
        'Usa IA para generar variantes y explorar el espacio de soluciones visuales de forma sistemática',
        'Integra herramientas de IA en el flujo de trabajo del equipo con documentación clara de cómo usarlas',
        'Evalúa la calidad de outputs de IA visual con criterios de diseño rigurosos',
      ],
      peer: [
        'Comparte prompts y workflows de IA para UI que otros pueden usar',
        'No usa IA para evitar trabajo de calidad; la usa para hacer más trabajo de calidad',
      ],
    },
    'AI Applied to Design Systems': {
      manager: [
        'Usa IA para detectar inconsistencias en el design system a escala',
        'Explora el uso de IA para mantener la documentación del design system actualizada',
        'Evalúa críticamente el código generado por IA para componentes del sistema',
      ],
      peer: [
        'Comparte experimentos de uso de IA en el design system con el equipo',
        'Identifica limitaciones del uso de IA en el design system y las comunica para evitar problemas',
      ],
    },
    'AI Critical Judgment': {
      manager: [
        'No acepta output visual de IA sin validarlo contra los criterios de accesibilidad, consistencia y contexto de uso',
        'Establece criterios claros para cuándo y cómo usar IA en el flujo de trabajo de UI',
        'Identifica y comunica sesgos visuales en outputs de IA (representación, diversidad, estética hegemónica)',
      ],
      peer: [
        'Señala cuando el equipo acepta outputs de IA de forma acrítica',
        'Contribuye a definir estándares de uso responsable de IA en el trabajo de UI del equipo',
      ],
    },
  },

  'Product Design': {
    'User Research & Validation': {
      manager: [
        'Valida hipótesis de producto con usuarios antes de comprometer esfuerzo de desarrollo significativo',
        'Diseña estudios de validación proporcionales al riesgo de la decisión',
        'Conecta los hallazgos de validación directamente con cambios en el diseño y el roadmap',
      ],
      peer: [
        'Comparte los resultados de validación con el equipo completo, incluyendo cuando contradicen las hipótesis',
        'Involucra a compañeros en sesiones de investigación para construir empatía de equipo',
      ],
    },
    'Problem Framing & Strategy': {
      manager: [
        'Define los problemas con precisión antes de explorar soluciones, conectando las necesidades del usuario con los objetivos del negocio',
        'Cuestiona el scope del problema cuando detecta que la definición inicial es incompleta o sesgada',
        'Alinea al equipo alrededor de la definición del problema antes de entrar en soluciones',
      ],
      peer: [
        'Invita al equipo a cuestionar la definición del problema, no solo a generar soluciones',
        'Comunica el "por qué" detrás de las decisiones de diseño conectándolas con el problema original',
      ],
    },
    'Interaction Design & Prototyping': {
      manager: [
        'Itera rápido con prototipos de la fidelidad apropiada para cada decisión',
        'Sus prototipos generan aprendizaje real que cambia las decisiones de diseño',
        'Gestiona el balance entre velocidad de iteración y calidad del prototipo según el contexto',
      ],
      peer: [
        'Comparte prototipos temprano para recoger feedback antes de invertir más tiempo',
        'Explica qué quiere aprender de cada prototipo antes de hacer el test',
      ],
    },
    'Metrics & Analytics': {
      manager: [
        'Define métricas de éxito para sus diseños antes de lanzar, no solo después',
        'Usa datos de producto para identificar oportunidades de mejora de experiencia de forma proactiva',
        'Conecta las métricas de experiencia con las métricas de negocio en sus presentaciones',
      ],
      peer: [
        'Comparte datos y aprendizajes de métricas del producto con el equipo',
        'Cuestiona decisiones de diseño que no tienen criterios de éxito medibles',
      ],
    },
    'Design Systems Thinking': {
      manager: [
        'Sus decisiones de diseño consideran el impacto en la coherencia del sistema completo del producto',
        'Contribuye activamente a la evolución del design system cuando identifica necesidades del producto',
        'Documenta decisiones de diseño sistémicas para que el equipo las pueda seguir',
      ],
      peer: [
        'Señala cuando una solución de diseño puntual puede crear inconsistencias sistémicas',
        'Comparte el razonamiento sistémico detrás de sus decisiones de diseño con el equipo',
      ],
    },
    'Stakeholder Management': {
      manager: [
        'Alinea a stakeholders con distintas prioridades alrededor de las necesidades del usuario y el negocio',
        'Comunica decisiones de diseño y su impacto de forma que los stakeholders no técnicos las entienden',
        'Gestiona expectativas y cambios de scope de forma profesional y proactiva',
      ],
      peer: [
        'Comparte el contexto de las conversaciones con stakeholders con el equipo para mantener a todos informados',
        'Busca input del equipo antes de comprometer decisiones de diseño con stakeholders',
      ],
    },
    'Business Acumen & ROI': {
      manager: [
        'Conecta sus propuestas de diseño con resultados de negocio concretos y medibles',
        'Prioriza el trabajo de diseño considerando el impacto de negocio, no solo la calidad de la experiencia',
        'Construye casos de negocio para inversiones en UX con datos y métricas relevantes',
      ],
      peer: [
        'Ayuda al equipo a entender el impacto de negocio de las decisiones de diseño',
        'Cuestiona trabajo de diseño que no tiene un caso de negocio o impacto en usuario claro',
      ],
    },
    'AI Tool Fluency': {
      manager: [
        'Usa IA para acelerar discovery, síntesis y exploración de soluciones de forma que escala la capacidad del equipo',
        'Identifica oportunidades para incorporar IA como feature en el producto de forma estratégica',
        'Evalúa críticamente qué partes del proceso de product design se benefician de IA y cuáles no',
      ],
      peer: [
        'Comparte workflows de IA aplicados al product design que otros pueden adoptar',
        'Equilibra el uso de IA con el juicio humano en las decisiones de diseño',
      ],
    },
    'AI Applied to Product': {
      manager: [
        'Diseña features de IA centradas en el usuario, con transparencia, control y manejo de errores del modelo',
        'Evalúa las implicaciones éticas de las features de IA antes de diseñarlas',
        'Itera las features de IA con usuarios para calibrar expectativas y comportamiento del modelo',
      ],
      peer: [
        'Comparte aprendizajes de diseño de features de IA con el equipo',
        'Señala cuando el diseño de una feature de IA puede crear problemas de experiencia o éticos',
      ],
    },
    'AI Critical Judgment': {
      manager: [
        'Evalúa críticamente las recomendaciones de IA con los mismos criterios que aplica a cualquier decisión de producto',
        'Define criterios éticos y de calidad para el uso de IA en el producto',
        'Comunica proactivamente los límites y riesgos del uso de IA al equipo y stakeholders',
      ],
      peer: [
        'Cuestiona cuando el equipo acepta recomendaciones de IA sin validación con usuarios reales',
        'Contribuye a construir una cultura de uso crítico y responsable de IA en el equipo de producto',
      ],
    },
  },

  'Service Design': {
    'Service Blueprinting & Journey Mapping': {
      manager: [
        'Sus blueprints capturan la complejidad real del servicio incluyendo frontstage, backstage y sistemas de soporte',
        'Los artefactos de journey/blueprint que produce son usados activamente por el equipo para tomar decisiones',
        'Facilita el proceso de mapeo involucrando a stakeholders de distintas áreas de la organización',
      ],
      peer: [
        'Sus artefactos de mapping son comprensibles para personas fuera del equipo de diseño',
        'Involucra a compañeros en la construcción de journeys y blueprints para asegurar perspectivas múltiples',
      ],
    },
    'Facilitation & Co-design': {
      manager: [
        'Facilita workshops que generan alineación real y outputs accionables, no solo conversaciones',
        'Adapta las dinámicas de facilitación al contexto, los participantes y los objetivos del taller',
        'Gestiona la dinámica del grupo de forma que todos los participantes contribuyen',
      ],
      peer: [
        'Sus facilitations crean un espacio seguro donde todos se sienten cómodos participando',
        'Comparte materiales y dinámicas de facilitación con el equipo para que otros las puedan usar',
      ],
    },
    'Systems Thinking': {
      manager: [
        'Identifica las interdependencias y bucles de retroalimentación relevantes en los sistemas que diseña',
        'Sus propuestas de diseño consideran los efectos de segundo y tercer orden en el sistema',
        'Comunica la complejidad sistémica de forma accesible para stakeholders no técnicos',
      ],
      peer: [
        'Ayuda al equipo a ver más allá del problema inmediato hacia las causas sistémicas',
        'Señala cuando una solución propuesta puede tener consecuencias negativas no intencionadas en el sistema',
      ],
    },
    'Research Integration': {
      manager: [
        'Integra múltiples fuentes de evidencia (cualitativa, cuantitativa, etnográfica) en sus decisiones de diseño',
        'Sus propuestas de diseño de servicio están fundamentadas en research, no solo en opiniones o benchmarks',
        'Construye conocimiento acumulativo sobre el servicio que trasciende proyectos individuales',
      ],
      peer: [
        'Comparte hallazgos de research relevantes para el trabajo del equipo aunque no sean de su proyecto directo',
        'Cuestiona decisiones de diseño que no están respaldadas por evidencia de usuario o servicio',
      ],
    },
    'Service Measurement & KPIs': {
      manager: [
        'Define métricas de servicio que capturan la experiencia completa del cliente, no solo indicadores digitales',
        'Conecta las métricas de experiencia de servicio con los KPIs de negocio de forma creíble',
        'Hace seguimiento a las métricas del servicio y usa los datos para informar iteraciones',
      ],
      peer: [
        'Comparte datos de servicio con el equipo para informar decisiones colectivas de diseño',
        'Cuestiona cuando el equipo usa métricas que no reflejan la experiencia real del cliente',
      ],
    },
    'Organizational Design & Change': {
      manager: [
        'Entiende y trabaja con la estructura organizacional del cliente para que el diseño del servicio sea implementable',
        'Identifica y gestiona resistencias al cambio durante los proyectos de diseño de servicio',
        'Sus propuestas incluyen un plan de implementación que considera la capacidad organizacional real',
      ],
      peer: [
        'Comparte el contexto organizacional del cliente con el equipo para que las propuestas sean realistas',
        'Ayuda al equipo a entender por qué algunos cambios de servicio son difíciles de implementar organizacionalmente',
      ],
    },
    'AI Tool Fluency': {
      manager: [
        'Usa IA para procesar grandes volúmenes de datos de servicio que serían inmanejables manualmente',
        'Identifica qué partes del proceso de service design se benefician de IA y cuáles requieren juicio humano',
        'Integra herramientas de IA en el flujo de trabajo del proyecto de forma documentada y replicable',
      ],
      peer: [
        'Comparte aprendizajes sobre uso de IA en service design con el equipo',
        'Señala cuando el uso de IA en un proyecto de servicio puede generar problemas de privacidad o ética',
      ],
    },
    'AI Applied to Service Design': {
      manager: [
        'Diseña touchpoints de IA en servicios considerando el ciclo completo de la experiencia del cliente',
        'Sus propuestas de AI touchpoints incluyen los handoffs con personas y los mecanismos de corrección',
        'Evalúa el impacto de la IA en los empleados del servicio, no solo en los clientes',
      ],
      peer: [
        'Comparte frameworks para diseñar servicios con IA de forma centrada en las personas',
        'Señala cuando el diseño de un touchpoint de IA puede excluir o dañar a ciertos grupos de usuarios',
      ],
    },
    'AI Critical Judgment': {
      manager: [
        'Evalúa las implicaciones éticas del uso de IA en servicios de alto impacto social antes de recomendarlos',
        'Construye criterios de aceptabilidad ética del uso de IA en los servicios que diseña',
        'Comunica proactivamente los riesgos del uso de IA en servicios al cliente y a los stakeholders',
      ],
      peer: [
        'Cuestiona propuestas de uso de IA en servicios que pueden generar exclusión o discriminación',
        'Contribuye a construir una cultura de diseño de servicios con IA responsable en el equipo',
      ],
    },
  },
}

// ── Mapeo score correcto → 1-5 ────────────────────────────────────────────────
// 0/3 → 1, 1/3 → 2, 2/3 → 3-4, 3/3 → 4-5
// Ajustamos por sesgo optimista típico: escala un poco conservadora
export function mapScoreToLevel(correctas, total) {
  const pct = correctas / total
  if (pct >= 0.9) return 5
  if (pct >= 0.7) return 4
  if (pct >= 0.5) return 3
  if (pct >= 0.3) return 2
  return 1
}

export const SCORE_LABEL = {
  1: 'Bajo',
  2: 'Básico',
  3: 'Competente',
  4: 'Avanzado',
  5: 'Experto',
}
