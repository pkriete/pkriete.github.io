// Implementation HT: https://beta.observablehq.com/@mbostock/altered-world

class Noise {
  static lerp(t, a, b) {
    return a + t * (b - a);
  }
  static grad2d(i, x, y) {
    const v = (i & 1) === 0 ? x : y;
    return (i & 2) === 0 ? -v : v;
  }
  constructor(octaves = 1) {
    this.p = new Uint8Array(512);
    this.octaves = octaves;
    this.init();
  }
  init() {
    for (let i = 0; i < 512; ++i) {
      this.p[i] = Math.random() * 256;
    }
  }
  noise2d(x2d, y2d) {
    const X = Math.floor(x2d) & 255;
    const Y = Math.floor(y2d) & 255;
    const x = x2d - Math.floor(x2d);
    const y = y2d - Math.floor(y2d);
    const fx = (3 - 2 * x) * x * x;
    const fy = (3 - 2 * y) * y * y;
    const p0 = this.p[X] + Y;
    const p1 = this.p[X + 1] + Y;
    return Noise.lerp(
      fy,
      Noise.lerp(
        fx,
        Noise.grad2d(this.p[p0], x, y),
        Noise.grad2d(this.p[p1], x - 1, y)
      ),
      Noise.lerp(
        fx,
        Noise.grad2d(this.p[p0 + 1], x, y - 1),
        Noise.grad2d(this.p[p1 + 1], x - 1, y - 1)
      )
    );
  }
  noise(x, y) {
    let e = 1,
        k = 1,
        s = 0;
    for (let i = 0; i < this.octaves; ++i) {
      e *= 0.5;
      s += e * (1 + this.noise2d(k * x, k * y)) / 2;
      k *= 2;
    }
    return s;
  }
}

let height = 200;
let width = 500;
const length = 400;
const period = 0.01;

const canvas = document.getElementsByTagName('canvas')[0];

function context2d() {
  const dpi = window.devicePixelRatio;
  const doc = document.documentElement;

  height = Math.max(doc.clientHeight, window.innerHeight || 0);
  width = Math.max(doc.clientWidth, window.innerWidth || 0);
  height += 400;
  width += 400;

  canvas.width = width * dpi;
  canvas.height = height * dpi;

  var context = canvas.getContext("2d");
  context.scale(dpi, dpi);
  return context;
}

function* create() {
  const perlin = new Noise(3);
  const context = context2d();

  context.lineWidth = 0.5;
  context.globalAlpha = 0.05;

  for (let px = 0; px < width; ++px) {
    for (let i = 0; i < height / 6; ++i) {
      let x = px;
      let y = Math.random() * height;
      let n = perlin.noise(x * period, y * period);

      context.strokeStyle = `hsl(${-40 + n * 600}, 100%, ${800 * n * n * n}%)`;
      context.beginPath();
      context.moveTo(x, y);

      for (let m = 0; m < length && y >= 0 && y <= height; ++m) {
        n = perlin.noise(x * period, y * period);
        context.lineTo(x += Math.cos(n * 14), y += Math.sin(n * 14));
      }

      context.stroke();
    }
    yield;
  }
}

let gen;
function setup() {
  gen = create();
}

const loop = () => {
  setTimeout(loop, 100);
  gen.next();
};

setup();
loop();

window.addEventListener("resize", setup);
