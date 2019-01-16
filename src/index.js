import Shake from 'shake.js';
import createClient from './client';
import colors from './colors';

// Listen to shake events on mobile
const myShake = new Shake();
myShake.start();

const WIDTH = 100;
const HEIGHT = 100;
const MULTIPLIER = 10;
const CWIDTH = WIDTH * MULTIPLIER;
const CHEIGHT = HEIGHT * MULTIPLIER;

const canvas = document.getElementById('canvas');
const mouseCanvas = document.getElementById('mousecanvas');
const colorSelector = document.getElementById('color');
const overlay = document.getElementById('overlay');
canvas.width = CWIDTH;
canvas.height = CHEIGHT;
const ctx = canvas.getContext('2d');
const mouseCtx = mouseCanvas.getContext('2d');
const imageData = ctx.createImageData(CWIDTH, CHEIGHT);
const data = imageData.data;

let changes = [];
let selectedColor = [0, 0, 0];
let pixels = new Array(WIDTH * HEIGHT).map(() => [0, 0, 0]);
let mousePixel = null;

function resizeCanvas() {
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  mouseCanvas.width = width;
  mouseCanvas.height = height;
  render();
  renderMouse();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function render() {
  const { height, width } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let y = 0; y < height; y++) {
    const pixelY = Math.floor((y * HEIGHT) / height);
    for (let x = 0; x < width; x++) {
      const pixelX = Math.floor((x * WIDTH) / width);
      const pixel = pixels[WIDTH * pixelY + pixelX] || [0, 0, 0];
      const loc = y * width * 4 + x * 4;
      data[loc] = pixel[0];
      data[loc + 1] = pixel[1];
      data[loc + 2] = pixel[2];
      data[loc + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function renderMouse() {
  const { height, width } = mouseCanvas;

  const w = i => (i * width) / WIDTH;
  const h = i => (i * height) / HEIGHT;

  mouseCtx.clearRect(0, 0, width, height);
  if (mousePixel) {
    const [x, y] = mousePixel;
    mouseCtx.fillStyle = `rgb(${selectedColor[0]}, ${selectedColor[1]}, ${
      selectedColor[2]
    })`;
    mouseCtx.fillRect(w(x), h(y), w(1), h(1));
  }
}

const client = createClient(p => {
  pixels = p;
  render();
});

function pixelFromMouseEvent(e) {
  const c = canvas.getBoundingClientRect();
  const x = e.clientX - c.left;
  const y = e.clientY - c.top;

  const pixelX = Math.floor(x * (WIDTH / c.width));
  const pixelY = Math.floor(y * (HEIGHT / c.height));
  return [pixelX, pixelY];
}

canvas.addEventListener('click', function canvasClick(e) {
  const [pixelX, pixelY] = pixelFromMouseEvent(e);
  setPixel(pixelX, pixelY, selectedColor);
});

canvas.addEventListener('mousemove', function mouseMove(e) {
  mousePixel = pixelFromMouseEvent(e);
  renderMouse();
});

canvas.addEventListener('mouseleave', function mouseLeave(e) {
  mousePixel = null;
  renderMouse();
});

function setPixel(x, y, color) {
  client.setPixel(x, y, color.slice(0));
}

const colorNames = Object.keys(colors);
const colorButtons = [];
for (let colorname of colorNames) {
  colorButtons.push(`
    <button style="background-color: ${colorname}">
    </button>
  `);
}

document.getElementById('colors').innerHTML = colorButtons.join('');

document.querySelectorAll('#colors  button').forEach(button => {
  button.addEventListener('click', e => {
    const style = window.getComputedStyle(e.target);
    selectedColor = style.backgroundColor
      .replace(/[^0-9,]/g, '')
      .split(',')
      .map(i => +i);
    e.target.className = 'selected';
    hideOverlay();
    setTimeout(() => (e.target.className = ''), 500);
  });
});

window.addEventListener('keydown', e => {
  // ESC
  if (e.keyCode === 27) {
    showOverlay();
  }
});

window.addEventListener('shake', () => {
  showOverlay();
});

function hideOverlay() {
  overlay.style.opacity = 0;
  overlay.style.visibility = 'hidden';
}

function showOverlay() {
  overlay.style.opacity = 1;
  overlay.style.visibility = 'visible';
  3;
}
