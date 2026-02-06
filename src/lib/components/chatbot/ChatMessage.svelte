<script lang="ts">
    import type { ChatMessage } from "$lib/stores/chatStore";

    interface Props {
        message: ChatMessage;
    }

    let { message }: Props = $props();
</script>

<div
    class="message-wrapper"
    class:user={message.role === "user"}
    class:assistant={message.role === "assistant"}
>
    <div class="message-bubble">
        <p>{message.content}</p>
    </div>
</div>

<style>
    .message-wrapper {
        display: flex;
        margin-bottom: 0.75rem;
    }

    .message-wrapper.user {
        justify-content: flex-end;
    }

    .message-wrapper.assistant {
        justify-content: flex-start;
    }

    .message-bubble {
        max-width: 80%;
        padding: 0.75rem 1rem;
        border-radius: 1rem;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .user .message-bubble {
        background: linear-gradient(135deg, #00f0ff 0%, #0080ff 100%);
        color: #0a0a0a;
        border-bottom-right-radius: 0.25rem;
    }

    .assistant .message-bubble {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #e0e0e0;
        border-bottom-left-radius: 0.25rem;
    }

    .message-bubble p {
        margin: 0;
        word-wrap: break-word;
    }
</style>
