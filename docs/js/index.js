// 100vh fix for mobile devices
const setHeight = () => {
	document.body.style.minHeight = window.innerHeight + "px";
};

if ((deviceWidth = window.matchMedia("(max-width: 1024px)").matches)) {
	window.addEventListener("resize", setHeight);
	setHeight();
}

// Light blob
const blob = document.getElementById("blob");
window.onpointermove = (event) => {
	const { clientX, clientY } = event;

	blob.animate(
		{
			left: `${clientX}px`,
			top: `${clientY}px`,
		},
		{ duration: 2000, fill: "forwards", easing: "ease-out" }
	);
};

// Nametag effect
const nameplate = document.getElementById("nameplate");
const letters = "abcdefghijklmnopqrstuvwxyz";

let interval = null;

nameplate.onmouseenter = (event) => {
	const targetElement = document.getElementById("nametag");

	let iteration = 0;

	clearInterval(interval);

	let targetText =
		targetElement.innerText === targetElement.dataset.first
			? targetElement.dataset.second
			: targetElement.dataset.first;

	interval = setInterval(() => {
		targetElement.innerText = targetElement.innerText
			.split("")
			.map((letter, index) => {
				if (index < iteration) {
					return targetText[index];
				}

				const returnLetter = letters[Math.floor(Math.random() * 26)];
				if (
					targetText[index] &&
					targetText[index] == targetText[index].toUpperCase()
				) {
					return returnLetter.toUpperCase();
				}
				return returnLetter;
			})
			.join("");

		if (iteration >= targetText.length) {
			clearInterval(interval);
		}

		iteration += 1 / 3;
	}, 35);
};
