class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(value) {
        this.items.push(value);
        return { action: 'insertar', value, message: `Se encola el elemento ${value} al final de la cola.` };
    }

    dequeue() {
        if (this.isEmpty()) {
            return { action: 'eliminar', value: null, message: 'La cola está vacía. No se puede desencolar.' };
        }
        const value = this.items.shift();
        return { action: 'eliminar', value, message: `Se desencola el elemento ${value} del frente de la cola.` };
    }

    insertAt(index, value) {
        if (index < 0 || index > this.items.length) {
            return { action: 'insertar', value, message: `Índice ${index} fuera de rango. La posición debe estar entre 0 y ${this.items.length}.` };
        }
        this.items.splice(index, 0, value);
        return { action: 'insertar', value, message: `Se inserta ${value} en la posición [${index}]. Los elementos desde [${index}] se desplazan a la derecha.` };
    }

    removeAt(index) {
        if (this.isEmpty()) {
            return { action: 'eliminar', value: null, message: 'La cola está vacía. No se puede eliminar.' };
        }
        if (index < 0 || index >= this.items.length) {
            return { action: 'eliminar', value: null, message: `Índice ${index} fuera de rango. Debe estar entre 0 y ${this.items.length - 1}.` };
        }
        const value = this.items.splice(index, 1)[0];
        return { action: 'eliminar', value, message: `Se elimina el elemento ${value} de la posición [${index}]. Los elementos se desplazan a la izquierda.` };
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    getAll() {
        return [...this.items];
    }
}
