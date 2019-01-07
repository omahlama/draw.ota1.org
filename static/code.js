const WIDTH = 100;
const HEIGHT = 100;
const MULTIPLIER = 10;
const CWIDTH = WIDTH * MULTIPLIER;
const CHEIGHT = HEIGHT * MULTIPLIER;

const canvas = document.getElementById("canvas");
const colorSelector = document.getElementById("color");
const randomizeBtn = document.getElementById("randomize");
canvas.width = CWIDTH;
canvas.height = CHEIGHT;
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(CWIDTH, CHEIGHT);
let pixels = new Array(WIDTH * HEIGHT);
const data = imageData.data;

let changes = [];
let selectedColor = [0, 0, 0];

function render() {
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
}

for (let i = 0; i < pixels.length; i++) {
  pixels[i] = randomPixel();
}
render();

canvas.addEventListener("click", function canvasClick(e) {
  const c = canvas.getBoundingClientRect();
  const x = e.clientX - c.left;
  const y = e.clientY - c.top;

  const pixelX = Math.floor(x / MULTIPLIER);
  const pixelY = Math.floor(y / MULTIPLIER);

  setPixel(pixelX, pixelY, selectedColor);
  render();
});

randomizeBtn.addEventListener("click", function randomize() {
  if (window.confirm("Tämä ylikirjoittaa kaiken, oletko varma?")) {
    for (let i = 0; i < pixels.length; i++) {
      pixels[i] = randomPixel();
    }
    render();
  }
});

function setPixel(x, y, color) {
  pixels[y * WIDTH + x] = color.slice(0);
  changes.push([Date.now(), x, y, ...color]);
  document.getElementById("changes").textContent = JSON.stringify(changes);
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

function randomPixel() {
  const h = rand(0, 1);
  const s = rand(0.5, 1);
  const l = rand(0.5, 1);
  return hslToRgb(h, s, l);
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
