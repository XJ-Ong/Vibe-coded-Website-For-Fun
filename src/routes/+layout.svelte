<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import Background3D from "$lib/components/layout/Background3D.svelte";
	import Navbar from "$lib/components/layout/Navbar.svelte";
	import DrawingCanvas from "$lib/components/layout/DrawingCanvas.svelte";
	import DrawingFAB from "$lib/components/layout/DrawingFAB.svelte";
	import ChatbotFAB from "$lib/components/chatbot/ChatbotFAB.svelte";
	import { penMode } from "$lib/stores/drawingStore";
	import { registerAction } from "$lib/stores/chatStore";

	let { children } = $props();

	let isPenMode = $state(false);

	$effect(() => {
		const unsub = penMode.subscribe((v) => (isPenMode = v));
		return () => unsub();
	});

	// Register chatbot navigation actions
	onMount(() => {
		registerAction("scrollToHome", () => {
			document
				.getElementById("home")
				?.scrollIntoView({ behavior: "smooth" });
		});
		registerAction("scrollToAbout", () => {
			document
				.getElementById("about")
				?.scrollIntoView({ behavior: "smooth" });
		});
		registerAction("scrollToProjects", () => {
			document
				.getElementById("projects")
				?.scrollIntoView({ behavior: "smooth" });
		});
		registerAction("scrollToContact", () => {
			document
				.getElementById("contact")
				?.scrollIntoView({ behavior: "smooth" });
		});
	});
</script>

<svelte:head>
	<title>XJ-Ong | Portfolio</title>
	<meta
		name="description"
		content="Building the Digital Future - Data Analytics & Backend Development"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Layer 0: 3D Background (fixed, z-0) -->
<Background3D />

<!-- Layer 1: Drawing Canvas (fixed, z-5) - behind content like background -->
<DrawingCanvas />

<!-- Layer 2: Page content (scrollable, z-10) - disabled in Pen Mode -->
<main class="relative z-10 pt-20" class:pointer-events-none={isPenMode}>
	{@render children()}
</main>

<!-- Layer 3: Navbar (fixed, z-50) - always on top -->
<Navbar />

<!-- Layer 4: Drawing FAB (fixed, z-40) - below navbar -->
<DrawingFAB />

<!-- Layer 5: Chatbot FAB (fixed, z-100+) - above everything except modals -->
<ChatbotFAB />
