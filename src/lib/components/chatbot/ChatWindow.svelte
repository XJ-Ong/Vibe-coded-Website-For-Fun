<script lang="ts">
    import { Send, RefreshCw, X, Crown } from "lucide-svelte";
    import ChatMessage from "./ChatMessage.svelte";
    import {
        chatState,
        sendMessage,
        closeChat,
        newConversation,
        type ChatMessage as ChatMessageType,
    } from "$lib/stores/chatStore";

    let inputValue = $state("");
    let messagesContainer: HTMLDivElement;
    let inputElement: HTMLInputElement;

    // Store subscriptions
    let messages: ChatMessageType[] = $state([]);
    let isLoading = $state(false);

    $effect(() => {
        const unsub = chatState.subscribe((s) => {
            messages = s.messages;
            isLoading = s.isLoading;
        });
        return () => unsub();
    });

    // Auto-scroll to bottom when new messages arrive
    $effect(() => {
        if (messages.length && messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 50);
        }
    });

    async function handleSend() {
        if (!inputValue.trim() || isLoading) return;
        const message = inputValue;
        inputValue = "";
        await sendMessage(message);
        // Refocus input after sending
        inputElement?.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }
</script>

<div class="chat-window">
    <!-- Header -->
    <div class="chat-header">
        <div class="header-left">
            <Crown class="w-5 h-5 text-yellow-400" />
            <span class="font-mono font-bold">PrawnKing</span>
        </div>
        <div class="header-actions">
            <button
                onclick={newConversation}
                title="New conversation"
                class="header-btn"
            >
                <RefreshCw class="w-4 h-4" />
            </button>
            <button onclick={closeChat} title="Close" class="header-btn">
                <X class="w-4 h-4" />
            </button>
        </div>
    </div>

    <!-- Messages -->
    <div class="messages-container" bind:this={messagesContainer}>
        {#if messages.length === 0}
            <div class="welcome-message">
                <Crown class="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <p class="text-center text-cool-grey">
                    Hey there! I'm <strong class="text-cyber-blue"
                        >PrawnKing</strong
                    >, your guide to this portfolio. Ask me anything!
                </p>
            </div>
        {:else}
            {#each messages as msg (msg.id)}
                <ChatMessage message={msg} />
            {/each}
        {/if}

        {#if isLoading}
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        {/if}
    </div>

    <!-- Input -->
    <div class="input-container">
        <input
            type="text"
            bind:value={inputValue}
            bind:this={inputElement}
            onkeydown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isLoading}
            class="chat-input"
        />
        <button
            onclick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            class="send-btn"
        >
            <Send class="w-5 h-5" />
        </button>
    </div>
</div>

<style>
    .chat-window {
        position: fixed;
        bottom: 6rem;
        right: 1.5rem;
        width: 360px;
        max-width: calc(100vw - 3rem);
        height: 500px;
        max-height: calc(100vh - 10rem);
        display: flex;
        flex-direction: column;
        background: rgba(10, 10, 15, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(0, 240, 255, 0.1);
        overflow: hidden;
        animation: slideUp 0.3s ease-out;
        z-index: 100;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* Mobile full-screen */
    @media (max-width: 480px) {
        .chat-window {
            bottom: 0;
            right: 0;
            width: 100vw;
            max-width: 100vw;
            height: calc(100vh - 4rem);
            max-height: calc(100vh - 4rem);
            border-radius: 1rem 1rem 0 0;
        }
    }

    .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: rgba(112, 0, 223, 0.2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: white;
    }

    .header-actions {
        display: flex;
        gap: 0.5rem;
    }

    .header-btn {
        padding: 0.5rem;
        border-radius: 0.5rem;
        color: #9ca3af;
        transition: all 0.2s;
    }

    .header-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        scroll-behavior: smooth;
    }

    .welcome-message {
        padding: 2rem 1rem;
    }

    .input-container {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .chat-input {
        flex: 1;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 0.75rem;
        color: white;
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s;
    }

    .chat-input:focus {
        border-color: #00f0ff;
    }

    .chat-input::placeholder {
        color: #6b7280;
    }

    .chat-input:disabled {
        opacity: 0.6;
    }

    .send-btn {
        padding: 0.75rem;
        background: linear-gradient(135deg, #00f0ff 0%, #0080ff 100%);
        border-radius: 0.75rem;
        color: #0a0a0a;
        transition: all 0.2s;
    }

    .send-btn:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
    }

    .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Typing indicator */
    .typing-indicator {
        display: flex;
        gap: 0.25rem;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 1rem;
        width: fit-content;
        margin-bottom: 0.75rem;
    }

    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #00f0ff;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) {
        animation-delay: 0s;
    }
    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }
    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes bounce {
        0%,
        80%,
        100% {
            transform: scale(0.6);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>
