document.addEventListener('DOMContentLoaded', () => {
    const stack = new Stack();
    const queue = new Queue();
    const list = new LinkedList();
    const tree = new BinarySearchTree();

    const renderer = new Renderer('canvas');
    let currentStructure = 'stack';

    const menuButtons = document.querySelectorAll('#menu button');
    const inputValue = document.getElementById('inputValue');
    const btnInsert = document.getElementById('btnInsert');
    const btnDelete = document.getElementById('btnDelete');

    function updateView() {
        let data, renderFn;
        switch (currentStructure) {
            case 'stack':
                data = stack.getAll();
                renderFn = () => renderer.drawStack(data);
                break;
            case 'queue':
                data = queue.getAll();
                renderFn = () => renderer.drawQueue(data);
                break;
            case 'list':
                data = list.getAll();
                renderFn = () => renderer.drawList(data);
                break;
            case 'tree':
                const root = tree.getRoot();
                renderFn = () => renderer.drawTree(root);
                break;
        }
        renderFn();
    }

    function getValue() {
        const val = parseInt(inputValue.value);
        if (isNaN(val)) {
            renderer.showExplanation('Por favor ingresa un número válido.');
            return null;
        }
        return val;
    }

    function selectStructure(name) {
        currentStructure = name;
        menuButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.structure === name));
        renderer.showExplanation(`Estructura seleccionada: ${name}`);
        updateView();
    }

    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => selectStructure(btn.dataset.structure));
    });

    btnInsert.addEventListener('click', () => {
        const value = getValue();
        if (value === null) return;

        let result;
        switch (currentStructure) {
            case 'stack':
                result = stack.push(value);
                break;
            case 'queue':
                result = queue.enqueue(value);
                break;
            case 'list':
                result = list.insert(value);
                break;
            case 'tree':
                result = tree.insert(value);
                break;
        }
        renderer.showExplanation(result.message);
        updateView();
        inputValue.value = '';
    });

    btnDelete.addEventListener('click', () => {
        let result;
        switch (currentStructure) {
            case 'stack':
                result = stack.pop();
                break;
            case 'queue':
                result = queue.dequeue();
                break;
            case 'list': {
                const value = getValue();
                if (value === null) return;
                result = list.delete(value);
                break;
            }
            case 'tree': {
                const value = getValue();
                if (value === null) return;
                result = tree.delete(value);
                break;
            }
        }
        renderer.showExplanation(result.message);
        updateView();
        inputValue.value = '';
    });

    // Inicializar con pila
    selectStructure('stack');
});
