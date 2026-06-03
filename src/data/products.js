export const products = [
  // SALUD IA
  { id: 1, name: "Anillo Inteligente de Salud", category: "salud", price: 89.99, margin: 85, emoji: "💍", badge: "Top ventas", desc: "Monitorea ritmo cardíaco, SpO2 y sueño en tiempo real.", viral: true },
  { id: 2, name: "Parche de Monitoreo de Sueño", category: "salud", price: 69.99, margin: 80, emoji: "🩹", badge: "Viral", desc: "Analiza fases del sueño con IA y envía reportes a la app.", viral: true },
  { id: 3, name: "Glucómetro sin Agujas IA", category: "salud", price: 119.99, margin: 75, emoji: "💉", badge: "Innovación", desc: "Mide glucosa con sensores ópticos, sin pinchazos.", viral: false },
  { id: 4, name: "Tensiómetro Bluetooth IA", category: "salud", price: 59.99, margin: 70, emoji: "❤️", badge: "Nuevo", desc: "Detecta patrones de presión arterial con IA predictiva.", viral: false },
  { id: 5, name: "Diadema de Meditación IA", category: "salud", price: 149.99, margin: 78, emoji: "🧠", badge: "Viral", desc: "Lee ondas cerebrales EEG y guía meditaciones en tiempo real.", viral: true },
  { id: 6, name: "Monitor de Estrés Corporal", category: "salud", price: 79.99, margin: 72, emoji: "💪", badge: "Nuevo", desc: "Detecta cortisol y ritmo cardíaco para alertar niveles de estrés.", viral: false },

  // BELLEZA TECH
  { id: 7, name: "Analizador de Piel con IA", category: "belleza", price: 129.99, margin: 85, emoji: "🔬", badge: "Top ventas", desc: "Analiza 11 parámetros cutáneos y recomienda tratamientos.", viral: true },
  { id: 8, name: "Masajeador Facial EMS", category: "belleza", price: 89.99, margin: 80, emoji: "✨", badge: "Viral", desc: "Estimulación microcorriente ajustada según tipo de piel.", viral: true },
  { id: 9, name: "Dispositivo LED Antienvejecimiento", category: "belleza", price: 109.99, margin: 82, emoji: "💡", badge: "Top ventas", desc: "Terapia de luz roja y azul con protocolos IA personalizados.", viral: true },
  { id: 10, name: "Depilador IPL Inteligente", category: "belleza", price: 99.99, margin: 78, emoji: "⚡", badge: "Nuevo", desc: "Detecta tono de piel y ajusta la intensidad automáticamente.", viral: false },
  { id: 11, name: "Escáner de Cabello IA", category: "belleza", price: 79.99, margin: 75, emoji: "💇", badge: "Innovación", desc: "Analiza salud del cabello con imágenes microscópicas.", viral: false },
  { id: 12, name: "Hidratador Facial Ultrasónico", category: "belleza", price: 69.99, margin: 73, emoji: "💧", badge: "Nuevo", desc: "Infunde activos según análisis de piel previo.", viral: false },

  // HOGAR
  { id: 13, name: "Enchufe Inteligente IA", category: "hogar", price: 39.99, margin: 65, emoji: "🔌", badge: "Viral", desc: "Aprende tus hábitos y optimiza el uso de energía.", viral: true },
  { id: 14, name: "Cámara Seguridad Facial IA", category: "hogar", price: 109.99, margin: 70, emoji: "📷", badge: "Top ventas", desc: "Distingue familiares, visitas y extraños sin falsas alarmas.", viral: true },
  { id: 15, name: "Termostato Inteligente IA", category: "hogar", price: 89.99, margin: 68, emoji: "🌡️", badge: "Nuevo", desc: "Aprende rutinas y ajusta temperatura para máximo ahorro.", viral: false },
  { id: 16, name: "Cerradura Biométrica Smart", category: "hogar", price: 129.99, margin: 72, emoji: "🔐", badge: "Innovación", desc: "Reconocimiento facial + huella + control por app.", viral: false },
  { id: 17, name: "Jardín Interior Automático IA", category: "hogar", price: 99.99, margin: 74, emoji: "🌱", badge: "Viral", desc: "Regula luz, agua y nutrientes automáticamente.", viral: true },
  { id: 18, name: "Robot Aspirador IA 3D", category: "hogar", price: 199.99, margin: 60, emoji: "🤖", badge: "Top ventas", desc: "Mapea el hogar en 3D y aprende zonas prioritarias.", viral: false },

  // WEARABLES
  { id: 19, name: "Smartwatch ECG y Temperatura", category: "wearables", price: 159.99, margin: 75, emoji: "⌚", badge: "Top ventas", desc: "ECG de 6 derivaciones y análisis de salud continuo.", viral: true },
  { id: 20, name: "Gafas de Realidad Aumentada", category: "wearables", price: 249.99, margin: 80, emoji: "🥽", badge: "Innovación", desc: "Superponen información en tiempo real al campo visual.", viral: true },
  { id: 21, name: "Audífonos Traductores IA", category: "wearables", price: 149.99, margin: 78, emoji: "🎧", badge: "Viral", desc: "Traducen +40 idiomas con latencia menor a 0.5 segundos.", viral: true },
  { id: 22, name: "Brazalete de Estrés IA", category: "wearables", price: 89.99, margin: 76, emoji: "🎗️", badge: "Nuevo", desc: "Detecta variabilidad cardíaca y activa vibraciones guiadas.", viral: false },
  { id: 23, name: "Plantillas Inteligentes Running", category: "wearables", price: 79.99, margin: 72, emoji: "👟", badge: "Innovación", desc: "Analizan pisada y cadencia en tiempo real.", viral: false },

  // MASCOTAS
  { id: 24, name: "Comedero Automático IA", category: "mascotas", price: 79.99, margin: 70, emoji: "🐾", badge: "Viral", desc: "Reconoce a tu mascota y controla porciones diarias.", viral: true },
  { id: 25, name: "GPS Collar Inteligente", category: "mascotas", price: 69.99, margin: 68, emoji: "📍", badge: "Top ventas", desc: "Localización en tiempo real y análisis de actividad física.", viral: true },
  { id: 26, name: "Monitor de Salud Mascotas", category: "mascotas", price: 89.99, margin: 72, emoji: "🏥", badge: "Nuevo", desc: "Detecta anomalías en comportamiento y vitales.", viral: false },
  { id: 27, name: "Juguete Robótico IA", category: "mascotas", price: 49.99, margin: 65, emoji: "🎮", badge: "Viral", desc: "Se adapta al comportamiento del animal para máximo entretenimiento.", viral: true },

  // COTIDIANO
  { id: 28, name: "Botella de Agua Inteligente", category: "cotidiano", price: 49.99, margin: 68, emoji: "💧", badge: "Viral", desc: "Rastrea hidratación y envía alertas a tu teléfono.", viral: true },
  { id: 29, name: "Báscula Corporal IA", category: "cotidiano", price: 59.99, margin: 65, emoji: "⚖️", badge: "Nuevo", desc: "Mide 17 parámetros corporales y genera planes de salud.", viral: false },
  { id: 30, name: "Papelera Automática IA", category: "cotidiano", price: 44.99, margin: 60, emoji: "🗑️", badge: "Innovación", desc: "Apertura por detección de movimiento y compactación automática.", viral: false },
]
