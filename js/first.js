'use strict';
/*jshint globalstrict: true*/
/*jshint esversion: 6 */
/* jshint browser: true */

/* ---- Stars ---- */

// Parameters
const star_canvas_sizes = [0.9, 0.8, 0.7, 0.6, 0.5];
const star_canvas_parallax = [0.05, 0.01, 0.001];
const star_outer_margin = 120;
const star_count = 200; // (Per layer)

/**
 * Struct for a star
 */
const star = {
    x: 0,
    y: 0,
    radius: 0,

    create: function (x, y, radius) {
        const obj = Object.create(this);
        obj.x = x;
        obj.y = y;
        obj.radius = radius;
        return obj;
    },

    draw: function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
};

/**
 * Struct for a star field
 */
const starField = {
    stars: [],
    starCount: 0,
    starRadius: 0,
    starColor: "",

    create: function (starCount, starRadius, starColor) {
        const obj = Object.create(this);
        obj.starCount = starCount;
        obj.starRadius = starRadius;
        obj.starColor = starColor;
        obj.stars = [];
        return obj;
    },

    generate: function (canvas) {
        // Star list
        for (let i = 0; i < this.starCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * this.starRadius;
            const s = star.create(x, y, radius);
            this.stars.push(s);
        }

        // Draw stars
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = this.starColor;
        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].draw(ctx);
        }
    },
};

/**
 * Generate and draws a static star field
 */
function loadStars() {
    const stars_canvases = document.getElementsByClassName("stars");
    for (let i = 0; i < stars_canvases.length; i++) {
        const canvas = stars_canvases[i];

        canvas.width = window.innerWidth + star_outer_margin;
        canvas.height = window.innerHeight + star_outer_margin;

        const starField1 = starField.create(star_count, star_canvas_sizes[i], "#ffffff");
        starField1.generate(canvas);
    }
}

/**
 * Parallax effect for the stars relative to mouse
 * One day this should be relative to scroll as well
 */
 document.addEventListener("mousemove", function(event) {
    const _w = window.innerWidth / 2;
    const _h = window.innerHeight / 2;
    const _mouseX = event.clientX;
    const _mouseY = event.clientY;
    const _x = _mouseX - _w;
    const _y = _mouseY - _h;

    const stars_canvases = document.getElementsByClassName("stars");
    for (let i = 0; i < stars_canvases.length; i++) {
        const canvas = stars_canvases[i];

        const _depth = star_canvas_parallax[i];
        const _x2 = _x * _depth;
        const _y2 = _y * _depth;

        canvas.style.left = _x2 + "px";
        canvas.style.top = _y2 + "px";
    }
 });


/* ---- o ---- */

document.addEventListener("DOMContentLoaded", function(_event) {

    function resizeCanvas() {
        loadStars();
    }

    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
});

