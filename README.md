# AYUCASE — Clinical Intelligence & Patient Narrative Platform

> **Uniting Patient Narratives with Physician Clinical Intelligence**  
> AYUCASE bridges patient health stories, multi-format medical documents, chronological timelines, and clinical decision support into a single, cohesive, and accessible health record experience.

---

## 🌟 Overview & Product Philosophy

In modern healthcare, patient narratives and clinical documentation often exist in fragmented silos. **AYUCASE** provides a calm, unified, human-centered clinical workspace designed with a dual-portal architecture:

1. **Patient Health Space**:
   - **Guided Clinical Interview**: Voice-first and structured patient questionnaires with natural speech-to-text input and entity extraction.
   - **My Health Story**: Patient-voiced narrative synthesis with progressive symptom timelines and medication experience tracking.
   - **Interactive Health Timeline**: Chronological event mapping, identifying missing data gaps and medical encounters.
   - **Document Repository**: Drag-and-drop ingestion of laboratory reports, radiology scans, discharge summaries, and DICOM with OCR simulation.
   - **Consent Control Center**: Granular autonomy over medical records with verifiable audit tokens (Granted, Pending, Not Granted, Withdrawn).
   - **AyuCase Care Capsule**: Exportable, printable, patient-centric health dossier summary.
   - **Elder Mode & Universal Accessibility**: High-contrast, large touch targets, font scaling, screen reader announcements, and multilingual support (English, தமிழ், हिन्दी, etc.).

2. **Physician Clinical Workstation**:
   - **Attention-Focused Dashboard**: Real-time patient triage queue highlighting completeness, critical condition badges, and case updates.
   - **Responsive 3-Panel Clinical Workspace**:
     - *Left*: Patient context, demographic markers, and consent statuses.
     - *Center*: Clinical synthesis, diagnostic impression, treatment pathways, and structured notes.
     - *Right*: Source traceability, clinical evidence, and timeline validation.
   - **Contradiction Radar**: Discrepancy detector identifying variances between patient voice statements and laboratory/clinical documentation.
   - **Clinical Intelligence Suite**: Case Constellation graph, Case DNA fingerprinting, and Patient Voice semantic analysis.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev) with [TypeScript](https://www.typescriptlang.org)
- **Bundler & Build Tool**: [Vite 6](https://vitejs.dev)
- **Routing**: [React Router v7](https://reactrouter.com) (`BrowserRouter` with clean SPA rewrites)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with bespoke healthcare tokens (Emerald/Teal/Cyan palette, Slate neutrals)
- **Animations & Transitions**: [Framer Motion](https://www.framer.com/motion/) with `prefers-reduced-motion` compliance
- **3D Visualization**: [Three.js](https://threejs.org) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **Icons**: [Lucide React](https://lucide.dev)
- **Persistence**: Safe `localStorage` adapter with default fallbacks and error boundaries

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation
```bash
git clone https://github.com/your-org/ayucase.git
cd ayucase
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
Generates production-optimized assets in `dist/`.

### Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Architecture

```
ayucase/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Brand illustrations and media assets
│   ├── components/
│   │   ├── accessibility/  # Modal & floating accessibility widgets
│   │   ├── canvas/         # 3D medical interactive canvas
│   │   ├── capsule/        # Care capsule summary, card & print modals
│   │   ├── contradiction/  # Contradiction radar & discrepancy cards
│   │   ├── dashboard/      # Journey steppers, notification center
│   │   ├── documents/      # Dropzones, viewers, traceability explorers
│   │   ├── elder/          # Elder mode views, medication boards, visit guides
│   │   ├── family/         # Family health tree graph and member cards
│   │   ├── intelligence/   # Constellation graph, DNA fingerprint, gap detector
│   │   ├── interview/      # Voice waveform, structured entities, pipeline
│   │   ├── layout/         # Streamlined Topbar, Sidebar, Drawer
│   │   ├── physician/      # 3-panel workstation panels, patient queue, briefs
│   │   ├── timeline/       # Interactive time slider, year detector, nodes
│   │   └── ui/             # AyuCase design system primitives (AyuButton, AyuCard, etc.)
│   ├── contexts/           # Auth, Patient, Physician, A11y, Consent, Language, Theme
│   ├── data/               # Mock clinical cases, patient profiles, translations
│   ├── hooks/              # Custom hooks for speech, media, keyboard shortcuts
│   ├── layouts/            # RootLayout, AuthLayout, PatientLayout, PhysicianLayout
│   ├── pages/
│   │   ├── landing/        # Calm product hero, features, and workflow
│   │   ├── patient/        # Dashboard, Story, Interview, Documents, Capsule, etc.
│   │   └── physician/      # Workstation, Patients, Case Detail, Radar, Settings
│   ├── types/              # Domain TypeScript interfaces
│   ├── utils/              # Formatters, helpers, and clinical calculations
│   ├── App.tsx             # Route declarations
│   ├── index.css           # Design tokens, accessibility modes, utility classes
│   └── main.tsx            # Application entrypoint & providers
├── vercel.json             # Vercel SPA routing rewrite configuration
└── vite.config.ts          # Vite configuration
```

---

## 🌐 Deployment Notes (Vercel, Netlify, Cloudflare)

This application is built as a single-page application using client-side `BrowserRouter`. A root-level `vercel.json` rewrite configuration is provided:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This guarantees direct navigation and browser page refreshes work smoothly across all deep routes:
- `/patient/dashboard`
- `/patient/story`
- `/patient/documents`
- `/patient/capsule`
- `/physician/dashboard`
- `/physician/case/:id`

---

## 🛡️ Privacy, Consent & Demo Status

> **Demo Simulation Environment**: All medical records, clinical cases, laboratory values, and patient profiles presented in this environment are simulated demonstration data stored within browser local storage. No actual personal health information (PHI) or government identifiers (such as Aadhaar or ABHA) are collected or transmitted to external servers.
