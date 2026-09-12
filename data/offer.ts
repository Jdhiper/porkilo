export const offer = {
  brand: "Porkilo",
  whatsappNumber: "573236284624",
  currency: "COP",
  locale: "es-CO",
  city: "Colombia",
  cutoff: {
    weekday: 0,
    hour: 11,
    label: "domingo a las 11:00 a. m.",
  },
  dispatch: "domingo",
  delivery: "Domicilio gratis",
  stockKg: 18,
  product: {
    name: "Panceta Porkilo",
    unit: "1 kg",
    serves: "3—4 personas",
    price: 89000,
    halfKgPrice: 49000,
    referencePrice: 109900,
    image: "/catalog/presentation/porkilo-completo-p.webp",
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
      title: "2 toppings a elección",
      description: "Medio kilo o un kilo incluyen dos; cada medio kilo adicional suma uno.",
      image: "/catalog/items/pico-de-gallo.webp" as string | null,
    },
    {
      id: "aji-incluido",
      title: "Ají en su recipiente",
      description: "Una porción aparte para ponerle picante a tu gusto.",
      image: "/catalog/items/aji.webp" as string | null,
    },
    {
      id: "maduro-incluido",
      title: "Plátano maduro",
      description: "Dorado, caramelizado y listo para acompañar la panceta.",
      image: "/catalog/items/platano-maduro.webp" as string | null,
    },
    {
      id: "arepas-incluidas",
      title: "Arepitas blancas",
      description: "Arepas pequeñas de maíz blanco incluidas en el pedido.",
      image: "/catalog/items/arepas-blancas.webp" as string | null,
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
      id: "guacamole",
      name: "Guacamole",
      description: "Cremoso, fresco y preparado con aguacate.",
      image: "/catalog/items/guacamole.webp",
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
      name: "Papas fritas extra",
      description: "Una porción adicional, dorada y lista para compartir.",
      price: 9000,
      image: "/catalog/items/papas-rusticas.webp" as string | null,
    },
    {
      id: "salsa",
      name: "Salsa ahumada extra",
      description: "Otra porción de nuestra salsa negra y ahumada.",
      price: 5000,
      image: "/catalog/items/salsa-ahumada-N.webp" as string | null,
    },
    {
      id: "pico-candela",
      name: "Pico de gallo extra",
      description: "Otra porción de tomate, cebolla, cilantro y limón.",
      price: 7000,
      image: "/catalog/items/pico-de-gallo.webp" as string | null,
    },
    {
      id: "guacamole-extra",
      name: "Guacamole extra",
      description: "Una porción adicional de guacamole fresco y cremoso.",
      price: 5000,
      image: "/catalog/items/guacamole.webp" as string | null,
    },
    {
      id: "aji-extra",
      name: "Ají extra",
      description: "Una porción adicional de ají en su propio recipiente.",
      price: 5000,
      image: "/catalog/items/aji.webp" as string | null,
    },
    {
      id: "maduro-extra",
      name: "Plátano maduro extra",
      description: "Una porción adicional de maduros dorados y caramelizados.",
      price: 5000,
      image: "/catalog/items/platano-maduro.webp" as string | null,
    },
    {
      id: "arepitas-extra",
      name: "Arepitas blancas extra",
      description: "Una porción adicional de arepas pequeñas de maíz blanco.",
      price: 5000,
      image: "/catalog/items/arepas-blancas.webp" as string | null,
    },
    {
      id: "cebolla-encurtida-extra",
      name: "Cebolla encurtida extra",
      description: "Una porción adicional, ácida, crocante y ligeramente dulce.",
      price: 5000,
      image: "/catalog/items/cebolla-encurtida.webp" as string | null,
    },
  ],
  beverages: [
    {
      id: "cocacola-15",
      name: "Coca-Cola 1,5 L",
      description: "El tamaño justo para acompañar hasta cuatro platos.",
      price: 7900,
      image: "/catalog/items/cocacola-15.webp" as string | null,
    },
    {
      id: "cocacola-3",
      name: "Coca-Cola 3 L",
      description: "La grande para cuando la mesa se llena.",
      price: 11000,
      image: "/catalog/items/cocacola-3.webp" as string | null,
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
