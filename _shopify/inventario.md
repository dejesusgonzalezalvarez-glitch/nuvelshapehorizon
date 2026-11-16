# Inventario y Plan de Migración - Nuvel Shape a Shopify Horizon

## A) PRODUCTOS

| Nombre | Descripción | Precio | Tipo / Categoría | Variantes | Imágenes | Avisos / Advertencias |
|---|---|---|---|---|---|---|
| **Faja moldeadora invisible Nuvel** (Handle: `faja-moldeadora-invisible-nuvel`) | Faja moldeadora invisible con diseño sin costuras y cierre frontal. | 0.00 (pendiente) | Shapewear | Tallas (S, M, L, XL, 2XL), Colores (Negro, Beige) | `producto-frente.jpg`, `producto-espalda.jpg`, `producto-detalle.jpg`, `corse-negro-frente.jpg`, `corse-negro-espalda.jpg`, `corse-beige-frente.jpg`, `corse-beige-espalda.jpg`, `corse-tallas.jpg`, etc. | Sin precio definido en origen. |
| **Retro Shapewear Top with Zipper** (Handle: `retro-shapewear-top-with-zipper`) | Top moldeador de estilo retro con cierre. | 0.00 (pendiente) | Tops / Shapewear | Tallas (S, M, L, XL), Colores (Negro, Rosa) | `corse-negro-modelo.jpg`, `corse-negro-modelo-espalda.jpg`, `corse-rosa-modelo.jpg`, `corse-rosa-modelo-espalda.jpg` | Sin precio definido en origen. |
| **Womens Shapewear Dress Jumpsuit** (Handle: `womens-shapewear-dress-jumpsuit`) | Vestido jumpsuit moldeador sin costuras. | 0.00 (pendiente) | Vestidos / Shapewear | Tallas (S, M, L, XL), Colores (Negro, Gris) | `vestido-negro-frente.jpg`, `vestido-negro-espalda.jpg`, `vestido-gris-frente.jpg`, `vestido-gris-espalda.jpg`, `vestido-tallas.jpg`, `vestido-ugc-negro.jpg`, `vestido-ugc-gris.jpg` | Sin precio definido en origen. |
| **Seamless Shapewear Panties** (Handle: `seamless-shapewear-panties`) | Braguitas moldeadoras sin costuras. | 0.00 (pendiente) | Panties / Shapewear | Tallas (S, M, L, XL), Colores (Negro, Beige) | `short-negro-frente.jpg`, `short-negro-espalda.jpg`, `short-beige-frente.jpg`, `short-beige-espalda.jpg`, `short-tallas.jpg`, `short-ugc-negro.jpg`, `short-ugc-beige.jpg` | Sin precio definido en origen. |
| **Sujetador Corrector de Postura** (Handle: `sujetador-corrector-postura-sin-costuras`) | Sujetador con tecnología de corrección postural. | 0.00 (pendiente) | Accesorios / Shapewear | Talla Única, Color Beige | `sujetador-corrector.jpg` (imagen por verificar) | Nuevo producto detectado en tienda en vivo - no estaba en repositorio original. |

### Avisos de Imágenes en Productos y Activos:
- **Imágenes > 500 KB:**
  - `modelo-estudio-hover.png` (~1.39 MB)
  - `tecnica-1-disenada-para-adaptarse.png` (~1.68 MB)
  - `tecnica-2-silueta-uniforme.png` (~2.02 MB)
  - `tecnica-3-comodidad-ritmo.png` (~1.88 MB)
- **Formatos no JPG/PNG/WebP:** Ninguno crítico en productos (algunos SVG de iconos de UI, MP4 de video UGC).
- **Nombres de archivo:** Algunos tienen mayúsculas o espacios en metadatos originales, pero en assets del tema se estandarizarán en minúsculas y sin espacios.

---

## B) SECCIONES (Página de Inicio / Index)

| Orden | Sección ORIGEN | Título / Propósito | Textos / Contenido | Imágenes / Elementos | Enlaces / Botones |
|---|---|---|---|---|---|
| 1 | `hero` | Banner principal | Eyebrow, Título principal, Subtítulo | `hero-principal.jpg` | Botón CTA de compra |
| 2 | `vida-real` | Comparativa producto vs puesta | Eyebrow, Título, Subtítulo | `producto-frente.jpg`, `avatar-vestida.jpg` | - |
| 3 | `caracteristicas-home` | Características técnicas | 3 puntos clave de diseño y comodidad | Iconos / imágenes técnicas | - |
| 4 | `producto-ancla` | Producto destacado (Faja moldeadora) | Buybox y selectores de variantes | Galería del producto | Botón Añadir al carrito |
| 5 | `catalogo` | Cuadrícula de catálogo | "Nuestro catálogo" | Tarjetas de los 5 productos | Enlaces a detalle de producto |
| 6 | `por-que` | Beneficios Nuvel | "Por qué Nuvel" (4 columnas) | Iconos / textos explicativos | - |
| 7 | `testimonios` | Opiniones de clientas | "Clientas reales, mensajes reales" | Texto informativo / UGC | - |
| 8 | `confianza` | Garantías de compra | Envío gratis, 30 días de prueba, Pago seguro | Iconos | Enlaces informativos |
| 9 | `cta-final` | Llamado a la acción final | Título, texto y botón de cierre | `avatar-athleisure.jpg` | Botón CTA |

---

## C) MAPA HACIA HORIZON

| Sección ORIGEN | Sección / Plantilla en HORIZON | Settings del Personalizador en Horizon |
|---|---|---|
| **Hero** (`index.json` -> `hero`) | `image-banner` o `custom-liquid` | Scheme de color, padding, imagen de fondo, textos alineados. |
| **Vida Real** (`vida-real`) | `image-with-text` o `rich-text` con columnas | Título, subtítulo, imágenes superpuestas o lado a lado. |
| **Características** (`caracteristicas-home`) | `multicolumn` | Título, 3 columnas con icono/título/texto, esquema de color. |
| **Producto Ancla** (`producto-ancla`) | `featured-product` | Selección del producto `faja-moldeadora-invisible-nuvel`, tamaño de medios, esquema de color. **Nota:** El catálogo ahora tiene 5 productos - el Sujetador Corrector se muestra en el catálogo pero el producto ancla principal sigue siendo la Faja Moldeadora Invisible. |
| **Catálogo** (`catalogo`) | `featured-collection` o `collection-list` | Título de sección, visualización de los 4 productos. |
| **Por qué Nuvel** (`por-que`) | `multicolumn` | 4 columnas con títulos y descripciones cortas. |
| **Testimonios** (`testimonios`) | `rich-text` | Texto centrado con testimonios de clientas. |
| **Confianza** (`confianza`) | `multicolumn` | 3 columnas (Envío, Devoluciones, Pago seguro). |
| **CTA Final** (`cta-final`) | `image-banner` o `call-to-action` | Imagen de fondo, título, texto y botón de acción. |

---

## D) LO QUE NO ENCAJA Y OPCIONES

1. **Scripts PageFly / Plugins externos antiguos:** Se omiten por completo, ya que Horizon maneja secciones nativas optimizadas.
2. **Componentes custom excesivamente personalizados (`nuvel-buybox` personalizado complejo):** Se adaptarán utilizando los bloques nativos de Horizon (`variant-picker`, `buy_buttons`, `description`, y snippets compatibles con el diseño de Nuvel sin romper Horizon).
3. **Imágenes pesadas PNG (>500KB):** Se comprimirán o reemplazarán por versiones optimizadas (JPG/WebP < 500 KB) al subirlas a `assets/`.
