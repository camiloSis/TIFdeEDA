# Simulador de Estructuras de Datos - v1

## Descripción General

El simulador es una página web interactiva que permite visualizar y comprender el funcionamiento de cuatro estructuras de datos fundamentales: **Pila**, **Cola**, **Lista Enlazada** y **Árbol Binario de Búsqueda**. El usuario puede insertar y eliminar elementos mientras observa los cambios gráficos en tiempo real y lee una explicación textual del proceso.

---

## Archivos del Proyecto

```
EDA/
├── index.html          # Página principal (interfaz HTML)
├── css/
│   └── styles.css      # Estilos visuales de la página
├── js/
│   ├── main.js         # Controlador principal (coordina todo)
│   ├── stack.js        # Clase Stack (Pila)
│   ├── queue.js        # Clase Queue (Cola)
│   ├── list.js         # Clase LinkedList (Lista Enlazada)
│   ├── tree.js         # Clase BinarySearchTree (Árbol Binario)
│   └── renderer.js     # Dibujado en canvas + explicaciones
└── version1.md         # Este archivo
```

---

## Descripción de Cada Archivo

### 1. `index.html`
Página principal. Contiene la estructura HTML:
- Menú para seleccionar la estructura (Pila, Cola, Lista, Árbol).
- Campo de entrada numérica y botones Insertar/Eliminar.
- Elemento `<canvas>` donde se dibuja la estructura.
- Área de texto para la explicación.
- Carga todos los archivos JS en orden.

### 2. `css/styles.css`
Define la apariencia visual: colores, fuente, distribución, botones, contenedores, etc. Sin este archivo la página se vería sin formato.

### 3. `js/stack.js`
Define la clase `Stack`. Implementa una pila (LIFO) usando un arreglo interno. Métodos:
- `push(valor)` → agrega un elemento a la cima.
- `pop()` → elimina y devuelve el elemento de la cima.
- `getAll()` → devuelve copia del arreglo para dibujar.

### 4. `js/queue.js`
Define la clase `Queue`. Implementa una cola (FIFO) usando un arreglo interno. Métodos:
- `enqueue(valor)` → agrega un elemento al final.
- `dequeue()` → elimina y devuelve el elemento del frente.
- `getAll()` → devuelve copia del arreglo para dibujar.

### 5. `js/list.js`
Define las clases `ListNode` y `LinkedList`. Implementa una lista enlazada simple. Métodos:
- `insert(valor)` → agrega un nodo al final.
- `delete(valor)` → elimina el primer nodo que contenga ese valor.
- `getAll()` → devuelve arreglo con los valores en orden.
- `getHead()` → devuelve el primer nodo (usado internamente).

### 6. `js/tree.js`
Define las clases `TreeNode` y `BinarySearchTree`. Implementa un árbol binario de búsqueda (BST). Métodos:
- `insert(valor)` → inserta respetando la propiedad BST (menores a la izquierda, mayores a la derecha), generando una explicación paso a paso.
- `delete(valor)` → elimina un nodo manejando tres casos (hoja, un hijo, dos hijos con sucesor in-order).
- `getRoot()` → devuelve la raíz para dibujar el árbol.
- `inOrder()` → recorrido in-order (opcional).

### 7. `js/renderer.js`
Define la clase `Renderer`. Es la encargada de todo el dibujo en el `<canvas>`:
- `drawStack(items)` → dibuja elementos apilados verticalmente con una marca en la cima.
- `drawQueue(items)` → dibuja elementos en fila horizontal con marcas de frente y final.
- `drawList(items)` → dibuja nodos conectados por flechas, con marca `head`.
- `drawTree(root)` → dibuja el árbol con nodos circulares y aristas, calculando posiciones con recorrido DFS.
- `showExplanation(mensaje)` → muestra el texto explicativo en el área correspondiente.

### 8. `js/main.js`
Controlador principal. Conecta todos los módulos:
- Escucha eventos del DOM (clic en menú, botones Insertar/Eliminar).
- Según la estructura seleccionada, llama al método correspondiente de la clase (Stack, Queue, LinkedList, BinarySearchTree).
- Toma el resultado (valor y mensaje), actualiza el canvas mediante `Renderer` y muestra la explicación.

---

## Flujo de Funcionamiento

1. El usuario abre `index.html` en un navegador.
2. Hace clic en una estructura del menú (ej: "Pila").
3. Escribe un número y presiona **Insertar** o **Eliminar**.
4. `main.js` recibe el evento y llama al método adecuado de la clase (ej: `stack.push(5)`).
5. La clase ejecuta la operación y devuelve un objeto `{ action, value, message }`.
6. `main.js` pasa el mensaje a `renderer.showExplanation()` y llama al método de dibujo correspondiente.
7. `Renderer` limpia el canvas y redibuja la estructura con los datos actualizados.
8. El usuario ve el cambio gráfico y la explicación del algoritmo.

---

## Tecnologías Usadas

- **HTML5** – estructura de la página.
- **CSS3** – estilos visuales.
- **JavaScript (ES6+)** – lógica del simulador.
- **Canvas API** – dibujo de las estructuras.
- **Git/GitHub** – control de versiones.

---

## Notas para el Grupo

- Cada archivo JS es independiente: se puede modificar sin afectar los demás.
- `main.js` es el único que conoce a los demás; las clases de datos (Stack, Queue, etc.) no dependen de nada externo.
- Para agregar una nueva estructura (ej: Lista Doblemente Enlazada o Árbol AVL), basta con crear su archivo JS, agregarlo al HTML e integrarlo en `main.js`.
