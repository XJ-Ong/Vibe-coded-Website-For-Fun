<script lang="ts">
  import { Pencil, X, Trash2 } from "lucide-svelte";
  import { penMode, clearDrawings } from "$lib/stores/drawingStore";

  let isPenMode = $state(false);

  $effect(() => {
    const unsub = penMode.subscribe((v) => (isPenMode = v));
    return () => unsub();
  });
</script>

<div class="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3">
  {#if isPenMode}
    <button
      onclick={clearDrawings}
      class="fab-btn bg-neon-red/90 hover:bg-neon-red
                   hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
      title="Clear all drawings"
    >
      <Trash2 class="w-5 h-5" />
    </button>
  {/if}

  <button
    onclick={() => penMode.update((v) => !v)}
    class="fab-btn p-4 {isPenMode
      ? 'bg-cyber-blue hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]'
      : 'bg-deep-purple/90 hover:shadow-[0_0_30px_rgba(112,0,223,0.5)]'}"
    title={isPenMode ? "Exit pen mode" : "Enable pen mode"}
  >
    {#if isPenMode}
      <X class="w-6 h-6 text-void-black" />
    {:else}
      <Pencil class="w-6 h-6 text-white" />
    {/if}
  </button>
</div>

<style>
  .fab-btn {
    padding: 0.75rem;
    border-radius: 9999px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    transition: all 0.3s;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .fab-btn:hover {
    transform: scale(1.1);
  }

  .fab-btn:active {
    transform: scale(0.95);
  }
</style>
