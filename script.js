const canvas = document.querySelector('.canvas');
        const toolbar = document.querySelector('.toolbar');
        const drawBtn = document.querySelector('.draw-btn');
        const rectangleBtn = document.querySelector('.rectangle-btn');
        const clearBtn = document.querySelector('.clear-btn');
        const paintColours = ['red', 'yellow', 'green', 'blue', 'purple', 'black', 'erase'];
        let allCells = [];
        let paintColour = 'black';
        let painting = false;
        let drawRectangle = false;
        let startRectangle = null;
        let endRectangle = null;
        let startRow, startCol, endRow, endCol;
        // Create canvas divs
        for (const div of new Array(25000)) {
            const div = document.createElement('div');
            div.classList = 'cell';
            canvas.append(div);
        }
        allCells = [...canvas.children];
        // Create paint palette
        for (const paintCol of paintColours) {
            const colour = document.createElement('div');
            colour.classList.add('colour-choice', paintCol);
            paintCol === 'black' && colour.classList.add('active');
            colour.dataset.colour = paintCol;
            toolbar.insertBefore(colour, drawBtn);
        }
        // Add canvas listeners
        canvas.addEventListener('mousedown', e => {
            painting = true;
            drawRectangle && (startRectangle = allCells.indexOf(e.target));
        });
        canvas.addEventListener('mouseup', () => {
            painting = false;

            if (drawRectangle) {
                const rectClassList = ['cell', paintColour];
                const rectW = endCol - startCol;
                const rectH = endRow - startRow;

                for (let w = 1; w <= rectW; w++) {
                    allCells[startRectangle + w].className = '';
                    allCells[endRectangle - w].className = '';
                    allCells[startRectangle + w].classList.add(...rectClassList);
                    allCells[endRectangle - w].classList.add(...rectClassList);
                }
                for (let h = 200; h < rectH * 200; h+=200) {
                    allCells[startRectangle + h].className = '';
                    allCells[startRectangle + rectW + h].className = '';
                    allCells[startRectangle + h].classList.add(...rectClassList);
                    allCells[startRectangle + rectW + h].classList.add(...rectClassList);
                }

                allCells[endRectangle].className = '';
                allCells[endRectangle].classList.add(...rectClassList);
            }
        });
        canvas.addEventListener('mousemove', e => {
            const target = e.target;

            if (paintColour === undefined) {
                paintColour = 'black';
                document.querySelector('.colour-choice.black').classList.add('active');
            }

            if (painting && target.classList.contains('cell')) {
                if (drawRectangle) {
                    allCells[startRectangle].className = '';
                    allCells[startRectangle].classList.add('cell', paintColour);
                    endRectangle = allCells.indexOf(target);

                    startRow = Math.ceil((startRectangle + 1) / 200);
                    startCol = (startRectangle + 1) % 200;
                    endRow = Math.ceil((endRectangle + 1) / 200);
                    endCol = (endRectangle + 1) % 200;
                } else {
                    target.className = '';
                    target.classList.add('cell', paintColour);
                }
            }
        });
        // Add toolbar listeners
        toolbar.addEventListener('click', e => {
            document.querySelectorAll('.colour-choice').forEach(col => col.classList.remove('active'));
            paintColour = e.target.dataset.colour;
            e.target.classList.add('active');
        });
        drawBtn.addEventListener('click', () => {
            rectangleBtn.classList.remove('active');
            drawBtn.classList.add('active');
            drawRectangle = false;
        });
        rectangleBtn.addEventListener('click', () => {
            drawBtn.classList.remove('active');
            rectangleBtn.classList.add('active');
            drawRectangle = true;
        });
        clearBtn.addEventListener('click', () => document.querySelectorAll('.cell').forEach(cell => cell.classList = 'cell'));