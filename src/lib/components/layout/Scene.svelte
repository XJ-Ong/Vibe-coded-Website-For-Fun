<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { onMount } from "svelte";
  import * as THREE from "three";
  import {
    penMode,
    gridScreenBounds,
    cameraStore,
    cameraUpdateCounter,
    GRID_Z,
  } from "$lib/stores/drawingStore";

  // State
  let mouseX = $state(0);
  let mouseY = $state(0);
  let isPenMode = $state(false);
  let camera: THREE.PerspectiveCamera | null = null;

  // Constants
  const GRID_SIZE = 100;
  const STAR_COUNT = 1000;

  // Subscribe to pen mode
  $effect(() => {
    const unsub = penMode.subscribe((v) => (isPenMode = v));
    return () => unsub();
  });

  // Create starfield geometry (runs once)
  const starGeometry = createStarfield();

  function createStarfield(): THREE.BufferGeometry {
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }

  // Starfield rotation
  let rotation = $state(0);
  useTask((delta) => (rotation += delta * 0.05));

  // Project grid corners to screen bounds
  function updateGridScreenBounds() {
    if (!camera) return;

    const { clientWidth: w, clientHeight: h } = document.documentElement;
    const halfSize = GRID_SIZE / 2;

    const corners = [
      new THREE.Vector3(-halfSize, -halfSize, GRID_Z),
      new THREE.Vector3(halfSize, -halfSize, GRID_Z),
      new THREE.Vector3(-halfSize, halfSize, GRID_Z),
      new THREE.Vector3(halfSize, halfSize, GRID_Z),
    ];

    const screenCoords = corners.map((corner) => {
      const p = corner.clone().project(camera!);
      return { x: ((p.x + 1) / 2) * w, y: ((-p.y + 1) / 2) * h };
    });

    const xs = screenCoords.map((c) => c.x);
    const ys = screenCoords.map((c) => c.y);
    const pad = 1;

    gridScreenBounds.set({
      left: Math.max(pad, Math.min(...xs)),
      right: Math.min(w - pad, Math.max(...xs)),
      top: Math.max(pad, Math.min(...ys)),
      bottom: Math.min(h - pad, Math.max(...ys)),
    });
  }

  // Event listeners
  onMount(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isPenMode) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", updateGridScreenBounds);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", updateGridScreenBounds);
    };
  });

  // Update camera and trigger drawing re-projection
  $effect(() => {
    if (!camera) return;

    camera.position.set(
      isPenMode ? 0 : mouseX * 2,
      isPenMode ? 0 : mouseY * 2,
      30,
    );
    camera.updateMatrixWorld();
    updateGridScreenBounds();
    cameraStore.set(camera);
    cameraUpdateCounter.update((n) => n + 1);
  });

  function handleCameraRef(ref: THREE.PerspectiveCamera) {
    camera = ref;
    cameraStore.set(camera);
    updateGridScreenBounds();
  }

  // Computed camera position for template
  const camX = $derived(isPenMode ? 0 : mouseX * 2);
  const camY = $derived(isPenMode ? 0 : mouseY * 2);
</script>

<T.PerspectiveCamera
  makeDefault
  position={[camX, camY, 30]}
  fov={75}
  oncreate={handleCameraRef}
/>

<T.AmbientLight intensity={0.5} />

<T.Points geometry={starGeometry} rotation.y={rotation}>
  <T.PointsMaterial
    size={0.1}
    color="#00f0ff"
    transparent
    opacity={0.8}
    sizeAttenuation
  />
</T.Points>

<T.GridHelper
  args={[GRID_SIZE, 50, "#7000df", "#1a1a1a"]}
  rotation.x={Math.PI / 2}
  position={[0, 0, GRID_Z]}
/>
