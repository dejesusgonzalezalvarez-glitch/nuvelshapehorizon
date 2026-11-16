como describirias o que imagen me darias como representacion de flujo de procesos con este prompt? # PROMPT MAESTRO: MIGRACIÓN A SHOPIFY HORIZON

## 1. ROL Y CONTEXTO
Eres mi asistente técnico para migrar el contenido de mi tienda anterior a
un tema de Shopify. Trabajas en mi computador con Windows. Las rutas
tienen espacios, así que entrecomilla siempre las rutas en los comandos.

## 2. PROYECTOS
- ORIGEN (SOLO LECTURA, NUNCA MODIFICAR NI BORRAR NADA):
  Carpeta: C:\Users\Roberth 2\Desktop\Gilmer\Nuvelshapestore
  Repo: https://github.com/dejesusgonzalezalvarez-glitch/nuvelshapestore
  Contiene las fotos y descripciones de mis productos y las secciones de
  mi página anterior.
- DESTINO (carpeta actual de trabajo):
  C:\Users\Roberth 2\Desktop\Theme Horizon Nuvel Shape
  Repo: https://github.com/dejesusgonzalezalvarez-glitch/nuvelshapehorizon
  Es el tema Shopify "Horizon" (Liquid, templates JSON, sections, blocks,
  snippets, assets, config, locales, layout). Es el ÚNICO tema de mi tienda.

## 3. OBJETIVO (ALCANCE EXACTO)
Pasar al tema Horizon únicamente:
  1. Las secciones de contenido de mi página anterior (inicio, nosotros,
     contacto, banners, textos, etc.).
  2. Las descripciones de mis productos.
  3. Las fotografías de mis productos.
NO migres CSS, JS, HTML crudo, plugins, fuentes ni ningún otro código del
origen. Si algo del origen queda fuera de estas tres cosas, no lo hagas.
Pregúntame.

## 4. REGLAS INQUEBRANTABLES
Seguridad del tema:
- No cambies la estructura de carpetas ni renombres archivos existentes.
- No borres código existente del tema sin avisarme antes y explicar por qué.
- No toques config/settings_data.json.
- Haz cambios mínimos y localizados. No reescribas archivos completos.
- No crees CSS ni JS nuevo salvo que sea imprescindible, y avísame ANTES.
- Usa las secciones, blocks y snippets que Horizon ya trae.
- JSON válido (sin comas finales ni comentarios). Liquid válido.
Seguridad de la tienda:
- No publiques nada. No uses --live ni "shopify theme publish".
- No toques otros temas de la tienda. No borres temas.
- No uses credenciales ni API de Shopify. Los productos se cargan por CSV
  que yo importo manualmente.
- Nunca leas, copies ni hagas commit de archivos .env, tokens o secretos.
Seguridad del origen:
- Todo lo que generes que no sea del tema (CSV, reportes, listas) va en:
  C:\Users\Roberth 2\Desktop\Gilmer\Nuvelshapestore\_shopify\
  NUNCA dentro de la carpeta del tema.
Forma de trabajar:
- Trabaja por fases. Al terminar cada fase, resume lo hecho y ESPERA mi
  aprobación escrita ("aprobado") antes de pasar a la siguiente.
- Si algo falla, es ambiguo o no estás seguro, DETENTE y pregúntame.
  No improvises, no inventes datos (precios, nombres, textos).
- Si falta información de un producto, déjala vacía o márcala; nunca la
  inventes.
- Responde siempre en español.

## 5. FASE 0: VERIFICACIONES PREVIAS (no modifiques nada)
a) Confirma que puedes leer la carpeta ORIGEN. Si no puedes, dímelo y
   detente.
b) Ejecuta "git status" y "git log -1" en la carpeta actual y dime si hay
   cambios sin commitear. Si los hay, pídeme hacer commit antes de seguir.
c) Confirma que la carpeta actual tiene la estructura de un tema Shopify
   (assets, blocks, config, layout, locales, sections, snippets,
   templates) y dime qué versión o nombre de tema indica config/ o
   package.json si existe.
d) Detecta la rama principal del repo ORIGEN (main o master) con
   "git branch" en esa carpeta.
e) Verifica si el repo ORIGEN es público: prueba con curl que una imagen
   de prueba abre en
   https://raw.githubusercontent.com/dejesusgonzalezalvarez-glitch/nuvelshapestore/RAMA/RUTA
   y dime el resultado (si da 404, el repo es privado o la ruta está mal).
f) Comprueba si Shopify CLI está instalado ("shopify version"). Solo
   infórmame, no lo instales sin preguntar.
Entrégame un resumen y espera mi "aprobado".

## 6. FASE 1: INVENTARIO Y PLAN (no modifiques nada)
A) PRODUCTOS. Crea una tabla con, por cada producto del ORIGEN:
   nombre, descripción completa, precio (si aparece), categoría o tipo
   (si aparece), variantes (talla, color, etc., si aparecen), y la lista
   de imágenes (ruta relativa, formato, peso en KB, dimensiones si puedes).
   Marca con aviso:
   - Imágenes de más de 500 KB.
   - Imágenes que no sean jpg, png o webp.
   - Nombres de archivo con espacios, mayúsculas o caracteres raros.
   - Productos sin precio, sin descripción o sin fotos.
B) SECCIONES. Crea una tabla con cada página y sección del ORIGEN:
   título, textos, imágenes, enlaces, botones, y orden de aparición.
C) MAPA HACIA HORIZON. Revisa templates/, sections/ y blocks/ de Horizon y
   propón, para cada sección del origen, en qué plantilla y sección o
   block de Horizon iría (por ejemplo: banner principal, texto con
   imagen, colección destacada, preguntas frecuentes, contacto).
   Indica qué settings del personalizador usaría cada una.
D) LO QUE NO ENCAJA. Lista lo que no tenga lugar natural en Horizon y
   dame opciones (omitir, usar página de Shopify, usar un block
   personalizado).
E) Guarda este inventario como Markdown en la carpeta _shopify\ del
   ORIGEN, con el nombre inventario.md.
Entrégame un resumen y espera mi "aprobado".

## 7. FASE 2: PRODUCTOS (archivo CSV de importación)
Genera products_import.csv en la carpeta _shopify\ del ORIGEN con el
formato oficial de importación de productos de Shopify.
Columnas, en este orden: Handle, Title, Body (HTML), Vendor, Type, Tags,
Published, Option1 Name, Option1 Value, Variant SKU, Variant Grams,
Variant Inventory Tracker, Variant Inventory Policy,
Variant Fulfillment Service, Variant Price, Variant Requires Shipping,
Variant Taxable, Image Src, Image Position, Image Alt Text,
Gift Card, Status.
Reglas:
- Encoding UTF-8 con comillas dobles para campos con comas o saltos de
  línea. Que las tildes y la ñ se vean bien.
- Handle: minúsculas, sin espacios ni tildes, solo letras, números y
  guiones. Único por producto.
- Title: el nombre original del producto.
- Body (HTML): la descripción original convertida a HTML simple
  (p, br, ul, li, strong, em). Sin CSS inline, sin scripts, sin clases.
- Vendor: pon "Nuvel Shape" si no existe otro dato.
- Producto sin variantes: Option1 Name = "Title" y
  Option1 Value = "Default Title".
- Variant Price: el precio original. Si falta, pon 0.00 y lístalo.
- Variant Inventory Policy: deny. Variant Fulfillment Service: manual.
- Image Src: URL pública con este formato exacto:
  https://raw.githubusercontent.com/dejesusgonzalezalvarez-glitch/nuvelshapestore/RAMA/RUTA/ARCHIVO
  usando la rama real detectada en la Fase 0, y reemplazando espacios
  por %20 y codificando caracteres especiales.
- Varias fotos del mismo producto: una fila extra por foto, con el mismo
  Handle y SOLO Image Src, Image Position (2, 3, ...) e Image Alt Text.
  La primera foto va en la fila principal con Image Position 1.
- Image Alt Text: descriptivo, por ejemplo "Nombre del producto - vista
  frontal".
- Published: FALSE. Status: draft.
Antes de darlo por terminado:
- Valida que el CSV abre bien (cuenta de columnas igual en cada fila).
- Verifica con curl que al menos 3 URLs de imagen responden 200.
- Dame la lista de productos incluidos, los de datos incompletos y las
  imágenes que no encontraste.
Espera mi "aprobado". Yo importaré el CSV manualmente en Shopify.

## 8. FASE 3: SECCIONES EN HORIZON (UNA PÁGINA POR VEZ)
Empieza por Inicio (templates/index.json). Cuando yo apruebe, sigue con
la siguiente página.
Para cada página:
- Antes de editar, dime qué archivos vas a modificar.
- Pasa los textos del ORIGEN a los settings y blocks de las secciones de
  Horizon, para que sean editables desde el personalizador de Shopify.
  No dejes textos fijos en el código si hay un setting disponible.
- Edita el JSON de la plantilla respetando su estructura, con IDs de
  sección y block únicos y el arreglo "order" actualizado.
- Imágenes de banner o secciones: cópialas desde el ORIGEN a assets/ del
  tema con nombre en minúsculas, sin espacios, sin subcarpetas, formato
  jpg, png o webp y menos de 500 KB. Si pesan más, avísame antes de
  comprimirlas. Las fotos de PRODUCTOS NO van en assets/.
- Referencia las imágenes con el mecanismo que use Horizon para ese
  setting (si usa image_picker, déjalo vacío y dime qué imagen debo elegir
  yo en el personalizador; si el setting no admite eso, usa asset_url).
- Agrega alt text descriptivo.
- Al terminar la página:
  1. Lista cada archivo modificado y qué cambiaste.
  2. Ejecuta "shopify theme check" si el CLI está instalado, y corrige
     los errores que causaste.
  3. Muestra "git diff --stat".
  4. Haz commit con un mensaje claro, por ejemplo
     "Migracion seccion inicio".
Espera mi "aprobado" antes de la siguiente página.

## 9. FASE 4: REVISIÓN FINAL
- Ejecuta "shopify theme check" en todo el tema y reporta el resultado.
- Valida que todos los archivos JSON del tema sean válidos.
- Confirma que no se modificó config/settings_data.json.
- Confirma que no hay archivos de _shopify\, .env ni del ORIGEN dentro de
  la carpeta del tema.
- Dame una lista final de todo lo migrado y de lo que quedó pendiente.

## 10. FASE 5: GIT
Solo cuando yo lo pida explícitamente:
- "git push origin main" (o la rama que corresponda) al repo
  nuvelshapehorizon.
- Confirma que el push terminó bien y que no se subieron secretos.
No hagas push antes de mi orden.

## 11. FORMATO DE TUS RESPUESTAS
Al final de cada fase entrégame:
1. Qué hiciste (breve).
2. Qué archivos creaste o modificaste (ruta completa).
3. Qué advertencias o problemas encontraste.
4. Qué necesitas de mí para continuar.

EMPIEZA AHORA SOLO CON LA FASE 0. No avances a la Fase 1 hasta que yo
escriba "aprobado".
…
Yo representaría este proyecto mediante una infografía de arquitectura de procesos tipo workflow, con una estética tecnológica, profesional y minimalista. No haría simplemente un diagrama con seis cajas: mostraría visualmente cómo se trasladan los datos de una tienda Shopify antigua al nuevo tema Horizon, qué controles existen y dónde necesitas intervenir para aprobar cada etapa.

Concepto visual: Migración controlada de Nuvel Shape a Shopify Horizon
On-Premise to Cloud Migration Roadmap
Así organizaría el flujo
NUVEL SHAPE — SHOPIFY HORIZON
FLUJO GENERAL DE MIGRACIÓN

ORIGEN

Nuvelshapestore

Solo lectura
DESTINO

Tema Shopify Horizon

Migración controlada
FASE 0
Verificaciones previas

Git · Carpetas · Repositorios · Shopify CLI · Permisos

FASE 1
Inventario y planificación

Productos · Fotografías · Descripciones · Secciones · Mapeo Horizon

FASE 2
Migración de productos

CSV · Imágenes públicas · Validación · Importación manual

FASE 3
Migración de páginas

Inicio → Nosotros → Contacto → Otras páginas

Editar → Validar → Commit → Aprobación

Repetir por cada página

FASE 4
Auditoría final

Theme Check · JSON · Seguridad · Archivos · Integridad

FASE 5
Publicación mediante Git

Push únicamente cuando el usuario lo autorice expresamente.

Control de seguridad permanente

Origen intacto · Sin publicación automática · Sin secretos · Sin modificaciones no autorizadas · Aprobación humana entre fases.

Cómo sería la imagen definitiva
Mi recomendación sería utilizar una composición horizontal de izquierda a derecha, con:

Lado izquierdo: la tienda anterior, representada como una base de datos con productos, fotografías y páginas.

Centro: un motor de migración que clasifica, transforma y valida la información.

Lado derecho: Shopify Horizon, representado como una tienda nueva que recibe los contenidos.

Parte inferior: las seis fases, con sus controles de aprobación y seguridad.

Conexiones: flechas que indiquen qué información se mueve y qué información permanece intacta.

La característica más importante sería mostrar que el proceso no es una migración automática sin supervisión: cada fase necesita tu aprobación antes de continuar.

Yo elegiría un diagrama técnico horizontal estilo arquitectura de software, en 16:9, con fondo azul oscuro, líneas luminosas y acentos verdes y dorados. Sería una representación visual del proceso completo, no una captura de cómo quedará la tienda.

# DIAGNÓSTICO Y REPARACIÓN DE ERRORES ACTUALES — NUVELSHAPE.STORE

**Sitio web:** https://nuvelshape.store/

## 1. CONTEXTO IMPORTANTE

Ya recibiste un prompt anterior con las instrucciones para migrar el contenido del proyecto antiguo de Nuvel al tema Shopify Horizon.

Este encargo NO sustituye ese trabajo ni modifica sus objetivos. Es una tarea adicional que debes realizar con cuidado.

Necesito que investigues por qué la tienda presenta problemas de funcionamiento y que determines si existen errores de publicación, enrutamiento, configuración, compatibilidad o implementación del tema.

**No quiero otro rediseño. Quiero que la tienda funcione correctamente.**

## 2. PRIMER PASO: DIAGNÓSTICO COMPLETO

Antes de modificar cualquier archivo:

1. Accede a https://nuvelshape.store/.
2. Comprueba si la página principal carga correctamente.
3. Comprueba si aparecen errores 404, páginas en blanco, contenido incompleto o elementos que no terminan de cargar.
4. Revisa las rutas de productos, colecciones y páginas internas.
5. Comprueba que los enlaces de navegación dirijan a destinos válidos.
6. Identifica errores de Liquid, JavaScript, CSS y referencias a archivos inexistentes.
7. Comprueba que las secciones y bloques del tema estén correctamente implementados.
8. Revisa si existen conflictos entre las plantillas JSON, los archivos Liquid y los recursos del tema.
9. Comprueba que los archivos estáticos, imágenes, fuentes y scripts estén correctamente referenciados.
10. Identifica posibles errores de configuración del dominio o publicación de Shopify.

No supongas que todos los errores proceden del código. Determina primero si el problema está en el dominio, la configuración de Shopify, el tema publicado o los enlaces internos.

## 3. COMPROBAR LA PUBLICACIÓN Y EL TEMA ACTIVO

Investiga:

- Qué tema está publicado actualmente en Shopify.
- Qué tema existe en el repositorio de Horizon.
- Si el repositorio y el tema publicado corresponden a la misma versión.
- Si existen cambios locales que todavía no se han integrado.
- Si Shopify está utilizando plantillas o archivos diferentes de los que estás revisando.
- Si existen referencias a snippets, secciones o assets que ya no existen.

No confundas el código del repositorio con el estado real de la tienda publicada.

## 4. INVESTIGAR LOS ERRORES FUNCIONALES

Presta especial atención a:

- Página principal que no carga.
- Páginas de productos que devuelven 404.
- Colecciones que no muestran productos.
- Enlaces internos rotos.
- Imágenes que no aparecen.
- Secciones que desaparecen o se muestran incorrectamente.
- Botones que no responden.
- Variantes de productos que no funcionan.
- Problemas con el carrito y el proceso de compra.
- Errores de visualización en móviles.
- Recursos inexistentes o rutas incorrectas.
- Errores de consola y solicitudes fallidas.

No ocultes páginas rotas ni elimines enlaces para que parezca que todo funciona. Encuentra y corrige la causa real.

## 5. REGLAS OBLIGATORIAS PARA LA REPARACIÓN

El proyecto de destino sigue siendo el tema Horizon.

Debes conservar:

- El diseño nativo de Horizon.
- Sus secciones y bloques originales.
- Su arquitectura Liquid.
- Sus plantillas y componentes.
- Sus estilos y funcionalidades originales.
- Su compatibilidad con el editor de temas de Shopify.

No debes recuperar ni reutilizar el código defectuoso del tema anterior.

Tampoco debes eliminar funcionalidades originales de Horizon para solucionar errores.

**IMPORTANTE:** El trabajo de migración anterior sigue vigente. Debes conservar el contenido de Nuvel y los cuatro productos autorizados, sin introducir productos adicionales.

## 6. MÉTODO DE TRABAJO

Trabaja en este orden:

**Fase 1 — Diagnóstico**
Identifica todos los errores y registra dónde se encuentran.

**Fase 2 — Clasificación**
Clasifica cada problema según su origen:
- Dominio y configuración de Shopify.
- Publicación del tema.
- Liquid y plantillas.
- JavaScript y CSS.
- Recursos e imágenes.
- Productos y colecciones.
- Navegación y enlaces.
- Diseño adaptable.

**Fase 3 — Reparación**
Corrige los problemas identificados sin realizar modificaciones innecesarias.

**Fase 4 — Validación**
Vuelve a comprobar las rutas, páginas, productos, imágenes, navegación, carrito y visualización móvil.

**Fase 5 — Informe**
Entrega un informe con los errores encontrados, su causa, los archivos modificados y las comprobaciones realizadas.

## 7. PRECAUCIONES

- Haz una copia de seguridad antes de modificar archivos.
- No elimines archivos originales de Horizon.
- No sobrescribas configuraciones globales sin necesidad.
- No modifiques información de Shopify que no sea necesaria para resolver el problema.
- No cambies precios, productos, variantes ni contenido comercial sin autorización.
- No publiques el tema ni realices despliegues sin mi autorización.
- No hagas cambios masivos sin identificar primero su necesidad.

## 8. RESULTADO ESPERADO

Quiero una tienda que:

1. Abra correctamente desde https://nuvelshape.store/.
2. Muestre la página principal sin errores.
3. Permita navegar por todas las secciones.
4. Muestre correctamente los cuatro productos autorizados.
5. Tenga enlaces funcionales.
6. Cargue todas las imágenes originales de Nuvel.
7. Permita seleccionar variantes y añadir productos al carrito.
8. Funcione correctamente en escritorio y dispositivos móviles.
9. Mantenga el diseño y la arquitectura nativa de Horizon.
10. Sea compatible con Shopify y su editor de temas.

## INSTRUCCIÓN FINAL

No te limites a entregarme una lista de posibles errores. Necesito que investigues el proyecto, encuentres las causas reales y ejecutes las reparaciones seguras.

Si detectas que el problema está fuera del código del tema —por ejemplo, en el dominio, DNS, configuración de Shopify o publicación—, indícalo claramente y explica qué debe corregirse y dónde.

Si alguna reparación implica riesgo de perder información, modificar datos comerciales o alterar la configuración de producción, detente y solicita autorización.

**Prioridad absoluta: recuperar el funcionamiento correcto de la tienda sin destruir el trabajo de migración a Horizon.**