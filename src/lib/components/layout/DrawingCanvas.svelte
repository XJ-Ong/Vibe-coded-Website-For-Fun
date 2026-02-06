<script lang="ts">
    import {
        penMode,
        drawnLines,
        generateLineId,
        gridScreenBounds,
        cameraStore,
        cameraUpdateCounter,
        screenToWorld,
        worldToScreen,
        type Point3D,
        type Point2D,
        type DrawnLine,
        type GridBounds,
    } from "$lib/stores/drawingStore";
    import type * as THREE from "three";

    // State
    let isDrawing = $state(false);
    let currentLine: Point3D[] = $state([]);

    // Store subscriptions
    let isPenMode = $state(false);
    let lines: DrawnLine[] = $state([]);
    let gridBounds: GridBounds = $state({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    });
    let camera: THREE.PerspectiveCamera | null = $state(null);
    let updateCount = $state(0);

    // Projected screen coordinates
    let projectedLines: { id: string; points: Point2D[] }[] = $state([]);
    let projectedCurrentLine: Point2D[] = $state([]);

    // Subscribe to all stores
    $effect(() => {
        const subs = [
            penMode.subscribe((v) => (isPenMode = v)),
            drawnLines.subscribe((v) => (lines = v)),
            gridScreenBounds.subscribe((v) => (gridBounds = v)),
            cameraStore.subscribe((v) => (camera = v)),
            cameraUpdateCounter.subscribe((v) => (updateCount = v)),
        ];
        return () => subs.forEach((unsub) => unsub());
    });

    // Re-project all lines when camera moves
    $effect(() => {
        if (!camera) return;
        void updateCount;

        projectedLines = lines.map((line) => ({
            id: line.id,
            points: line.points
                .map((p) => worldToScreen(p, camera!))
                .filter((p): p is Point2D => p !== null),
        }));

        projectedCurrentLine = currentLine
            .map((p) => worldToScreen(p, camera!))
            .filter((p): p is Point2D => p !== null);
    });

    // Helpers
    function isWithinBounds(x: number, y: number): boolean {
        return (
            x >= gridBounds.left &&
            x <= gridBounds.right &&
            y >= gridBounds.top &&
            y <= gridBounds.bottom
        );
    }

    function getWorldPos(clientX: number, clientY: number): Point3D | null {
        return camera ? screenToWorld(clientX, clientY, camera) : null;
    }

    function startDrawing(clientX: number, clientY: number) {
        if (!isPenMode || !camera || !isWithinBounds(clientX, clientY)) return;
        const pos = getWorldPos(clientX, clientY);
        if (pos) {
            isDrawing = true;
            currentLine = [pos];
        }
    }

    function continueDrawing(clientX: number, clientY: number) {
        if (!isPenMode || !isDrawing || !camera) return;
        if (!isWithinBounds(clientX, clientY)) {
            finishLine();
            return;
        }
        const pos = getWorldPos(clientX, clientY);
        if (pos) {
            currentLine = [...currentLine, pos];
        } else {
            finishLine();
        }
    }

    function finishLine() {
        if (currentLine.length > 1) {
            drawnLines.update((prev) => [
                ...prev,
                { id: generateLineId(), points: currentLine },
            ]);
        }
        isDrawing = false;
        currentLine = [];
    }

    function pointsToPath(points: Point2D[]): string {
        if (points.length === 0) return "";
        const [first, ...rest] = points;
        return (
            `M ${first.x} ${first.y} ` +
            rest.map((p) => `L ${p.x} ${p.y}`).join(" ")
        );
    }

    // Mouse event handlers
    function onMouseDown(e: MouseEvent) {
        if (e.button !== 0) return;
        e.preventDefault();
        startDrawing(e.clientX, e.clientY);
    }

    function onMouseMove(e: MouseEvent) {
        if ((e.buttons & 1) === 0) {
            if (isDrawing) finishLine();
            return;
        }
        continueDrawing(e.clientX, e.clientY);
    }

    function onMouseUp() {
        if (isDrawing) finishLine();
    }

    // Touch event handlers (for mobile)
    function onTouchStart(e: TouchEvent) {
        if (!isPenMode || e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        startDrawing(touch.clientX, touch.clientY);
    }

    function onTouchMove(e: TouchEvent) {
        if (!isDrawing || e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        continueDrawing(touch.clientX, touch.clientY);
    }

    function onTouchEnd() {
        if (isDrawing) finishLine();
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="drawing-canvas"
    class:pen-mode={isPenMode}
    onmousedown={onMouseDown}
    onmousemove={onMouseMove}
    onmouseup={onMouseUp}
    onmouseleave={onMouseUp}
    ontouchstart={onTouchStart}
    ontouchmove={onTouchMove}
    ontouchend={onTouchEnd}
    ontouchcancel={onTouchEnd}
    role="application"
    aria-label="Drawing canvas"
>
    {#if isPenMode}
        <div
            class="grid-boundary"
            style="left:{gridBounds.left}px; top:{gridBounds.top}px; 
                   width:{gridBounds.right - gridBounds.left}px; 
                   height:{gridBounds.bottom - gridBounds.top}px"
        ></div>
    {/if}

    <svg width="100%" height="100%">
        {#each projectedLines as line (line.id)}
            <path d={pointsToPath(line.points)} class="drawing-line" />
        {/each}

        {#if projectedCurrentLine.length > 0}
            <path d={pointsToPath(projectedCurrentLine)} class="drawing-line" />
        {/if}
    </svg>
</div>

<style>
    .drawing-canvas {
        position: fixed;
        inset: 0;
        z-index: 5;
        pointer-events: none;
        touch-action: none; /* Prevent scroll/zoom while drawing */
    }

    .drawing-canvas.pen-mode {
        pointer-events: auto;
        cursor: crosshair;
        user-select: none;
    }

    .drawing-canvas svg {
        width: 100%;
        height: 100%;
    }

    .drawing-line {
        fill: none;
        stroke: #39ff14;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        opacity: 0.8;
    }

    .grid-boundary {
        position: absolute;
        border: 1px dashed rgba(112, 0, 223, 0.4);
        pointer-events: none;
    }
</style>
