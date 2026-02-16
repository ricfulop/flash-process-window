# Flash Process Parameters for Metals

An interactive web application for computing and visualizing the **flash process window** of pure metals — the regime of current density and electric field where defect-mediated flash onset occurs before thermal loss of cohesion (LOC).

**Live demo → [flash-process-window.onrender.com](https://flash-process-window.onrender.com/)**

---

## What is Flash?

Flash is a rapid, non-equilibrium phenomenon in which a solid metal specimen under an applied electric field undergoes an abrupt increase in power dissipation, enabling ultra-fast Joule heating. Unlike conventional sintering (which applies to ceramics and powders), flash in solid metals occurs when the electric field exceeds a material-specific threshold — the **voltivity** (λ) — triggering phonon-softened defect nucleation within a coherence length *r*.

This calculator helps experimentalists determine whether a given metal, geometry, and ramp rate will reach flash onset before the specimen melts.

## Features

- **51 pure metals** from the Voltivity DFT Handbook v12, spanning alkali metals, alkaline earths, 3d/4d/5d transition metals, post-transition metals, lanthanides, and actinides
- **Full periodic table selector** — standard 18-column IUPAC layout with all 118 elements; non-database elements greyed out
- **Process Window chart** — Emax vs. Normalized Ramp (NR) scatter plot showing your design point relative to the adiabatic and cooling-limited regimes
- **E(J) curves** — electric field vs. current density for all metals simultaneously, with flash onset and LOC markers
- **Fin + clip thermal model** — accounts for both convective cooling and axial heat conduction to clip contacts
- **Dynamic J_LOC estimation** — scales from reference calibration data (Ti, Ni, Cu, Al) using geometric and ramp-rate corrections
- **Power supply settings** — calculates current ramp (dI/dt), estimated time to flash onset and LOC
- **Flash thresholds table** — compact 4-column view of E_flash and λ for all 51 metals
- **Foil & wire geometries** — adjustable thickness, width, diameter, and gauge length
- **Comparison table** — side-by-side properties and derived quantities for all metals
- **Built-in technical guide** — comprehensive explanation of the physics, formulas, and how to use the tool

## Physics Model

The application implements a thermal model with two heat-loss paths:

1. **Convective cooling**: q_conv = h × (P/A), where P = perimeter, A = cross-section
2. **Axial clip conduction** (fin model): q_clip = 2 × k_th × m × tanh(mL/2) / L

The **Loss of Cohesion** current density J_LOC is the point where Joule heating (ρ_m × J²) balances total cooling at ΔT = T_m − 300K. The **flash onset** occurs at a lower current density where E = λ/r (the voltivity threshold).

Key variables:
| Symbol | Description |
|--------|-------------|
| λ (voltivity) | Fundamental material constant [V/cm × µm] for resonant electron–phonon coupling |
| r | Defect nucleation coherence length [µm] |
| E_flash | Flash onset threshold: E_flash = λ / r [V/cm] |
| J_LOC | Loss of Cohesion current density [A/mm²] |
| N_R | Normalized ramp: t_ramp / τ_cool |
| E_max | Peak electric field at LOC [V/cm] |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
git clone https://github.com/ricfulop/flash-process-window.git
cd flash-process-window
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

The production build outputs to `dist/`.

## Deployment

The app is configured for deployment on [Render](https://render.com) via `render.yaml`. Pushing to `main` triggers an automatic deploy to [flash-process-window.onrender.com](https://flash-process-window.onrender.com/).

## Tech Stack

- **React 19** — UI components
- **Recharts** — interactive charts (ScatterChart, LineChart)
- **Vite 7** — build tool and dev server
- **Vanilla CSS** — inline styles, no framework

## Project Structure

```
flash-process-window/
├── index.html              # Entry point
├── src/
│   ├── main.jsx            # React mount
│   ├── ProcessWindowV5.jsx # Main application (DB, models, UI)
│   ├── FlashGuide.jsx      # Technical guide modal
│   ├── App.jsx             # App wrapper
│   └── *.css               # Styles
├── render.yaml             # Render deployment config
├── package.json
└── vite.config.js
```

## Data Sources

- Metal properties (ρ₀, ρ_m, T_m, C_p, ρ_m, k_th): CRC Handbook of Chemistry and Physics, ASM Handbooks
- Voltivity values (λ): Voltivity DFT Handbook v12 (Fulop et al.)
- Experimental calibration data: Ti (R14-R19), Ni (R8), Cu (R1-R5), Al (R6-R7)

## References

- Das, S. et al. — Flash sintering and loss of cohesion studies
- Fulop, R. — Voltivity framework and DFT calculations

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

**Ric Fulop** — MIT Center for Bits and Atoms

© 2026 Ric Fulop. All rights reserved.
