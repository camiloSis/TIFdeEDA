# Simulador de Estructuras de Datos - v6

## Scroll dinámico del canvas

Este documento reúne todo el trabajo realizado a partir del pedido de agregar barras de scroll a pila, cola, lista y árbol: la implementación original, las dos observaciones que surgieron al probarla, el diagnóstico de cada una y la solución aplicada. Reemplaza y amplía lo descrito en anteriores versiones, ya que durante las pruebas aparecieron dos problemas adicionales que no se habían detectado al escribir dichos documentos.

---

## Fase 1 — Implementación del scroll dinámico

### 1.1 Diagnóstico inicial

Antes de este trabajo, el `<canvas>` tenía en `css/styles.css` un tamaño fijo:

```css
#canvas {
    display: block;
    width: 100%;
    height: 360px;
}
```

Y en `js/renderer.js`, la única función que definía el tamaño del canvas era `resize()`, que lo igualaba siempre al tamaño del contenedor (`#canvas-container`), sin importar cuántos elementos hubiera en la estructura.

**Causa raíz:** el tamaño del canvas dependía solo del contenedor, nunca de la cantidad de datos. Cada función `drawX()` calculaba las posiciones usando `this.canvas.width`/`height` como referencia, así que con 3 o con 30 elementos todo se repartía y se comprimía dentro del mismo espacio. Además, el CSS forzaba `width: 100%; height: 360px;`, así que aunque el canvas hubiera crecido internamente, el navegador lo habría reescalado visualmente de vuelta al tamaño del contenedor.

### 1.2 Solución: `css/styles.css` deja de forzar el tamaño del canvas

```css
#canvas {
    display: block;
}
```

Se quitaron `width: 100%` y `height: 360px`. Sin estas líneas, el tamaño visible del canvas pasa a ser exactamente su tamaño interno real (los atributos `width`/`height` que le asigna `renderer.js`), en vez de una medida forzada por CSS.

### 1.3 Solución: `js/renderer.js` calcula el tamaño según el contenido

**a) El tamaño del contenedor pasa a ser un mínimo, no un tamaño fijo:**

```javascript
constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onResize = null;
    this.resize();
    window.addEventListener('resize', () => {
        this.resize();
        if (this.onResize) this.onResize();
    });
}

resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.baseWidth = rect.width || 800;
    this.baseHeight = rect.height || 350;
    this.canvas.width = this.baseWidth;
    this.canvas.height = this.baseHeight;
}
```

`onResize` se agregó porque, al poder crecer el canvas más allá del contenedor, la ventana ya no puede solo "volver a medir": también necesita **volver a dibujar** con las nuevas medidas. `js/main.js` ya tenía conectado `renderer.onResize = () => updateView();` desde el trabajo anterior sobre el bug de resize, así que no fue necesario tocar ese archivo.

**b) Nuevo método `_setCanvasSize()`**, que agranda el canvas solo si el contenido lo necesita, sin achicarlo nunca por debajo del tamaño del panel:

```javascript
_setCanvasSize(neededW, neededH) {
    const w = Math.max(this.baseWidth, Math.ceil(neededW));
    const h = Math.max(this.baseHeight, Math.ceil(neededH));
    if (this.canvas.width !== w) this.canvas.width = w;
    if (this.canvas.height !== h) this.canvas.height = h;
}
```

El `if` antes de asignar evita un borrado innecesario del canvas cuando el tamaño no cambió entre un dibujo y otro (asignar `width`/`height` siempre limpia el canvas, incluso con el mismo valor).

**c) Cada función de dibujo calcula cuánto espacio necesita antes de dibujar:**

Pila (crece solo verticalmente):
```javascript
const neededH = items.length * (boxH + gap) + 100;
this._setCanvasSize(this.baseWidth, neededH);
```

Cola (crece solo horizontalmente):
```javascript
const totalW = items.length * (boxW + gap) - gap;
this._setCanvasSize(totalW + 200, this.baseHeight);
```

Lista (crece solo horizontalmente, con margen extra para las etiquetas `NULL`/`head`/`tail`):
```javascript
const totalW = values.length * (nodeW + gap) - gap;
this._setCanvasSize(totalW + 220, this.baseHeight);
```

Árbol (crece en ambos ejes: más nodos → más ancho, más profundidad → más alto):
```javascript
const neededW = order * hSpacing + 100;
const neededH = 60 + maxDepth * levelHeight + 90;
this._setCanvasSize(neededW, neededH);
```

### 1.4 Cambio adicional en el árbol: posicionamiento por recorrido in-order

Se aprovechó el cambio para reemplazar el posicionamiento horizontal del árbol (antes dividía el ancho disponible a la mitad recursivamente, lo que podía superponer nodos en árboles muy desbalanceados) por uno basado en recorrido in-order:

```javascript
let order = 0;
const dfs = (node, depth) => {
    if (!node) return;
    dfs(node.left, depth + 1);
    const x = 50 + order * hSpacing;
    const y = 60 + depth * levelHeight;
    positions.push({ node, x, y, depth });
    order++;
    dfs(node.right, depth + 1);
};
```

Como el recorrido in-order de un árbol binario de búsqueda siempre visita los valores de menor a mayor, asignar posiciones X consecutivas en ese orden garantiza que los nodos queden ordenados de izquierda a derecha sin superponerse nunca, sin importar qué tan desbalanceado esté el árbol.

**Efecto secundario resuelto:** con este posicionamiento la raíz ya no queda necesariamente al centro visual del canvas. Se agregó, al final de `drawTree()`, que el scroll horizontal se centre sobre la raíz cuando el árbol es más ancho que el panel:

```javascript
const rootPos = positions.find(p => p.node === root);
const container = this.canvas.parentElement;
if (rootPos && container.scrollWidth > container.clientWidth) {
    container.scrollLeft = Math.max(0, rootPos.x - container.clientWidth / 2);
}
```

---

## Fase 2 — Corrección: el crecimiento vertical empujaba los controles fuera de vista

### 2.1 Observación

Al probar la pila y el árbol con muchos elementos, el crecimiento vertical del canvas no quedaba contenido en una barra de scroll interna: la tarjeta completa del canvas crecía de alto y empujaba hacia abajo el panel de controles (insertar/eliminar), obligando a desplazarse por **toda la página** para llegar a los botones, en vez de solo desplazarse dentro del recuadro del canvas.

### 2.2 Diagnóstico

```css
.canvas-container {
    border: 1px dashed var(--color-border);
    border-radius: 14px;
    background: var(--color-bg);
    min-height: 360px;
    overflow: auto;
}
```

**Causa raíz:** `min-height` establece un mínimo, no un límite. Un contenedor con altura `auto` (que es lo que queda al no fijar `height`) simplemente crece tanto como su contenido, sin importar que tenga `overflow: auto`; esa propiedad solo recorta contenido cuando el tamaño del contenedor ya está determinado por otra vía (`height` o `max-height`). Como acá solo había un mínimo, el contenedor nunca llegaba a "desbordarse" verticalmente y la barra de scroll interna nunca aparecía.

### 2.3 Solución

```css
.canvas-container {
    border: 1px dashed var(--color-border);
    border-radius: 14px;
    background: var(--color-bg);
    height: 360px;
    overflow: auto;
}
```

Se cambió `min-height` por `height`, manteniendo el mismo valor (360px) para no alterar el tamaño visual habitual. Con una altura fija real, `overflow: auto` sí tiene algo concreto que recortar: en cuanto el canvas interno (ya dimensionado según la cantidad de datos por `_setCanvasSize`) supera esos 360px, aparece la barra de scroll **dentro de esa tarjeta**, y el panel de controles se queda fijo al lado sin moverse, tanto en escritorio como en la versión de una sola columna para mobile.

No fue necesario modificar `renderer.js` ni `main.js` para esta corrección: ambos ya calculaban el tamaño necesario del canvas asumiendo que el contenedor tenía un límite fijo: lo único que faltaba era que el CSS realmente se lo diera.

---

## Fase 3 — Corrección: el crecimiento horizontal desbordaba toda la página

### 3.1 Observación

Con estructuras que crecen horizontalmente (árbol, lista, cola), en pantallas de escritorio el usuario tenía que desplazar la página completa para encontrar el panel de controles, ya que este quedaba corrido fuera del área visible en vez de permanecer fijo al lado del canvas.

### 3.2 Diagnóstico

Este es un problema distinto al de la Fase 2, específico de CSS Grid. `.workspace` reparte el espacio entre el canvas y los controles con `grid-template-columns: 1.6fr 1fr;`. Por especificación, un elemento dentro de una columna de grid tiene, por defecto, un **ancho mínimo automático** basado en el contenido más ancho que tenga adentro (`min-width: auto`), y esto se calcula de forma independiente a que ese contenido esté dentro de un contenedor con `overflow: auto`. El `<canvas>`, al ser un elemento reemplazado con un ancho intrínseco fijo (no es texto que pueda ajustarse), puede reportar un ancho mínimo enorme cuando el árbol o la lista crecen mucho.

**Causa raíz:** ni `.workspace` ni la tarjeta que contiene el canvas (`.canvas-panel`) tenían `min-width: 0`, así que el grid seguía intentando reservarle a esa columna todo el ancho que el canvas interno pedía, empujando el ancho total de la página más allá del viewport, en vez de respetar la proporción `1.6fr` y dejar que `.canvas-container` (que ya tenía `overflow: auto`) se encargara de recortar internamente.

### 3.3 Solución

```css
.workspace {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 20px;
    align-items: start;
    min-width: 0;
}

.canvas-panel {
    min-width: 0;
}
```

Se agregó `min-width: 0;` tanto a `.workspace` como a la nueva regla `.canvas-panel`. Esto le indica explícitamente al grid que ignore el ancho del contenido interno del canvas al calcular cuánto espacio mínimo reservarle a esa columna, y respete siempre la proporción `1.6fr` / `1fr` sin importar qué tan ancha crezca la estructura dibujada. El desborde horizontal queda así contenido exclusivamente dentro de `.canvas-container`, y el panel de "Operaciones" permanece fijo al lado, siempre visible.

Esta corrección es puramente de reparto de ancho entre columnas del grid; tampoco requirió cambios en `renderer.js` ni en `main.js`.

---

## Resumen de todos los cambios de este documento

| Archivo | Cambio | Fase |
|---|---|---|
| `css/styles.css` | `#canvas`: se quitó el tamaño forzado (`width: 100%; height: 360px;`) | 1 |
| `js/renderer.js` | `baseWidth`/`baseHeight` como mínimos, `_setCanvasSize()`, cálculo de tamaño en `drawStack`/`drawQueue`/`drawList`/`drawTree`, reposicionamiento del árbol por recorrido in-order, centrado de scroll sobre la raíz | 1 |
| `css/styles.css` | `.canvas-container`: `min-height` → `height` (límite real para que `overflow: auto` funcione verticalmente) | 2 |
| `css/styles.css` | `.workspace` y nueva regla `.canvas-panel`: `min-width: 0;` (evita que el grid se ensanche por el contenido interno del canvas) | 3 |
| `js/main.js` | Sin cambios en ninguna fase (el hook `renderer.onResize` ya existía desde el trabajo anterior) | — |

### Estado final relevante de `css/styles.css`

```css
.workspace {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 20px;
    align-items: start;
    min-width: 0;
}

.panel {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(16, 40, 29, 0.06);
}

.canvas-panel {
    min-width: 0;
}

.canvas-container {
    border: 1px dashed var(--color-border);
    border-radius: 14px;
    background: var(--color-bg);
    height: 360px;
    overflow: auto;
}

#canvas {
    display: block;
}
```

Con estas tres correcciones, el canvas de cualquiera de las cuatro estructuras puede crecer tanto vertical como horizontalmente según la cantidad de datos, mostrando una barra de scroll contenida dentro de su propia tarjeta, sin que el panel de controles se mueva de su lugar ni la página se desborde en ningún eje.