# Porkilo — landing de preventa

Landing de conversión para vender panceta premium por kilos mediante preventa semanal y cierre de pedido por WhatsApp.

## Configuración comercial

Los datos que cambian cada semana viven en `data/offer.ts`:

- número de WhatsApp en formato internacional, sin `+`;
- precio de preventa y precio de referencia;
- inventario semanal;
- hora de cierre y día de despacho;
- bonificaciones y adicionales.

El número de WhatsApp está configurado en formato internacional dentro de `data/offer.ts`. Los botones generan el resumen completo y abren la conversación directamente con Porkilo.

## Imágenes de bonificaciones y adicionales

Guarda las imágenes preparadas dentro de `public/catalog/bonuses` o `public/catalog/addons`. Después asigna su ruta pública en el campo `image` correspondiente de `data/offer.ts`; por ejemplo: `"/catalog/bonuses/salsa.png"`. Las tarjetas ya recortan la foto dentro de los bordes redondeados.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Meta Pixel y API de conversiones

La web envía `PageView` al cargar y `InitiateCheckout` cuando un pedido válido abre WhatsApp. El evento del navegador y el del servidor comparten `event_id`, por lo que Meta puede deduplicarlos.

Configura estas variables en Vercel, dentro de **Project Settings → Environment Variables**:

- `NEXT_PUBLIC_META_PIXEL_ID`: identificador del píxel o conjunto de datos.
- `META_CONVERSIONS_API_TOKEN`: token secreto de la API de conversiones. Nunca debe llevar el prefijo `NEXT_PUBLIC_`.
- `META_TEST_EVENT_CODE`: opcional y temporal para validar la integración en **Administrador de eventos → Probar eventos**.

Para trabajar localmente, copia `.env.example` como `.env.local` y reemplaza los valores de ejemplo. Después de modificar variables en Vercel es necesario crear un nuevo despliegue.

## Embudo de conversión y comportamiento

La web registra estos hitos anónimos: llegada al configurador, visualización de toppings, extras, bebidas y resumen, clics en las llamadas a la acción, cambios de cantidad, adicionales agregados y apertura de WhatsApp.

- En Vercel Pro aparecen en **Analytics → Events**. Vercel Hobby conserva las visitas generales, pero no incluye eventos personalizados.
- Para grabaciones de sesiones, mapas de calor y embudos visuales, crea un proyecto en Microsoft Clarity y configura su identificador como `NEXT_PUBLIC_CLARITY_PROJECT_ID` en Vercel. No se envían nombres, teléfonos ni el contenido del mensaje de WhatsApp.

## Alcance del MVP

Incluye experiencia visual, contador de preventa, escasez, oferta, bonificaciones, configurador, cálculo del total y generación del pedido para WhatsApp. No incluye pagos, usuarios, base de datos, CRM ni inventario en tiempo real.
