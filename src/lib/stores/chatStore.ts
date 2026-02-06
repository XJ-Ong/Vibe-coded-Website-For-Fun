import { writable, get } from 'svelte/store';

// ============================================================================
// TYPES
// ============================================================================

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface ChatState {
    messages: ChatMessage[];
    isOpen: boolean;
    isLoading: boolean;
}

// Action handlers registry for future function triggering
type ActionHandler = () => void;
const actionHandlers = new Map<string, ActionHandler>();

// ============================================================================
// STORES
// ============================================================================

const initialState: ChatState = {
    messages: [],
    isOpen: false,
    isLoading: false
};

export const chatState = writable<ChatState>(initialState);

// ============================================================================
// ACTIONS
// ============================================================================

/** Generate unique message ID */
function generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Open the chat window */
export function openChat(): void {
    chatState.update(s => ({ ...s, isOpen: true }));
}

/** Close the chat window */
export function closeChat(): void {
    chatState.update(s => ({ ...s, isOpen: false }));
}

/** Toggle chat window */
export function toggleChat(): void {
    chatState.update(s => ({ ...s, isOpen: !s.isOpen }));
}

/** Clear conversation and start fresh */
export function newConversation(): void {
    chatState.update(s => ({ ...s, messages: [], isLoading: false }));
}

/** Register an action handler for chatbot-triggered actions */
export function registerAction(name: string, handler: ActionHandler): void {
    actionHandlers.set(name, handler);
}

/** Execute a chatbot action if registered */
function executeAction(actionName: string): void {
    const handler = actionHandlers.get(actionName);
    if (handler) {
        handler();
    } else {
        console.warn(`Unknown chat action: ${actionName}`);
    }
}

/** Send a message and get AI response */
export async function sendMessage(content: string): Promise<void> {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now()
    };

    // Add user message and set loading
    chatState.update(s => ({
        ...s,
        messages: [...s.messages, userMessage],
        isLoading: true
    }));

    try {
        // Prepare messages for API (only role and content)
        const state = get(chatState);
        const apiMessages = state.messages.map(m => ({
            role: m.role,
            content: m.content
        }));

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: apiMessages })
        });

        if (!response.ok) {
            throw new Error('Failed to get response');
        }

        const data = await response.json();

        const assistantMessage: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: data.reply,
            timestamp: Date.now()
        };

        chatState.update(s => ({
            ...s,
            messages: [...s.messages, assistantMessage],
            isLoading: false
        }));

        // Execute action if present
        if (data.action) {
            executeAction(data.action);
        }

    } catch (err) {
        console.error('Chat error:', err);

        const errorMessage: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: Date.now()
        };

        chatState.update(s => ({
            ...s,
            messages: [...s.messages, errorMessage],
            isLoading: false
        }));
    }
}
