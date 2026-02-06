<script lang="ts">
    import { Mail, Github, ArrowUpRight } from "lucide-svelte";
    import Icon from "@iconify/svelte";

    // ============================================
    // EDIT YOUR CONTACT DETAILS HERE
    // ============================================
    const contactInfo = {
        email: "oxj0887@gmail.com",
        github: "https://github.com/XJ-Ong",
        discord: "https://discord.gg/your-server-invite", // ← Add your Discord invite link
    };
    // ============================================
</script>

<section id="contact" class="min-h-screen py-20 px-6">
    <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold mb-4 text-center">
            <span class="text-cyber-blue">//</span> Contact
        </h2>

        <p class="text-cool-grey text-center mb-12 max-w-md mx-auto">
            Want to chat? Feel free to reach out!
        </p>

        <!-- Social Cards Grid -->
        <div class="grid md:grid-cols-3 gap-6">
            <!-- GitHub Card -->
            <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                class="group relative overflow-hidden rounded-2xl p-6
                       bg-gradient-to-br from-gray-600 to-gray-800
                       border border-white/10
                       transition-all duration-500 ease-out
                       hover:scale-105 hover:-translate-y-1
                       group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
                <div
                    class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div class="relative mb-4">
                    <div
                        class="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm
                                flex items-center justify-center
                                group-hover:bg-white/20 transition-all duration-300"
                    >
                        <Github size={28} class="text-white" />
                    </div>
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="text-xl font-bold text-white">GitHub</h3>
                        <ArrowUpRight
                            size={20}
                            class="text-white/50 group-hover:text-white 
                               group-hover:translate-x-1 group-hover:-translate-y-1
                               transition-all duration-300"
                        />
                    </div>
                    <p class="text-white/70 text-sm truncate">@XJ-Ong</p>
                </div>
            </a>

            <!-- Discord Card -->
            <a
                href={contactInfo.discord}
                target="_blank"
                rel="noopener noreferrer"
                class="group relative overflow-hidden rounded-2xl p-6
                       bg-gradient-to-br from-indigo-500 to-indigo-700
                       border border-white/10
                       transition-all duration-500 ease-out
                       hover:scale-105 hover:-translate-y-1
                       group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]"
            >
                <div
                    class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div class="relative mb-4">
                    <div
                        class="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm
                                flex items-center justify-center
                                group-hover:bg-white/20 transition-all duration-300"
                    >
                        <Icon
                            icon="simple-icons:discord"
                            width={28}
                            height={28}
                            class="text-white"
                        />
                    </div>
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="text-xl font-bold text-white">Discord</h3>
                        <ArrowUpRight
                            size={20}
                            class="text-white/50 group-hover:text-white 
                               group-hover:translate-x-1 group-hover:-translate-y-1
                               transition-all duration-300"
                        />
                    </div>
                    <p class="text-white/70 text-sm truncate">Join my server</p>
                </div>
            </a>

            <!-- Email Card -->
            <a
                href={`mailto:${contactInfo.email}`}
                target="_blank"
                rel="noopener noreferrer"
                class="group relative overflow-hidden rounded-2xl p-6
                       bg-gradient-to-br from-cyber-blue to-deep-purple
                       border border-white/10
                       transition-all duration-500 ease-out
                       hover:scale-105 hover:-translate-y-1
                       group-hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]"
            >
                <div
                    class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div class="relative mb-4">
                    <div
                        class="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm
                                flex items-center justify-center
                                group-hover:bg-white/20 transition-all duration-300"
                    >
                        <Mail size={28} class="text-white" />
                    </div>
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="text-xl font-bold text-white">Email</h3>
                        <ArrowUpRight
                            size={20}
                            class="text-white/50 group-hover:text-white 
                               group-hover:translate-x-1 group-hover:-translate-y-1
                               transition-all duration-300"
                        />
                    </div>
                    <p class="text-white/70 text-sm truncate">
                        {contactInfo.email}
                    </p>
                </div>
            </a>
        </div>

        <!-- Bottom CTA -->
        <div class="mt-16 text-center">
            <p class="text-cool-grey font-mono text-sm">
                <span class="text-cyber-blue">const</span> response =
                <span class="text-green-400">await</span>
                <span class="text-deep-purple">connect</span>();
            </p>
        </div>
    </div>
</section>
