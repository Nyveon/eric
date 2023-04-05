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

// Nameplate effect
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

let interval = null;

document.getElementById("nametag").onmouseover = (event) => {
	let iteration = 0;

	clearInterval(interval);

	let targetText =
		event.target.innerText === event.target.dataset.first
			? event.target.dataset.second
			: event.target.dataset.first;

	interval = setInterval(() => {
		event.target.innerText = event.target.innerText
			.split("")
			.map((letter, index) => {
				if (index < iteration) {
					return targetText[index];
				}

				return letters[Math.floor(Math.random() * 26 * 2)];
			})
			.join("");

		if (iteration >= targetText.length) {
			clearInterval(interval);
		}

		iteration += 1 / 3;
	}, 30);
};
