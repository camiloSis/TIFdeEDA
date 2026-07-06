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
        const startY = h - 60;
        const gap = 5;
        const topIdx = items.length - 1;

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

            ctx.fillStyle = '#16213e';
            ctx.font = '12px monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(`[${i}]`, x - 8, y + boxH / 2);

            if (i === topIdx) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText('← cima (top)', x + boxW + 8, y + boxH / 2);
            }
        });

        ctx.fillStyle = '#16213e';
        ctx.fillRect(w / 2 - 50, startY + boxH + 5, 100, 8);
    }

    drawQueue(items) {
        this.clear();
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const boxW = 60;
        const boxH = 50;
        const gap = 10;
        const totalW = items.length * (boxW + gap) - gap;
        const startX = Math.max(40, w / 2 - totalW / 2);
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

            ctx.fillStyle = '#16213e';
            ctx.font = '11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`[${i}]`, x + boxW / 2, y - 6);

            if (i === 0) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText('← frente (front)', x + boxW + 6, y + boxH / 2 + 4);
            }
            if (i === items.length - 1 && items.length > 1) {
                ctx.fillStyle = '#ffd700';
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText('(back) final →', x - 6, y + boxH / 2 + 4);
            }
        });

        ctx.strokeStyle = '#16213e';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < items.length - 1; i++) {
            const x1 = startX + (i + 1) * (boxW + gap) - gap + 2;
            const arrowY = y + boxH / 2;
            ctx.beginPath();
            ctx.moveTo(x1, arrowY);
            ctx.lineTo(x1 + 6, arrowY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x1 + 4, arrowY - 3);
            ctx.lineTo(x1 + 6, arrowY);
            ctx.lineTo(x1 + 4, arrowY + 3);
            ctx.stroke();
        }
    }

    drawList(stepInfo) {
        this.clear();
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const { values, highlight, highlightColor, doubly, floatingValue, floatingLabel, markDeleted, fadeIdx, extraLabel } = stepInfo;
        const hColor = highlightColor || '#ffd700';

        const dataW = 50;
        const ptrW = 30;
        const nodeW = doubly ? dataW + ptrW * 2 : dataW + ptrW;
        const nodeH = 50;
        const gap = 70;
        const totalW = values.length * (nodeW + gap) - gap;
        const startX = Math.max(60, w / 2 - totalW / 2);
        const y = h / 2 - nodeH / 2 - 15;

        // Draw each node
        values.forEach((val, i) => {
            const x = startX + i * (nodeW + gap);
            const isHighlighted = i === highlight;
            const isDeleted = i === markDeleted;
            const isFading = i === fadeIdx;

            const boxColor = isDeleted ? '#e94560' : (isFading ? '#ccc' : (isHighlighted ? hColor : '#2d6a4f'));

            if (doubly) {
                // Three sections: prev | data | next
                const sections = [
                    { x, w: ptrW, label: '', isPtr: true, dir: 'prev' },
                    { x: x + ptrW, w: dataW, label: val, isPtr: false },
                    { x: x + ptrW + dataW, w: ptrW, label: '', isPtr: true, dir: 'next' }
                ];
                sections.forEach(s => {
                    ctx.fillStyle = s.isPtr ? '#34495e' : boxColor;
                    ctx.strokeStyle = '#16213e';
                    ctx.lineWidth = 2;
                    ctx.fillRect(s.x, y, s.w, nodeH);
                    ctx.strokeRect(s.x, y, s.w, nodeH);

                    if (!s.isPtr) {
                        ctx.fillStyle = 'white';
                        ctx.font = 'bold 18px monospace';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(s.label, s.x + s.w / 2, y + nodeH / 2);
                    }
                });
            } else {
                // Two sections: data + next pointer
                const dataX = x;
                const ptrX = x + dataW;

                // Data part
                ctx.fillStyle = boxColor;
                ctx.strokeStyle = '#16213e';
                ctx.lineWidth = 2;
                ctx.fillRect(dataX, y, dataW, nodeH);
                ctx.strokeRect(dataX, y, dataW, nodeH);
                ctx.fillStyle = 'white';
                ctx.font = 'bold 18px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(val, dataX + dataW / 2, y + nodeH / 2);

                // Pointer part
                ctx.fillStyle = '#34495e';
                ctx.fillRect(ptrX, y, ptrW, nodeH);
                ctx.strokeRect(ptrX, y, ptrW, nodeH);

                // Small circle inside pointer section
                const cx = ptrX + ptrW / 2;
                const cy = y + nodeH / 2;
                ctx.beginPath();
                ctx.arc(cx, cy, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#ecf0f1';
                ctx.fill();
                ctx.strokeStyle = '#16213e';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Index above
            ctx.fillStyle = '#16213e';
            ctx.font = '11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`[${i}]`, x + nodeW / 2, y - 6);

            // Arrow to next node
            if (i < values.length - 1) {
                const fromX = doubly ? x + ptrW + dataW + ptrW : x + nodeW;
                const fromY = y + nodeH / 2;
                const toX = startX + (i + 1) * (nodeW + gap);
                const toY = y + nodeH / 2;

                ctx.strokeStyle = '#16213e';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX - 4, toY);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(toX - 2, toY - 4);
                ctx.lineTo(toX + 2, toY);
                ctx.lineTo(toX - 2, toY + 4);
                ctx.stroke();

                // Label "next" on arrow
                if (i === 0 || i === Math.floor(values.length / 2)) {
                    ctx.fillStyle = '#7f8c8d';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText('next', (fromX + toX) / 2, fromY - 4);
                }
            }

            // Back arrow for doubly
            if (doubly && i > 0) {
                const fromX = startX + i * (nodeW + gap);
                const fromY = y + nodeH / 2;
                const toX = startX + (i - 1) * (nodeW + gap) + nodeW;
                const toY = y + nodeH / 2;

                ctx.strokeStyle = '#8e44ad';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX + 4, toY);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(toX + 2, toY - 4);
                ctx.lineTo(toX - 2, toY);
                ctx.lineTo(toX + 2, toY + 4);
                ctx.stroke();

                ctx.fillStyle = '#8e44ad';
                ctx.font = '9px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText('prev', (fromX + toX) / 2, fromY + 4);
            }
        });

        // NULL label after last node
        if (values.length > 0) {
            const lastX = startX + (values.length - 1) * (nodeW + gap) + nodeW;
            const lx = lastX + 10;
            const ly = y + nodeH / 2;
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 13px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('NULL', lx, ly);
            // Slash
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lx - 2, ly - 8);
            ctx.lineTo(lx + 32, ly + 8);
            ctx.stroke();
        }

        // Prev NULL for doubly first node
        if (doubly && values.length > 0) {
            const firstX = startX;
            const lx = firstX - 10;
            const ly = y + nodeH / 2;
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 13px monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('NULL', lx, ly);
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lx - 30, ly - 8);
            ctx.lineTo(lx + 2, ly + 8);
            ctx.stroke();
        }

        // Head label
        if (values.length > 0) {
            const headX = startX + nodeW / 2;
            ctx.fillStyle = '#f39c12';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('head →', headX - 30, y - 22);
            // arrow from head text to first node
            const arrEndX = startX;
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(headX - 10, y - 18);
            ctx.lineTo(arrEndX - 2, y - 18);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(arrEndX + 2, y - 22);
            ctx.lineTo(arrEndX - 2, y - 18);
            ctx.lineTo(arrEndX + 2, y - 14);
            ctx.stroke();
        }

        // Tail label for doubly
        if (doubly && values.length > 0) {
            const lastX = startX + (values.length - 1) * (nodeW + gap) + nodeW / 2;
            ctx.fillStyle = '#8e44ad';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('← tail', lastX + 30, y - 22);
            const arrEndX2 = startX + (values.length - 1) * (nodeW + gap) + nodeW;
            ctx.strokeStyle = '#8e44ad';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lastX + 10, y - 18);
            ctx.lineTo(arrEndX2 + 2, y - 18);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(arrEndX2 - 2, y - 22);
            ctx.lineTo(arrEndX2 + 2, y - 18);
            ctx.lineTo(arrEndX2 - 2, y - 14);
            ctx.stroke();
        }

        // Floating node for step where new node is shown before insertion
        if (floatingValue !== undefined && floatingValue !== null) {
            const fx = 20;
            const fy = 20;
            ctx.fillStyle = '#2d6a4f';
            ctx.strokeStyle = '#16213e';
            ctx.lineWidth = 2;
            ctx.fillRect(fx, fy, dataW + ptrW, 36);
            ctx.strokeRect(fx, fy, dataW + ptrW, 36);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(floatingValue, fx + (dataW + ptrW) / 2, fy + 18);

            ctx.fillStyle = '#f39c12';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(floatingLabel || 'nuevo', fx + (dataW + ptrW) / 2, fy + 40);

            // Dashed border to indicate it's floating
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 3]);
            ctx.strokeRect(fx - 3, fy - 3, dataW + ptrW + 6, 42);
            ctx.setLineDash([]);
        }

        // Extra label on a node (for step explanations)
        if (extraLabel && highlight !== undefined && highlight >= 0 && highlight < values.length) {
            const hx = startX + highlight * (nodeW + gap) + nodeW / 2;
            ctx.fillStyle = '#e74c3c';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(extraLabel, hx, y + nodeH + 6);
        }
    }

    drawTree(root) {
        this.clear();
        if (!root) return;
        const ctx = this.ctx;
        const w = this.canvas.width;

        const levelHeight = 70;
        const nodeRadius = 24;
        const positions = [];

        const dfs = (node, depth, left, right) => {
            if (!node) return null;
            const mid = (left + right) / 2;
            const x = mid;
            const y = 60 + depth * levelHeight;
            positions.push({ node, x, y, depth });
            dfs(node.left, depth + 1, left, mid - 20);
            dfs(node.right, depth + 1, mid + 20, right);
            return true;
        };

        dfs(root, 0, 0, w);

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
