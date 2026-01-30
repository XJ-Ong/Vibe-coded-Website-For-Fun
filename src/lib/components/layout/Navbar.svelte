<script lang="ts">
  import { Pencil, MousePointer, Trash2 } from "lucide-svelte";
  import { penMode, clearDrawings } from "$lib/stores/drawingStore";

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#projects", label: "Work" },
    { href: "#about", label: "About" },
  ];

  let isPenMode = $state(false);

  $effect(() => {
    const unsub = penMode.subscribe((v) => (isPenMode = v));
    return () => unsub();
  });

  function togglePenMode() {
    penMode.update((v) => !v);
  }

  function handleClear() {
    clearDrawings();
  }
</script>

<nav class="fixed top-0 left-0 right-0 z-50 glass">
  <div
    class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative"
  >
    <!-- Left: Logo/Name -->
    <a href="/" class="text-xl font-bold text-cyber-blue font-mono">
      <span class="text-white">&lt;</span>XJ-Ong<span class="text-white"
        >/&gt;</span
      >
    </a>

    <!-- Center: Drawing controls (absolute positioned for true center) -->
    <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
      <!-- Pen/Mouse Toggle -->
      <button
        onclick={togglePenMode}
        class="p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
        class:bg-cyber-blue={isPenMode}
        class:bg-transparent={!isPenMode}
        title={isPenMode ? "Switch to Mouse Mode" : "Switch to Pen Mode"}
      >
        {#if isPenMode}
          <MousePointer class="w-5 h-5 text-void-black" />
        {:else}
          <Pencil class="w-5 h-5 text-cyber-blue" />
        {/if}
      </button>

      <!-- Clear Drawing -->
      <button
        onclick={handleClear}
        class="p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
        title="Clear Drawings"
      >
        <Trash2 class="w-5 h-5 text-neon-red" />
      </button>
    </div>

    <!-- Right: Navigation -->
    <ul class="flex items-center gap-8">
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            class="group relative px-4 py-2 text-cool-grey hover:text-white transition-colors duration-300 font-mono"
            class:pointer-events-none={isPenMode}
            class:opacity-50={isPenMode}
          >
            <span
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cyber-blue"
              >[</span
            >
            {link.label}
            <span
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cyber-blue"
              >]</span
            >
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
