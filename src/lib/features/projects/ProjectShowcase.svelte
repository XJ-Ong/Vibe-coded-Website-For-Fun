<script lang="ts">
  import projects from "$lib/data/projects.json";
  import { ExternalLink } from "lucide-svelte";
</script>

<section id="projects" class="min-h-screen py-20 px-6">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold mb-12 text-center">
      <span class="text-cyber-blue">//</span> Projects
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each projects as project}
        <article
          class="glass group rounded-xl p-6 border border-white/10
                 hover:border-cyber-blue transition-all duration-300
                 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]
                 flex flex-col h-full"
        >
          <div class="aspect-video bg-charcoal rounded-lg mb-4 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <h3
            class="text-xl font-bold mb-2 group-hover:text-cyber-blue transition-colors break-words line-clamp-1"
          >
            {project.title}
          </h3>

          <p
            class="text-cool-grey text-sm mb-4 leading-relaxed flex-1 line-clamp-3"
          >
            {project.description}
          </p>

          <!-- Tags and Link pushed to bottom -->
          <div class="mt-auto">
            <div class="flex flex-wrap gap-2 mb-4">
              {#each project.tags as tag}
                <span
                  class="px-2 py-1 text-xs font-mono bg-deep-purple/20 text-deep-purple rounded border border-deep-purple/30"
                >
                  {tag}
                </span>
              {/each}
            </div>

            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-mono text-cyber-blue
                     hover:underline underline-offset-4"
            >
              View Project <ExternalLink size={14} />
            </a>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
