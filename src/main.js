let canvas;
let ctx;
// Test
// Physics engine
const TRIANGLE_COUNT = 20;
const { Engine, Bodies, Body, Composite } = Matter;
const engine = Engine.create();
engine.gravity.y = 1.0;
let triangles = []
function buildTriangles() {
    for (let i = 0; i < TRIANGLE_COUNT; i++) {
        triangles.push(Bodies.fromVertices((canvas.width / (TRIANGLE_COUNT+2)) * (i+1), 100, [[
            { x: 0,  y: 0 },
            { x: 80, y: 0 },
            { x: 0, y: 80 }
        ]], {restitution: 1.15, friction: 0.5, frictionAir: 0}));
        Body.setVelocity(triangles[triangles.length-1], {x: 20, y: -8});
        Composite.add(engine.world, triangles[triangles.length-1]);
    }
}

let walls = [];
function buildWalls() {
  Composite.remove(engine.world, walls);
  const w = canvas.width, h = canvas.height, t = 100;
  walls = [
    Bodies.rectangle(w / 2, h + t / 2, w + 2 * t, t, { isStatic: true }), // floor
    Bodies.rectangle(w / 2, -t / 2,    w + 2 * t, t, { isStatic: true }), // ceiling
    Bodies.rectangle(-t / 2,    h / 2, t, h + 2 * t, { isStatic: true }), // left
    Bodies.rectangle(w + t / 2, h / 2, t, h + 2 * t, { isStatic: true })  // right
  ];
  Composite.add(engine.world, walls);
}

function setup() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    resize();
    buildTriangles();
    loop();
}

function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    buildWalls();
}

function drawBody(body) {
  ctx.beginPath();
  body.vertices.forEach((v, i) => i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y));
  ctx.closePath();
  ctx.fill();
}


function draw() {
    ctx.fillStyle = '#B0B0FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'tomato';
    for (let i = 0; i < triangles.length-1; i++) {
        drawBody(triangles[i]);
    }
    ctx.fillStyle = '#00ff00';
    drawBody(triangles[triangles.length-1]);
}


function loop() {
    Engine.update(engine, 1000 / 60);
    draw();
    requestAnimationFrame(loop);
}

window.addEventListener('resize', resize);
window.addEventListener('load', setup);