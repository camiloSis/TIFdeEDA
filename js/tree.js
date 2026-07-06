class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new TreeNode(value);
        if (!this.root) {
            this.root = newNode;
            return { action: 'insertar', value, message: `Se inserta ${value} como raíz del árbol.` };
        }
        let current = this.root;
        let steps = `Insertando ${value}: `;
        while (true) {
            if (value < current.value) {
                steps += `${value} < ${current.value} → va al subárbol izquierdo. `;
                if (!current.left) {
                    current.left = newNode;
                    steps += `Se inserta ${value} como hijo izquierdo de ${current.value}.`;
                    return { action: 'insertar', value, message: steps };
                }
                current = current.left;
            } else if (value > current.value) {
                steps += `${value} > ${current.value} → va al subárbol derecho. `;
                if (!current.right) {
                    current.right = newNode;
                    steps += `Se inserta ${value} como hijo derecho de ${current.value}.`;
                    return { action: 'insertar', value, message: steps };
                }
                current = current.right;
            } else {
                return { action: 'insertar', value, message: `El valor ${value} ya existe en el árbol.` };
            }
        }
    }

    delete(value) {
        const result = { action: 'eliminar', value, message: '' };
        let steps = `Eliminando ${value}: `;

        const deleteRec = (node, val) => {
            if (!node) {
                result.message = `No se encontró el valor ${value} en el árbol.`;
                return null;
            }
            if (val < node.value) {
                steps += `${val} < ${node.value} → buscar en izquierdo. `;
                node.left = deleteRec(node.left, val);
                return node;
            } else if (val > node.value) {
                steps += `${val} > ${node.value} → buscar en derecho. `;
                node.right = deleteRec(node.right, val);
                return node;
            } else {
                // Nodo encontrado
                if (!node.left && !node.right) {
                    steps += `Se elimina el nodo hoja ${val}.`;
                    return null;
                }
                if (!node.left) {
                    steps += `Se reemplaza ${val} con su hijo derecho.`;
                    return node.right;
                }
                if (!node.right) {
                    steps += `Se reemplaza ${val} con su hijo izquierdo.`;
                    return node.left;
                }
                // Dos hijos: encontrar el sucesor in-order
                let successor = node.right;
                while (successor.left) {
                    successor = successor.left;
                }
                steps += `Se reemplaza ${val} con el sucesor in-order ${successor.value}. `;
                node.value = successor.value;
                node.right = deleteRec(node.right, successor.value);
                return node;
            }
        };

        this.root = deleteRec(this.root, value);
        if (!result.message) {
            result.message = steps || `Se eliminó el valor ${value} del árbol.`;
        }
        return result;
    }

    isEmpty() {
        return this.root === null;
    }

    getRoot() {
        return this.root;
    }

    inOrder(node = this.root, result = []) {
        if (node) {
            this.inOrder(node.left, result);
            result.push(node.value);
            this.inOrder(node.right, result);
        }
        return result;
    }
}
