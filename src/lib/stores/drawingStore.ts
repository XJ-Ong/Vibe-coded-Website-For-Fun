import { writable } from 'svelte/store';

// Pen Mode state
export const penMode = writable<boolean>(false);

// Grid bounds in screen coordinates (set by Scene.svelte)
export interface GridBounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

export const gridScreenBounds = writable<GridBounds>({
    left: 0,
    right: isBrowser ? window.innerWidth : 1920,
    top: 0,
    bottom: isBrowser ? window.innerHeight : 1080
});

// Drawn lines data
export interface Point {
    x: number;
    y: number;
}

export interface DrawnLine {
    id: string;
    points: Point[];
}

export const drawnLines = writable<DrawnLine[]>([]);

// Helper to generate unique IDs
export function generateLineId(): string {
    return `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Clear all drawings
export function clearDrawings(): void {
    drawnLines.set([]);
}
