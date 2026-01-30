<script lang="ts">
    import {
        penMode,
        drawnLines,
        generateLineId,
        gridScreenBounds,
        type Point,
        type DrawnLine,
        type GridBounds,
    } from "$lib/stores/drawingStore";

    let isDrawing = $state(false);
    let currentLine: Point[] = $state([]);
    let drawingArea: HTMLDivElement;

    // Subscribe to stores
    let isPenMode = $state(false);
    let lines: DrawnLine[] = $state([]);
    let gridBounds: GridBounds = $state({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    });

    $effect(() => {
        const unsubPen = penMode.subscribe((v) => (isPenMode = v));
        const unsubLines = drawnLines.subscribe((v) => (lines = v));
        const unsubBounds = gridScreenBounds.subscribe((v) => (gridBounds = v));
        return () => {
            unsubPen();
            unsubLines();
            unsubBounds();
        };
    });

    function getRelativePosition(e: MouseEvent): Point | null {
        if (!drawingArea) return null;
        const rect = drawingArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if within grid bounds (from 3D projection)
        if (
            e.clientX < gridBounds.left ||
            e.clientX > gridBounds.right ||
            e.clientY < gridBounds.top ||
            e.clientY > gridBounds.bottom
        ) {
            return null;
        }

        return { x, y };
    }

    function handleMouseDown(e: MouseEvent) {
        if (!isPenMode) return;
        // Only start drawing with primary button (left click)
        if (e.button !== 0) return;

        // Prevent default browser drag behavior (text selection, etc.)
        e.preventDefault();

        const pos = getRelativePosition(e);
        if (!pos) return;

        isDrawing = true;
        currentLine = [pos];
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isPenMode || !isDrawing) return;

        // Check if primary mouse button is still pressed (e.buttons uses bitmask, 1 = primary)
        // This fixes the bug where rapid clicking causes isDrawing to get stuck
        if ((e.buttons & 1) === 0) {
            finishLine();
            return;
        }

        const pos = getRelativePosition(e);
        if (!pos) {
            // If moved outside bounds, finish the current line
            finishLine();
            return;
        }

        currentLine = [...currentLine, pos];
    }

    function finishLine() {
        if (currentLine.length > 1) {
            drawnLines.update((prev) => [
                ...prev,
                {
                    id: generateLineId(),
                    points: currentLine,
                },
            ]);
        }

        isDrawing = false;
        currentLine = [];
    }

    function handleMouseUp() {
        if (!isPenMode || !isDrawing) return;
        finishLine();
    }

    function handleMouseLeave() {
        if (isDrawing) {
            finishLine();
        }
    }

    function pointsToPath(points: Point[]): string {
        if (points.length === 0) return "";
        const [first, ...rest] = points;
        return (
            `M ${first.x} ${first.y} ` +
            rest.map((p) => `L ${p.x} ${p.y}`).join(" ")
        );
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_no_noninteractive_tabindex -->
<div
    bind:this={drawingArea}
    class="drawing-canvas"
    class:pen-mode={isPenMode}
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onmouseleave={handleMouseLeave}
    role="application"
    aria-label="Drawing canvas"
>
    <!-- Visual grid boundary indicator in pen mode -->
    {#if isPenMode}
        <div
            class="grid-boundary"
            style="
                left: {gridBounds.left}px;
                top: {gridBounds.top}px;
                width: {gridBounds.right - gridBounds.left}px;
                height: {gridBounds.bottom - gridBounds.top}px;
            "
        ></div>
    {/if}

    <svg width="100%" height="100%">
        <!-- Saved lines -->
        {#each lines as line (line.id)}
            <path
                d={pointsToPath(line.points)}
                fill="none"
                stroke="#39ff14"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.8"
            />
        {/each}

        <!-- Current drawing line -->
        {#if currentLine.length > 0}
            <path
                d={pointsToPath(currentLine)}
                fill="none"
                stroke="#39ff14"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.8"
            />
        {/if}
    </svg>
</div>

<style>
    .drawing-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 5;
        pointer-events: none;
    }

    .drawing-canvas.pen-mode {
        pointer-events: auto;
        cursor: crosshair;
        user-select: none;
        -webkit-user-select: none;
    }

    .drawing-canvas svg {
        width: 100%;
        height: 100%;
    }

    .grid-boundary {
        position: absolute;
        border: 1px dashed rgba(112, 0, 223, 0.4);
        pointer-events: none;
        box-sizing: border-box;
    }
</style>
