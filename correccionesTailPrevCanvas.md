# Simulador de Estructuras de Datos - v3

## Corrección de errores detectados en revisión de código

Este documento detalla dos errores encontrados durante una revisión del código de la versión 2 (`version2.md`), junto con el diagnóstico de cada uno y la solución aplicada.

---

## 1. Desincronización de `tail` y `prev` al alternar entre lista simple y doble

### Diagnóstico

En `js/list.js`, los atributos `tail` (puntero al último nodo) y `prev` (puntero al nodo anterior, usado en lista doble) solo se actualizaban dentro de bloques `if (this.doubly)`. Esto generaba un estado inconsistente en el siguiente escenario:

1. El usuario construye la lista en modo simple (`doubly = false`) usando `insertLast` varias veces.
2. Como `doubly` es `false`, `tail` nunca se actualiza más allá del primer nodo creado, y ningún nodo recibe su puntero `prev`.
3. El usuario marca el checkbox "Lista doble" (`doubly = true`).
4. `tail` sigue apuntando al nodo antiguo (no al último real), y ningún nodo tiene `prev` calculado.
5. Al presionar "Recorrer atrás" (`traverseBackward`), el recorrido comienza desde un `tail` incorrecto y se corta de inmediato porque los `prev` son `null`.

**Causa raíz:** `tail` y `prev` se trataban como propiedades exclusivas del modo doble, en lugar de mantenerse siempre consistentes con la estructura real de la lista.

### Solución aplicada

**a) Se agregó un método `_rebuildLinks()`** que recorre toda la lista y recalcula `prev` (según el modo actual) y `tail` (siempre), sin importar el modo:

```javascript
_rebuildLinks() {
    let current = this.head;
    let prev = null;
    while (current) {
        current.prev = this.doubly ? prev : null;
        prev = current;
        current = current.next;
    }
    this.tail = prev;
}
```

**b) `setDoubly()` ahora llama a `_rebuildLinks()`** cada vez que el usuario cambia de modo, garantizando que `tail` y todos los `prev` queden correctos de inmediato:

```javascript
setDoubly(val) {
    this.doubly = val;
    this._rebuildLinks();
}
```

**c) `tail` se actualiza siempre, no solo en modo doble**, tanto en `insertLast` como en `delete`, eliminando la condición `this.doubly` en esas asignaciones específicas. Esto evita que el problema vuelva a aparecer aunque el usuario nunca presione el checkbox.

### Verificación

Insertar varios valores en modo simple, activar "Lista doble", y ejecutar "Recorrer atrás": el recorrido ahora visita todos los nodos en el orden correcto, de último a primero.

---

## 2. El canvas queda en blanco al redimensionar la ventana

### Diagnóstico

En `js/renderer.js`, el método `resize()` recalculaba el ancho y alto del `<canvas>` en cada evento `resize` de la ventana, pero nunca volvía a dibujar la estructura activa. Al cambiar las propiedades `width`/`height` de un elemento `<canvas>`, el navegador borra automáticamente su contenido. Como resultado, redimensionar la ventana del navegador dejaba el canvas vacío hasta que el usuario realizaba una nueva operación (insertar/eliminar).

**Causa raíz:** `Renderer` no tenía forma de saber qué estructura estaba activa en `main.js`, por lo que no podía volver a dibujar por sí solo tras un resize.

### Solución aplicada

**a) Se agregó un callback `onResize`** en el constructor de `Renderer`, que se ejecuta después de recalcular el tamaño del canvas:

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
```

**b) En `main.js`, se asignó `renderer.onResize` a la función `updateView()`** ya existente, justo después de crear la instancia de `Renderer`:

```javascript
renderer.onResize = () => updateView();
```

Con esto, cada resize recalcula el tamaño del canvas y de inmediato vuelve a dibujar la estructura que esté activa en ese momento, reutilizando la misma lógica de refresco que ya usa el resto de la aplicación.

### Verificación

Con cualquier estructura dibujada en pantalla, redimensionar la ventana del navegador ya no borra el contenido: el dibujo se recalcula y se muestra correctamente en el nuevo tamaño.

---

## Archivos modificados respecto a v2

| Archivo | Cambio |
|---|---|
| `js/list.js` | Nuevo método `_rebuildLinks()`; `setDoubly()` lo invoca; `tail` se actualiza siempre en `insertLast` y `delete`, no solo en modo doble |
| `js/renderer.js` | Nuevo campo `onResize` en el constructor; se invoca tras cada evento de `resize` |
| `js/main.js` | Se asigna `renderer.onResize = () => updateView()` tras crear el `Renderer` |
| `version2.md` | Sin cambios |
| `version3.md` | **(Nuevo)** Este documento |
