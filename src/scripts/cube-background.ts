import { Application, Geometry, Mesh, Shader, UniformGroup } from "pixi.js";

const vertex = `
    attribute vec2 aPosition;
    attribute vec2 aUV;
    attribute vec2 aCenter;
    attribute vec2 aShadeBand;
    uniform vec2 uViewport;
    uniform vec2 uPointer;
    uniform float uStrength;
    uniform float uRadius;
    uniform vec4 uRipple0;
    uniform vec4 uRipple1;
    uniform vec4 uRipple2;
    uniform vec4 uRipple3;
    varying vec2 vUV;
    varying vec2 vAlpha;

    float rippleLight(vec4 ripple) {
        if (ripple.w <= 0.0) return 0.0;
        float ring = (distance(aCenter, ripple.xy) - ripple.z) / 65.0;
        return exp(-ring * ring) * ripple.w;
    }

    void main() {
        gl_Position = vec4(aPosition / uViewport * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
        vUV = aUV;
        vec2 offset = (aCenter - uPointer) / uRadius;
        float hover = exp(-3.0 * dot(offset, offset)) * uStrength;
        float ripples = rippleLight(uRipple0) + rippleLight(uRipple1)
            + rippleLight(uRipple2) + rippleLight(uRipple3);
        float light = hover * 0.19 + min(ripples, 0.5);
        vAlpha = vec2((0.012 + light) * aShadeBand.x, 0.045 + light * 0.5) * aShadeBand.y;
    }
`;

const fragment = `
    precision mediump float;
    uniform float uFaceHeight;
    uniform float uPixelRatio;
    varying vec2 vUV;
    varying vec2 vAlpha;

    void main() {
        // All faces are rhombi with the same altitude. Shade their boundaries
        // analytically so outlines need no extra geometry or draw calls.
        vec2 edgeDistance = min(vUV, 1.0 - vUV) * uFaceHeight;
        float edge = 1.0 - smoothstep(0.0, 0.65 + 0.5 / uPixelRatio, min(edgeDistance.x, edgeDistance.y));
        float lineAlpha = vAlpha.y * edge;
        float alpha = lineAlpha + vAlpha.x * (1.0 - lineAlpha);
        vec3 color = vec3(192.0, 215.0, 211.0) / 255.0 * lineAlpha
            + vec3(169.0, 210.0, 205.0) / 255.0 * vAlpha.x * (1.0 - lineAlpha);
        gl_FragColor = vec4(color, alpha);
    }
`;

function createGeometry(width: number, height: number, a: number) {
    const b = a / Math.sqrt(3);
    const positions: number[] = [];
    const uvs: number[] = [];
    const centers: number[] = [];
    const shadeBands: number[] = [];
    const indices: number[] = [];
    const faceUVs = [0, 0, 1, 0, 1, 1, 0, 1];

    for (let row = -1; row < height / (3 * b) + 1; row++) {
        for (let col = -1; col < width / (2 * a) + 1; col++) {
            const x = col * 2 * a + (row % 2) * a;
            const y = row * 3 * b;
            const band =
                0.3 + 0.7 * ((Math.cos(y / 150 + x / 650) + 1) / 2) ** 2;
            const faces = [
                [x, y - 2 * b, x + a, y - b, x, y, x - a, y - b],
                [x - a, y - b, x, y, x, y + 2 * b, x - a, y + b],
                [x, y, x + a, y - b, x + a, y + b, x, y + 2 * b],
            ];
            faces.forEach((face, index) => {
                const start = positions.length / 2;
                positions.push(...face);
                uvs.push(...faceUVs);
                for (let corner = 0; corner < 4; corner++) {
                    centers.push(x, y);
                    shadeBands.push([1, 0.38, 0.64][index], band);
                }
                indices.push(
                    start,
                    start + 1,
                    start + 2,
                    start,
                    start + 2,
                    start + 3,
                );
            });
        }
    }

    return new Geometry({
        attributes: {
            aPosition: {
                buffer: new Float32Array(positions),
                format: "float32x2",
            },
            aUV: { buffer: new Float32Array(uvs), format: "float32x2" },
            aCenter: { buffer: new Float32Array(centers), format: "float32x2" },
            aShadeBand: {
                buffer: new Float32Array(shadeBands),
                format: "float32x2",
            },
        },
        indexBuffer: new Uint32Array(indices),
    });
}

export async function startCubeBackground(
    canvas: HTMLCanvasElement,
    signal: AbortSignal,
) {
    const app = new Application();
    try {
        await app.init({
            canvas,
            preference: "webgl",
            autoStart: false,
            sharedTicker: false,
            autoDensity: true,
            resolution: Math.min(devicePixelRatio || 1, 2),
            backgroundAlpha: 0,
            antialias: false,
            powerPreference: "low-power",
        });
    } catch (error) {
        app.stage.destroy({ children: true });
        throw error;
    }
    if (signal.aborted) {
        app.destroy(false, { children: true });
        return;
    }

    const events = new AbortController();
    const options = { signal: events.signal };
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const lighting = new UniformGroup({
        uViewport: { value: new Float32Array([1, 1]), type: "vec2<f32>" },
        uPointer: { value: new Float32Array([0, 0]), type: "vec2<f32>" },
        uStrength: { value: 0, type: "f32" },
        uRadius: { value: 560, type: "f32" },
        uFaceHeight: { value: 1, type: "f32" },
        uPixelRatio: { value: app.renderer.resolution, type: "f32" },
        // x, y, radius, brightness
        uRipple0: { value: new Float32Array(4), type: "vec4<f32>" },
        uRipple1: { value: new Float32Array(4), type: "vec4<f32>" },
        uRipple2: { value: new Float32Array(4), type: "vec4<f32>" },
        uRipple3: { value: new Float32Array(4), type: "vec4<f32>" },
    });
    const uniforms = lighting.uniforms;
    const rippleDuration = 2.4;
    const ripples = [
        uniforms.uRipple0,
        uniforms.uRipple1,
        uniforms.uRipple2,
        uniforms.uRipple3,
    ].map((data) => ({ data, age: rippleDuration }));
    let nextRipple = 0;
    const clearRipples = () => {
        for (const ripple of ripples) {
            ripple.age = rippleDuration;
            ripple.data[3] = 0;
        }
    };
    const shader = Shader.from({
        gl: { vertex, fragment },
        resources: { lighting },
    });
    let mesh: Mesh<Geometry, Shader> | undefined;
    let pointerActive = false;
    let width = 0;
    let height = 0;

    function resize() {
        const nextWidth = Math.max(1, canvas.parentElement!.clientWidth);
        const nextHeight = Math.max(1, canvas.parentElement!.clientHeight);
        const ratio = Math.min(devicePixelRatio || 1, 2);
        if (
            nextWidth === width &&
            nextHeight === height &&
            ratio === uniforms.uPixelRatio
        )
            return;
        width = nextWidth;
        height = nextHeight;
        app.renderer.resize(width, height, ratio);
        uniforms.uViewport.set([width, height]);
        uniforms.uPixelRatio = ratio;
        uniforms.uRadius = Math.min(560, width * 0.9);
        clearRipples();
        const a = (width < 600 ? 36 : 48) / Math.sqrt(2);
        uniforms.uFaceHeight = a;
        const geometry = createGeometry(width, height, a);
        if (mesh) {
            const previous = mesh.geometry;
            mesh.geometry = geometry;
            previous.destroy();
        } else {
            mesh = new Mesh({ geometry, shader });
            mesh.eventMode = "none";
            app.stage.addChild(mesh);
        }
        app.render();
    }

    app.ticker.maxFPS = 60;
    app.ticker.add((ticker) => {
        const delta = Math.min(ticker.deltaMS, 80);
        const ease = 1 - Math.exp(-delta / 180);
        uniforms.uStrength +=
            ((pointerActive ? 1 : 0) - uniforms.uStrength) * ease;
        for (const ripple of ripples) {
            if (ripple.age >= rippleDuration) continue;
            ripple.age = Math.min(rippleDuration, ripple.age + delta / 1000);
            ripple.data[2] = ripple.age * 520;
            ripple.data[3] = 0.32 * (1 - ripple.age / rippleDuration) ** 2;
        }
    });

    function syncAnimation() {
        if (!document.hidden && !motion.matches) {
            app.start();
        } else {
            app.stop();
            pointerActive = false;
            uniforms.uStrength = 0;
            clearRipples();
            if (!document.hidden) app.render();
        }
    }

    window.addEventListener(
        "pointermove",
        (event) => {
            if (event.pointerType === "touch" || motion.matches) return;
            uniforms.uPointer[0] = event.clientX;
            uniforms.uPointer[1] = event.clientY;
            pointerActive = true;
        },
        options,
    );
    window.addEventListener(
        "click",
        (event) => {
            if (
                event.button !== 0 ||
                event.detail === 0 ||
                motion.matches ||
                document.hidden
            )
                return;

            if (
                event
                    .composedPath()
                    .some(
                        (node) =>
                            node instanceof Element &&
                            node.matches(
                                "a, button, input, textarea, select, [role='button'], [contenteditable], #nameplate, astro-dev-toolbar",
                            ),
                    )
            )
                return;

            // Cursor
            const a = uniforms.uFaceHeight;
            const b = a / Math.sqrt(3);
            const nearestRow = Math.round(event.clientY / (3 * b));
            let centerX = 0;
            let centerY = 0;
            let bestDistance = Infinity;
            for (let row = nearestRow - 1; row <= nearestRow + 1; row++) {
                const offset = (row % 2) * a;
                const x =
                    Math.round((event.clientX - offset) / (2 * a)) * 2 * a +
                    offset;
                const y = row * 3 * b;
                const distance =
                    (event.clientX - x) ** 2 + (event.clientY - y) ** 2;
                if (distance < bestDistance) {
                    bestDistance = distance;
                    centerX = x;
                    centerY = y;
                }
            }
            const ripple = ripples[nextRipple];
            nextRipple = (nextRipple + 1) % ripples.length;
            ripple.age = 0;
            ripple.data.set([centerX, centerY, 0, 0.32]);
        },
        options,
    );
    const leave = () => {
        pointerActive = false;
    };
    document.documentElement.addEventListener("pointerleave", leave, options);
    window.addEventListener("blur", leave, options);
    window.addEventListener("resize", resize, options);
    document.addEventListener("visibilitychange", syncAnimation, options);
    motion.addEventListener("change", syncAnimation, options);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement!);

    const cleanup = () => {
        events.abort();
        observer.disconnect();
        const geometry = mesh?.geometry;
        app.destroy(false, { children: true });
        geometry?.destroy();
        shader.destroy();
    };
    signal.addEventListener("abort", cleanup, { once: true });
    try {
        resize();
        syncAnimation();
    } catch (error) {
        signal.removeEventListener("abort", cleanup);
        cleanup();
        throw error;
    }
}
