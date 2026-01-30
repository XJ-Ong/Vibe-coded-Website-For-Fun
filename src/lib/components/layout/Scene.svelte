<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { penMode, gridScreenBounds } from "$lib/stores/drawingStore";

  let mouseX = $state(0);
  let mouseY = $state(0);
  let isPenMode = $state(false);
  let camera: THREE.PerspectiveCamera | null = null;

  // Subscribe to pen mode
  $effect(() => {
    const unsub = penMode.subscribe((v) => (isPenMode = v));
    return () => unsub();
  });

  // Create starfield geometry
  const starCount = 1000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  let rotation = $state(0);

  useTask((delta) => {
    rotation += delta * 0.05;
  });

  // Grid parameters
  const gridSize = 100;
  const gridZ = -20;
  const gridHalfSize = gridSize / 2;

  // Project grid corners to screen coordinates
  function updateGridScreenBounds() {
    if (!camera) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Grid corners in 3D world space (after rotation, the grid is in XY plane at z=-20)
    const corners = [
      new THREE.Vector3(-gridHalfSize, -gridHalfSize, gridZ), // bottom-left
      new THREE.Vector3(gridHalfSize, -gridHalfSize, gridZ), // bottom-right
      new THREE.Vector3(-gridHalfSize, gridHalfSize, gridZ), // top-left
      new THREE.Vector3(gridHalfSize, gridHalfSize, gridZ), // top-right
    ];

    // Project each corner to screen coordinates
    const screenCoords = corners.map((corner) => {
      const projected = corner.clone().project(camera!);
      return {
        x: ((projected.x + 1) / 2) * width,
        y: ((-projected.y + 1) / 2) * height,
      };
    });

    // Find bounding box
    const xs = screenCoords.map((c) => c.x);
    const ys = screenCoords.map((c) => c.y);

    gridScreenBounds.set({
      left: Math.min(...xs),
      right: Math.max(...xs),
      top: Math.min(...ys),
      bottom: Math.max(...ys),
    });
  }

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only update camera position if not in pen mode
      if (!isPenMode) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2; // Negated for consistent direction
      }
    };

    const handleResize = () => {
      updateGridScreenBounds();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  });

  // Update grid bounds when camera moves or pen mode changes
  $effect(() => {
    if (camera) {
      // Update camera position first
      camera.position.set(
        isPenMode ? 0 : mouseX * 2,
        isPenMode ? 0 : mouseY * 2,
        30,
      );
      camera.updateMatrixWorld();
      updateGridScreenBounds();
    }
  });

  function handleCameraRef(ref: THREE.PerspectiveCamera) {
    camera = ref;
    updateGridScreenBounds();
  }
</script>

<T.PerspectiveCamera
  makeDefault
  position={[isPenMode ? 0 : mouseX * 2, isPenMode ? 0 : mouseY * 2, 30]}
  fov={75}
  oncreate={handleCameraRef}
/>

<T.AmbientLight intensity={0.5} />

<!-- Starfield -->
<T.Points {geometry} rotation.y={rotation}>
  <T.PointsMaterial
    size={0.1}
    color="#00f0ff"
    transparent
    opacity={0.8}
    sizeAttenuation
  />
</T.Points>

<!-- Grid floor -->
<T.GridHelper
  args={[gridSize, 50, "#7000df", "#1a1a1a"]}
  rotation.x={Math.PI / 2}
  position={[0, 0, gridZ]}
/>
