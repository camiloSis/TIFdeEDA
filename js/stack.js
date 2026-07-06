class Stack {
    constructor() {
        this.items = [];
    }

    push(value) {
        this.items.push(value);
        return { action: 'insertar', value, message: `Se apila el elemento ${value} en la cima de la pila.` };
    }

    pop() {
        if (this.isEmpty()) {
            return { action: 'eliminar', value: null, message: 'La pila está vacía. No se puede desapilar.' };
        }
        const value = this.items.pop();
        return { action: 'eliminar', value, message: `Se desapila el elemento ${value} de la cima de la pila.` };
    }

    peek() {
        return this.items[this.items.length - 1];
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
