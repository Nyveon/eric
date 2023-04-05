// 100vh fix for mobile devices
const setHeight = () => {
	document.getElementById("my-element").style.minHeight =
		window.innerHeight + "px";
};

let deviceWidth = window.matchMedia("(max-width: 1024px)");

if (deviceWidth.matches) {
	window.addEventListener("resize", setHeight);
	setHeight();
}

// Blob animation
const blob = document.getElementById("blob");

window.onpointermove = (event) => {
	const { clientX, clientY } = event;

	blob.animate(
		{
			left: `${clientX}px`,
			top: `${clientY}px`,
		},
		{ duration: 3000, fill: "forwards" }
	);
};
