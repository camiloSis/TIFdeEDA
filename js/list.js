class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    insert(value) {
        const newNode = new ListNode(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
        return { action: 'insertar', value, message: `Se inserta el nodo con valor ${value} al final de la lista enlazada.` };
    }

    delete(value) {
        if (!this.head) {
            return { action: 'eliminar', value: null, message: 'La lista está vacía. No se puede eliminar.' };
        }
        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
            return { action: 'eliminar', value, message: `Se elimina el nodo con valor ${value} de la cabeza de la lista.` };
        }
        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }
        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return { action: 'eliminar', value, message: `Se elimina el nodo con valor ${value} de la lista enlazada.` };
        }
        return { action: 'eliminar', value: null, message: `No se encontró el valor ${value} en la lista.` };
    }

    isEmpty() {
        return this.size === 0;
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
}
