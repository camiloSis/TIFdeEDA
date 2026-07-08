const COLORS = {
    stroke: '#1B4332',      // verde bosque: bordes y líneas estructurales
    stackBox: '#1B4332',
    queueBox: '#2F6B4F',
    listBox: '#2F6B4F',
    ptrBox: '#3E5C4E',
    treeNode: '#2F6B4F',
    highlight: '#E8A33D',   // ámbar: resaltado / nodo activo
    head: '#E8A33D',
    newLabel: '#E8A33D',
    tail: '#7C5CBF',        // ciruela: tail / prev / recorrido inverso
    danger: '#D64550',      // rojo: eliminar / NULL
    fading: '#C9D2CC',
    ptrCircleFill: '#F3F7F4',
    noteText: '#6B7C72',
    white: '#FFFFFF'
};

const FONTS = {
    mono: "'JetBrains Mono', monospace",
    sans: "'Inter', sans-serif"
};

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

    // Dibuja un rectángulo con esquinas redondeadas (sin fill/stroke, solo el path)
    _roundRect(x, y, w, h, r = 8) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    }

    _fillStrokeRoundRect(x, y, w, h, r, fillColor, strokeColor, lineWidth = 2) {
        const ctx = this.ctx;
        this._roundRect(x, y, w, h, r);
        ctx.fillStyle = fillColor;
        ctx.fill();
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
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

        items.forEach((val, i) => {
            const y = startY - i * (boxH + gap);
            const x = w / 2 - boxW / 2;

            this._fillStrokeRoundRect(x, y, boxW, boxH, 8, COLORS.stackBox, COLORS.stroke);

            ctx.fillStyle = COLORS.white;
            ctx.font = `bold 16px ${FONTS.mono}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x + boxW / 2, y + boxH / 2);

            ctx.fillStyle = COLORS.noteText;
            ctx.font = `12px ${FONTS.mono}`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(`[${i}]`, x - 8, y + boxH / 2);

            if (i === topIdx) {
                ctx.fillStyle = COLORS.highlight;
                ctx.font = `12px ${FONTS.sans}`;
                ctx.textAlign = 'left';
                ctx.fillText('← cima (top)', x + boxW + 8, y + boxH / 2);
            }
        });

        ctx.fillStyle = COLORS.stroke;
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

        items.forEach((val, i) => {
            const x = startX + i * (boxW + gap);

            this._fillStrokeRoundRect(x, y, boxW, boxH, 8, COLORS.queueBox, COLORS.stroke);

            ctx.fillStyle = COLORS.white;
            ctx.font = `bold 16px ${FONTS.mono}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x + boxW / 2, y + boxH / 2);

            ctx.fillStyle = COLORS.noteText;
            ctx.font = `11px ${FONTS.mono}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`[${i}]`, x + boxW / 2, y - 6);

            if (i === 0) {
                ctx.fillStyle = COLORS.highlight;
                ctx.font = `11px ${FONTS.sans}`;
                ctx.textAlign = 'left';
                ctx.fillText('← frente (front)', x + boxW + 6, y + boxH / 2 + 4);
            }
            if (i === items.length - 1 && items.length > 1) {
                ctx.fillStyle = COLORS.highlight;
                ctx.font = `11px ${FONTS.sans}`;
                ctx.textAlign = 'right';
                ctx.fillText('(back) final →', x - 6, y + boxH / 2 + 4);
            }
        });

        ctx.strokeStyle = COLORS.stroke;
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
        const hColor = highlightColor || COLORS.highlight;

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

            const boxColor = isDeleted ? COLORS.danger : (isFading ? COLORS.fading : (isHighlighted ? hColor : COLORS.listBox));

            if (doubly) {
                // Three sections: prev | data | next
                const sections = [
                    { x, w: ptrW, label: '', isPtr: true, dir: 'prev' },
                    { x: x + ptrW, w: dataW, label: val, isPtr: false },
                    { x: x + ptrW + dataW, w: ptrW, label: '', isPtr: true, dir: 'next' }
                ];
                sections.forEach(s => {
                    this._fillStrokeRoundRect(s.x, y, s.w, nodeH, 6, s.isPtr ? COLORS.ptrBox : boxColor, COLORS.stroke);

                    if (!s.isPtr) {
                        ctx.fillStyle = COLORS.white;
                        ctx.font = `bold 18px ${FONTS.mono}`;
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
                this._fillStrokeRoundRect(dataX, y, dataW, nodeH, 6, boxColor, COLORS.stroke);
                ctx.fillStyle = COLORS.white;
                ctx.font = `bold 18px ${FONTS.mono}`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(val, dataX + dataW / 2, y + nodeH / 2);

                // Pointer part
                this._fillStrokeRoundRect(ptrX, y, ptrW, nodeH, 6, COLORS.ptrBox, COLORS.stroke);

                // Small circle inside pointer section
                const cx = ptrX + ptrW / 2;
                const cy = y + nodeH / 2;
                ctx.beginPath();
                ctx.arc(cx, cy, 6, 0, Math.PI * 2);
                ctx.fillStyle = COLORS.ptrCircleFill;
                ctx.fill();
                ctx.strokeStyle = COLORS.stroke;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Index above
            ctx.fillStyle = COLORS.noteText;
            ctx.font = `11px ${FONTS.mono}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`[${i}]`, x + nodeW / 2, y - 6);

            // Arrow to next node
            if (i < values.length - 1) {
                const fromX = doubly ? x + ptrW + dataW + ptrW : x + nodeW;
                const fromY = y + nodeH / 2;
                const toX = startX + (i + 1) * (nodeW + gap);
                const toY = y + nodeH / 2;

                ctx.strokeStyle = COLORS.stroke;
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
                    ctx.fillStyle = COLORS.noteText;
                    ctx.font = `10px ${FONTS.sans}`;
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

                ctx.strokeStyle = COLORS.tail;
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

                ctx.fillStyle = COLORS.tail;
                ctx.font = `9px ${FONTS.sans}`;
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
            ctx.fillStyle = COLORS.danger;
            ctx.font = `bold 13px ${FONTS.mono}`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('NULL', lx, ly);
            // Slash
            ctx.strokeStyle = COLORS.danger;
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
            ctx.fillStyle = COLORS.danger;
            ctx.font = `bold 13px ${FONTS.mono}`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('NULL', lx, ly);
            ctx.strokeStyle = COLORS.danger;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lx - 30, ly - 8);
            ctx.lineTo(lx + 2, ly + 8);
            ctx.stroke();
        }

        // Head label
        if (values.length > 0) {
            const headX = startX + nodeW / 2;
            ctx.fillStyle = COLORS.head;
            ctx.font = `bold 14px ${FONTS.sans}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('head →', headX - 30, y - 22);
            // arrow from head text to first node
            const arrEndX = startX;
            ctx.strokeStyle = COLORS.head;
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
            ctx.fillStyle = COLORS.tail;
            ctx.font = `bold 14px ${FONTS.sans}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('← tail', lastX + 30, y - 22);
            const arrEndX2 = startX + (values.length - 1) * (nodeW + gap) + nodeW;
            ctx.strokeStyle = COLORS.tail;
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
            this._fillStrokeRoundRect(fx, fy, dataW + ptrW, 36, 6, COLORS.listBox, COLORS.stroke);

            ctx.fillStyle = COLORS.white;
            ctx.font = `bold 14px ${FONTS.mono}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(floatingValue, fx + (dataW + ptrW) / 2, fy + 18);

            ctx.fillStyle = COLORS.newLabel;
            ctx.font = `11px ${FONTS.sans}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(floatingLabel || 'nuevo', fx + (dataW + ptrW) / 2, fy + 40);

            // Dashed border to indicate it's floating
            ctx.strokeStyle = COLORS.newLabel;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 3]);
            this._roundRect(fx - 3, fy - 3, dataW + ptrW + 6, 42, 8);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Extra label on a node (for step explanations)
        if (extraLabel && highlight !== undefined && highlight >= 0 && highlight < values.length) {
            const hx = startX + highlight * (nodeW + gap) + nodeW / 2;
            ctx.fillStyle = COLORS.noteText;
            ctx.font = `11px ${FONTS.sans}`;
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

        ctx.strokeStyle = COLORS.stroke;
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
            ctx.fillStyle = COLORS.treeNode;
            ctx.fill();
            ctx.strokeStyle = COLORS.stroke;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = COLORS.white;
            ctx.font = `bold 14px ${FONTS.mono}`;
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