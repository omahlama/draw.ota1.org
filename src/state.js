export default (width = 100, height = 100) => {
    let pixels = new Array(width * height);
    for(let i=0; i<pixels.length; i++) {
        pixels[i] = randomPixel();
    }

    return {
        getState: () => pixels.slice(0),
        setState: p => pixels = p.slice(0), 
        setPixel: (x, y, colorArray) => {
            pixels[y*width + x] = colorArray;
        }
    }
}

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