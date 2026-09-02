# Usama Ashraf — 3D Portfolio

Personal portfolio site for **Usama Ashraf**, Solution Architect and Full Stack AI & Web3 developer. Built with React, TypeScript, Three.js and GSAP, it pairs a scroll-driven 3D character scene with animated sections, a custom cursor, and a project gallery.

**Live site:** [www.usamaash.dev](https://www.usamaash.dev/)

## Contact

- **Email:** [usamaashraf127@gmail.com](mailto:usamaashraf127@gmail.com)
- **LinkedIn:** [linkedin.com/in/usamaashraf127](https://www.linkedin.com/in/usamaashraf127/)
- **GitHub:** [github.com/Usama397](https://github.com/Usama397)

## Table of Contents

- [About](#about)
- [Site Sections](#site-sections)
- [Featured Work](#featured-work)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [The 3D Character Scene](#the-3d-character-scene)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Editing the Content](#editing-the-content)
- [GSAP License Note](#gsap-license-note)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [License](#license)

## About

I turn ambitious ideas into production-grade AI and Web3 platforms. From architecture to launch, I build products that scale cleanly, move fast, and earn trust.

**Solution Architect — System Design & Technical Strategy**
Turning business requirements into scalable, cloud-native systems with clean API boundaries, solid data models, and automated delivery.
`System Design` `AWS` `Microservices` `REST APIs` `Docker & CI/CD` `PostgreSQL`

**Full Stack AI & Web3 — Intelligent Apps & Onchain Systems**
Pairing LLM-powered features with smart contracts: RAG pipelines, agent tooling, and wallet-connected dApps on EVM chains.
`Next.js` `Node.js` `TypeScript` `LLMs & RAG` `Solidity` `ethers.js`

### Education & Learning

| | | |
| --- | --- | --- |
| **Computer Science** | Abasyn University | 2024–28 |
| **Full Stack Development** | Self-taught & projects | 2023–now |

## Site Sections

| Section | Component | Purpose |
| --- | --- | --- |
| Landing | `Landing.tsx` | Animated intro over the 3D character scene |
| About | `About.tsx` | Short positioning statement |
| What I Do | `WhatIDo.tsx` | The two practice areas and their toolsets |
| Career | `Career.tsx` | Education and learning timeline |
| Work | `Work.tsx` | Featured project gallery |
| Tech Stack | `TechStack.tsx` | Marquee of tools and frameworks |
| Contact | `Contact.tsx` | Direct links and social profiles |

## Featured Work

| Project | Focus | Stack |
| --- | --- | --- |
| [AminoArcade](#) | Peptide marketplace & protocol tracking | Next.js, TypeScript, Node.js, PostgreSQL, Stripe |
| [Fika Duka](https://fikaduka.com) | Retail distribution, field sales & logistics | React Native, Node.js, PostgreSQL, Maps API |
| [NexSentia](https://nexsentia.com) | Organizational friction detection | Next.js, Python, LLMs, RAG, PostgreSQL |
| [OFFR](https://of-fr.com) | Local deals, experience booking & rewards | React Native, Node.js, PostgreSQL, Stripe |
| Zooni | F45 fitness SaaS marketplace | Next.js, TypeScript, Node.js, Stripe, AWS |
| [CSPERKS](https://csperks.com) | CS2 match & inventory analytics | Next.js, TypeScript, Node.js, Redis, Steam API |
| [VNEXIA](https://vnexia.com) | AI-powered health & safety | Next.js, Python, LLMs, Computer Vision, AWS |
| [SENOA](https://senoaapp.com) | Crypto-native social commerce | Next.js, TypeScript, Solidity, wagmi, Node.js |

Project entries live in the `projects` array at the top of `src/components/Work.tsx`.

## Tech Stack

**Core** — React 18, TypeScript, Vite

**3D & animation** — Three.js, `three-stdlib`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-three/cannon`, `@react-three/rapier`, GSAP with `@gsap/react` (ScrollTrigger, ScrollSmoother, SplitText)

**Supporting** — `react-icons`, `react-fast-marquee`, `@vercel/analytics`

## Project Structure

```text
.
├── public/
│   ├── draco/                 # Draco decoder for compressed geometry
│   ├── images/                # Section art, tech logos
│   │   └── projects/          # Work gallery thumbnails
│   └── models/
│       ├── character.enc      # AES-encrypted 3D character (GLB)
│       └── char_enviorment.hdr
├── src/
│   ├── components/
│   │   ├── Character/         # 3D scene setup
│   │   │   ├── Scene.tsx      # Renderer, camera, render loop
│   │   │   └── utils/         # Model loading, lighting, animation, input
│   │   ├── styles/            # Per-section CSS
│   │   ├── utils/             # GSAP scroll timelines, intro FX, text splitting
│   │   └── *.tsx              # Page sections
│   ├── context/               # Loading state provider
│   ├── data/                  # Bone name lists for the character rig
│   ├── types/                 # GSAP plugin type declarations
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## The 3D Character Scene

The centrepiece is a rigged character that reacts to the cursor and animates as you scroll.

- **Encrypted model.** The GLB ships as `public/models/character.enc` and is decrypted in the browser via the Web Crypto API (`Character/utils/decrypt.ts`) before being handed to `GLTFLoader`.
- **Draco compression.** Geometry is decoded with the decoder in `public/draco/`.
- **Scroll choreography.** `components/utils/GsapScroll.ts` drives the character's pose and camera through the page using GSAP ScrollTrigger.
- **Cursor tracking.** The head bone follows the pointer near the top of the page (`Character/utils/mouseUtils.ts`).
- **Appearance tweaks.** Outfit colour and the character's beard are applied at load time in `Character/utils/character.ts` and `Character/utils/facialHair.ts`, by cloning materials rather than editing the model.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/Usama397/<repository-name>.git
cd 3d-portfolio-main
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`). The dev server runs with `--host`, so the site is also reachable from other devices on your network.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server, exposed on the local network |
| `npm run build` | Type-check with `tsc -b`, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## Editing the Content

- **Name, headline, intro** — `src/components/Landing.tsx` and the `<title>` in `index.html`
- **About blurb** — `src/components/About.tsx`
- **Practice areas and skill tags** — `src/components/WhatIDo.tsx`
- **Education timeline** — `src/components/Career.tsx`
- **Projects** — the `projects` array in `src/components/Work.tsx`, with images in `public/images/projects/`
- **Contact details and social links** — `src/components/Contact.tsx`, `src/components/SocialIcons.tsx`, `src/components/Navbar.tsx`
- **Styling** — per-section CSS in `src/components/styles/`, globals in `src/index.css` and `src/App.css`

## GSAP License Note

This project uses the standard `gsap` package, which now includes the formerly premium plugins (ScrollSmoother, SplitText) in core. If you are migrating from an older setup, remove any `gsap-trial` dependency first. See the [GSAP installation docs](https://gsap.com/docs/v3/Installation/).

## Troubleshooting

**Blank screen in development**
Check the browser console for module import errors and confirm dependencies installed cleanly.

**`Failed to resolve entry for package` or truncated source maps**
Usually a partially written `node_modules` from an interrupted install. Reinstall the offending package, or `rm -rf node_modules && npm ci`.

**Character never appears / loading bar stalls**
The model is decrypted and Draco-decoded in the browser. Confirm `public/models/character.enc` and `public/draco/` are being served, and that the page has a WebGL context.

**Poor performance on low-end devices**
Reduce post-processing and scene complexity in `src/components/Character/`.

**TypeScript build failures**
`noUnusedLocals` is enabled, so unused imports fail the build. Run `npm run build` and clear reported errors before deploying.

## Deployment

```bash
npm run build     # outputs to dist/
npm run preview   # verify locally
```

Deploy `dist/` to any static host — Vercel, Netlify, or Cloudflare Pages. `@vercel/analytics` is wired up, so page analytics work out of the box on Vercel.

## License

Released under the [MIT License](LICENSE). © 2026 Usama Ashraf.
