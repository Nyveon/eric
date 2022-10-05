"use strict";
/*jshint globalstrict: true*/
/*jshint esversion: 6 */
/* jshint browser: true */

var hasTouchScreen = false;

if ("maxTouchPoints" in navigator) {
  hasTouchScreen = navigator.maxTouchPoints > 0;
} else if ("msMaxTouchPoints" in navigator) {
  hasTouchScreen = navigator.msMaxTouchPoints > 0;
} else {
  var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
  if (mQ && mQ.media === "(pointer:coarse)") {
    hasTouchScreen = !!mQ.matches;
  } else if ("orientation" in window) {
    hasTouchScreen = true; // deprecated, but good fallback
  } else {
    // Only as a last resort, fall back to user agent sniffing
    var UA = navigator.userAgent;
    hasTouchScreen =
      /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
      /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
  }
}

/* ---- Stars ---- */

// Parameters
const star_layers = 10;
const star_canvas_sizes = [0.9, 0.8, 0.7, 0.6, 0.5, 0.5, 0.5, 0.4, 0.4, 0.3];
const star_canvas_parallax = [
  0.05, 0.045, 0.04, 0.035, 0.03, 0.025, 0.02, 0.015, 0.01, 0.005,
];
const star_outer_margin = 200;
const star_density = 0.0006 / star_layers; // (Per pixel)
const star_color = "#c2fff8";

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
  },
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
    const starCount = canvas.width * canvas.height * star_density;

    starField
      .create(starCount, star_canvas_sizes[i], "#ffffff")
      .generate(canvas);
  }
}

/**
 * Parallax effect for the stars relative to mouse
 * One day this should be relative to scroll as well
 */
function parallaxStars(x, y) {
  const _w = window.innerWidth / 2;
  const _h = window.innerHeight / 2;
  const _x = x - _w;
  const _y = y - _h;

  const stars_canvases = document.getElementsByClassName("stars");
  for (let i = 0; i < stars_canvases.length; i++) {
    const canvas = stars_canvases[i];

    const _depth = star_canvas_parallax[i];
    const _x2 = _x * _depth;
    const _y2 = _y * _depth;

    canvas.style.left = _x2 + "px";
    canvas.style.top = _y2 + "px";
  }
}

function parallaxMouse(event) {
  parallaxStars(event, event.clientX, event.clientY);
}

// Parallax if desktop, animation if mobile
if (!hasTouchScreen) {
  document.addEventListener("mousemove", parallaxMouse);
}

/**
 * Make star layers
 */
function makeStars() {
  const container = document.getElementById("stars-canvas");
  for (let i = 0; i < star_layers; i++) {
    const canvas = document.createElement("canvas");
    canvas.className = "stars";
    container.appendChild(canvas);
  }
}

/* ---- o ---- */

document.addEventListener("DOMContentLoaded", function (_event) {
  makeStars();

  function resizeCanvas() {
    loadStars();
  }

  window.addEventListener("resize", resizeCanvas, false);
  resizeCanvas();
});
