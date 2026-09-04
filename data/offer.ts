export const offer = {
  brand: "Porkilo",
  whatsappNumber: "573194650461",
  currency: "COP",
  locale: "es-CO",
  city: "Colombia",
  cutoff: {
    weekday: 0,
    hour: 11,
    label: "domingo a las 11:00 a. m.",
  },
  dispatch: "domingo",
  stockKg: 18,
  product: {
    name: "Panceta Porkilo",
    unit: "1 kg",
    serves: "3—4 personas",
    price: 89000,
    halfKgPrice: 49000,
    referencePrice: 109900,
    image: "/catalog/presentation/porkilo-completo-vertical.webp",
  },
  bulkDiscount: {
    minimumKg: 3,
    rate: 0.08,
    label: "8% OFF llevando 3 kilos",
  },
  // Agrega las fotos en /public/catalog y reemplaza null por una ruta como
  // "/catalog/bonuses/salsa.png" o "/catalog/addons/papas.png".
  bonuses: [
    {
      id: "papas-incluidas",
      title: "Papas cocinadas",
      description: "Una porción lista para servir incluida con cada kilo.",
      image: "/catalog/items/papas-rusticas.webp" as string | null,
    },
    {
      id: "toppings-incluidos",
      title: "Desde 2 toppings",
      description: "Medio kilo o un kilo incluyen dos; cada medio kilo adicional suma uno.",
      image: "/catalog/items/pico-de-gallo.webp" as string | null,
    },
    {
      id: "cuatro-sabores",
      title: "4 sabores disponibles",
      description: "Frescos, cremosos, ahumados o encurtidos.",
      image: "/catalog/items/salsa-ajo.webp" as string | null,
    },
  ],
  toppings: [
    {
      id: "pico-de-gallo",
      name: "Pico de gallo",
      description: "Tomate, cebolla, cilantro y limón.",
      image: "/catalog/items/pico-de-gallo.webp",
    },
    {
      id: "salsa-ahumada",
      name: "Salsa ahumada negra",
      description: "Oscura, intensa y con un golpe de humo.",
      image: "/catalog/items/salsa-ahumada-N.webp",
    },
    {
      id: "salsa-ajo",
      name: "Salsa de la casa",
      description: "Cremosa y preparada con ajo.",
      image: "/catalog/items/salsa-ajo.webp",
    },
    {
      id: "cebolla-encurtida",
      name: "Cebolla encurtida",
      description: "Ácida, crocante y ligeramente dulce.",
      image: "/catalog/items/cebolla-encurtida.webp",
    },
  ],
  addons: [
    {
      id: "papas",
      name: "Papas rústicas extra",
      description: "Una porción adicional para una mesa más grande.",
      price: 15900,
      image: "/catalog/items/papas-rusticas.webp" as string | null,
    },
    {
      id: "cocacola-15",
      name: "Coca-Cola 1,5 L",
      description: "Bien fría para acompañar hasta 4 platos.",
      price: 7900,
      image: "/catalog/items/cocacola-15.webp" as string | null,
    },
    {
      id: "cocacola-3",
      name: "Coca-Cola 3 L",
      description: "La grande para cuando la mesa se llena.",
      price: 11900,
      image: "/catalog/items/cocacola-3.webp" as string | null,
    },
    {
      id: "salsa",
      name: "Salsa ahumada extra",
      description: "Otra porción de nuestra salsa negra y ahumada.",
      price: 5900,
      image: "/catalog/items/salsa-ahumada-N.webp" as string | null,
    },
    {
      id: "pico-candela",
      name: "Pico Candela extra",
      description: "Otra porción de tomate, cebolla, cilantro y limón.",
      price: 8900,
      image: "/catalog/items/pico-de-gallo.webp" as string | null,
    },
    {
      id: "salsa-casa-extra",
      name: "Salsa de la casa extra",
      description: "Una porción adicional de nuestra salsa cremosa de ajo.",
      price: 5900,
      image: "/catalog/items/salsa-ajo.webp" as string | null,
    },
    {
      id: "cebolla-encurtida-extra",
      name: "Cebolla encurtida extra",
      description: "Una porción adicional, ácida, crocante y ligeramente dulce.",
      price: 6900,
      image: "/catalog/items/cebolla-encurtida.webp" as string | null,
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
