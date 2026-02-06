import { writable } from 'svelte/store';
import * as THREE from 'three';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Z-position of the grid plane in 3D world space */
export const GRID_Z = -20;

// ============================================================================
// TYPES
// ============================================================================

export interface GridBounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface Point2D {
    x: number;
    y: number;
}

export interface DrawnLine {
    id: string;
    points: Point3D[];
}

// ============================================================================
// STORES
// ============================================================================

/** Whether pen/drawing mode is active */
export const penMode = writable(false);

/** Lines drawn by the user (stored in 3D world coordinates) */
export const drawnLines = writable<DrawnLine[]>([]);

/** Grid bounds projected to screen coordinates */
export const gridScreenBounds = writable<GridBounds>({
    left: 0,
    right: typeof window !== 'undefined' ? window.innerWidth : 1920,
    top: 0,
    bottom: typeof window !== 'undefined' ? window.innerHeight : 1080
});

/** Shared camera reference for coordinate conversions */
export const cameraStore = writable<THREE.PerspectiveCamera | null>(null);

/** Increments when camera moves to trigger re-projection */
export const cameraUpdateCounter = writable(0);

// ============================================================================
// ACTIONS
// ============================================================================

/** Clear all drawings */
export function clearDrawings(): void {
    drawnLines.set([]);
}

/** Generate a unique line ID */
export function generateLineId(): string {
    return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================================
// COORDINATE CONVERSION UTILITIES
// ============================================================================

/** Get current viewport dimensions */
function getViewportSize() {
    return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
}

/** Convert screen coordinates to 3D world coordinates on the grid plane */
export function screenToWorld(
    screenX: number,
    screenY: number,
    camera: THREE.PerspectiveCamera
): Point3D | null {
    if (!camera) return null;

    const { width, height } = getViewportSize();

    // Convert to normalized device coordinates (-1 to +1)
    const ndc = new THREE.Vector2(
        (screenX / width) * 2 - 1,
        -(screenY / height) * 2 + 1
    );

    // Raycast from camera through click point to grid plane
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -GRID_Z);
    const intersection = new THREE.Vector3();

    if (!raycaster.ray.intersectPlane(plane, intersection)) {
        return null;
    }

    return { x: intersection.x, y: intersection.y, z: intersection.z };
}

/** Convert 3D world coordinates to screen coordinates */
export function worldToScreen(
    point: Point3D,
    camera: THREE.PerspectiveCamera
): Point2D | null {
    if (!camera) return null;

    const { width, height } = getViewportSize();
    const vector = new THREE.Vector3(point.x, point.y, point.z).project(camera);

    // Point is behind camera
    if (vector.z > 1) return null;

    return {
        x: ((vector.x + 1) / 2) * width,
        y: ((-vector.y + 1) / 2) * height
    };
}
