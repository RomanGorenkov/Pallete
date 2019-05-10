
let paintBucketTool = document.querySelector('#paint-bucket-button');
let pickerTool = document.querySelector('#picker-button');
let moveTool = document.querySelector('#move-button');
let transformTool = document.querySelector('#transform-button');
let paintCanvas = document.querySelector('.canvas');
let figures = document.querySelectorAll('.canvas-figure');
figures = Array.prototype.slice.call(figures);
let colorButtons = document.querySelectorAll('.color-button');
colorButtons = Array.prototype.slice.call(colorButtons);
let toolButtons = document.querySelectorAll('.tool-button');
toolButtons = Array.prototype.slice.call(toolButtons);
let dragSrcEl = null;

colorButtons.forEach((elem) => {
    elem.addEventListener('click', changeSelectedColor)
})

toolButtons.forEach((elem) => {
    elem.addEventListener('click', chooseTool);
})

paintCanvas.addEventListener('click', toolAction);
addEventListener('keydown', keyboardControl);

function changeFigureColor() {
    let colorElement = document.querySelector('#current-color');
    let color = colorElement.value;
    event.target.style.backgroundColor = color;
}

function changeSelectedColor() {
    let elem = this.querySelector('.fa-circle');
    let currentColorElem = document.querySelector('#current-color');
    let prevColorElem = colorButtons[1].querySelector('.fa-circle');
    let bufColor = currentColorElem.value;
    let color = getElemColor(elem);
    if (window.getComputedStyle(elem).color == bufColor) {
        return;
    }
    currentColorElem.value = color;
    prevColorElem.style.color = bufColor;
}

function getFigureColor() {
    let currentColorElem = document.querySelector('#current-color');
    let prevColorElem = document.querySelector('#prev-color');
    let color = parseRgbInHex(window.getComputedStyle(event.target).backgroundColor)
    if (color == currentColorElem.value) {
        return;
    }
    prevColorElem.style.color = currentColorElem.value;
    currentColorElem.value = color;
}

function swapFihure() {
    figures.forEach((elem) => {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragenter', handleDragEnter, false);
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('dragleave', handleDragLeave, false);
        elem.addEventListener('drop', handleDrop, false);
        elem.addEventListener('dragend', handleDragEnd, false);
    })
}

function resetSwapFigure() {
    figures.forEach((elem) => {
        elem.removeEventListener('dragstart', handleDragStart, false);
        elem.removeEventListener('dragenter', handleDragEnter, false);
        elem.removeEventListener('dragover', handleDragOver, false);
        elem.removeEventListener('dragleave', handleDragLeave, false);
        elem.removeEventListener('drop', handleDrop, false);
        elem.removeEventListener('dragend', handleDragEnd, false);
    })
}

function transformFigure() {
    let elem = event.target;
    if (!elem.classList.contains('canvas-figure')) {
        return;
    }
    if (elem.classList.contains('transform')) {
        elem.classList.remove('transform');
    }
    else {
        elem.classList.add('transform');
    }
}

function chooseTool() {
    let current = document.getElementsByClassName('active');
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    document.querySelector('.canvas').style.cursor = `url(${this.querySelector('.tool-button-img').src}), auto`;
}


function toolAction() {
    let tool = document.querySelector('.active');
    moveFigure();
    if (tool == paintBucketTool) {
        return changeFigureColor.call(this);
    }
    if (tool == pickerTool) {
        return getFigureColor.call(this);
    }
    if (tool == transformTool) {
        return transformFigure.call(this);
    }

}

function keyboardControl(key) {
    switch (key.keyCode) {

        case 80:
            document.querySelectorAll('.tool-button')[0].click();
            break;
        case 67:
            document.querySelectorAll('.tool-button')[1].click();
            break;
        case 77:
            document.querySelectorAll('.tool-button')[2].click();
            break;
        case 84:
            document.querySelectorAll('.tool-button')[3].click();
            break;
        case 83:
            savePage();
            break;
        case 85:
            uploadPage();
            break;
    }
}

function getElemColor(elem) {
    let rgb = window.getComputedStyle(elem).color.match(/\d+/g);
    let color = rgb.reduce((sharp, item) => {
        item = (+item).toString(16) == 0 ? '00' : (+item).toString(16);
        return sharp + item;
    }, '#');
    return color;
}
function parseRgbInHex(rgb) {
    rgb = rgb.match(/\d+/g);
    let color = rgb.reduce((sharp, item) => {
        item = (+item).toString(16) == 0 ? '00' : (+item).toString(16);
        return sharp + item;
    }, '#');
    return color;
}

function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('color', this.style.backgroundColor);
    e.dataTransfer.setData('form', this.classList);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl != this) {
        dragSrcEl.style.backgroundColor = this.style.backgroundColor;
        dragSrcEl.classList = this.classList;
        this.style.backgroundColor = e.dataTransfer.getData('color');
        this.classList = e.dataTransfer.getData('form');
    }

    return false;
}

function handleDragEnd(e) {
    figures.forEach((figure) => {
        figure.classList.remove('over');
    });
    this.style.opacity = '1';
}

function moveFigure() {
    if (document.querySelector('.active') == moveTool) {
        addFieldListener();
        addFigureDoubleClickListener();
        swapFihure();
    }
    else {
        removeFieldListener();
        removeFigureDoubleClickListener();
        resetSwapFigure();
    }
}

let field = document.querySelector('.canvas');
let block;

function addFigureDoubleClickListener() {
    figures.forEach((elem) => {
        elem.addEventListener('dblclick', getFigureByClick, false);
    });
}

function removeFigureDoubleClickListener() {
    figures.forEach((elem) => {
        elem.removeEventListener('dblclick', getFigureByClick, false);
    });
}

function fieldListenerFunction(event) {

    let fieldCoords = this.getBoundingClientRect();

    let fieldInnerCoords = {
        top: fieldCoords.top + field.clientTop,
        left: fieldCoords.left + field.clientLeft
    };

    let blockCoords = {
        top: event.clientY - fieldInnerCoords.top - block.clientHeight / 2,
        left: event.clientX - fieldInnerCoords.left - block.clientWidth / 2
    };

    if (blockCoords.top < 0) blockCoords.top = 0;

    if (blockCoords.left < 0) blockCoords.left = 0;

    if (blockCoords.left + block.clientWidth > field.clientWidth) {
        blockCoords.left = field.clientWidth - block.clientWidth;
    }

    if (blockCoords.top + block.clientHeight > field.clientHeight) {
        blockCoords.top = field.clientHeight - block.clientHeight;
    }

    block.style.left = blockCoords.left + 'px';
    block.style.top = blockCoords.top + 'px';
    block.style.opacity = '1';
    block = null;
}
function addFieldListener() {
    field.addEventListener('click', fieldListenerFunction);
}

function removeFieldListener() {
    field.removeEventListener('click', fieldListenerFunction);
}

function getFigureByClick(e) {
    let elemId = e.target.id;
    e.target.style.opacity = '.7';
    block = document.querySelector(`#${elemId}`);
}

function savePage() {
    function SaveFigure(figure) {
        this.color = window.getComputedStyle(figure).backgroundColor;
        this.top = figure.offsetTop;
        this.left = figure.offsetLeft;
        this.transform = figure.classList.length == 2 ? true : false;
        this.background = window.getComputedStyle(document.querySelector('.canvas')).backgroundColor;
    }

    figures.map((figure) => {
        let figureSave = JSON.stringify(new SaveFigure(figure));
        let figureId = '#' + figure.id;
        localStorage.setItem(figureId, figureSave);
    })
}

function uploadPage() {
    let figuresArray = [];
    figures.map((figure) => {
        let figureId = '#' + figure.id;
        figuresArray.push(JSON.parse(localStorage.getItem(figureId)));
    })
    figuresArray.map((figureFromSave, index) => {
        figureToChange = figures[index];
        figureToChange.style.backgroundColor = figureFromSave.color;
        figureToChange.style.top = figureFromSave.top + 'px';
        figureToChange.style.left = figureFromSave.left + 'px';
        if (figureFromSave.transform) {
            figureToChange.classList.add('transform');
        }
        document.querySelector('.canvas').style.backgroundColor = figureFromSave.background;
    })
}

