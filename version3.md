# Simulador de Estructuras de Datos - v3

## Rediseño visual del simulador

Cambios aplicados al diseño visual de la interfaz (no se modificó ninguna lógica de las estructuras de datos), el porqué de cada decisión, y qué partes exactas del código cambiaron en cada archivo.

---

## 1. Punto de partida: referencias de diseño

El rediseño se basó en dos referencias visuales de estilo "fintech / SaaS":

- Una app móvil de ahorros con header verde oscuro, botones completamente redondeados ("pill"), tarjetas blancas sobre fondo claro, y una barra de navegación inferior flotante con esquinas redondeadas.
- Un dashboard de escritorio (CRM) con sidebar fijo a la izquierda con navegación por íconos, tarjetas blancas con sombra suave y bordes redondeados, y una píldora de información destacando un dato puntual.

No se copió ningún diseño literalmente. Se tomó de cada referencia el lenguaje visual (paleta, forma de los botones, estructura de navegación) y se adaptó al contenido real del simulador: pilas, colas, listas y árboles.

---

## 2. Sistema de diseño

### 2.1 Paleta de colores

Se centralizó toda la paleta en variables CSS (`:root`) y en un objeto `COLORS` en `renderer.js`, para que ambos archivos usen exactamente los mismos tonos y cualquier ajuste futuro se haga en un solo lugar.

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#1B4332` | Verde bosque. Color de marca: sidebar activo, botones de insertar, nodos de pila/árbol |
| `--color-accent` | `#40916C` | Verde medio. Eyebrow del header, detalles secundarios |
| `--color-danger` | `#D64550` | Rojo. Botones de eliminar, NULL, nodo marcado para borrar |
| `--color-info` | `#2C7A7B` | Verde azulado. Botón "Recorrer adelante" |
| `--color-plum` | `#7C5CBF` | Ciruela. Botón "Recorrer atrás", flechas `prev`/`tail` en el canvas |
| `--color-bg` | `#F3F7F4` | Fondo general de la página |
| `--color-surface` | `#FFFFFF` | Fondo de tarjetas (sidebar, paneles, explicación) |
| `--color-surface-alt` | `#EAF3EC` | Fondo de las secciones de controles, hover del menú |
| `--color-border` | `#DCE6E0` | Bordes sutiles de tarjetas e inputs |

**Por qué:** en la versión anterior los colores estaban repartidos como valores sueltos (`#16213e`, `#e94560`, `#0f3460`, `#ffd700`, etc.) sin ninguna relación entre sí. Ahora cada color tiene un rol semántico fijo: verde = estructura/acción de insertar, rojo = eliminar/NULL, ámbar = elemento resaltado o nuevo, ciruela = dirección inversa (`tail`/`prev`). Esto hace que el color mismo comunique información, no solo decore.

Como detalle intencional: el color ámbar (`#E8A33D`) usado para resaltar el nodo activo, el puntero `head` y el nodo "nuevo" en la lista, es un guiño a la moneda dorada de la referencia de la app de ahorros, reutilizado aquí con una función didáctica (marcar lo que está "en foco" en cada paso).

### 2.2 Tipografía

Se reemplazó la fuente genérica del sistema (`Segoe UI, Tahoma, Verdana`) por tres familias con roles distintos, cargadas desde Google Fonts en `index.html`:

- **Poppins** (600/700) para títulos: `h1`, nombres de panel (`Visualización`, `Operaciones`), marca del sidebar.
- **Inter** (400/500/600) para texto de interfaz: botones, etiquetas, explicaciones.
- **JetBrains Mono** (500/600) para todo lo que representa un dato: valores dentro de los nodos, contador de `#info-display`, inputs numéricos.

**Por qué:** usar una fuente monoespaciada solo para los valores (en vez de para toda la interfaz, como antes) separa visualmente "dato" de "interfaz", lo cual ayuda a leer el simulador igual que se leería una estructura en un debugger.

### 2.3 Forma: botones y contenedores tipo "pill"

Todos los botones (`.btn`) y el checkbox de lista doble (`#lblDoubly`) pasaron de `border-radius: 6-8px` a `border-radius: 999px` (píldora completa), igual que los botones de ambas referencias. Las tarjetas (`.panel`, `.sidebar`, `.explanation-card`) usan `border-radius: 18-20px`, más generoso que los `8-12px` originales.

---

## 3. Cambios por archivo

### 3.1 `index.html`

**Cambio principal:** se pasó de una sola columna centrada (`<div id="app">` con todo apilado) a una estructura de dos zonas:

```html
<div class="app-shell">
    <aside class="sidebar"> ... </aside>
    <main class="main-content"> ... </main>
</div>
```

El `<nav id="menu">` (con los mismos 4 botones y los mismos atributos `data-structure`) ahora vive dentro de `.sidebar` junto con un bloque de marca (`.brand`) y un pie de página (`.sidebar-footer`). Cada botón de estructura ahora incluye un ícono SVG en línea además del texto:

```html
<button data-structure="stack">
    <svg viewBox="0 0 24 24" ...><rect .../><rect .../><rect .../></svg>
    <span class="label">Pila</span>
</button>
```

**Por qué:** los íconos ayudan a reconocer cada estructura de un vistazo (barras apiladas para pila, cuadrados en fila para cola, círculos conectados para lista, jerarquía de nodos para árbol), y permiten que en la versión móvil el botón se pueda mostrar solo con el ícono y una etiqueta pequeña debajo, sin perder claridad.

El área de trabajo se dividió en un `<section class="workspace">` con dos tarjetas (`.panel`) hijas: una para el canvas y otra para los controles, en vez de tenerlos uno debajo del otro sin agrupación visual:

```html
<section class="workspace">
    <div class="panel canvas-panel"> ...canvas... </div>
    <div class="panel controls-panel"> ...controles... </div>
</section>
```

**Se agregó** `<link>` a Google Fonts (Poppins, Inter, JetBrains Mono) en el `<head>`.

**No se modificó ningún `id` referenciado por `main.js`**: `#menu`, `#inputValue`, `#inputDeleteValue`, `#btnInsert`, `#btnDelete`, `#info-display`, `#queue-section`, `#inputPosition`, `#inputQueueValue`, `#btnInsertAt`, `#btnRemoveAt`, `#list-section`, `#btnInsertFirst`, `#btnInsertLast`, `#inputListPos`, `#inputListVal`, `#btnInsertListAt`, `#btnDeleteListAt`, `#btnTraverseFwd`, `#btnTraverseBwd`, `#chkDoubly`, `#canvas`, `#explanation`. Por eso no fue necesario tocar `main.js`: toda la lógica de eventos sigue enganchando a los mismos elementos.

### 3.2 `css/styles.css`

**Cambio principal:** se agregó un bloque `:root` con todas las variables de color y tipografía descritas en la sección 2, y se reescribió el layout usando CSS Grid en vez de `flex` centrado:

```css
.app-shell {
    display: grid;
    grid-template-columns: 232px 1fr;
    gap: 24px;
    max-width: 1280px;
}
```

**Responsive (el cambio más importante para "que funcione en celular y PC"):** en vez de duplicar el menú de navegación para mobile y desktop (lo cual habría requerido tener dos elementos con el mismo `id="menu"`, algo inválido en HTML y que además rompería `document.querySelectorAll('#menu button')` en `main.js`), se usa **un solo** `<nav id="menu">` que cambia de apariencia según el ancho de pantalla:

```css
@media (max-width: 768px) {
    .app-shell { grid-template-columns: 1fr; padding-bottom: 100px; }

    .sidebar {
        position: fixed;
        bottom: 16px; left: 16px; right: 16px;
        flex-direction: row;
        border-radius: 999px;
    }

    .brand, .sidebar-footer { display: none; }

    .nav-menu { flex-direction: row; justify-content: space-around; }

    #menu button { flex-direction: column; }
}
```

**Por qué:** por debajo de 768px de ancho, el mismo `.sidebar` deja de comportarse como una columna fija a la izquierda y se convierte en una barra flotante inferior con posición fija, con los 4 botones distribuidos horizontalmente y el ícono arriba del texto. Esto imita el patrón de navegación inferior de apps móviles (como la referencia de la app de ahorros) sin duplicar HTML ni tocar JavaScript. El `padding-bottom: 100px` en `.app-shell` evita que el contenido quede tapado por la barra flotante.

También se agregó un breakpoint intermedio en 900px que apila el canvas y los controles en una sola columna antes de llegar al cambio de sidebar, para que se vea bien en tablets.

### 3.3 `js/renderer.js`

**No se modificó ninguna fórmula de posicionamiento** (coordenadas `x`, `y`, anchos, altos, cálculos de `startX`/`gap` quedaron intactos). Los cambios fueron dos:

**a) Centralización de colores y fuentes** en dos objetos al inicio del archivo:

```javascript
const COLORS = {
    stroke: '#1B4332',
    listBox: '#2F6B4F',
    highlight: '#E8A33D',
    tail: '#7C5CBF',
    danger: '#D64550',
    // ...
};

const FONTS = {
    mono: "'JetBrains Mono', monospace",
    sans: "'Inter', sans-serif"
};
```

Cada lugar donde antes había un color escrito directamente (por ejemplo `ctx.fillStyle = '#e94560'`) ahora referencia el token correspondiente (`ctx.fillStyle = COLORS.danger`). **Por qué:** antes, cambiar el color de "eliminar" en todo el simulador implicaba buscar y reemplazar el mismo hexadecimal en varias funciones distintas (`drawStack`, `drawList`, etc.), con riesgo de dejar alguno desactualizado. Ahora es un solo cambio en `COLORS`.

**b) Esquinas redondeadas en las cajas dibujadas.** Se agregó un método auxiliar:

```javascript
_roundRect(x, y, w, h, r = 8) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    // ...
    ctx.closePath();
}
```

y se reemplazaron los pares `ctx.fillRect(...)` + `ctx.strokeRect(...)` (que dibujan rectángulos de esquina recta) por llamadas a `_fillStrokeRoundRect(...)`, usado en las cajas de la pila, la cola, y las secciones de dato/puntero de cada nodo de la lista. Los círculos del árbol no se tocaron porque ya eran redondeados por naturaleza (`ctx.arc`).

**Por qué:** las esquinas rectas de `strokeRect`/`fillRect` contrastaban con el resto de la interfaz, que ahora usa bordes redondeados en botones y tarjetas. Redondear también las cajas del canvas mantiene consistencia visual entre el HTML/CSS y lo que se dibuja dentro del `<canvas>`.

---

## 4. Archivos que NO se modificaron

`js/main.js`, `js/stack.js`, `js/queue.js`, `js/list.js` y `js/tree.js` quedaron exactamente igual: ninguna lógica de inserción, eliminación o recorrido cambió. Todo lo descrito en este documento es puramente visual.

---

## 5. Resumen de archivos modificados

| Archivo | Tipo de cambio | Alcance |
|---|---|---|
| `index.html` | Estructural | Nuevo layout (sidebar + main), íconos SVG en el menú, imports de fuentes |
| `css/styles.css` | Visual + responsive | Variables de diseño, CSS Grid, breakpoints para sidebar → barra inferior |
| `js/renderer.js` | Visual | Objeto `COLORS`/`FONTS`, helper `_roundRect`, sin cambios de posicionamiento |
| `js/main.js`, `stack.js`, `queue.js`, `list.js`, `tree.js` | Sin cambios | Lógica intacta |