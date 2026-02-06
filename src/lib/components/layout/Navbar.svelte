<script lang="ts">
  import { Menu, X } from "lucide-svelte";

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  let isMenuOpen = $state(false);

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<nav class="fixed top-0 left-0 right-0 z-50 glass">
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between"
  >
    <!-- Logo -->
    <a href="/" class="text-xl font-bold text-cyber-blue font-mono">
      <span class="text-white">&lt;</span>XJ-Ong<span class="text-white"
        >/&gt;</span
      >
    </a>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center gap-8">
      {#each navLinks as link}
        <a
          href={link.href}
          class="text-cool-grey hover:text-cyber-blue transition-colors duration-300 font-medium"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <!-- Mobile Menu Button -->
    <button
      class="md:hidden p-2 text-cool-grey hover:text-cyber-blue transition-colors"
      onclick={() => (isMenuOpen = !isMenuOpen)}
      aria-label="Toggle menu"
    >
      {#if isMenuOpen}
        <X class="w-6 h-6" />
      {:else}
        <Menu class="w-6 h-6" />
      {/if}
    </button>
  </div>

  <!-- Mobile Menu Dropdown -->
  {#if isMenuOpen}
    <div class="md:hidden glass border-t border-white/10">
      <div class="px-4 py-4 flex flex-col gap-4">
        {#each navLinks as link}
          <a
            href={link.href}
            onclick={closeMenu}
            class="text-cool-grey hover:text-cyber-blue transition-colors duration-300
                               font-medium py-2 px-4 rounded-lg hover:bg-white/5"
          >
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</nav>
