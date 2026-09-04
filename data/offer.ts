export const offer = {
  brand: "Porkilo",
  whatsappNumber: "573194650461",
  currency: "COP",
  locale: "es-CO",
  city: "Colombia",
  cutoff: {
    weekday: 5,
    hour: 20,
    label: "viernes a las 8:00 p. m.",
  },
  dispatch: "domingo",
  stockKg: 18,
  product: {
    name: "Panceta Porkilo",
    unit: "1 kg",
    serves: "3—4 personas",
    price: 89000,
    referencePrice: 109900,
    image: "/catalog/presentation/porkilo-completo.webp",
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
      title: "Papas rústicas",
      description: "Una porción crocante incluida con cada kilo.",
      image: "/catalog/items/papas-rusticas.webp" as string | null,
    },
    {
      id: "pico-incluido",
      title: "Pico de gallo fresco",
      description: "La ensalada fresca que equilibra toda la mesa.",
      image: "/catalog/items/pico-de-gallo.webp" as string | null,
    },
    {
      id: "salsa-incluida",
      title: "Salsa ahumada",
      description: "Nuestra salsa de la casa, incluida con cada kilo.",
      image: "/catalog/items/salsa-ahumada.webp" as string | null,
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
      description: "Otra porción de nuestra salsa ahumada de la casa.",
      price: 5900,
      image: "/catalog/items/salsa-ahumada.webp" as string | null,
    },
    {
      id: "pico-candela",
      name: "Pico Candela extra",
      description: "Otra porción de tomate, cebolla, cilantro y limón.",
      price: 8900,
      image: "/catalog/items/pico-de-gallo.webp" as string | null,
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
