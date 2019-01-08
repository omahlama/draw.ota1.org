import createClient from './client';

const WIDTH = 100;
const HEIGHT = 100;
const MULTIPLIER = 10;
const CWIDTH = WIDTH * MULTIPLIER;
const CHEIGHT = HEIGHT * MULTIPLIER;

const canvas = document.getElementById("canvas");
const colorSelector = document.getElementById("color");
canvas.width = CWIDTH;
canvas.height = CHEIGHT;
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(CWIDTH, CHEIGHT);
const data = imageData.data;

let changes = [];
let selectedColor = [0, 0, 0];

const client = createClient((pixels) => {
  for (let y = 0; y < CHEIGHT; y++) {
    for (let x = 0; x < CWIDTH; x++) {
      const pixel =
      pixels[WIDTH * Math.floor(y / MULTIPLIER) + Math.floor(x / MULTIPLIER)];
      const loc = y * CWIDTH * 4 + x * 4;
      data[loc] = pixel[0];
      data[loc + 1] = pixel[1];
      data[loc + 2] = pixel[2];
      data[loc + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
});

canvas.addEventListener("click", function canvasClick(e) {
  const c = canvas.getBoundingClientRect();
  const x = e.clientX - c.left;
  const y = e.clientY - c.top;

  const pixelX = Math.floor(x / MULTIPLIER);
  const pixelY = Math.floor(y / MULTIPLIER);

  setPixel(pixelX, pixelY, selectedColor);
});

function setPixel(x, y, color) {
  client.setPixel(x, y, color.slice(0));
}

colorSelector.addEventListener("change", function changeColor(e) {
  const newColor = e.target.value;
  if (newColor.length === 7) {
    const r = parseInt(newColor.substr(1, 2), 16);
    const g = parseInt(newColor.substr(3, 2), 16);
    const b = parseInt(newColor.substr(5, 2), 16);
    selectedColor = [r, g, b];
  }
});
