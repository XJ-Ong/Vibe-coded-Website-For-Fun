# 🌐 Vibe-Coded Portfolio Website

A modern, interactive portfolio website built with SvelteKit and Three.js. Features a cyberpunk aesthetic with 3D starfield background, interactive drawing canvas, and smooth animations.

[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://netlify.com)
[![Built with SvelteKit](https://img.shields.io/badge/Built%20with-SvelteKit-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev)
[![Styled with TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

## ✨ Features

- **3D Starfield Background** - Interactive parallax effect using Three.js via Threlte
- **Drawing Canvas** - Draw freely on the website with pen mode
- **Responsive Design** - Looks great on all devices
- **Cyberpunk Theme** - Neon colors, glowing effects, and futuristic UI
- **Smooth Animations** - Powered by Motion library
- **Terminal-style UI** - Code-inspired design elements

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [SvelteKit](https://kit.svelte.dev) | Full-stack framework |
| [Threlte](https://threlte.xyz) | Three.js for Svelte |
| [TailwindCSS](https://tailwindcss.com) | Utility-first CSS |
| [DaisyUI](https://daisyui.com) | Component library |
| [Motion](https://motion.dev) | Animations |
| [Lucide](https://lucide.dev) | Icons |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/XJ-Ong/Vibe-coded-Website-For-Fun.git

# Navigate to the directory
cd Vibe-coded-Website-For-Fun

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   │   └── layout/     # Layout components (Navbar, Scene, DrawingCanvas)
│   ├── features/       # Feature-specific components
│   │   ├── hero/       # Hero section
│   │   ├── about/      # About section
│   │   └── projects/   # Projects showcase
│   ├── data/           # JSON data files
│   └── stores/         # Svelte stores
├── routes/             # SvelteKit routes
└── app.css             # Global styles
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ and AI assistance (vibe-coded)
- Inspired by cyberpunk aesthetics and developer portfolios
