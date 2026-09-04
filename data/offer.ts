export const offer = {
  brand: "Porkilo",
  whatsappNumber: "",
  currency: "COP",
  locale: "es-CO",
  city: "Colombia",
  cutoff: {
    weekday: 5,
    hour: 20,
    label: "viernes a las 8:00 p. m.",
  },
  dispatch: "sábado",
  stockKg: 18,
  product: {
    name: "Panceta Porkilo",
    unit: "1 kg",
    serves: "3—4 personas",
    price: 89900,
    referencePrice: 109900,
    image: "/media/panceta-principal.png",
  },
  // Agrega las fotos en /public/catalog y reemplaza null por una ruta como
  // "/catalog/bonuses/salsa.png" o "/catalog/addons/papas.png".
  bonuses: [
    {
      id: "salsa-incluida",
      title: "Salsa incluida",
      description: "Nuestra salsa ahumada de la casa acompaña cada kilo.",
      image: null as string | null,
    },
    {
      id: "listo-para-servir",
      title: "Listo para servir",
      description: "Lo recibes cortado y empacado para llevarlo directo a la mesa.",
      image: null as string | null,
    },
    {
      id: "entrega-programada",
      title: "Entrega programada",
      description: "Tu pedido queda reservado para el despacho del sábado.",
      image: null as string | null,
    },
  ],
  addons: [
    {
      id: "papas",
      name: "Papas rústicas",
      description: "Doradas, sazonadas y listas para compartir.",
      price: 15900,
      image: null as string | null,
    },
    {
      id: "queso",
      name: "Queso fundido",
      description: "Cremoso, tibio y hecho para bañar cada corte.",
      price: 8900,
      image: null as string | null,
    },
    {
      id: "salsa",
      name: "Salsa extra",
      description: "Una porción adicional de nuestra salsa ahumada.",
      price: 5900,
      image: null as string | null,
    },
    {
      id: "limonada",
      name: "Limonada artesanal",
      description: "Fresca, cítrica y perfecta para equilibrar el fuego.",
      price: 7900,
      image: null as string | null,
    },
  ],
} as const;

export function formatMoney(value: number) {
  return new Intl.NumberFormat(offer.locale, {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(value);
}
