<script lang="ts">
	// Floating button that opens the Cakna app menu — always visible, top of the
	// z-stack. Kept deliberately small so it doesn't obstruct page content.
	const CAKNA_MENU_URL = 'https://cakna.org/menu';
</script>

<a
	href={CAKNA_MENU_URL}
	target="_blank"
	rel="noopener noreferrer"
	aria-label="Buka Cakna app"
	class="no-print fixed right-5 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
	style="background: linear-gradient(135deg, #1a5c48 0%, #2d8c6a 100%);"
>
	<!-- Cakna crescent-and-dot wordmark, simplified as SVG -->
	<svg
		width="28"
		height="28"
		viewBox="0 0 28 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M22 14a8 8 0 1 1-8-8 6 6 0 0 0 8 8Z"
			fill="white"
			opacity="0.95"
		/>
		<circle cx="20" cy="7" r="2" fill="white" opacity="0.95" />
	</svg>
</a>
