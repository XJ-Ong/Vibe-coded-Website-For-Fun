<script lang="ts">
    import { MessageCircle, X, Crown } from "lucide-svelte";
    import { chatState, toggleChat } from "$lib/stores/chatStore";
    import ChatWindow from "./ChatWindow.svelte";

    let isOpen = $state(false);

    $effect(() => {
        const unsub = chatState.subscribe((s) => (isOpen = s.isOpen));
        return () => unsub();
    });
</script>

<!-- Chat Window -->
{#if isOpen}
    <ChatWindow />
{/if}

<!-- FAB Button - hidden on mobile when chat is open -->
<button
    onclick={toggleChat}
    class="chat-fab"
    class:active={isOpen}
    class:hide-on-mobile-open={isOpen}
    title={isOpen ? "Close chat" : "Chat with PrawnKing"}
>
    <div class="icon-container">
        {#if isOpen}
            <X class="w-6 h-6" />
        {:else}
            <div class="crown-icon">
                <Crown class="w-6 h-6" />
            </div>
        {/if}
    </div>
</button>

<style>
    .chat-fab {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #7000df 0%, #5000af 100%);
        border: 2px solid rgba(255, 255, 255, 0.2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
            0 10px 25px rgba(112, 0, 223, 0.4),
            0 0 20px rgba(112, 0, 223, 0.2);
        transition: all 0.3s ease;
        z-index: 110;
        cursor: pointer;
    }

    .chat-fab:hover {
        transform: scale(1.1);
        box-shadow:
            0 15px 35px rgba(112, 0, 223, 0.5),
            0 0 30px rgba(112, 0, 223, 0.3);
    }

    .chat-fab:active {
        transform: scale(0.95);
    }

    .chat-fab.active {
        background: linear-gradient(135deg, #00f0ff 0%, #0080ff 100%);
        box-shadow:
            0 10px 25px rgba(0, 240, 255, 0.4),
            0 0 20px rgba(0, 240, 255, 0.2);
    }

    .chat-fab.active:hover {
        box-shadow:
            0 15px 35px rgba(0, 240, 255, 0.5),
            0 0 30px rgba(0, 240, 255, 0.3);
    }

    .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .crown-icon {
        color: #fbbf24;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.5));
        }
        50% {
            filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.8));
        }
    }

    /* Mobile: hide FAB when chat is open (user can close via header X) */
    @media (max-width: 480px) {
        .chat-fab {
            bottom: 1rem;
            right: 1rem;
            width: 56px;
            height: 56px;
        }

        .chat-fab.hide-on-mobile-open {
            display: none;
        }
    }
</style>
