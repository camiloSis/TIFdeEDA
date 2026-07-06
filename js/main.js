document.addEventListener('DOMContentLoaded', () => {
    const stack = new Stack();
    const queue = new Queue();
    const list = new LinkedList();
    const tree = new BinarySearchTree();

    const renderer = new Renderer('canvas');
    let currentStructure = 'stack';
    let animTimer = null;
    let animSteps = [];
    let animIndex = 0;

    const menuButtons = document.querySelectorAll('#menu button');
    const inputValue = document.getElementById('inputValue');
    const inputDeleteValue = document.getElementById('inputDeleteValue');
    const btnInsert = document.getElementById('btnInsert');
    const btnDelete = document.getElementById('btnDelete');
    const infoDisplay = document.getElementById('info-display');
    const queueSection = document.getElementById('queue-section');
    const inputPosition = document.getElementById('inputPosition');
    const inputQueueValue = document.getElementById('inputQueueValue');
    const btnInsertAt = document.getElementById('btnInsertAt');
    const btnRemoveAt = document.getElementById('btnRemoveAt');
    const listSection = document.getElementById('list-section');
    const btnInsertFirst = document.getElementById('btnInsertFirst');
    const btnInsertLast = document.getElementById('btnInsertLast');
    const inputListPos = document.getElementById('inputListPos');
    const inputListVal = document.getElementById('inputListVal');
    const btnInsertListAt = document.getElementById('btnInsertListAt');
    const btnDeleteListAt = document.getElementById('btnDeleteListAt');
    const btnTraverseFwd = document.getElementById('btnTraverseFwd');
    const btnTraverseBwd = document.getElementById('btnTraverseBwd');
    const chkDoubly = document.getElementById('chkDoubly');

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
                renderFn = () => renderer.drawList({ values: data, highlight: -1, doubly: list.getDoubly() });
                break;
            case 'tree':
                const root = tree.getRoot();
                renderFn = () => renderer.drawTree(root);
                break;
        }
        renderFn();
        updateInfoDisplay();
    }

    function updateInfoDisplay() {
        switch (currentStructure) {
            case 'stack':
                infoDisplay.textContent = `Top: ${stack.getTop()}`;
                break;
            case 'queue':
                infoDisplay.textContent = `Elementos: ${queue.size()}`;
                break;
            case 'list': {
                const vals = list.getAll();
                infoDisplay.textContent = `Nodos: ${vals.length}  |  Tipo: ${list.getDoubly() ? 'Doble' : 'Simple'}`;
                break;
            }
            case 'tree':
                infoDisplay.textContent = `Nodos: ${tree.inOrder().length}`;
                break;
        }
    }

    function getValue() {
        const val = parseInt(inputValue.value);
        if (isNaN(val)) {
            renderer.showExplanation('Por favor ingresa un número válido.');
            return null;
        }
        return val;
    }

    function getDeleteValue() {
        const val = parseInt(inputDeleteValue.value);
        if (isNaN(val)) {
            renderer.showExplanation('Por favor ingresa un número válido para eliminar.');
            return null;
        }
        return val;
    }

    // --- Step-by-step animation for list ---
    function stopAnimation() {
        if (animTimer) {
            clearInterval(animTimer);
            animTimer = null;
        }
        animSteps = [];
        animIndex = 0;
        enableAllButtons(true);
    }

    function enableAllButtons(enabled) {
        const allBtns = document.querySelectorAll('button');
        allBtns.forEach(b => b.disabled = !enabled);
    }

    function runSteps(steps) {
        stopAnimation();
        if (!steps || steps.length === 0) return;
        animSteps = steps;
        animIndex = 0;
        enableAllButtons(false);
        showStep(0);
        animTimer = setInterval(() => {
            animIndex++;
            if (animIndex >= animSteps.length) {
                stopAnimation();
                updateView();
                return;
            }
            showStep(animIndex);
        }, 900);
    }

    function showStep(idx) {
        const step = animSteps[idx];
        if (!step) return;
        renderer.drawList(step);
        renderer.showExplanation(step.message);
        // Update info with current values count
        if (step.values) {
            infoDisplay.textContent = `Nodos: ${step.values.length}  |  Tipo: ${list.getDoubly() ? 'Doble' : 'Simple'}  |  Paso ${idx + 1}/${animSteps.length}`;
        }
    }

    // --- selectStructure ---
    function selectStructure(name) {
        stopAnimation();
        currentStructure = name;
        menuButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.structure === name));

        inputDeleteValue.style.display = (name === 'list' || name === 'tree') ? 'inline-block' : 'none';
        queueSection.style.display = (name === 'queue') ? 'flex' : 'none';
        listSection.style.display = (name === 'list') ? 'flex' : 'none';

        if (name === 'list') {
            chkDoubly.checked = list.getDoubly();
        }

        renderer.showExplanation(`Estructura seleccionada: ${name}`);
        updateView();
    }

    // --- list step helpers ---
    function runListSteps(steps) {
        if (!steps || steps.length === 0) return;
        // Mark first step as the start
        runSteps(steps);
    }

    function listInsertFirst() {
        const val = parseInt(inputValue.value);
        if (isNaN(val)) { renderer.showExplanation('Ingresa un valor numérico.'); return; }
        const steps = list.insertFirst(val);
        runListSteps(steps);
        inputValue.value = '';
    }

    function listInsertLast() {
        const val = parseInt(inputValue.value);
        if (isNaN(val)) { renderer.showExplanation('Ingresa un valor numérico.'); return; }
        const steps = list.insertLast(val);
        runListSteps(steps);
        inputValue.value = '';
    }

    function listInsertAt() {
        const pos = parseInt(inputListPos.value);
        const val = parseInt(inputListVal.value);
        if (isNaN(pos) || isNaN(val)) { renderer.showExplanation('Ingresa posición y valor.'); return; }
        const steps = list.insertAt(pos, val);
        runListSteps(steps);
        inputListPos.value = '';
        inputListVal.value = '';
    }

    function listDelete() {
        const val = parseInt(inputDeleteValue.value);
        if (isNaN(val)) { renderer.showExplanation('Ingresa un valor a eliminar.'); return; }
        const steps = list.delete(val);
        runListSteps(steps);
        inputDeleteValue.value = '';
    }

    function listDeleteAt() {
        const pos = parseInt(inputListPos.value);
        if (isNaN(pos)) { renderer.showExplanation('Ingresa una posición.'); return; }
        const vals = list.getAll();
        if (pos < 0 || pos >= vals.length) {
            renderer.showExplanation(`Posición ${pos} fuera de rango.`);
            return;
        }
        const steps = list.delete(vals[pos]);
        runListSteps(steps);
        inputListPos.value = '';
    }

    function listTraverseFwd() {
        const steps = list.traverseForward();
        runListSteps(steps);
    }

    function listTraverseBwd() {
        if (!list.getDoubly()) {
            renderer.showExplanation('El recorrido inverso solo está disponible en lista doble. Activa "Lista doble".');
            return;
        }
        const steps = list.traverseBackward();
        runListSteps(steps);
    }

    // --- Event listeners ---
    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => selectStructure(btn.dataset.structure));
    });

    chkDoubly.addEventListener('change', () => {
        list.setDoubly(chkDoubly.checked);
        updateView();
        renderer.showExplanation(chkDoubly.checked ? 'Cambiado a Lista Doblemente Enlazada.' : 'Cambiado a Lista Simplemente Enlazada.');
    });

    btnInsert.addEventListener('click', () => {
        if (currentStructure === 'list') { listInsertLast(); return; }
        const value = getValue();
        if (value === null) return;
        let result;
        switch (currentStructure) {
            case 'stack': result = stack.push(value); break;
            case 'queue': result = queue.enqueue(value); break;
            case 'tree': result = tree.insert(value); break;
        }
        renderer.showExplanation(result.message);
        updateView();
        inputValue.value = '';
    });

    btnInsertAt.addEventListener('click', () => {
        if (currentStructure !== 'queue') return;
        const index = parseInt(inputPosition.value);
        const value = parseInt(inputQueueValue.value);
        if (isNaN(index) || isNaN(value)) {
            renderer.showExplanation('Ingresa una posición y un valor válidos.');
            return;
        }
        const result = queue.insertAt(index, value);
        renderer.showExplanation(result.message);
        updateView();
        inputPosition.value = '';
        inputQueueValue.value = '';
    });

    btnRemoveAt.addEventListener('click', () => {
        if (currentStructure !== 'queue') return;
        const index = parseInt(inputPosition.value);
        if (isNaN(index)) {
            renderer.showExplanation('Ingresa una posición válida.');
            return;
        }
        const result = queue.removeAt(index);
        renderer.showExplanation(result.message);
        updateView();
        inputPosition.value = '';
    });

    btnDelete.addEventListener('click', () => {
        if (currentStructure === 'list') { listDelete(); return; }
        let result;
        switch (currentStructure) {
            case 'stack': result = stack.pop(); break;
            case 'queue': result = queue.dequeue(); break;
            case 'tree': {
                const value = getDeleteValue();
                if (value === null) return;
                result = tree.delete(value);
                inputDeleteValue.value = '';
                break;
            }
        }
        renderer.showExplanation(result.message);
        updateView();
        inputValue.value = '';
    });

    // List-specific buttons
    btnInsertFirst.addEventListener('click', listInsertFirst);
    btnInsertLast.addEventListener('click', listInsertLast);
    btnInsertListAt.addEventListener('click', listInsertAt);
    btnDeleteListAt.addEventListener('click', listDeleteAt);
    btnTraverseFwd.addEventListener('click', listTraverseFwd);
    btnTraverseBwd.addEventListener('click', listTraverseBwd);

    // Inicializar
    selectStructure('stack');
});
