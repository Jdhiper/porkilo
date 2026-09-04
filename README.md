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

## Alcance del MVP

Incluye experiencia visual, contador de preventa, escasez, oferta, bonificaciones, configurador, cálculo del total y generación del pedido para WhatsApp. No incluye pagos, usuarios, base de datos, CRM ni inventario en tiempo real.
