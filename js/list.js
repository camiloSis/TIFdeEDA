class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.doubly = false;
    }

    setDoubly(val) {
        this.doubly = val;
        this._rebuildLinks();
    }

    _rebuildLinks() {
        // Recalcula prev (solo si doubly) y tail (siempre) recorriendo la lista completa
        let current = this.head;
        let prev = null;
        while (current) {
            current.prev = this.doubly ? prev : null;
            prev = current;
            current = current.next;
        }
        this.tail = prev;
    }

    getDoubly() {
        return this.doubly;
    }

    getAll() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }

    getHead() {
        return this.head;
    }

    getTail() {
        return this.tail;
    }

    isEmpty() {
        return this.size === 0;
    }

    clearSteps() {}

    // --- insertFirst ---
    insertFirst(value) {
        const steps = [];
        const currentVals = this.getAll();

        if (this.size === 0) {
            steps.push({
                message: `La lista está vacía. Se crea un nuevo nodo con valor ${value}.`,
                values: [], highlight: -1, doubly: this.doubly,
                floatingValue: value, floatingLabel: 'nuevo'
            });
            this.head = new ListNode(value);
            this.tail = this.head;
            this.size++;
            steps.push({
                message: `El nuevo nodo ${value} es el primer y único elemento. Head → ${value}.`,
                values: this.getAll(), highlight: 0, highlightColor: '#2d6a4f', doubly: this.doubly
            });
            return steps;
        }

        const oldHeadVal = currentVals[0];
        steps.push({
            message: `Paso 1: Se crea un nuevo nodo con valor ${value}.`,
            values: currentVals, highlight: -1, doubly: this.doubly,
            floatingValue: value, floatingLabel: 'nuevo'
        });

        const newNode = new ListNode(value);
        newNode.next = this.head;
        if (this.doubly) {
            this.head.prev = newNode;
        }
        this.head = newNode;
        this.size++;

        steps.push({
            message: `Paso 2: El puntero next del nuevo nodo ${value} apunta al antiguo primer nodo (${oldHeadVal}).`,
            values: this.getAll(), highlight: 0, highlightColor: '#ffd700', doubly: this.doubly,
            extraLabel: `next → ${oldHeadVal}`
        });

        steps.push({
            message: `Paso 3: Head se actualiza para apuntar al nuevo nodo ${value}. Ahora ${value} es el primer elemento.`,
            values: this.getAll(), highlight: 0, highlightColor: '#2d6a4f', doubly: this.doubly
        });
        return steps;
    }

    // --- insertLast ---
    insertLast(value) {
        const steps = [];
        const currentVals = this.getAll();

        if (this.size === 0) {
            return this.insertFirst(value);
        }

        steps.push({
            message: `Se va a insertar ${value} al final. Recorriendo la lista hasta el último nodo...`,
            values: currentVals, highlight: -1, doubly: this.doubly
        });

        let current = this.head;
        let idx = 0;
        while (current.next) {
            steps.push({
                message: `Visitando nodo [${idx}] = ${current.value}. Tiene next → ${current.next ? current.next.value : 'NULL'}. Avanzando...`,
                values: currentVals, highlight: idx, highlightColor: '#ffd700', doubly: this.doubly
            });
            current = current.next;
            idx++;
        }
        steps.push({
            message: `Llegamos al último nodo [${idx}] = ${current.value}. Su next es NULL.`,
            values: currentVals, highlight: idx, highlightColor: '#ffd700', doubly: this.doubly
        });

    const newNode = new ListNode(value);
        current.next = newNode;
        if (this.doubly) {
            newNode.prev = current;
            }
        this.tail = newNode;
        this.size++;

        const finalVals = this.getAll();
        steps.push({
            message: `Se enlaza el nuevo nodo ${value} al final. El next del nodo [${idx}] ahora apunta a ${value}.`,
            values: finalVals, highlight: finalVals.length - 1, highlightColor: '#2d6a4f', doubly: this.doubly
        });
        return steps;
    }

    // --- insertAt ---
    insertAt(index, value) {
        if (index < 0 || index > this.size) {
            return [{
                message: `Índice ${index} fuera de rango. Debe estar entre 0 y ${this.size}.`,
                values: this.getAll(), highlight: -1, doubly: this.doubly
            }];
        }
        if (index === 0) return this.insertFirst(value);
        if (index === this.size) return this.insertLast(value);

        const steps = [];
        const currentVals = this.getAll();

        steps.push({
            message: `Insertar ${value} en posición [${index}]. Recorriendo hasta el nodo anterior a la posición deseada...`,
            values: currentVals, highlight: -1, doubly: this.doubly
        });

        let current = this.head;
        let idx = 0;
        while (idx < index - 1) {
            steps.push({
                message: `Visitando nodo [${idx}] = ${current.value}. Avanzando al siguiente...`,
                values: currentVals, highlight: idx, highlightColor: '#ffd700', doubly: this.doubly
            });
            current = current.next;
            idx++;
        }
        steps.push({
            message: `Estamos en el nodo [${idx}] = ${current.value}. Su next apunta a ${current.next.value} (posición [${index}]). Aquí insertaremos el nuevo nodo.`,
            values: currentVals, highlight: idx, highlightColor: '#ffd700', doubly: this.doubly
        });

        const newNode = new ListNode(value);
        newNode.next = current.next;
        if (this.doubly) {
            newNode.prev = current;
            current.next.prev = newNode;
        }
        current.next = newNode;
        this.size++;

        const finalVals = this.getAll();
        steps.push({
            message: `Se inserta el nuevo nodo ${value} entre [${idx}] = ${current.value} y el antiguo nodo en [${idx+1}]. Los punteros se re-enlazan.`,
            values: finalVals, highlight: finalVals.indexOf(value), highlightColor: '#2d6a4f', doubly: this.doubly
        });
        return steps;
    }

    // --- delete ---
    delete(value) {
        const steps = [];
        const currentVals = this.getAll();

        if (!this.head) {
            steps.push({
                message: 'La lista está vacía. No se puede eliminar.',
                values: [], highlight: -1, doubly: this.doubly
            });
            return steps;
        }

        // Traverse searching
        let current = this.head;
        let idx = 0;
        while (current && current.value !== value) {
            steps.push({
                message: `Visitando nodo [${idx}] = ${current.value}. No es ${value}. Avanzando...`,
                values: currentVals, highlight: idx, highlightColor: '#ffd700', doubly: this.doubly
            });
            current = current.next;
            idx++;
        }

        if (!current) {
            steps.push({
                message: `No se encontró el valor ${value} en la lista.`,
                values: currentVals, highlight: -1, doubly: this.doubly
            });
            return steps;
        }

        // Found it
        steps.push({
            message: `¡Encontrado! Nodo [${idx}] = ${value}. Se procede a eliminar.`,
            values: currentVals, highlight: idx, highlightColor: '#e94560', doubly: this.doubly,
            markDeleted: idx
        });

        const prevNode = current.prev; // for doubly
        if (idx === 0) {
            this.head = current.next;
            if (this.doubly && this.head) this.head.prev = null;
            if (!this.head) this.tail = null;
        } else {
            const before = this._getNodeAt(idx - 1);
            before.next = current.next;
            if (this.doubly && current.next) {
                current.next.prev = before;
            }
            if (!current.next) {
                this.tail = before;
            }
        }
        this.size--;

        steps.push({
            message: `Se re-enlazan los punteros: el nodo anterior salta por encima del nodo ${value} y apunta directamente al siguiente.`,
            values: this.getAll(), highlight: Math.min(idx, this.size - 1), highlightColor: '#2d6a4f', doubly: this.doubly,
            fadeIdx: Math.min(idx, this.size)
        });

        if (this.doubly) {
            steps.push({
                message: `En lista doble también se actualiza el puntero prev del nodo siguiente. El nodo ${value} queda desconectado de la estructura.`,
                values: this.getAll(), highlight: -1, doubly: this.doubly
            });
        }

        return steps;
    }

    // --- traverseForward ---
    traverseForward() {
        const steps = [];
        if (!this.head) {
            steps.push({ message: 'La lista está vacía.', values: [], highlight: -1, doubly: this.doubly });
            return steps;
        }
        let current = this.head;
        let idx = 0;
        while (current) {
            steps.push({
                message: `Visitando nodo [${idx}] = ${current.value}. ${current.next ? 'Apuntando al siguiente...' : 'Fin de la lista (NULL).'}`,
                values: this.getAll(), highlight: idx, highlightColor: '#3498db', doubly: this.doubly
            });
            current = current.next;
            idx++;
        }
        steps.push({
            message: 'Recorrido completado. Se visitaron todos los nodos hacia adelante.',
            values: this.getAll(), highlight: -1, doubly: this.doubly
        });
        return steps;
    }

    // --- traverseBackward (solo doble) ---
    traverseBackward() {
        const steps = [];
        if (!this.tail) {
            steps.push({ message: 'La lista está vacía.', values: [], highlight: -1, doubly: this.doubly });
            return steps;
        }
        let current = this.tail;
        let idx = this.size - 1;
        while (current) {
            steps.push({
                message: `Visitando nodo [${idx}] = ${current.value} (recorriendo hacia atrás). ${current.prev ? 'Apuntando al anterior...' : 'Inicio de la lista (NULL).'}`,
                values: this.getAll(), highlight: idx, highlightColor: '#9b59b6', doubly: this.doubly
            });
            current = current.prev;
            idx--;
        }
        steps.push({
            message: 'Recorrido inverso completado. Se visitaron todos los nodos hacia atrás.',
            values: this.getAll(), highlight: -1, doubly: this.doubly
        });
        return steps;
    }

    _getNodeAt(index) {
        let current = this.head;
        let i = 0;
        while (current && i < index) {
            current = current.next;
            i++;
        }
        return current;
    }
}
