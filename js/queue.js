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
