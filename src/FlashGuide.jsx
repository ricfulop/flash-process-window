import { useState } from "react";

const FONT_S = "'IBM Plex Sans', system-ui, sans-serif";
const FONT_M = "'IBM Plex Mono', monospace";

/* ─── colour palette (light theme) ─── */
const C = {
    bg: "#f8fafc",
    card: "#ffffff",
    border: "#e2e8f0",
    heading: "#0f172a",
    body: "#334155",
    muted: "#64748b",
    accent: "#2563eb",
    accentLight: "#dbeafe",
    code: "#f1f5f9",
    link: "#1d4ed8",
    warn: "#d97706",
    good: "#16a34a",
    highlight: "#fef3c7",
};

/* ─── reusable sub-components ─── */
function Section({ id, title, children }) {
    return (
        <section id={id} style={{ marginBottom: 40 }}>
            <h2 style={{
                fontSize: "1.15rem", fontWeight: 700, color: C.heading,
                borderBottom: "2px solid " + C.accent, paddingBottom: 6,
                marginBottom: 14, fontFamily: FONT_S, letterSpacing: "-0.01em"
            }}>{title}</h2>
            {children}
        </section>
    );
}

function P({ children, style }) {
    return (
        <p style={{
            fontSize: "0.88rem", lineHeight: 1.75, color: C.body,
            marginBottom: 12, fontFamily: FONT_S, ...style
        }}>{children}</p>
    );
}

function Eq({ children }) {
    return (
        <div style={{
            background: C.code, borderRadius: 6, padding: "10px 16px",
            margin: "10px 0 14px", fontFamily: FONT_M, fontSize: "0.82rem",
            color: C.heading, border: "1px solid " + C.border,
            overflowX: "auto", letterSpacing: "0.02em"
        }}>
            {children}
        </div>
    );
}

function Note({ type, children }) {
    var bg = type === "warn" ? "#fef3c7" : type === "tip" ? "#dcfce7" : C.accentLight;
    var bc = type === "warn" ? "#f59e0b" : type === "tip" ? "#22c55e" : C.accent;
    var icon = type === "warn" ? "⚠️" : type === "tip" ? "💡" : "ℹ️";
    return (
        <div style={{
            background: bg, borderLeft: "4px solid " + bc, borderRadius: "0 6px 6px 0",
            padding: "10px 14px", margin: "12px 0 16px", fontSize: "0.82rem",
            fontFamily: FONT_S, color: "#1e293b", lineHeight: 1.65
        }}>
            <span style={{ marginRight: 6 }}>{icon}</span>
            {children}
        </div>
    );
}

function Cite({ label, href }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" style={{
            color: C.link, fontSize: "0.78rem", textDecoration: "none",
            borderBottom: "1px dashed " + C.link
        }}>{label}</a>
    );
}

function Def({ term, children }) {
    return (
        <div style={{ marginBottom: 8 }}>
            <span style={{
                fontFamily: FONT_M, fontWeight: 700, color: C.accent,
                fontSize: "0.84rem", marginRight: 6
            }}>{term}</span>
            <span style={{ fontSize: "0.84rem", color: C.body, lineHeight: 1.7 }}>{children}</span>
        </div>
    );
}

function TOCLink({ href, children }) {
    return (
        <li style={{ marginBottom: 4 }}>
            <a href={href} style={{
                color: C.link, textDecoration: "none", fontSize: "0.82rem",
                fontFamily: FONT_S
            }}>{children}</a>
        </li>
    );
}

function DataTable({ headers, rows }) {
    return (
        <div style={{ overflowX: "auto", margin: "12px 0 16px" }}>
            <table style={{
                width: "100%", borderCollapse: "collapse", fontSize: "0.78rem",
                fontFamily: FONT_M
            }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid " + C.border }}>
                        {headers.map(function (h, i) {
                            return <th key={i} style={{
                                textAlign: i === 0 ? "left" : "right", padding: "4px 8px",
                                color: C.muted, fontWeight: 600, fontSize: "0.72rem",
                                textTransform: "uppercase", letterSpacing: "0.06em"
                            }}>{h}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(function (row, ri) {
                        return (
                            <tr key={ri} style={{
                                borderBottom: "1px solid " + C.border,
                                background: ri % 2 === 0 ? "transparent" : "#f8fafc"
                            }}>
                                {row.map(function (cell, ci) {
                                    return <td key={ci} style={{
                                        textAlign: ci === 0 ? "left" : "right",
                                        padding: "4px 8px", color: ci === 0 ? C.heading : C.body,
                                        fontWeight: ci === 0 ? 700 : 400
                                    }}>{cell}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN GUIDE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function FlashGuide({ onClose }) {
    var _s = useState(false);
    var showTOC = _s[0], setShowTOC = _s[1];

    return (
        <div style={{
            fontFamily: FONT_S, maxWidth: 820, margin: "0 auto", padding: "1rem 1.2rem 3rem",
            background: C.bg, minHeight: "100vh", color: C.body
        }}>
            {/* Header bar */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 20, paddingBottom: 12,
                borderBottom: "1px solid " + C.border
            }}>
                <button onClick={onClose} style={{
                    background: C.accent, color: "#fff", border: "none",
                    borderRadius: 6, padding: "6px 16px", cursor: "pointer",
                    fontSize: "0.78rem", fontFamily: FONT_M, fontWeight: 600,
                    transition: "opacity 0.15s"
                }}>
                    ← Back to Calculator
                </button>
                <span style={{
                    fontSize: "0.6rem", color: C.muted, fontFamily: FONT_M
                }}>
                    © 2026 Ric Fulop, MIT Center for Bits and Atoms
                </span>
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: 30 }}>
                <h1 style={{
                    fontSize: "1.6rem", fontWeight: 800, color: C.heading,
                    letterSpacing: "-0.025em", marginBottom: 8, lineHeight: 1.2
                }}>
                    Technical Guide: Flash in Solid Metals
                </h1>
                <p style={{
                    fontSize: "0.82rem", color: C.muted, fontFamily: FONT_M,
                    maxWidth: 560, margin: "0 auto", lineHeight: 1.6
                }}>
                    How to achieve, measure, and control flash phenomena in metallic
                    conductors — from theory to practice.
                </p>
                <div style={{ marginTop: 10, fontSize: "0.72rem", color: C.muted }}>
                    Based on{" "}
                    <Cite label="Fulop et al. (2026) — Voltivity Preprint"
                        href="https://doi.org/10.21203/rs.3.rs-8803756/v1" />
                    {" | "}
                    <Cite label="Das et al. (2025) — LOC in Metals, J. Am. Ceram. Soc."
                        href="https://doi.org/10.1111/jace.70483" />
                </div>
            </div>

            {/* Table of Contents toggle */}
            <div style={{
                background: C.card, border: "1px solid " + C.border, borderRadius: 8,
                padding: "10px 16px", marginBottom: 28
            }}>
                <div onClick={function () { setShowTOC(!showTOC); }} style={{
                    cursor: "pointer", fontWeight: 700, color: C.heading,
                    fontSize: "0.88rem", display: "flex", justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <span>📑 Table of Contents</span>
                    <span style={{ color: C.muted, fontSize: "0.7rem" }}>{showTOC ? "▲ collapse" : "▼ expand"}</span>
                </div>
                {showTOC ? (
                    <ol style={{ paddingLeft: 18, marginTop: 8, marginBottom: 4 }}>
                        <TOCLink href="#voltivity">What Is Voltivity?</TOCLink>
                        <TOCLink href="#why-metals-lower">Why Metals Have Lower Voltivity</TOCLink>
                        <TOCLink href="#how-to-flash">How to Put a Metal in Flash</TOCLink>
                        <TOCLink href="#measuring-flash">How to Measure Flash Onset</TOCLink>
                        <TOCLink href="#loc">Loss of Cohesion (LOC)</TOCLink>
                        <TOCLink href="#transport">Transport Parameters & Handbook Values</TOCLink>
                        <TOCLink href="#lattice">Crystal Structure & Lattice Effects</TOCLink>
                        <TOCLink href="#atmosphere">Atmosphere Requirements</TOCLink>
                        <TOCLink href="#pulsing">Why Pulsing Makes Sense for Electroplasticity</TOCLink>
                        <TOCLink href="#sintering-vs-solids">Sintering vs. Solid Metals in Flash</TOCLink>
                        <TOCLink href="#practical-tips">Practical Tips for Metal Flash Experiments</TOCLink>
                        <TOCLink href="#using-the-app">How to Use the Process Window Calculator</TOCLink>
                    </ol>
                ) : null}
            </div>

            {/* ═══ 1. VOLTIVITY ═══ */}
            <Section id="voltivity" title="1. What Is Voltivity?">
                <P>
                    <strong>Voltivity (λ)</strong> is a fundamental material constant that quantifies
                    the threshold for coupling between an applied electric field and the acoustic
                    phonon modes that destabilize a crystal lattice. Discovered by analysis of 68
                    field-activated experiments across 36 materials, voltivity is defined as the
                    invariant product:
                </P>
                <Eq>λ = E × r &nbsp;&nbsp;[V·μm]</Eq>
                <P>
                    where <strong>E</strong> is the applied electric field at flash onset (V/cm) and{" "}
                    <strong>r</strong> is the defect nucleation coherence length (μm) — the spatial
                    region within which phonon-softened barriers must persist for defect nucleation
                    to occur.
                </P>
                <P>
                    The key insight is that momentum conservation <em>forbids</em> direct coupling
                    between the long-wavelength applied electric field and the short-wavelength
                    acoustic phonons that drive structural transformations. Energy must cascade
                    through intermediate excitations — free electrons in metals, polarons in oxides,
                    liberated carriers in covalent materials — before reaching the acoustic modes.
                    Voltivity measures the end-to-end efficiency of this cascade.
                </P>
                <P>
                    Across all tested materials, λ remains invariant per material with coefficients
                    of variation below 2%, spanning nearly two orders of magnitude from ~1,000 V·μm
                    for metals to ~27,000 V·μm for strongly covalent carbides like WC and SiC.
                </P>
                <P style={{ fontSize: "0.78rem", color: C.muted }}>
                    Full theory:{" "}
                    <Cite label="Fulop, R. et al. — Microscopic Origins of Voltivity (2026)"
                        href="https://doi.org/10.21203/rs.3.rs-8803756/v1" />
                </P>
            </Section>

            {/* ═══ 2. WHY METALS LOWER ═══ */}
            <Section id="why-metals-lower" title="2. Why Metals Have Lower Voltivity Than Other Materials">
                <P>
                    Metals have the <strong>lowest voltivity values</strong> of any material class
                    (λ ≈ 500–1,400 V·μm), meaning they require the weakest electric fields to
                    activate flash phenomena. This arises from two factors in the master equation:
                </P>
                <Eq>λ = E_defect / (k_soft × 0.533) &nbsp;&nbsp;where k_soft = 1 − 0.533β</Eq>

                <P><strong>1. Low rate-limiting defect energy (E_defect):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    In metals, the rate-limiting step is <em>vacancy migration</em>, with activation
                    energies of only 0.2–0.5 eV. Compare this to ionic oxides (2.5–5.5 eV for
                    oxygen vacancy formation) or covalent carbides (2–6 eV for bond breaking).
                    Metals simply need less energy per defect event.
                </P>

                <P><strong>2. Efficient phonon softening (low k_soft):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    For metals, the softening parameter β = 0.3γ, where γ is the Grüneisen
                    parameter. Typical metallic γ values of 1.5–2.2 yield β ≈ 0.5–0.7, giving
                    k_soft ≈ 0.62–0.73. This means the phonon cascade retains 62–73% of the
                    thermodynamic barrier — moderate softening from the abundant free electron bath
                    and strong anharmonic decay channels.
                </P>

                <P><strong>Understanding r (defect nucleation coherence length):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    The interaction length <strong>r</strong> in metals is <em>not</em> a phonon
                    length scale — it is the <strong>defect nucleation coherence volume</strong>: the
                    spatial region within which phonon-softened barriers enable coordinated defect
                    formation. Formally, r = √(α_th × τ_nuc), where α_th is thermal diffusivity and
                    τ_nuc is the defect nucleation time. For metals, r is typically 1–50 μm, set by
                    the dislocation cell size under applied load. In the calculator below, r is
                    computed from the voltivity via r = λ/E.
                </P>

                <DataTable
                    headers={["Metal", "λ (V·μm)", "r (μm)", "ρ₀ (nΩ·m)", "k_soft", "Class"]}
                    rows={[
                        ["Ti", "1168", "~965", "42", "~0.73", "HCP transition"],
                        ["Ni", "1090", "~6142", "7.0", "~0.71", "FCC transition"],
                        ["Cu", "818", "~1222", "1.7", "~0.70", "FCC noble"],
                        ["Al", "970", "~9819", "2.7", "~0.72", "FCC s/p"],
                        ["Fe", "1192", "~1711", "9.7", "~0.74", "BCC transition"],
                        ["W", "1026", "~2222", "5.3", "~0.71", "BCC refractory"],
                        ["Pt", "493", "~38", "10.6", "~0.68", "FCC noble"],
                        ["Re", "1337", "~1611", "19.3", "~0.76", "HCP refractory"],
                    ]}
                />

                <Note type="info">
                    <strong>Key insight:</strong> Metals are "easy" to flash because their abundant
                    free electrons provide an efficient cascade channel and their low-energy defect
                    reactions (vacancy migration) require minimal work. The challenge in metals is
                    not reaching flash — it is <em>avoiding Loss of Cohesion</em>.
                </Note>
            </Section>

            {/* ═══ 3. HOW TO FLASH ═══ */}
            <Section id="how-to-flash" title="3. How to Put a Metal in a State of Flash">
                <P>
                    Flash in metals is initiated by passing direct current through a metallic
                    conductor at a controlled ramp rate until the applied electric field exceeds
                    the voltivity threshold E_flash = λ/r. The process has several distinct phases:
                </P>

                <P><strong>Phase 1 — Ohmic Heating (pre-flash):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    As current ramps linearly, Joule heating raises the temperature. Resistivity
                    increases with temperature according to ρ(T) = ρ₀ + (ρₘ − ρ₀) × (T − 300)/(T_m − 300).
                    The electric field E = ρ(T) × J rises approximately linearly with J at first.
                </P>

                <P><strong>Phase 2 — Approach to Flash Onset:</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    As the specimen heats, its resistivity accelerates non-linearly (metals have
                    positive TCR). The E-field climbs faster than J. When E approaches E_flash, the
                    phonon cascade begins coupling field energy to acoustic modes at the damping
                    ridge (q*/q_D ≈ 0.73).
                </P>

                <P><strong>Phase 3 — Flash (E ≥ E_flash):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Above the voltivity threshold, field-phonon coupling accelerates defect
                    generation exponentially. Defect concentrations can exceed 10 mol%. This
                    manifests as:
                </P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li><strong>Anomalous resistance drop</strong> — despite increasing temperature, resistance peaks and then <em>decreases</em>. This is the hallmark signature of flash.</li>
                    <li><strong>Electroluminescence</strong> — the specimen glows, visible as incandescence that exceeds what blackbody radiation at the measured temperature would predict.</li>
                    <li><strong>Accelerated diffusion</strong> — mass transport rates increase by up to 10⁸ times compared to conventional processing.</li>
                </ul>

                <P><strong>Phase 4 — Loss of Cohesion (if current continues):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    If current density continues to increase past J_LOC, the vacancy concentration
                    reaches a critical threshold (~38 mol% for Cu) and the metal spontaneously
                    fractures <em>below its melting point</em>.
                </P>

                <Note type="warn">
                    <strong>Critical:</strong> The useful "flash window" exists between J_flash
                    (onset) and J_LOC (fracture). This window is typically 15–40% of J_LOC,
                    depending on geometry and ramp rate. The Process Window Calculator helps you
                    find and maximize this window.
                </Note>
            </Section>

            {/* ═══ 4. MEASURING FLASH ═══ */}
            <Section id="measuring-flash" title="4. How to Measure That You Are in Flash">
                <P>
                    Flash onset in metals produces measurable electrical signatures. The recommended
                    approach is the <strong>four-point resistance measurement</strong> during current
                    ramping:
                </P>

                <P><strong>Setup:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>Current-controlled power supply connected to the free ends of the specimen.</li>
                    <li>Two inner voltage taps (voltmeter probes) placed along the gauge section.</li>
                    <li>Infrared camera for temperature measurement.</li>
                    <li>Linear current ramp at known dJ/dt (A/mm²/min).</li>
                </ul>

                <P><strong>What you will observe:</strong></P>
                <ol style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li style={{ marginBottom: 6 }}>
                        <strong>Resistance rises monotonically</strong> with J during pre-flash
                        (normal metallic behavior, positive TCR).
                    </li>
                    <li style={{ marginBottom: 6 }}>
                        <strong>Resistance peaks and then drops</strong> even as power input continues
                        to increase. This is the <em>unambiguous signature of flash onset</em>. The
                        drop is anomalous — it cannot be explained by thermal effects alone.
                        Das et al. attribute this to the formation of an ordered vacancy structure
                        ("antimass phase") that forces electrons into 2D conduction, reducing
                        three-dimensional scattering.
                    </li>
                    <li style={{ marginBottom: 6 }}>
                        <strong>Electroluminescence</strong> appears — the specimen glows brighter than
                        expected for its measured temperature.
                    </li>
                    <li style={{ marginBottom: 6 }}>
                        If current continues past J_LOC: <strong>spontaneous fracture</strong> without
                        evidence of melting. SEM shows predominantly intergranular failure.
                    </li>
                </ol>

                <Note type="tip">
                    <strong>Practical tip:</strong> Plot ΔR/R₀ vs. J in real time during the
                    experiment. The <em>peak in resistance</em> defines J_flash. If you stop or
                    hold current here, you are operating in the flash regime. The four-point method
                    eliminates contact resistance artifacts.
                </Note>
            </Section>

            {/* ═══ 5. LOC ═══ */}
            <Section id="loc" title="5. Loss of Cohesion (LOC)">
                <P>
                    Loss of Cohesion (LOC) is a <strong>structural failure mode unique to flash
                        experiments</strong>. It is fundamentally different from melting: the metal
                    fractures spontaneously at temperatures <em>below</em> its melting point due
                    to the accumulation of field-generated defects.
                </P>

                <P><strong>Key findings from Das et al. (2025):</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>
                        <strong>J_LOC is rate-independent.</strong> Experiments on 0.25mm Cu wire at
                        current rates spanning 21–1000 A/mm²/min all showed LOC at the same J_LOC ≈
                        167 A/mm² (0.25mm wire). The product t_LOC × dJ/dt = constant = J_LOC.
                    </li>
                    <li>
                        <strong>Defect concentration at LOC ≈ 38 mol%</strong> (in Cu). This is
                        estimated via energy deficit analysis — the difference between input electrical
                        energy and energy lost to blackbody radiation, convection, and specific heat
                        is attributed to endothermic defect generation.
                    </li>
                    <li>
                        <strong>Fracture is intergranular</strong> with no evidence of melting. SEM
                        micrographs show clean grain boundary separation, consistent with vacancy
                        accumulation weakening grain boundaries.
                    </li>
                    <li>
                        <strong>Temperature at LOC is below T_m.</strong> For each metal, the LOC
                        occurs at a temperature that depends on how quickly J_flash is reached
                        relative to J_LOC.
                    </li>
                </ul>

                <Note type="info">
                    The calculator models LOC using a thermal-structural framework: J_LOC is where
                    the thermal model predicts the sample loses structural integrity, calibrated
                    against experimental Cu, Ti, Ni, and Al data. For uncalibrated metals, a default
                    overshoot factor of 2.8× over steady-state J_ss is used.
                </Note>

                <P style={{ fontSize: "0.78rem", color: C.muted }}>
                    Reference:{" "}
                    <Cite label="Das, S. et al. — Loss of cohesion in metals below the melting point, J. Am. Ceram. Soc. 109, e70483 (2025)"
                        href="https://doi.org/10.1111/jace.70483" />
                </P>
            </Section>

            {/* ═══ 6. TRANSPORT ═══ */}
            <Section id="transport" title="6. Transport Parameters & Handbook Values">
                <P>
                    The calculator requires several thermophysical properties for each metal. Here
                    is how to obtain and validate them:
                </P>

                <P><strong>Electrical Resistivity (ρ₀, ρₘ):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    <strong>ρ₀</strong> — room-temperature resistivity [Ω·m]. Standard handbook
                    values from CRC or ASM. For alloys, use the alloy-specific value (not
                    composition-weighted pure metal values).<br />
                    <strong>ρₘ</strong> — resistivity at melting point. Often not directly tabulated.
                    Estimate by linear extrapolation from the temperature coefficient of resistivity
                    (TCR): ρₘ ≈ ρ₀ × [1 + α(T_m − 300)], where α is the TCR. For transition
                    metals, ρₘ/ρ₀ is typically 3–5×. For noble metals, it can be 5–8×.
                </P>

                <P><strong>Thermal Conductivity (k_th):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Use room-temperature values. At elevated temperatures, k_th decreases for most
                    metals (Wiedemann-Franz law: k/σ ∝ T). This means the sample will cool less
                    effectively at high T — the model uses the RT value as a conservative
                    (optimistic) estimate for the cooling calculation.
                </P>

                <P><strong>Specific Heat (C_p) and Density (ρ_m):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Standard handbook values. C_p varies weakly with temperature for most metals
                    (Dulong-Petit limit). Use room-temperature values.
                </P>

                <P><strong>Melting Temperature (T_m):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Solidus temperature for alloys. Remember that LOC occurs <em>below</em> T_m,
                    so results are not sensitive to exact T_m values.
                </P>

                <P><strong>Recommended sources:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>CRC Handbook of Chemistry and Physics (resistivity, thermal conductivity)</li>
                    <li>ASM Handbook Vol. 2: Properties and Selection (alloy-specific data)</li>
                    <li>NIST Standard Reference Data (high-temperature extrapolations)</li>
                    <li>Haynes: CRC Handbook, 97th ed. (2016-2017) — comprehensive metal property tables</li>
                </ul>
            </Section>

            {/* ═══ 7. LATTICE ═══ */}
            <Section id="lattice" title="7. Crystal Structure & Lattice Effects">
                <P>
                    The crystal structure influences flash behavior through its effect on defect
                    energetics, Grüneisen parameter, and thermal transport:
                </P>

                <P><strong>BCC Metals (Fe, W, Mo, Nb, Ta, Cr):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Higher vacancy migration energies (0.5–0.7 eV) compared to FCC. More open
                    structure allows easier interstitial accommodation. Tend to have higher λ values
                    and stronger anharmonicity (higher γ). BCC metals often have lower thermal
                    conductivity due to stronger phonon-phonon scattering. Fe and W are well-suited
                    to flash experiments due to their high resistivity-to-conductivity ratio.
                </P>

                <P><strong>FCC Metals (Cu, Al, Ni, Pt, Au, Ag):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Close-packed structure with lower vacancy migration energies (0.2–0.4 eV).
                    Generally higher thermal conductivity (especially Cu, Al, Ag) which makes flash
                    harder to achieve — more current is needed to overcome cooling. Cu and Al are
                    well-studied in flash experiments. Ni has magnetic phase transitions that add
                    complexity near Curie temperature.
                </P>

                <P><strong>HCP Metals (Ti, Zr, Re, Mg, Zn):</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Anisotropic thermal and electrical properties. Preferred orientation of
                    polycrystalline specimens can affect flash behavior. Ti is the best-studied
                    flash metal — its high resistivity and moderate thermal conductivity create a
                    favorable process window. HCP metals tend to have higher λ due to the
                    anisotropic phonon coupling.
                </P>

                <DataTable
                    headers={["Structure", "Vacancy E_mig (eV)", "γ typical", "k_soft range", "Flash ease"]}
                    rows={[
                        ["BCC", "0.5–0.7", "1.5–2.0", "0.60–0.68", "Moderate"],
                        ["FCC", "0.2–0.4", "1.8–2.5", "0.71–0.76", "Easy (but needs current)"],
                        ["HCP", "0.3–0.6", "1.4–1.8", "0.70–0.74", "Good (Ti is ideal)"],
                    ]}
                />
            </Section>

            {/* ═══ 8. ATMOSPHERE ═══ */}
            <Section id="atmosphere" title="8. Atmosphere Requirements">
                <P>
                    Atmosphere control is <strong>critical</strong> for metal flash experiments.
                    Unlike ceramic flash sintering (which can be done in air for oxides), metals
                    oxidize rapidly at the temperatures reached during flash.
                </P>

                <P><strong>Recommended: Argon or Inert Gas</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>
                        <strong>Argon (99.999% purity)</strong> is the standard choice. Use a glove
                        box with O₂ levels below 20 ppm for best results. Das et al. performed all Cu
                        LOC experiments in a glove box at 10–20 ppm O₂.
                    </li>
                    <li>
                        <strong>Nitrogen</strong> is acceptable for some metals (Cu, Ni) but can form
                        nitrides with Ti, Zr, and other reactive metals. Avoid for refractory metals.
                    </li>
                    <li>
                        <strong>Forming gas (95% Ar / 5% H₂)</strong> can be used for reducing
                        conditions. Useful for pre-oxidized samples or when surface cleanliness is
                        critical.
                    </li>
                </ul>

                <Note type="warn">
                    <strong>Air atmosphere is problematic.</strong> Above ~400°C, most metals form
                    oxides that change surface emissivity, create insulating barriers, and alter
                    resistance measurements. Oxide scale formation can mask the anomalous resistance
                    drop that signals flash onset. Always use inert atmosphere for reliable flash
                    experiments on metals.
                </Note>

                <P><strong>Vacuum:</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Vacuum ({"<"}10⁻⁴ Torr) eliminates convective cooling entirely, pushing the
                    process strongly into the adiabatic regime (low N_R). This is fine for thin
                    specimens but increases LOC risk — the sample heats very rapidly with no
                    convective loss, making the flash window very
                    narrow. Consider using vacuum only when convective
                    cooling would prevent reaching E_flash (e.g., thick, high-conductivity metals).
                </P>

                <P><strong>Effect on the thermal model:</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    The convection coefficient h in the calculator represents the combined
                    convective heat transfer. In stagnant argon, h ≈ 5–15 W/m²K. In flowing gas, h
                    ≈ 20–50 W/m²K. In vacuum, h → 0 (radiation only). Adjusting h in the calculator
                    lets you model these different environments.
                </P>
            </Section>

            {/* ═══ 9. PULSING ═══ */}
            <Section id="pulsing" title="9. Why Pulsing Makes Sense for Electroplasticity">
                <P>
                    In <strong>electroplasticity</strong> — where electric current enhances the
                    formability of metals during deformation — pulsed current delivery has
                    significant advantages over DC ramping. The voltivity framework explains why:
                </P>

                <P><strong>The case for pulsing:</strong></P>
                <ol style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li style={{ marginBottom: 8 }}>
                        <strong>Exceed E_flash transiently without LOC.</strong> A short, high-current
                        pulse can push E above E_flash for microseconds to milliseconds, activating
                        the phonon cascade and generating defects, then allowing the specimen to cool
                        before the cumulative defect concentration reaches LOC levels. This exploits
                        the transient E_peak overshooting the steady-state E_max.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        <strong>Control defect dose.</strong> Each pulse delivers a controlled "dose" of
                        defects. By adjusting pulse width, amplitude, and duty cycle, you can
                        accumulate defects gradually — analogous to dose-controlled irradiation. This
                        gives precise control over enhanced plasticity without risking catastrophic
                        fracture.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        <strong>Manage thermal budget.</strong> Pulsing prevents the cumulative thermal
                        runaway that occurs during DC ramping. Between pulses, the specimen cools via
                        the same fin+clip+convection pathways modeled in the calculator. The duty cycle
                        controls the average temperature rise.
                    </li>
                    <li style={{ marginBottom: 8 }}>
                        <strong>Interaction length control.</strong> The defect nucleation coherence
                        length r in electroplasticity corresponds to the dislocation cell size under
                        applied load (0.1–10 μm, per Conrad 2000). Pulsing at frequencies matched to
                        τ_nuc preferentially generates defects at dislocation cell walls — exactly
                        where enhanced plasticity is needed.
                    </li>
                </ol>

                <P><strong>Pulse design guidelines:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>
                        <strong>Pulse width:</strong> 0.1–100 ms. Should be short enough that T does
                        not approach T_m. Use the transient solver's time-stepping model (dt = 2 ms)
                        as a guide.
                    </li>
                    <li>
                        <strong>Peak J:</strong> Must be high enough that ρ(T_peak) × J_peak ≥ E_flash.
                        Refer to the E(J) chart for the target metal.
                    </li>
                    <li>
                        <strong>Duty cycle:</strong> Typically 1–10%. Lower duty cycles allow more
                        cooling but require more aggressive peak currents.
                    </li>
                    <li>
                        <strong>Frequency:</strong> 1–1000 Hz range is typical. Higher frequencies
                        reduce peak temperature excursion per pulse.
                    </li>
                </ul>

                <Note type="tip">
                    <strong>Rule of thumb:</strong> Use the calculator to find J_flash for your metal/geometry,
                    then design pulses with peak J ≈ 1.2–1.5× J_flash and pulse width shorter than
                    τ_cool. This ensures you transiently enter flash without approaching LOC.
                </Note>
            </Section>

            {/* ═══ 10. SINTERING VS SOLIDS ═══ */}
            <Section id="sintering-vs-solids" title="10. Flash Sintering vs. Flash in Solid Metals">
                <P>
                    Flash sintering of powders and flash in bulk solid metals share the same
                    underlying physics — voltivity-governed phonon cascades — but differ in several
                    important experimental and practical ways:
                </P>

                <DataTable
                    headers={["Parameter", "Flash Sintering (Powders)", "Flash in Solid Metals"]}
                    rows={[
                        ["Starting material", "Compacted powder (green body)", "Bulk wire, foil, or sheet"],
                        ["Interaction length r", "Hotspot wavelength in green body (1–100 μm)", "Dislocation cell size or defect cluster spacing (0.1–50 μm)"],
                        ["Contact resistance", "Significant — particle necks dominate early resistance", "Negligible — bulk resistance only"],
                        ["Failure mode", "Thermal runaway → localized melting", "LOC → intergranular fracture below T_m"],
                        ["Useful outcome", "Full densification in seconds", "Enhanced plasticity, defect engineering"],
                        ["Atmosphere", "Air (for oxides), inert (for non-oxides)", "Always inert (Ar, N₂, vacuum)"],
                        ["E_flash values", "Higher (E measured across powder compact)", "Lower (E measured across bulk metal)"],
                        ["Typical J range", "0.1–10 A/mm² (ceramics)", "10–500 A/mm² (metals)"],
                        ["Process control", "Voltage/current limiting", "Current ramp rate + I_max limiting"],
                        ["Temperature measurement", "Furnace + pyrometer", "IR camera + four-point resistance"],
                    ]}
                />

                <P>
                    <strong>The fundamental difference</strong> is geometric: in powder compacts, the
                    electric field concentrates at particle-particle contacts (narrow necks), so the
                    effective local field E_local ≫ E_applied. This is why flash sintering of
                    ceramics can occur at applied fields of 10–200 V/cm, while the intrinsic λ for
                    those materials would predict much higher thresholds. In bulk metals, there is
                    no field concentration — the applied field is uniform, and E = ρ × J directly.
                </P>

                <P>
                    <strong>Implication for metals:</strong> Because metals have a uniform cross-section,
                    the entire specimen enters flash simultaneously (good for electroplasticity),
                    rather than localized hotspot-driven sintering. This means thermal management is
                    more predictable, but also means that LOC — when it occurs — is catastrophic for
                    the entire specimen rather than localized.
                </P>
            </Section>

            {/* ═══ 11. PRACTICAL TIPS ═══ */}
            <Section id="practical-tips" title="11. Practical Tips for Metal Flash Experiments">
                <P>
                    Collected from experimental experience with Ti, Cu, Ni, and Al flash:
                </P>

                <P><strong>Specimen preparation:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>Use high-purity wire or foil (≥99.95%) for reproducible results. Impurities shift ρ₀ and can nucleate premature LOC.</li>
                    <li>Clean specimens with acetone/IPA to remove surface oxides. For Ti, light acid etching (dilute HF) removes tenacious oxide layers.</li>
                    <li>Ensure uniform cross-section along the gauge length. Variations create local hotspots and premature LOC.</li>
                    <li>Spot-weld or clamp voltage taps firmly. Loose contacts introduce noise in the resistance measurement.</li>
                </ul>

                <P><strong>Electrical setup:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>Use a current-controlled power supply with programmable ramp. Voltage control is dangerous — flash creates a negative differential resistance that can cause uncontrolled current runaway.</li>
                    <li>Set I_max below the LOC limit. The calculator provides I_onset and I_at_LOC for your geometry — set I_max between these.</li>
                    <li>Data acquisition at ≥100 Hz for resistance monitoring. Flash onset can occur rapidly (within tens of milliseconds at high dJ/dt).</li>
                </ul>

                <P><strong>Thermal management:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>Clip cooling is significant for short gauge lengths (L {"<"} 20 mm). The fin model in the calculator accounts for this — use it to determine whether clip cooling dominates your setup.</li>
                    <li>For thick specimens or high-k metals (Cu, Al), consider increasing gauge length L or reducing convection (enclosed chamber vs. open air) to reduce the cooling load.</li>
                    <li>Monitor the N_R value: if N_R {">"} 10, your ramp is much slower than cooling — you may need impractically high currents. Increase ramp rate or reduce cooling.</li>
                </ul>

                <P><strong>Safety:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li>LOC produces a rapid fracture with potentially hot fragments. Use a shielded enclosure.</li>
                    <li>Power supplies in the 10–1000 A range at low voltage ({"<"}5V) can deliver enormous instantaneous power. Ensure proper fusing and emergency shutoff.</li>
                    <li>IR cameras should be rated for the expected temperature range (typically up to T_m of the target metal).</li>
                </ul>
            </Section>

            {/* ═══ 12. USING THE APP ═══ */}
            <Section id="using-the-app" title="12. How to Use the Process Window Calculator">
                <P>
                    The Metal Flash Process Window Calculator (v6) helps you design flash
                    experiments by predicting whether your metal/geometry/ramp-rate combination will
                    reach the voltivity threshold before Loss of Cohesion.
                </P>

                <P><strong>Step 1 — Select a Metal:</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Click one of the metal chips (Ti, Ni, Cu, Al, Fe, W, Pt, Re) in the left
                    sidebar. The app immediately recalculates all results for that metal's
                    thermophysical properties and voltivity.
                </P>

                <P><strong>Step 2 — Set Specimen Geometry:</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    Toggle between <strong>Foil</strong> (rectangular cross-section: thickness ×
                    width) and <strong>Wire</strong> (circular: diameter). Adjust thickness/diameter,
                    width, and gauge length L using the sliders. The cross-sectional area A and
                    perimeter P (used for cooling calculations) update automatically.
                </P>

                <P><strong>Step 3 — Set Process Parameters:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li><strong>Ramp rate (J̇)</strong> — Rate of current density increase [A/mm²/min]. Higher values push you into the adiabatic regime (lower N_R), which can improve flash probability but increases LOC risk.</li>
                    <li><strong>h (convection)</strong> — Convective heat transfer coefficient [W/m²K]. Use 5–15 for stagnant gas, 20–50 for flowing gas, 100+ for forced air jets.</li>
                    <li><strong>I_max (supply)</strong> — Maximum current your power supply can deliver [A]. This caps the achievable J and therefore the achievable E.</li>
                    <li><strong>V offset</strong> — Voltage offset for the E_flash threshold [mV]. Usually leave at default unless you have calibration data.</li>
                </ul>

                <P><strong>Step 4 — Read the Results:</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    The results panel shows the key output values:
                </P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li><strong>E_max</strong> — Maximum E-field at LOC [V/cm]. This is the peak field the specimen will reach.</li>
                    <li><strong>J_LOC</strong> — Current density at LOC [A/mm²]. Do not exceed this.</li>
                    <li><strong>J_onset (flash)</strong> — Current density where E = E_flash. This is your target operating point.</li>
                    <li><strong>I_onset</strong> — The actual current in Amps at flash onset. Set your I_max near this value.</li>
                    <li><strong>Flash window</strong> — The percentage range between J_flash and J_LOC where flash is active. Larger is better.</li>
                    <li><strong>N_R</strong> — Normalized ramp (t_ramp / τ_cool). {"<"}1 = adiabatic regime, {">"}1 = cooling-limited.</li>
                    <li><strong>Outcome</strong> — "FLASH → LOC" (good: flash occurs before LOC) or "MELT" (no flash: E_max {"<"} E_flash).</li>
                </ul>

                <P><strong>Step 5 — Interpret the Charts:</strong></P>
                <P style={{ paddingLeft: 16 }}>
                    <strong>Process Window (top right):</strong> Plots E_max vs. normalized ramp N_R.
                    Your operating point is the green circle labeled "you". If it sits above the
                    E_flash dashed line, flash is expected. Other metals' operating points from the
                    literature are shown as reference dots. The blue shaded region (N_R {"<"} 1) is
                    the adiabatic regime; amber (N_R {">"}1) is cooling-limited.
                </P>
                <P style={{ paddingLeft: 16 }}>
                    <strong>E(J) chart (middle right):</strong> Shows the electric field vs. current
                    density curve for all 8 metals at your geometry. The horizontal dashed line is
                    E_flash for the selected metal. The vertical dashed line marks J_flash (onset).
                    The green shaded region between J_flash and J_LOC is the flash window.
                </P>
                <P style={{ paddingLeft: 16 }}>
                    <strong>Table (bottom right):</strong> Compares all metals side-by-side at the
                    current geometry. Key columns: λ, J_flash, J_LOC, E_max, E_flash, Gap (ratio of
                    achievable E to threshold — Gap {">"}1 means flash is expected), and Outcome (LOC
                    vs. MELT).
                </P>

                <P><strong>Step 6 — Optimize Your Design:</strong></P>
                <ul style={{ paddingLeft: 32, fontSize: "0.84rem", color: C.body, lineHeight: 1.8 }}>
                    <li><strong>Can't reach flash?</strong> (Gap {"<"} 1) — Increase ramp rate, reduce gauge length, reduce specimen thickness/width, or reduce convection (lower h).</li>
                    <li><strong>Flash window too small?</strong> — Reduce ramp rate (wider window but harder to reach flash) or use a thinner specimen.</li>
                    <li><strong>Need lower current?</strong> — Use a thinner/narrower specimen. J = I/A, so smaller A gives higher J at lower I.</li>
                    <li><strong>Power supply limited?</strong> — Reduce specimen cross-section until I_onset falls within your supply's range.</li>
                </ul>

                <Note type="tip">
                    <strong>Quick start:</strong> Select Ti (the easiest metal to flash), set foil
                    100 μm × 6 mm × 20 mm gauge, ramp rate 500 A/mm²/min, and observe the result:
                    J_flash ≈ 52, I_onset ≈ 31 A, flash window ≈ 23%. This is a well-characterized
                    reference configuration.
                </Note>
            </Section>

            {/* Footer */}
            <div style={{
                marginTop: 40, paddingTop: 16,
                borderTop: "1px solid " + C.border, textAlign: "center"
            }}>
                <P style={{ fontSize: "0.72rem", color: C.muted, textAlign: "center" }}>
                    Metal Flash Process Window — Technical Guide v1.0<br />
                    © 2026 Ric Fulop, MIT Center for Bits and Atoms<br />
                    <Cite label="Voltivity Preprint: doi.org/10.21203/rs.3.rs-8803756/v1"
                        href="https://doi.org/10.21203/rs.3.rs-8803756/v1" />
                    {" | "}
                    <Cite label="LOC Paper: doi.org/10.1111/jace.70483"
                        href="https://doi.org/10.1111/jace.70483" />
                </P>
            </div>
        </div>
    );
}
