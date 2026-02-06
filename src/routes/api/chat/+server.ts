import { json, error } from '@sveltejs/kit';
import { CHATBOT_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

// Models ranked by quality (best first) for fallback
// Each has separate rate limits, so we can cascade through them
const MODELS = [
    'llama-3.3-70b-versatile',           // Best quality, 100K TPD
    'meta-llama/llama-4-scout-17b-16e-instruct', // Llama 4, 500K TPD
    'openai/gpt-oss-120b',               // 120B params, 200K TPD
    'qwen/qwen3-32b',                    // Good quality, 500K TPD
    'llama-3.1-8b-instant',              // Fast, 500K TPD
];

// System prompt that gives PrawnKing its personality and context
const SYSTEM_PROMPT = `You are PrawnKing, an AI assistant for XJ-Ong's portfolio website.

CONTEXT:
- This is a developer portfolio showcasing projects and skills
- Sections: Home, About, Projects, Contact
- Theme: Cyberpunk/Terminal aesthetic with neon colors
- The user is visiting XJ-Ong's portfolio and may have questions


WEBSITE CONTENT (be accurate to this):
- Home: Welcome section with "Welcome" tagline in many different languages
- About: Shows XJ is from Malaysia, knows Python/C/C#/C++/Java, currently a Software Developer Intern
- Projects: Showcases XJ's development projects
- Contact: GitHub, Discord, and Email links
- Interactive Feature: Background has a drawing canvas - users can draw on the page background

RULES:
- Adapt to the user's language
- Be helpful and friendly, with a touch of tech-savvy humor but FACTUAL - don't embellish or make up details not listed above
- If asked about something not listed above, admit you don't have that info
- Keep responses concise (2-3 sentences max)
- ALWAYS complete your sentences - never end with incomplete thoughts, colons, or ellipses
- Can discuss the portfolio, projects, tech topics, or general questions
- Occasionally use tech/gaming references when appropriate
- Feel free to suggest trying the drawing feature when appropriate (e.g., if conversation is light or user seems curious)

ACTIONS:
When the user wants to trigger a website action, include in your response:
[ACTION:action_name]
- Only use actions when the user explicitly asks to navigate or perform an action.
- Only mention actions ONCE per response, never stack multiple actions

Available actions:
- scrollToHome - Navigate to home section
- scrollToAbout - Navigate to about section  
- scrollToProjects - Navigate to projects section
- scrollToContact - Navigate to contact section`;

// Helper function to call Groq API with a specific model
async function callGroqAPI(model: string, messages: Array<{ role: string, content: string }>) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHATBOT_API_KEY}`
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 500
        })
    });

    return response;
}

export const POST: RequestHandler = async ({ request }) => {
    if (!CHATBOT_API_KEY) {
        console.error('CHATBOT_API_KEY is not configured');
        throw error(500, 'Chatbot is not configured');
    }

    try {
        const body = await request.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            throw error(400, 'Messages array is required');
        }

        // Limit history to last 40 messages (20 exchanges) to prevent token overflow
        const MAX_HISTORY = 40;
        const trimmedMessages = messages.slice(-MAX_HISTORY);

        // Prepend system message to conversation
        const fullMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...trimmedMessages
        ];

        // Try each model in order until one succeeds
        let lastError: string | null = null;

        for (const model of MODELS) {
            const response = await callGroqAPI(model, fullMessages);

            // If rate limited (429), try next model
            if (response.status === 429) {
                console.log(`Model ${model} rate limited, trying next...`);
                lastError = `Rate limited on ${model}`;
                continue;
            }

            // If other error, try next model
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Model ${model} error:`, errorText);
                lastError = errorText;
                continue;
            }

            // Success! Parse and return response
            const data = await response.json();
            const reply = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

            // Parse any actions from the response (handle optional space after colon)
            const actionMatch = reply.match(/\[ACTION:\s*(\w+)\]/);
            const action = actionMatch ? actionMatch[1] : null;
            const cleanReply = reply.replace(/\[ACTION:\s*\w+\]/g, '').trim();

            console.log(`Response from model: ${model}`);

            return json({
                reply: cleanReply,
                action: action,
                model: model // Include which model was used (for debugging)
            });
        }

        // All models failed
        console.error('All models exhausted:', lastError);
        throw error(503, 'All AI models are currently unavailable. Please try again later.');

    } catch (err) {
        console.error('Chat API error:', err);
        if (err instanceof Error && 'status' in err) {
            throw err;
        }
        throw error(500, 'Failed to process chat request');
    }
};
