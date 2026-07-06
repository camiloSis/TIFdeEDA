# Simulador de Estructuras de Datos - v2

## Cambios respecto a v1

Este documento detalla todos los cambios realizados desde la versión 1, incluyendo las observaciones que motivaron cada modificación.

---

## 1. Pila (Stack)

### Observación
> *"En el apartado de pila, pon el input 'valor' e insertar lejos de Eliminar, ya que si el valor sigue admitiendo datos, el usuario podría pensar que al insertar un valor ese mismo se eliminará, cuando en realidad sigue el principio LIFO. Por ello se debe diseñar el botón 'eliminar' apartado de los botones insertar y 'valor'. También me gustaría que se indique el tope (top) que al no haber nada, empiece con -1, luego 0, 1, 2... si se le agregan elementos. Esto con el fin de visualizar de mejor manera esta estructura de datos."*

### Cambios realizados

#### HTML (`index.html`)
- Se dividieron los controles en dos secciones visuales separadas: `#insert-section` (input valor + botón Insertar) y `#delete-section` (input valor a eliminar + botón Eliminar), con un gap amplio entre ellas.
- Se agregó `#info-display` para mostrar información dinámica de la estructura.

#### CSS (`css/styles.css`)
- Cada sección de controles tiene su propio fondo, borde y padding para diferenciarlas visualmente.
- El botón Insertar es de color verde (`#2d6a4f`) y el botón Eliminar es rojo (`#e94560`).
- El input de eliminar (`#inputDeleteValue`) está oculto por defecto y solo se muestra cuando la estructura lo requiere.

#### JavaScript — `js/stack.js`
- Nuevo método `getTop()` que devuelve el índice de la cima: `-1` cuando la pila está vacía, `0` con un elemento, `1` con dos, etc.

#### JavaScript — `js/renderer.js` — `drawStack()`
- Cada elemento de la pila ahora muestra su índice `[i]` a la izquierda del bloque.
- La cima se marca con `← cima (top)` en color dorado.

#### JavaScript — `js/main.js`
- El input de valor a eliminar (`#inputDeleteValue`) solo se muestra para Lista y Árbol (que necesitan un valor para eliminar). Para Pila y Cola permanece oculto.
- `#info-display` se actualiza dinámicamente mostrando `Top: X` cuando la Pila está seleccionada.

---

## 2. Cola (Queue)

### Observación
> *"El diseño y funcionamiento es correcto pero simple, no muestra cómo se aplicarían los métodos insertAt() ni removeAt(). Considera añadir estos 2 últimos y que si es necesario, la interfaz gráfica para el apartado de 'Cola' cambie, ya que el diseño está bien, pero los métodos como insertAt() requieren de una posición y por lo tanto de un input al que el usuario debe ingresar un valor si es que quiere usar ese método."*

### Cambios realizados

#### JavaScript — `js/queue.js`
- Nuevo método `insertAt(index, value)`: inserta un valor en la posición especificada usando `splice()`. Desplaza los elementos existentes a la derecha. Valida que el índice esté entre 0 y la longitud actual.
- Nuevo método `removeAt(index)`: elimina y devuelve el elemento en la posición especificada usando `splice()`. Desplaza los elementos a la izquierda. Valida el índice.
- Ambos métodos devuelven mensajes explicativos detallados.

#### HTML (`index.html`)
- Nueva sección `#queue-section` con:
  - Input de **posición** (`#inputPosition`)
  - Input de **valor** (`#inputQueueValue`)
  - Botón **"Insertar en posición"** (`#btnInsertAt`)
  - Botón **"Eliminar en posición"** (`#btnRemoveAt`)

#### CSS (`css/styles.css`)
- `#queue-section` oculta por defecto (`display: none`).
- Botones con colores diferenciados para insertar y eliminar.

#### JavaScript — `js/main.js`
- Al seleccionar **Cola**, se muestra `#queue-section` con los controles de posición; al seleccionar otra estructura, se oculta.
- Manejadores para `btnInsertAt` y `btnRemoveAt` que leen posición + valor y ejecutan las operaciones.
- Los botones básicos Insertar/Eliminar siguen funcionando como `enqueue`/`dequeue`.

#### JavaScript — `js/renderer.js` — `drawQueue()`
- Cada elemento ahora muestra su índice `[i]` sobre el bloque.
- Se agregaron etiquetas `← frente (front)` y `(back) final →` para identificar extremos.
- Flechas más claras entre elementos.

---

## 3. Lista (Lista Enlazada)

### Observación
> *"Para que la simulación realmente ayude a la comprensión del usuario, la página web debería mostrar los siguientes detalles cuando se hace una operación sobre una lista enlazada:*

> *- Cada nodo debe representarse visualmente como una caja dividida en dos partes: una para el dato y otra para el puntero. En la lista simple, cada nodo tiene una sola flecha saliente hacia el siguiente nodo. En la lista doble, cada nodo debe mostrar dos flechas.*

> *- Es importante que la página muestre explícitamente los punteros especiales de la estructura, como la cabeza (head) que apunta al primer nodo, y en el caso de la doble, también la cola (tail) que apunta al último. Cuando estos punteros son NULL, conviene mostrarlo con una flecha que termina en una barra diagonal o en la palabra 'NULL'.*

> *- Cuando se inserta un nodo, la simulación debería mostrar el proceso en pasos separados en vez de un solo salto instantáneo. Por ejemplo, para insertar al inicio: primero se crea el nuevo nodo, luego se dibuja la flecha del nuevo nodo hacia el que antes era el primero, y finalmente se mueve head para que apunte al nuevo nodo.*

> *- Para insertar en medio o al final, la simulación debería mostrar el recorrido de los punteros paso a paso hasta llegar a la posición deseada, resaltando visualmente el nodo que está siendo 'visitado' en cada momento.*

> *- Cuando se elimina un nodo, es importante mostrar visualmente el re-enlace de punteros: cómo el nodo anterior deja de apuntar al nodo eliminado y pasa a apuntar directamente al siguiente. En la lista doble, además hay que mostrar cómo se actualiza el puntero 'anterior' del nodo siguiente. Es buena práctica mostrar el nodo eliminado con algún efecto visual.*

> *- Si tu grupo decide simular también la doble enlazada, un buen valor agregado sería mostrar cómo, gracias al segundo puntero, se puede recorrer la lista en ambas direcciones, tal vez con un botón que permita al usuario elegir 'recorrer hacia adelante' o 'recorrer hacia atrás' y ver cómo cambia el resaltado de nodo en nodo según la dirección elegida."*

### Cambios realizados

#### JavaScript — `js/list.js` — Rediseño completo

**Clase `ListNode`:**
- Nuevo atributo `prev` para soportar lista doblemente enlazada.

**Clase `LinkedList`:**
- Nuevo atributo `tail` para el puntero al último nodo (útil en lista doble).
- Nueva propiedad `doubly` y método `setDoubly(val)` para alternar entre simple/doble.
- Todos los métodos de modificación (`insertFirst`, `insertLast`, `insertAt`, `delete`) ahora devuelven **arrays de pasos**, donde cada paso contiene:
  - `message`: texto explicativo del paso.
  - `values`: arreglo de valores de la lista en ese estado.
  - `highlight`: índice del nodo resaltado.
  - `highlightColor`: color del resaltado.
  - `doubly`: si la lista es doble.
  - `floatingValue` / `floatingLabel`: muestra un nodo flotante (nuevo) fuera de la lista.
  - `markDeleted`: índice del nodo marcado como eliminado.
- Nuevos métodos de recorrido didáctico:
  - `traverseForward()`: recorre la lista de principio a fin resaltando cada nodo visitado.
  - `traverseBackward()`: recorre la lista de fin a principio (solo en modo doble).

**Detalle de pasos por operación:**

| Operación | Pasos generados |
|---|---|
| `insertFirst(v)` | 1. Crear nuevo nodo (flotante). 2. Enlazar next al antiguo head. 3. Actualizar head. |
| `insertLast(v)` | 1. Iniciar recorrido. 2-3. Visitar cada nodo hasta el último. 4. Enlazar nuevo nodo al final. |
| `insertAt(i, v)` | 1. Recorrer hasta nodo anterior. 2. Insertar y re-enlazar punteros. |
| `delete(v)` | 1-2. Recorrer buscando valor. 3. Marcar nodo encontrado (rojo). 4. Re-enlazar punteros. 5. (Doble) Actualizar prev del siguiente. |
| `traverseForward()` | Visitar cada nodo en orden con resaltado azul. |
| `traverseBackward()` | Visitar cada nodo en orden inverso con resaltado violeta. |

#### JavaScript — `js/renderer.js` — Nueva `drawList()`

**Nodo visual:**
- **Lista simple**: cada nodo es un rectángulo dividido en dos secciones:
  - Izquierda: valor (fondo verde).
  - Derecha: puntero next (fondo gris oscuro con un círculo pequeño).
- **Lista doble**: cada nodo dividido en tres secciones:
  - Izquierda: puntero prev.
  - Centro: valor.
  - Derecha: puntero next.

**Flechas:**
- Flecha `next` entre nodos en negro sólido con etiqueta "next".
- Flecha `prev` (solo doble) en púrpura punteada con etiqueta "prev".

**Punteros especiales:**
- Etiqueta `head →` en naranja con flecha apuntando al primer nodo.
- Etiqueta `← tail` en púrpura con flecha apuntando al último nodo (solo doble).
- **NULL** visible al final (y al inicio en doble) con texto rojo y barra diagonal.

**Nodo flotante:**
- Cuando se crea un nuevo nodo antes de insertarlo, se dibuja aparte con borde punteado amarillo y etiqueta "nuevo".

**Colores de resaltado:**
- Amarillo (`#ffd700`): nodo visitado durante recorrido.
- Verde (`#2d6a4f`): nodo insertado.
- Rojo (`#e94560`): nodo a eliminar.
- Azul (`#3498db`): recorrido hacia adelante.
- Violeta (`#9b59b6`): recorrido hacia atrás.

#### HTML (`index.html`) — Nueva `#list-section`
```
[Insertar al inicio] [Insertar al final]
[Posición] [Valor] [Insertar en posición] [Eliminar en posición]
[→ Recorrer adelante] [← Recorrer atrás]
[☐ Lista doble]
```

#### CSS (`css/styles.css`)
- `#list-section` oculta por defecto.
- Botones con colores específicos: verde para insertar, rojo para eliminar, azul para recorrido adelante, violeta para recorrido atrás.
- Checkbox con estilo inline para el toggle de lista doble.

#### JavaScript — `js/main.js` — Sistema de animación por pasos

- Nueva función `runSteps(steps)`: ejecuta la secuencia de pasos con un intervalo de **900ms** entre cada uno.
- Durante la animación, **todos los botones se deshabilitan** para evitar operaciones concurrentes.
- Cada paso renderiza el estado visual (`drawList`) y muestra el mensaje explicativo + contador "Paso X/N".
- Función `stopAnimation()`: limpia el intervalo y re-habilita los botones.
- Cuando se cambia de estructura, la animación se detiene automáticamente.
- Event listeners para los nuevos botones de lista (`btnInsertFirst`, `btnInsertLast`, `btnInsertListAt`, `btnDeleteListAt`, `btnTraverseFwd`, `btnTraverseBwd`).
- El checkbox `chkDoubly` alterna la propiedad `doubly` de la lista y actualiza la vista.

---

## Archivos modificados respecto a v1

| Archivo | Cambio |
|---|---|
| `index.html` | Controles divididos en secciones; nuevas secciones para Cola y Lista |
| `css/styles.css` | Estilos para secciones separadas, colores por operación, list-section, info-display |
| `js/stack.js` | Nuevo método `getTop()` |
| `js/queue.js` | Nuevos métodos `insertAt()` y `removeAt()` |
| `js/list.js` | **Reescritura completa**: paso a paso, doble enlace, recorridos |
| `js/renderer.js` | **Reescritura de `drawList()`**: nodos con punteros, head/tail/NULL, flotante; `drawQueue()` con índices |
| `js/main.js` | **Reescritura**: sistema de animación, controles dinámicos por estructura, nuevos eventos |
| `version1.md` | Sin cambios |
| `version2.md` | **(Nuevo)** Este documento |

---

## Resumen de funcionalidades por estructura (v2)

| Estructura | Operaciones | Visualización |
|---|---|---|
| **Pila** | push, pop | Elementos apilados verticalmente, índices `[i]`, marca `cima (top)`, indicador `Top: X` |
| **Cola** | enqueue, dequeue, insertAt, removeAt | Elementos en fila horizontal, índices `[i]`, marcas `frente`/`final` |
| **Lista Simple** | insertFirst, insertLast, insertAt, delete, traverseForward | Nodos `[dato | puntero]`, flechas next, head, NULL, animación paso a paso |
| **Lista Doble** | (las anteriores) + traverseBackward | Nodos `[prev | dato | next]`, flechas next + prev, head + tail, NULL en ambos extremos |
| **Árbol Binario** | insert, delete | Sin cambios respecto a v1 |
