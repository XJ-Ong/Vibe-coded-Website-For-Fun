<script lang="ts">
  import { Terminal, MapPin, Code, Briefcase } from "lucide-svelte";

  const bioData = [
    { icon: MapPin, key: "user.location", value: '"Malaysia"' },
    {
      icon: Code,
      key: "user.languages",
      value: '["Python", "C", "C#", "C++", "Java"]',
    },
    {
      icon: Briefcase,
      key: "user.status",
      value: '"Software Developer Intern"',
    },
  ];
</script>

<section id="about" class="min-h-screen py-20 px-6">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold mb-12 text-center">
      <span class="text-cyber-blue">//</span> About
    </h2>

    <!-- Terminal Window -->
    <div class="glass rounded-xl overflow-hidden border border-white/10">
      <!-- Terminal Header -->
      <div
        class="flex items-center gap-2 px-4 py-3 bg-charcoal/50 border-b border-white/10"
      >
        <div class="w-3 h-3 rounded-full bg-neon-red"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="ml-4 text-sm font-mono text-cool-grey">about_me.sh</span>
      </div>

      <!-- Terminal Body -->
      <div class="p-6 font-mono text-sm md:text-base">
        <p class="text-cool-grey mb-4">
          <span class="text-green-400">$</span> cat ./bio.json
        </p>

        <div class="pl-4 space-y-3">
          <p class="text-cool-grey">{`{`}</p>

          {#each bioData as item, i}
            <div class="flex items-start gap-3 pl-4">
              <svelte:component
                this={item.icon}
                size={16}
                class="text-cyber-blue mt-1 shrink-0"
              />
              <p>
                <span class="text-deep-purple">"{item.key}"</span>
                <span class="text-white">:</span>
                <span class="text-cyber-blue">{item.value}</span>
                {#if i < bioData.length - 1}<span class="text-white">,</span
                  >{/if}
              </p>
            </div>
          {/each}

          <p class="text-cool-grey">{`}`}</p>
        </div>

        <p class="text-cool-grey mt-6">
          <span class="text-green-400">$</span>
          <span class="inline-block w-2 h-4 bg-cyber-blue animate-pulse ml-1"
          ></span>
        </p>
      </div>
    </div>
  </div>
</section>
