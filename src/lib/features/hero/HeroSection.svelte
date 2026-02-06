<script lang="ts">
  import { onMount } from "svelte";
  import { animate, stagger } from "motion";
  import { ChevronDown } from "lucide-svelte";

  const cycleWords = [
    "Hi", // English
    "你好", // Chinese (Simplified)
    "Bonjour", // French
    "Hola", // Spanish
    "مرحبا", // Arabic
    "Ciao", // Italian
    "Olá", // Portuguese
    "Hallo", // German
    "こんにちは", // Japanese
    "안녕하세요", // Korean
    "Привет", // Russian
    "नमस्ते", // Hindi
    "سلام", // Persian/Urdu
    "สวัสดี", // Thai
    "Selamat", // Malay/Indonesian
    "Xin chào", // Vietnamese
    "Merhaba", // Turkish
    "Jambo", // Swahili
    "Szia", // Hungarian
    "Hej", // Swedish/Danish
    "Ahoj", // Czech
    "Γειά", // Greek
    "שָׁלוֹם", // Hebrew
  ];
  let currentWordIndex = $state(0);
  let cycleWord = $derived(cycleWords[currentWordIndex]);

  onMount(() => {
    // Animate entrance
    const elements = document.querySelectorAll(".hero-text");
    animate(
      elements as any,
      { opacity: [0, 1], y: [30, 0] },
      { delay: stagger(0.15), duration: 0.6, ease: "easeOut" },
    );

    // Cycle through words
    const interval = setInterval(() => {
      currentWordIndex = (currentWordIndex + 1) % cycleWords.length;
    }, 2000);

    return () => clearInterval(interval);
  });

  function scrollToProjects() {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }
</script>

<section
  id="home"
  class="min-h-screen flex flex-col items-center justify-center px-6 text-center"
>
  <div class="max-w-4xl">
    <h1 class="hero-text text-5xl md:text-7xl font-bold mb-6 leading-tight">
      <span class="relative inline-block">
        <span class="text-cyber-blue">[</span>
        <span class="text-white glitch" data-text={cycleWord}>{cycleWord}</span>
        <span class="text-cyber-blue">]</span>
      </span>. Welcome~
    </h1>

    <p class="hero-text text-lg md:text-xl text-cool-grey mb-8 font-mono">
      Web Portfolio by <span
        class="text-cyber-blue font-bold tracking-widest drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
        >XJ-Ong</span
      >
    </p>

    <button
      onclick={scrollToProjects}
      class="hero-text group glass px-8 py-4 rounded-lg font-mono text-cyber-blue
             border border-cyber-blue/30 hover:border-cyber-blue transition-all duration-300
             hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
    >
      sudo explore
      <ChevronDown
        class="inline-block ml-2 group-hover:translate-y-1 transition-transform"
        size={18}
      />
    </button>
  </div>
</section>
