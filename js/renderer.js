class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width || 800;
        this.canvas.height = rect.height || 350;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStack(items) {
        this.clear();
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const boxW = 80;
        const boxH = 40;
        const startY = h - 40;
        const gap = 5;

        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 2;

        items.forEach((val, i) => {
            const y = startY - i * (boxH + gap);
            const x = w / 2 - boxW / 2;

            ctx.fillStyle = '#e94560';
            ctx.strokeRect(x, y, boxW, boxH);
            ctx.fillRect(x, y, boxW, boxH);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x + boxW / 2, y + boxH / 2);

            if (i === items.length - 1) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '12px sans-serif';
                ctx.fillText('← cima', x + boxW + 10, y + boxH / 2);
            }
        });

        // Dibujar base
        ctx.fillStyle = '#16213e';
        ctx.fillRect(w / 2 - 50, startY + boxH + 5, 100, 8);
    }

    drawQueue(items) {
        this.clear();
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const boxW = 70;
        const boxH = 50;
        const gap = 8;
        const totalW = items.length * (boxW + gap) - gap;
        const startX = w / 2 - totalW / 2;
        const y = h / 2 - boxH / 2;

        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 2;

        items.forEach((val, i) => {
            const x = startX + i * (boxW + gap);

            ctx.fillStyle = '#0f3460';
            ctx.strokeRect(x, y, boxW, boxH);
            ctx.fillRect(x, y, boxW, boxH);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x + boxW / 2, y + boxH / 2);

            if (i === 0) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '12px sans-serif';
                ctx.fillText('← frente', x, y - 15);
            }
            if (i === items.length - 1) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '12px sans-serif';
                ctx.fillText('← final', x + boxW, y - 15);
            }
        });

        // Flechas entre elementos
        ctx.fillStyle = '#16213e';
        for (let i = 0; i < items.length - 1; i++) {
            const x1 = startX + (i + 1) * (boxW + gap) - gap / 2;
            const arrowY = y + boxH / 2;
            ctx.beginPath();
            ctx.moveTo(x1 - 5, arrowY);
            ctx.lineTo(x1 + 5, arrowY);
            ctx.lineTo(x1, arrowY - 5);
            ctx.moveTo(x1 + 5, arrowY);
            ctx.lineTo(x1, arrowY + 5);
            ctx.stroke();
        }
    }

    drawList(list) {
        this.clear();
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const boxW = 70;
        const boxH = 50;
        const gap = 80;
        const totalW = list.length * (boxW + gap) - gap;
        const startX = w / 2 - totalW / 2;
        const y = h / 2 - boxH / 2;

        list.forEach((val, i) => {
            const x = startX + i * (boxW + gap);

            // Nodo (valor)
            ctx.fillStyle = '#2d6a4f';
            ctx.strokeRect(x, y, boxW, boxH);
            ctx.fillRect(x, y, boxW, boxH);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x + boxW / 2, y + boxH / 2);

            // Flecha al siguiente
            if (i < list.length - 1) {
                const fx = x + boxW;
                const fy = y + boxH / 2;
                const tx = x + boxW + gap;
                ctx.strokeStyle = '#16213e';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(fx, fy);
                ctx.lineTo(tx - 10, fy);
                ctx.stroke();
                // Punta de flecha
                ctx.beginPath();
                ctx.moveTo(tx - 5, fy - 5);
                ctx.lineTo(tx, fy);
                ctx.lineTo(tx - 5, fy + 5);
                ctx.stroke();
            }

            // Etiqueta "head" en el primero
            if (i === 0) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '12px sans-serif';
                ctx.fillText('head', x + boxW / 2, y - 15);
            }
        });
    }

    drawTree(root) {
        this.clear();
        if (!root) return;
        const ctx = this.ctx;
        const w = this.canvas.width;

        const levelHeight = 70;
        const nodeRadius = 24;
        const maxDepth = this._maxDepth(root);
        const positions = [];

        const dfs = (node, depth, left, right) => {
            if (!node) return null;
            const mid = (left + right) / 2;
            const x = mid;
            const y = 60 + depth * levelHeight;
            positions.push({ node, x, y, depth });
            const leftChild = dfs(node.left, depth + 1, left, mid - 20);
            const rightChild = dfs(node.right, depth + 1, mid + 20, right);
            return true;
        };

        dfs(root, 0, 0, w);

        // Dibujar aristas
        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 2;
        positions.forEach(({ node, x, y }) => {
            if (node.left) {
                const child = positions.find(p => p.node === node.left);
                if (child) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + nodeRadius);
                    ctx.lineTo(child.x, child.y - nodeRadius);
                    ctx.stroke();
                }
            }
            if (node.right) {
                const child = positions.find(p => p.node === node.right);
                if (child) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + nodeRadius);
                    ctx.lineTo(child.x, child.y - nodeRadius);
                    ctx.stroke();
                }
            }
        });

        // Dibujar nodos
        positions.forEach(({ node, x, y }) => {
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#e94560';
            ctx.fill();
            ctx.strokeStyle = '#16213e';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.value, x, y);
        });
    }

    _maxDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(this._maxDepth(node.left), this._maxDepth(node.right));
    }

    showExplanation(message) {
        const el = document.getElementById('explanation');
        el.textContent = message;
    }
}
