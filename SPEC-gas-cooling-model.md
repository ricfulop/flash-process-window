# Feature Spec: Gas-Dependent Convective + Radiative Cooling Model

## Summary

Upgrade the thermal loss model in Flash Process Window to include **pressure-dependent gas convection**, **gas-species-dependent thermal conductivity**, and **linearized radiation** — all expressed as effective heat transfer coefficients compatible with Newton's law of cooling. The user selects a gas atmosphere and chamber pressure; the model computes `h_total = h_conv + h_rad` and feeds it into the existing J_LOC calculation.

---

## Motivation

The current model uses a single convective heat transfer coefficient `h`. In practice, flash experiments run under controlled atmospheres (forming gas, argon, hydrogen) at pressures ranging from 1 atm down to rough vacuum (<1 torr). The actual cooling a specimen sees varies dramatically:

- **Gas species matters**: H₂ has ~7× the thermal conductivity of N₂ or Ar. A specimen in pure H₂ cools much faster than in Ar.
- **Pressure matters**: Below ~100 torr, natural convection dies and only gas-phase conduction remains. Below ~1 torr, even conduction degrades (Knudsen regime).
- **Radiation dominates at high T**: Above ~500°C, radiative losses (∝ T⁴) exceed gas-phase losses for most geometries. Radiation depends on surface emissivity, not gas species.

Without this, J_LOC estimates can be off by 2–5× depending on the actual experimental conditions.

---

## Gas Property Database

### Pure Gas Properties (Temperature-Dependent)

Store thermal conductivity `k(T)`, viscosity `μ(T)`, and specific heat `Cp(T)` as polynomial or linear fits for three gases. All properties evaluated at **film temperature** `T_film = (T_surface + T_wall) / 2`.

#### Thermal Conductivity k (W/m·K) — Linear fits valid 300–1200 K

| Gas | k(T) approximation | k at 300 K | k at 750 K | k at 1000 K |
|-----|---------------------|------------|------------|-------------|
| N₂  | 0.0258 + 5.58e-5 × (T − 300) | 0.026 | 0.051 | 0.065 |
| H₂  | 0.182 + 3.30e-4 × (T − 300) | 0.182 | 0.331 | 0.413 |
| Ar  | 0.018 + 3.80e-5 × (T − 300) | 0.018 | 0.035 | 0.045 |

#### Viscosity μ (Pa·s) — Power law: μ = μ_ref × (T/T_ref)^0.7

| Gas | μ at 300 K (Pa·s) |
|-----|-------------------|
| N₂  | 1.79e-5 |
| H₂  | 0.89e-5 |
| Ar  | 2.27e-5 |

#### Specific Heat Cp (J/kg·K) — approximately constant over range

| Gas | Cp (J/kg·K) | Molar mass (g/mol) |
|-----|-------------|---------------------|
| N₂  | 1040 | 28.0 |
| H₂  | 14300 | 2.016 |
| Ar  | 520 | 39.95 |

### Gas Mixtures

For **forming gas (95% N₂ / 5% H₂ by volume)**, use mole-fraction-weighted mixing:

```
k_mix = x_N2 × k_N2 + x_H2 × k_H2
μ_mix = x_N2 × μ_N2 + x_H2 × μ_H2
Cp_mix = (x_N2 × M_N2 × Cp_N2 + x_H2 × M_H2 × Cp_H2) / M_mix
M_mix = x_N2 × M_N2 + x_H2 × M_H2
```

This is a simple linear mixing rule. Wilke's rule is more accurate for viscosity but overkill for this application.

---

## Thermal Model

### 1. Convective Heat Transfer Coefficient — `h_conv`

Use the **Churchill-Chu correlation for natural convection from a horizontal cylinder** (the dominant geometry for foil/wire specimens):

```
Nu = { 0.60 + 0.387 × [Ra / (1 + (0.559/Pr)^(9/16))^(16/9)]^(1/6) }²
h_conv = Nu × k_gas / D_char
```

Where:
- `D_char` = characteristic length (wire diameter, or `2 × thickness` for foil)
- `Ra = (g × β × ΔT × D_char³) / (ν × α)` — Rayleigh number
- `β = 1 / T_film` (ideal gas)
- `ν = μ / ρ` — kinematic viscosity
- `α = k / (ρ × Cp)` — thermal diffusivity
- `ρ = P × M / (R × T_film)` — gas density (ideal gas, scales with pressure)
- `Pr = μ × Cp / k` — Prandtl number

**Critical pressure dependence**: Since `ρ ∝ P`, we get `Ra ∝ P²`. Convection shuts down rapidly below ~100 torr.

#### Pressure Regimes

| Regime | Condition | Behavior |
|--------|-----------|----------|
| Continuum convection | Ra > ~1 | Full Churchill-Chu correlation |
| Pure gas conduction | Ra < 1, Kn < 0.01 | Nu ≈ 2 (conduction limit for cylinder); `h_cond = 2 × k / D_char` |
| Slip / transitional | 0.01 < Kn < 0.1 | `k_eff = k / (1 + 2 × Kn)` then use conduction limit |
| Free molecular | Kn > 0.1 | Negligible gas cooling; set `h_conv ≈ 0` |

**Knudsen number**: `Kn = λ / D_char` where mean free path:
```
λ = k_B × T / (√2 × π × d_mol² × P)
```

Molecular diameters: N₂ = 3.64 Å, H₂ = 2.71 Å, Ar = 3.40 Å.

For mixtures, use mole-fraction-weighted `d_mol`.

### 2. Radiative Heat Transfer Coefficient — `h_rad`

Linearize Stefan-Boltzmann radiation into Newton's law form:

```
h_rad = ε × σ × (T_s² + T_w²) × (T_s + T_w)
```

Where:
- `σ = 5.67e-8 W/m²·K⁴`
- `T_s` = specimen surface temperature (K)
- `T_w` = chamber wall temperature (K), default 300 K
- `ε` = surface emissivity (material-dependent)

#### Emissivity Values (at elevated temperature)

Add `emissivity` field to the metals database:

| Metal | ε (typical, 800–1200 K) | Notes |
|-------|------------------------|-------|
| W     | 0.15–0.25 | Low, polished; increases with oxidation |
| Mo    | 0.15–0.25 | Similar to W |
| Ti    | 0.35–0.50 | Oxidizes readily |
| Ni    | 0.25–0.40 | |
| Cu    | 0.15–0.30 | Oxidized Cu much higher (~0.6) |
| Fe/Steel | 0.50–0.70 | Oxidized surface |
| Al    | 0.08–0.15 | Very low; oxide layer increases it |
| Zr    | 0.35–0.50 | |
| Nb    | 0.15–0.25 | |
| Ta    | 0.15–0.25 | |
| Default | 0.40 | For metals without specific data |

Store a single representative `ε` per metal. Allow user override via an input field.

### 3. Total Effective h

```
h_total = h_conv(T, P, gas) + h_rad(T, ε)
```

This replaces the current fixed `h` in the J_LOC calculation. The rest of the thermal model (fin/clip conduction) remains unchanged.

---

## Implementation

### New UI Controls

Add a **"Chamber Environment"** panel/section to the main controls area, grouped logically:

#### Gas Selection
- **Dropdown**: `Forming Gas (95N₂/5H₂)` | `Argon` | `Hydrogen` | `Nitrogen`
- Default: `Forming Gas (95N₂/5H₂)`

#### Chamber Pressure
- **Numeric input** with unit toggle: `torr` / `mbar` / `atm`
- Default: `760 torr` (1 atm)
- Range: `0.01 torr` to `760 torr`
- Consider a **log-scale slider** since the interesting physics spans decades (1–760 torr)

#### Emissivity Override
- **Numeric input**: 0.01–1.0
- Default: auto-populated from the selected metal's database value
- Label: `Surface Emissivity (ε)`

#### Wall Temperature
- **Numeric input**: default `300 K` (27°C)
- Most users won't change this, so it can be in an "Advanced" expandable section

### Updated Outputs

#### In the existing results / power supply section:
- Show `h_conv`, `h_rad`, and `h_total` (W/m²·K) alongside the existing thermal parameters
- Show `q_conv` and `q_rad` (W) — total heat loss via each mechanism
- Show which mechanism dominates (e.g., "Radiation: 78% of cooling")

#### New Chart: h_total vs Temperature

Add an optional chart (toggled via a tab or checkbox) showing:
- **X-axis**: Specimen temperature (300 K → T_melt)
- **Y-axis**: h (W/m²·K)
- **Three curves**: `h_conv`, `h_rad`, `h_total`
- This helps the user see the crossover point where radiation takes over

#### New Chart: h_total vs Pressure (optional)

- **X-axis**: Chamber pressure (log scale, 0.1–760 torr)
- **Y-axis**: h (W/m²·K)
- **Curves**: one per gas species at the current specimen temperature
- Shows the pressure at which convection dies and you're left with conduction + radiation

### Impact on J_LOC Calculation

The current J_LOC model solves:

```
ρ_elec × J² = h × (P_perim / A_cross) × (T_m - T_ambient) + q_clip
```

Replace `h` with `h_total(T_m, P_chamber, gas, ε)`:

```
ρ_elec × J_LOC² = h_total(T_m, P, gas, ε) × (P_perim / A_cross) × (T_m - T_wall) + q_clip(T_m)
```

Where `h_total` is evaluated at the specimen's melting temperature (the LOC condition). This means J_LOC now depends on gas, pressure, and emissivity — which is physically correct.

### Impact on Process Window Chart

The process window (E_max vs N_R) will shift with gas/pressure:
- **Lower h_total** (e.g., Ar at 1 torr) → lower J_LOC → process window shifts
- **Higher h_total** (e.g., H₂ at 1 atm) → higher J_LOC → wider process window

The E_flash threshold is unchanged (it's a material/field property, not thermal).

---

## Code Architecture

### New module: `gasProperties.js`

```javascript
// gasProperties.js — Gas thermal property database and mixing rules

export const GASES = {
  'forming_gas': { label: 'Forming Gas (95N₂/5H₂)', components: { N2: 0.95, H2: 0.05 } },
  'argon':       { label: 'Argon',                    components: { Ar: 1.0 } },
  'hydrogen':    { label: 'Hydrogen (H₂)',            components: { H2: 1.0 } },
  'nitrogen':    { label: 'Nitrogen (N₂)',            components: { N2: 1.0 } },
};

// Pure gas properties: k(T), mu(T), Cp, M, d_mol
export const PURE_GAS_DATA = { ... };

// Functions:
export function getGasMixProperties(gasKey, T_film, P_Pa) → { k, mu, Cp, rho, Pr, beta }
export function getMeanFreePath(gasKey, T, P_Pa) → lambda (m)
```

### New module: `coolingModel.js`

```javascript
// coolingModel.js — Convective + radiative cooling model

export function computeHconv(gasProps, D_char, T_surface, T_wall, P_Pa) → h_conv (W/m²·K)
// Implements Churchill-Chu with pressure regime switching (continuum → conduction → slip → free molecular)

export function computeHrad(T_surface, T_wall, emissivity) → h_rad (W/m²·K)
// Linearized Stefan-Boltzmann

export function computeHtotal(gasKey, P_Pa, T_surface, T_wall, D_char, emissivity) → { h_conv, h_rad, h_total }
// Main entry point for the thermal model
```

### Integration into `ProcessWindowV5.jsx`

1. Import `computeHtotal` from `coolingModel.js`
2. Add gas/pressure/emissivity state variables
3. Replace the current fixed `h` in the J_LOC calculation with `computeHtotal(...).h_total`
4. Add the Chamber Environment UI controls
5. Add the h breakdown to the output display
6. Optionally add the new charts

---

## Validation Checks

Before shipping, verify against hand calculations:

| Scenario | Expected h_total (W/m²·K) |
|----------|---------------------------|
| SS tube, forming gas, 760 torr, 1200 K | ~97 |
| W tube, forming gas, 760 torr, 1200 K | ~45 |
| SS tube, Ar, 760 torr, 1200 K | ~83 (lower h_conv due to low k_Ar) |
| SS tube, H₂, 760 torr, 1200 K | ~140 (much higher h_conv) |
| SS tube, forming gas, 10 torr, 1200 K | ~83 (convection dead, conduction + rad) |
| SS tube, forming gas, 0.1 torr, 1200 K | ~78 (radiation only) |
| Any metal, any gas, 300 K surface | h_rad ≈ 0, h_conv dominates |

---

## Edge Cases

- **T_surface ≤ T_wall**: Set `h_rad = 0`, `h_conv = 0` (no cooling)
- **Very low pressure (< 0.01 torr)**: Clamp `h_conv` to 0; radiation only
- **Very small specimens**: At small D_char, Kn transitions happen at higher pressures — the model handles this naturally
- **Emissivity = 0**: Valid for theoretical "no radiation" case; `h_total = h_conv` only
- **Pure H₂ at high T**: k_H2 is very high — verify numerical stability of Ra calculation

---

## Priority

**P0 (must-have for initial release):**
- Gas selection dropdown (4 gases)
- Pressure input
- h_total calculation feeding into J_LOC
- h_conv / h_rad / h_total display in results

**P1 (fast follow):**
- Emissivity per metal in database + override field
- h vs Temperature chart

**P2 (nice to have):**
- h vs Pressure chart
- Wall temperature input
- Custom gas mixture ratios
