// 100vh fix for mobile devices
const setHeight = () => {
	document.body.style.minHeight = window.innerHeight + "px";
};

if ((deviceWidth = window.matchMedia("(max-width: 1024px)").matches)) {
	window.addEventListener("resize", setHeight);
	setHeight();
}

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
