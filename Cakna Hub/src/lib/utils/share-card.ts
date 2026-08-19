// Shareable ayah card (canvas 1080×1350) — port of the sample (index.html L4086+).
export interface CardInput {
	arabic: string;
	translation: string;
	surahLatin: string;
	surah: number;
	ayah: number;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
	const words = text.split(' ');
	const lines: string[] = [];
	let line = '';
	for (const w of words) {
		const test = line ? line + ' ' + w : w;
		if (ctx.measureText(test).width > maxWidth && line) {
			lines.push(line);
			line = w;
		} else line = test;
	}
	if (line) lines.push(line);
	return lines;
}

export async function generateAyahCard(input: CardInput): Promise<Blob> {
	try {
		await document.fonts.ready;
		await document.fonts.load("54px 'Amiri Quran'");
	} catch {
		/* best effort */
	}
	const W = 1080;
	const H = 1350;
	const canvas = document.createElement('canvas');
	canvas.width = W;
	canvas.height = H;
	const ctx = canvas.getContext('2d')!;

	// background gradient
	const grad = ctx.createLinearGradient(0, 0, 0, H);
	grad.addColorStop(0, '#0B3D2E');
	grad.addColorStop(1, '#062219');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, W, H);

	// double gold frame
	ctx.strokeStyle = '#C7A24B';
	ctx.lineWidth = 3;
	ctx.strokeRect(46, 46, W - 92, H - 92);
	ctx.lineWidth = 1;
	ctx.strokeRect(60, 60, W - 120, H - 120);

	// 8-point star
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let i = 0; i <= 16; i++) {
		const r = i % 2 === 0 ? 34 : 15;
		const a = (i * Math.PI) / 8 - Math.PI / 2;
		const x = W / 2 + r * Math.cos(a);
		const y = 150 + r * Math.sin(a);
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	}
	ctx.stroke();

	// Arabic
	ctx.textAlign = 'center';
	ctx.direction = 'rtl';
	ctx.fillStyle = '#F7F3E8';
	ctx.font = "54px 'Amiri Quran','Scheherazade New',serif";
	let y = 300;
	for (const line of wrap(ctx, input.arabic, W - 220)) {
		ctx.fillText(line, W / 2, y);
		y += 96;
	}

	// translation (max 10 lines)
	ctx.direction = 'ltr';
	ctx.fillStyle = '#CBBE9B';
	ctx.font = 'italic 30px Figtree,sans-serif';
	y += 40;
	for (const line of wrap(ctx, `"${input.translation}"`, W - 240).slice(0, 10)) {
		ctx.fillText(line, W / 2, y);
		y += 46;
	}

	// reference + watermark
	ctx.fillStyle = '#C7A24B';
	ctx.font = '700 30px Figtree,sans-serif';
	ctx.fillText(`Surah ${input.surahLatin} · ${input.surah}:${input.ayah}`, W / 2, H - 160);
	ctx.fillStyle = '#8FA898';
	ctx.font = '24px Marcellus,serif';
	ctx.fillText('CAKNA', W / 2, H - 108);

	return new Promise((resolve, reject) => {
		canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
	});
}

export async function downloadAyahCard(input: CardInput) {
	const blob = await generateAyahCard(input);
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `ayat-${input.surah}-${input.ayah}.png`;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 5000);
}
