// use:longpress — 480 ms pointer hold (or contextmenu) fires `onlongpress`;
// the following click is suppressed, like the sample's lpFired flag.
export function longpress(node: HTMLElement, callback: () => void) {
	let timer: ReturnType<typeof setTimeout> | null = null;
	let fired = false;

	const start = () => {
		fired = false;
		timer = setTimeout(() => {
			fired = true;
			callback();
		}, 480);
	};
	const cancel = () => {
		if (timer) clearTimeout(timer);
		timer = null;
	};
	const onContextMenu = (e: Event) => {
		e.preventDefault();
		cancel();
		if (!fired) {
			fired = true;
			callback();
		}
	};
	const onClick = (e: Event) => {
		if (fired) {
			e.preventDefault();
			e.stopPropagation();
			fired = false;
		}
	};

	node.addEventListener('pointerdown', start);
	node.addEventListener('pointerup', cancel);
	node.addEventListener('pointermove', cancel);
	node.addEventListener('pointercancel', cancel);
	node.addEventListener('contextmenu', onContextMenu);
	node.addEventListener('click', onClick, true);

	return {
		destroy() {
			cancel();
			node.removeEventListener('pointerdown', start);
			node.removeEventListener('pointerup', cancel);
			node.removeEventListener('pointermove', cancel);
			node.removeEventListener('pointercancel', cancel);
			node.removeEventListener('contextmenu', onContextMenu);
			node.removeEventListener('click', onClick, true);
		}
	};
}
