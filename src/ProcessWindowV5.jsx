import { useState, useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, Label, Cell, LineChart, Line, Legend
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════
   COMPREHENSIVE METALS DATABASE — 49 pure metals
   Source: Voltivity DFT Handbook v12 (voltivity λ),
           CRC Handbook of Chemistry & Physics (physical properties),
           ASM International / Smithells (resistivity at melt)
   ═══════════════════════════════════════════════════════════════════ */
const DB = {
  /* ── ALKALI METALS ── */
  Li: {
    name: "Lithium", rho0: 9.28e-8, rhoM: 2.6e-7, Tm: 454, Cp: 3582,
    rho_m: 534, k_th: 84.8, lam: 972,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#dc2626", cat: "Alkali"
  },
  Na: {
    name: "Sodium", rho0: 4.77e-8, rhoM: 1.3e-7, Tm: 371, Cp: 1228,
    rho_m: 971, k_th: 142, lam: 437,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#f97316", cat: "Alkali"
  },
  K: {
    name: "Potassium", rho0: 7.2e-8, rhoM: 2.0e-7, Tm: 337, Cp: 757,
    rho_m: 862, k_th: 102.5, lam: 248,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#fb923c", cat: "Alkali"
  },
  /* ── ALKALINE EARTH METALS ── */
  Be: {
    name: "Beryllium", rho0: 3.56e-8, rhoM: 3.4e-7, Tm: 1560, Cp: 1825,
    rho_m: 1850, k_th: 200, lam: 4071,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#84cc16", cat: "Alkaline Earth"
  },
  Mg: {
    name: "Magnesium", rho0: 4.39e-8, rhoM: 2.7e-7, Tm: 923, Cp: 1023,
    rho_m: 1738, k_th: 156, lam: 1051,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#22c55e", cat: "Alkaline Earth"
  },
  Ca: {
    name: "Calcium", rho0: 3.36e-8, rhoM: 2.1e-7, Tm: 1115, Cp: 647,
    rho_m: 1550, k_th: 201, lam: 667,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#16a34a", cat: "Alkaline Earth"
  },
  Sr: {
    name: "Strontium", rho0: 1.32e-7, rhoM: 5.5e-7, Tm: 1050, Cp: 301,
    rho_m: 2640, k_th: 35.4, lam: 424,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#15803d", cat: "Alkaline Earth"
  },
  Ba: {
    name: "Barium", rho0: 3.32e-7, rhoM: 1.0e-6, Tm: 1000, Cp: 204,
    rho_m: 3510, k_th: 18.4, lam: 330,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#166534", cat: "Alkaline Earth"
  },
  /* ── TRANSITION METALS — 3d ── */
  Sc: {
    name: "Scandium", rho0: 5.5e-7, rhoM: 1.8e-6, Tm: 1814, Cp: 568,
    rho_m: 2985, k_th: 15.8, lam: 1020,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#06b6d4", cat: "3d Transition"
  },
  Ti: {
    name: "Titanium", rho0: 4.2e-7, rhoM: 1.78e-6, Tm: 1941, Cp: 523,
    rho_m: 4510, k_th: 21.9, lam: 1168,
    ref_jdot: 500, ref_Jloc: 68, ref_t: 100, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#2563eb", cat: "3d Transition"
  },
  V: {
    name: "Vanadium", rho0: 1.97e-7, rhoM: 7.6e-7, Tm: 2183, Cp: 489,
    rho_m: 6110, k_th: 30.7, lam: 1014,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#7c3aed", cat: "3d Transition"
  },
  Cr: {
    name: "Chromium", rho0: 1.27e-7, rhoM: 1.3e-6, Tm: 2180, Cp: 449,
    rho_m: 7150, k_th: 93.9, lam: 1763,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#6d28d9", cat: "3d Transition"
  },
  Mn: {
    name: "Manganese", rho0: 1.44e-6, rhoM: 2.6e-6, Tm: 1519, Cp: 479,
    rho_m: 7470, k_th: 7.8, lam: 1113,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#9333ea", cat: "3d Transition"
  },
  Fe: {
    name: "Iron", rho0: 9.71e-8, rhoM: 1.3e-6, Tm: 1811, Cp: 449,
    rho_m: 7874, k_th: 80.4, lam: 1192,
    ref_jdot: null, ref_Jloc: null, ref_t: 100, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#8B4513", cat: "3d Transition"
  },
  Co: {
    name: "Cobalt", rho0: 5.6e-8, rhoM: 4.3e-7, Tm: 1768, Cp: 421,
    rho_m: 8900, k_th: 100, lam: 1083,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#3b82f6", cat: "3d Transition"
  },
  Ni: {
    name: "Nickel", rho0: 6.99e-8, rhoM: 3.5e-7, Tm: 1728, Cp: 444,
    rho_m: 8908, k_th: 90.9, lam: 1090,
    ref_jdot: 1000, ref_Jloc: 39, ref_t: 200, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#525252", cat: "3d Transition"
  },
  Cu: {
    name: "Copper", rho0: 1.68e-8, rhoM: 1.0e-7, Tm: 1358, Cp: 385,
    rho_m: 8960, k_th: 401, lam: 818,
    ref_jdot: 244, ref_Jloc: 229, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#B87333", cat: "3d Transition"
  },
  Zn: {
    name: "Zinc", rho0: 5.9e-8, rhoM: 3.5e-7, Tm: 693, Cp: 388,
    rho_m: 7140, k_th: 116, lam: 721,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#64748b", cat: "3d Transition"
  },
  /* ── TRANSITION METALS — 4d ── */
  Y: {
    name: "Yttrium", rho0: 5.96e-7, rhoM: 1.8e-6, Tm: 1799, Cp: 298,
    rho_m: 4472, k_th: 17.2, lam: 776,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0891b2", cat: "4d Transition"
  },
  Zr: {
    name: "Zirconium", rho0: 4.21e-7, rhoM: 1.5e-6, Tm: 2128, Cp: 278,
    rho_m: 6506, k_th: 22.7, lam: 840,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0e7490", cat: "4d Transition"
  },
  Nb: {
    name: "Niobium", rho0: 1.52e-7, rhoM: 5.7e-7, Tm: 2750, Cp: 265,
    rho_m: 8570, k_th: 53.7, lam: 706,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#155e75", cat: "4d Transition"
  },
  Mo: {
    name: "Molybdenum", rho0: 5.34e-8, rhoM: 3.6e-7, Tm: 2896, Cp: 251,
    rho_m: 10220, k_th: 138, lam: 1168,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0369a1", cat: "4d Transition"
  },
  Ru: {
    name: "Ruthenium", rho0: 7.1e-8, rhoM: 4.7e-7, Tm: 2607, Cp: 238,
    rho_m: 12370, k_th: 117, lam: 1381,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0284c7", cat: "4d Transition"
  },
  Rh: {
    name: "Rhodium", rho0: 4.33e-8, rhoM: 2.2e-7, Tm: 2237, Cp: 243,
    rho_m: 12410, k_th: 150, lam: 1057,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0ea5e9", cat: "4d Transition"
  },
  Pd: {
    name: "Palladium", rho0: 1.05e-7, rhoM: 4.3e-7, Tm: 1828, Cp: 246,
    rho_m: 12020, k_th: 71.8, lam: 611,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#1d4ed8", cat: "4d Transition"
  },
  Ag: {
    name: "Silver", rho0: 1.587e-8, rhoM: 9.6e-8, Tm: 1235, Cp: 235,
    rho_m: 10500, k_th: 429, lam: 480,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#475569", cat: "4d Transition"
  },
  Cd: {
    name: "Cadmium", rho0: 6.83e-8, rhoM: 3.4e-7, Tm: 594, Cp: 232,
    rho_m: 8650, k_th: 96.6, lam: 470,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#64748b", cat: "4d Transition"
  },
  /* ── TRANSITION METALS — 5d ── */
  Hf: {
    name: "Hafnium", rho0: 3.31e-7, rhoM: 1.5e-6, Tm: 2506, Cp: 144,
    rho_m: 13310, k_th: 23, lam: 735,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#5b21b6", cat: "5d Transition"
  },
  Ta: {
    name: "Tantalum", rho0: 1.25e-7, rhoM: 6.2e-7, Tm: 3290, Cp: 140,
    rho_m: 16654, k_th: 57.5, lam: 613,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#7e22ce", cat: "5d Transition"
  },
  W: {
    name: "Tungsten", rho0: 5.28e-8, rhoM: 2.5e-7, Tm: 3695, Cp: 132,
    rho_m: 19300, k_th: 173, lam: 1026,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#555", cat: "5d Transition"
  },
  Re: {
    name: "Rhenium", rho0: 1.93e-7, rhoM: 9.0e-7, Tm: 3459, Cp: 137,
    rho_m: 21020, k_th: 47.9, lam: 1337,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#6b21a8", cat: "5d Transition"
  },
  Os: {
    name: "Osmium", rho0: 8.12e-8, rhoM: 5.5e-7, Tm: 3306, Cp: 130,
    rho_m: 22590, k_th: 87.6, lam: 1258,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#4c1d95", cat: "5d Transition"
  },
  Ir: {
    name: "Iridium", rho0: 4.71e-8, rhoM: 2.8e-7, Tm: 2719, Cp: 131,
    rho_m: 22560, k_th: 147, lam: 957,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#581c87", cat: "5d Transition"
  },
  Pt: {
    name: "Platinum", rho0: 1.06e-7, rhoM: 3.8e-7, Tm: 2041, Cp: 133,
    rho_m: 21450, k_th: 71.6, lam: 493,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#8aa", cat: "5d Transition"
  },
  Au: {
    name: "Gold", rho0: 2.21e-8, rhoM: 1.35e-7, Tm: 1337, Cp: 129,
    rho_m: 19300, k_th: 318, lam: 299,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#eab308", cat: "5d Transition"
  },
  /* ── POST-TRANSITION METALS ── */
  Al: {
    name: "Aluminum", rho0: 2.65e-8, rhoM: 1.2e-7, Tm: 933, Cp: 897,
    rho_m: 2700, k_th: 237, lam: 970,
    ref_jdot: 244, ref_Jloc: 150, ref_t: 25, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#ef4444", cat: "Post-Transition"
  },
  Ga: {
    name: "Gallium", rho0: 1.36e-7, rhoM: 2.6e-7, Tm: 303, Cp: 371,
    rho_m: 5910, k_th: 40.6, lam: 551,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#f87171", cat: "Post-Transition"
  },
  In: {
    name: "Indium", rho0: 8.37e-8, rhoM: 3.3e-7, Tm: 430, Cp: 233,
    rho_m: 7310, k_th: 81.8, lam: 237,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#b91c1c", cat: "Post-Transition"
  },
  Sn: {
    name: "Tin", rho0: 1.1e-7, rhoM: 4.8e-7, Tm: 505, Cp: 228,
    rho_m: 7365, k_th: 66.8, lam: 457,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#78716c", cat: "Post-Transition"
  },
  Tl: {
    name: "Thallium", rho0: 1.5e-7, rhoM: 7.5e-7, Tm: 577, Cp: 129,
    rho_m: 11850, k_th: 46.1, lam: 214,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#78716c", cat: "Post-Transition"
  },
  Pb: {
    name: "Lead", rho0: 2.08e-7, rhoM: 9.5e-7, Tm: 601, Cp: 129,
    rho_m: 11340, k_th: 35.3, lam: 210,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#57534e", cat: "Post-Transition"
  },
  Bi: {
    name: "Bismuth", rho0: 1.07e-6, rhoM: 1.3e-6, Tm: 544, Cp: 122,
    rho_m: 9780, k_th: 7.97, lam: 335,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#44403c", cat: "Post-Transition"
  },
  /* ── LANTHANIDES ── */
  La: {
    name: "Lanthanum", rho0: 5.7e-7, rhoM: 1.6e-6, Tm: 1193, Cp: 195,
    rho_m: 6162, k_th: 13.4, lam: 432,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#059669", cat: "Lanthanide"
  },
  Ce: {
    name: "Cerium", rho0: 7.4e-7, rhoM: 1.7e-6, Tm: 1068, Cp: 192,
    rho_m: 6770, k_th: 11.3, lam: 531,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#10b981", cat: "Lanthanide"
  },
  Nd: {
    name: "Neodymium", rho0: 6.43e-7, rhoM: 1.6e-6, Tm: 1297, Cp: 190,
    rho_m: 7010, k_th: 16.5, lam: 466,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#047857", cat: "Lanthanide"
  },
  Gd: {
    name: "Gadolinium", rho0: 1.31e-6, rhoM: 2.0e-6, Tm: 1585, Cp: 236,
    rho_m: 7900, k_th: 10.6, lam: 529,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#065f46", cat: "Lanthanide"
  },
  Dy: {
    name: "Dysprosium", rho0: 9.26e-7, rhoM: 1.8e-6, Tm: 1680, Cp: 170,
    rho_m: 8550, k_th: 10.7, lam: 613,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0d9488", cat: "Lanthanide"
  },
  Er: {
    name: "Erbium", rho0: 8.6e-7, rhoM: 1.6e-6, Tm: 1802, Cp: 168,
    rho_m: 9066, k_th: 14.5, lam: 613,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0f766e", cat: "Lanthanide"
  },
  Lu: {
    name: "Lutetium", rho0: 5.82e-7, rhoM: 1.2e-6, Tm: 1925, Cp: 154,
    rho_m: 9841, k_th: 16.4, lam: 607,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#115e59", cat: "Lanthanide"
  },
  /* ── ACTINIDES ── */
  Th: {
    name: "Thorium", rho0: 1.47e-7, rhoM: 6.7e-7, Tm: 2023, Cp: 113,
    rho_m: 11720, k_th: 54, lam: 472,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#d946ef", cat: "Actinide"
  },
  U: {
    name: "Uranium", rho0: 2.8e-7, rhoM: 1.2e-6, Tm: 1405, Cp: 116,
    rho_m: 19050, k_th: 27.5, lam: 572,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#a855f7", cat: "Actinide"
  },
  /* ═══════════════════════════════════════════════════════════════════
     METALLIC ALLOYS — from Voltivity DFT Handbook v12, Metallic Alloys sheet
     Physical properties: ASM Handbook, CRC, MatWeb standard references
     λ (voltivity): composition-weighted Grüneisen prediction
     ═══════════════════════════════════════════════════════════════════ */
  /* ── AUSTENITIC STAINLESS STEELS ── */
  "304SS": {
    name: "304 Stainless Steel", rho0: 7.2e-7, rhoM: 1.25e-6, Tm: 1723, Cp: 500,
    rho_m: 8000, k_th: 16.2, lam: 1111,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#334155", cat: "Stainless Steel"
  },
  "316SS": {
    name: "316 Stainless Steel", rho0: 7.4e-7, rhoM: 1.26e-6, Tm: 1673, Cp: 500,
    rho_m: 8000, k_th: 16.3, lam: 1109,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#475569", cat: "Stainless Steel"
  },
  "316LSS": {
    name: "316L Stainless Steel", rho0: 7.4e-7, rhoM: 1.26e-6, Tm: 1673, Cp: 500,
    rho_m: 7990, k_th: 16.3, lam: 1109,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#64748b", cat: "Stainless Steel"
  },
  "310SS": {
    name: "310 Stainless Steel", rho0: 7.8e-7, rhoM: 1.28e-6, Tm: 1673, Cp: 502,
    rho_m: 7900, k_th: 14.2, lam: 1107,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#94a3b8", cat: "Stainless Steel"
  },
  /* ── DUPLEX STAINLESS STEEL ── */
  "Duplex2205": {
    name: "Duplex 2205", rho0: 8.0e-7, rhoM: 1.30e-6, Tm: 1703, Cp: 500,
    rho_m: 7800, k_th: 19, lam: 1116,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#1e3a5f", cat: "Stainless Steel"
  },
  /* ── NICKEL SUPERALLOYS ── */
  "IN718": {
    name: "Inconel 718", rho0: 1.25e-6, rhoM: 1.30e-6, Tm: 1609, Cp: 435,
    rho_m: 8190, k_th: 11.4, lam: 1061,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#16a34a", cat: "Ni Superalloy"
  },
  "IN625": {
    name: "Inconel 625", rho0: 1.29e-6, rhoM: 1.33e-6, Tm: 1623, Cp: 410,
    rho_m: 8440, k_th: 9.8, lam: 1054,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#15803d", cat: "Ni Superalloy"
  },
  "HasX": {
    name: "Hastelloy X", rho0: 1.18e-6, rhoM: 1.26e-6, Tm: 1628, Cp: 473,
    rho_m: 8220, k_th: 9.1, lam: 1063,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#166534", cat: "Ni Superalloy"
  },
  "Wasp": {
    name: "Waspaloy", rho0: 1.24e-6, rhoM: 1.30e-6, Tm: 1623, Cp: 460,
    rho_m: 8190, k_th: 11.7, lam: 1056,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#047857", cat: "Ni Superalloy"
  },
  "H230": {
    name: "Haynes 230", rho0: 1.25e-6, rhoM: 1.32e-6, Tm: 1628, Cp: 397,
    rho_m: 8970, k_th: 8.9, lam: 1068,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#065f46", cat: "Ni Superalloy"
  },
  "Rene41": {
    name: "René 41", rho0: 1.31e-6, rhoM: 1.35e-6, Tm: 1588, Cp: 421,
    rho_m: 8250, k_th: 10.9, lam: 1059,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0d9488", cat: "Ni Superalloy"
  },
  /* ── TITANIUM ALLOYS ── */
  "Ti64": {
    name: "Ti-6Al-4V", rho0: 1.71e-6, rhoM: 1.85e-6, Tm: 1933, Cp: 526,
    rho_m: 4430, k_th: 6.7, lam: 1193,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#1d4ed8", cat: "Ti Alloy"
  },
  "Ti6242": {
    name: "Ti-6Al-2Sn-4Zr-2Mo", rho0: 1.67e-6, rhoM: 1.82e-6, Tm: 1923, Cp: 502,
    rho_m: 4540, k_th: 7.7, lam: 1207,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#2563eb", cat: "Ti Alloy"
  },
  "CPTi2": {
    name: "CP-Ti Grade 2", rho0: 5.2e-7, rhoM: 1.78e-6, Tm: 1941, Cp: 523,
    rho_m: 4510, k_th: 16.4, lam: 1205,
    ref_jdot: 500, ref_Jloc: 68, ref_t: 100, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#3b82f6", cat: "Ti Alloy"
  },
  "B21S": {
    name: "β-21S (Ti-15Mo-3Nb-3Al)", rho0: 1.42e-6, rhoM: 1.60e-6, Tm: 1813, Cp: 500,
    rho_m: 4940, k_th: 7.8, lam: 1164,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#60a5fa", cat: "Ti Alloy"
  },
  /* ── ALUMINUM ALLOYS ── */
  "Al6061": {
    name: "Al 6061", rho0: 3.99e-8, rhoM: 1.3e-7, Tm: 855, Cp: 896,
    rho_m: 2700, k_th: 167, lam: 984,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#dc2626", cat: "Al Alloy"
  },
  "Al7075": {
    name: "Al 7075", rho0: 5.15e-8, rhoM: 1.4e-7, Tm: 908, Cp: 960,
    rho_m: 2810, k_th: 130, lam: 977,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#b91c1c", cat: "Al Alloy"
  },
  "Al2024": {
    name: "Al 2024", rho0: 5.82e-8, rhoM: 1.4e-7, Tm: 911, Cp: 875,
    rho_m: 2780, k_th: 121, lam: 982,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#991b1b", cat: "Al Alloy"
  },
  "Al5083": {
    name: "Al 5083", rho0: 5.9e-8, rhoM: 1.4e-7, Tm: 847, Cp: 900,
    rho_m: 2660, k_th: 117, lam: 987,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#7f1d1d", cat: "Al Alloy"
  },
  /* ── SOLDERS ── */
  "SAC305": {
    name: "SAC305 (Sn-3Ag-0.5Cu)", rho0: 1.1e-7, rhoM: 4.8e-7, Tm: 490, Cp: 220,
    rho_m: 7380, k_th: 58, lam: 987,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#a16207", cat: "Solder"
  },
  "SAC387": {
    name: "SAC387 (Sn-3.8Ag-0.7Cu)", rho0: 1.2e-7, rhoM: 4.8e-7, Tm: 490, Cp: 219,
    rho_m: 7400, k_th: 55, lam: 984,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#ca8a04", cat: "Solder"
  },
  "SnPb": {
    name: "Sn-37Pb (eutectic)", rho0: 1.5e-7, rhoM: 6.8e-7, Tm: 456, Cp: 176,
    rho_m: 8500, k_th: 50, lam: 972,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#eab308", cat: "Solder"
  },
  /* ── HIGH-ENTROPY ALLOYS ── */
  "Cantor": {
    name: "CoCrFeMnNi (Cantor)", rho0: 9.5e-7, rhoM: 1.4e-6, Tm: 1607, Cp: 450,
    rho_m: 8000, k_th: 12, lam: 1099,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#7c3aed", cat: "HEA"
  },
  "CCFN": {
    name: "CoCrFeNi", rho0: 8.9e-7, rhoM: 1.3e-6, Tm: 1690, Cp: 440,
    rho_m: 8100, k_th: 13, lam: 1087,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#6d28d9", cat: "HEA"
  },
  "ACCFN": {
    name: "AlCoCrFeNi", rho0: 1.53e-6, rhoM: 1.7e-6, Tm: 1573, Cp: 490,
    rho_m: 6710, k_th: 10.5, lam: 1111,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#5b21b6", cat: "HEA"
  },
  "TZHNT": {
    name: "TiZrHfNbTa (refractory HEA)", rho0: 1.85e-6, rhoM: 2.0e-6, Tm: 2423, Cp: 260,
    rho_m: 9940, k_th: 8, lam: 1207,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#4c1d95", cat: "HEA"
  },
  /* ── COPPER ALLOYS ── */
  "Brass": {
    name: "Cu-30Zn (Brass)", rho0: 6.2e-8, rhoM: 3.5e-7, Tm: 1188, Cp: 377,
    rho_m: 8530, k_th: 120, lam: 1006,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#d97706", cat: "Cu Alloy"
  },
  "Bronze": {
    name: "Cu-8Sn (Bronze)", rho0: 1.1e-7, rhoM: 4.5e-7, Tm: 1273, Cp: 380,
    rho_m: 8800, k_th: 75, lam: 1025,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#b45309", cat: "Cu Alloy"
  },
  /* ── SPECIAL ALLOYS ── */
  "NiTi": {
    name: "NiTi (Nitinol)", rho0: 8.2e-7, rhoM: 1.1e-6, Tm: 1583, Cp: 450,
    rho_m: 6450, k_th: 18, lam: 1049,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0891b2", cat: "Special Alloy"
  },
  "Kovar": {
    name: "Kovar (Fe-29Ni-17Co)", rho0: 4.9e-7, rhoM: 1.2e-6, Tm: 1723, Cp: 439,
    rho_m: 8360, k_th: 17.3, lam: 1073,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#0e7490", cat: "Special Alloy"
  },
  "AZ31": {
    name: "AZ31 (Mg-3Al-1Zn)", rho0: 9.2e-8, rhoM: 3.5e-7, Tm: 903, Cp: 1050,
    rho_m: 1770, k_th: 96, lam: 1135,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#155e75", cat: "Mg Alloy"
  },
};

/* Category groupings for UI presentation */
var METAL_CATEGORIES = {
  "Alkali": ["Li", "Na", "K"],
  "Alk. Earth": ["Be", "Mg", "Ca", "Sr", "Ba"],
  "3d Trans.": ["Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn"],
  "4d Trans.": ["Y", "Zr", "Nb", "Mo", "Ru", "Rh", "Pd", "Ag", "Cd"],
  "5d Trans.": ["Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au"],
  "Post-Trans.": ["Al", "Ga", "In", "Sn", "Tl", "Pb", "Bi"],
  "Lanthanide": ["La", "Ce", "Nd", "Gd", "Dy", "Er", "Lu"],
  "Actinide": ["Th", "U"],
};
var ALLOY_CATEGORIES = {
  "Stainless Steel": ["304SS", "316SS", "316LSS", "310SS", "Duplex2205"],
  "Ni Superalloy": ["IN718", "IN625", "HasX", "Wasp", "H230", "Rene41"],
  "Ti Alloy": ["Ti64", "Ti6242", "CPTi2", "B21S"],
  "Al Alloy": ["Al6061", "Al7075", "Al2024", "Al5083"],
  "Solder": ["SAC305", "SAC387", "SnPb"],
  "HEA": ["Cantor", "CCFN", "ACCFN", "TZHNT"],
  "Cu Alloy": ["Brass", "Bronze"],
  "Other Alloy": ["NiTi", "Kovar", "AZ31"],
};

/* Full periodic table — standard 18-column IUPAC layout, all 118 elements */
var PT_ROWS = [
  ["H", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "He"],
  ["Li", "Be", null, null, null, null, null, null, null, null, null, null, "B", "C", "N", "O", "F", "Ne"],
  ["Na", "Mg", null, null, null, null, null, null, null, null, null, null, "Al", "Si", "P", "S", "Cl", "Ar"],
  ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
  ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
  ["Cs", "Ba", "*Ln", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
  ["Fr", "Ra", "*An", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
];
var PT_LN = ["La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"];
var PT_AN = ["Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"];

/* All pure metals for the comparison table */
var ALL_METALS = Object.values(METAL_CATEGORIES).flat();
var ALL_ALLOYS = Object.values(ALLOY_CATEGORIES).flat();
var ALL_MATERIALS = ALL_METALS.concat(ALL_ALLOYS);

/* Chart metals: all materials in the database get E(J) curves */
var CHART_METALS = ALL_MATERIALS;
var TABLE_METALS = ALL_MATERIALS;

var EXP = [
  { label: "Ti R14", m: "Ti", jdot: 1000, t: 100, w: 6, L: 20, Jloc: 70.3, flash: true },
  { label: "Ti R12", m: "Ti", jdot: 500, t: 100, w: 6, L: 20, Jloc: 67.6, flash: true },
  { label: "Ti R13", m: "Ti", jdot: 244, t: 100, w: 6, L: 20, Jloc: 65.1, flash: true },
  { label: "Cu R21", m: "Cu", jdot: 244, t: 50, w: 6, L: 20, Jloc: 229, flash: false },
  { label: "Ni R1", m: "Ni", jdot: 5000, t: 200, w: 6, L: 20, Jloc: 64.8, flash: false },
  { label: "Ni R2", m: "Ni", jdot: 1000, t: 200, w: 6, L: 20, Jloc: 38.9, flash: false },
  { label: "Ni R3", m: "Ni", jdot: 500, t: 200, w: 6, L: 20, Jloc: 33.1, flash: false },
  { label: "Al R1", m: "Al", jdot: 667, t: 25, w: 6, L: 20, Jloc: 167, flash: false },
  { label: "Al R2", m: "Al", jdot: 244, t: 25, w: 6, L: 20, Jloc: 150, flash: false },
  { label: "Al R3", m: "Al", jdot: 160, t: 25, w: 6, L: 20, Jloc: 156, flash: false },
  { label: "Al R4", m: "Al", jdot: 107, t: 25, w: 6, L: 20, Jloc: 145, flash: false },
];

/* Compute cross-section A [m²] and perimeter P [m] for any geometry */
function geoAP(geo, t_um, w_mm, d_um, tubeID_mm, tubeWall_um) {
  var A, P;
  if (geo === "wire") {
    var d = d_um * 1e-6;
    A = Math.PI / 4 * d * d;
    P = Math.PI * d;
  } else if (geo === "tube") {
    var id_m = (tubeID_mm || 1) / 1000;
    var wall_m = (tubeWall_um || 50) * 1e-6;
    var od_m = id_m + 2 * wall_m;
    A = Math.PI / 4 * (od_m * od_m - id_m * id_m);  /* annular area */
    P = Math.PI * (od_m + id_m);  /* inner + outer surfaces */
  } else {
    A = (t_um * 1e-6) * (w_mm / 1000);
    P = 2 * ((t_um * 1e-6) + (w_mm / 1000));
  }
  if (A < 1e-15) A = 1e-15;
  return { A: A, P: P };
}

/* ═══════════════════════════════════════════════════════════════════════════
   GAS-DEPENDENT CONVECTIVE + RADIATIVE COOLING MODEL
   Per SPEC-gas-cooling-model.md
   h_total = h_conv(T, P, gas) + h_rad(T, ε)
   ═══════════════════════════════════════════════════════════════════════════ */

var BOLTZ = 1.38064852e-23;    /* Boltzmann constant J/K */
var R_GAS = 8.314;             /* universal gas constant J/(mol·K) */
var SIGMA_SB = 5.670374419e-8; /* Stefan-Boltzmann constant W/m²·K⁴ */
var G_ACC = 9.81;              /* gravitational accel m/s² */

/* Pure gas properties */
var PURE_GAS = {
  N2: {
    M: 0.028,        /* kg/mol */
    Cp: 1040,         /* J/kg·K (approx constant) */
    mu_ref: 1.79e-5,  /* Pa·s at 300K */
    T_ref: 300,
    mu_exp: 0.7,      /* μ power-law exponent */
    d_mol: 3.64e-10,  /* molecular diameter m */
    /* k(T) = k0 + k1*(T-300) — linear fit 300–1200K */
    k0: 0.0258, k1: 5.58e-5
  },
  H2: {
    M: 0.002016, Cp: 14300, mu_ref: 0.89e-5, T_ref: 300, mu_exp: 0.7,
    d_mol: 2.71e-10,
    k0: 0.182, k1: 3.30e-4
  },
  Ar: {
    M: 0.03995, Cp: 520, mu_ref: 2.27e-5, T_ref: 300, mu_exp: 0.7,
    d_mol: 3.40e-10,
    k0: 0.018, k1: 3.80e-5
  }
};

/* Named gas atmospheres */
var GASES = {
  forming: { label: "Forming Gas (95N₂/5H₂)", comp: { N2: 0.95, H2: 0.05 } },
  argon: { label: "Argon", comp: { Ar: 1.0 } },
  hydrogen: { label: "Hydrogen (H₂)", comp: { H2: 1.0 } },
  nitrogen: { label: "Nitrogen (N₂)", comp: { N2: 1.0 } }
};

/* Compute temperature-dependent gas properties for a named gas mixture */
function gasMixProps(gasKey, T_film) {
  var gas = GASES[gasKey] || GASES.forming;
  var comp = gas.comp;
  var k_mix = 0, mu_mix = 0, Cp_num = 0, M_mix = 0, d_mix = 0;

  var species = Object.keys(comp);
  for (var i = 0; i < species.length; i++) {
    var sp = species[i];
    var x = comp[sp];
    var pg = PURE_GAS[sp];
    /* thermal conductivity k(T) */
    var k_T = pg.k0 + pg.k1 * (T_film - 300);
    /* viscosity μ(T) = μ_ref × (T/T_ref)^0.7 */
    var mu_T = pg.mu_ref * Math.pow(T_film / pg.T_ref, pg.mu_exp);
    k_mix += x * k_T;
    mu_mix += x * mu_T;
    Cp_num += x * pg.M * pg.Cp;
    M_mix += x * pg.M;
    d_mix += x * pg.d_mol;
  }
  var Cp_mix = Cp_num / M_mix;
  var Pr = mu_mix * Cp_mix / k_mix;  /* Prandtl number */
  return { k: k_mix, mu: mu_mix, Cp: Cp_mix, M: M_mix, Pr: Pr, d_mol: d_mix };
}

/* Mean free path λ = k_B·T / (√2·π·d²·P) */
function meanFreePath(d_mol, T, P_Pa) {
  if (P_Pa < 0.001) P_Pa = 0.001;
  return BOLTZ * T / (Math.sqrt(2) * Math.PI * d_mol * d_mol * P_Pa);
}

/* Churchill-Chu natural convection for horizontal cylinder
   with pressure-dependent regime transitions */
function computeHconv(gasKey, D_char, T_s, T_w, P_Pa) {
  if (D_char < 1e-6) D_char = 1e-6;
  if (T_s <= T_w) return 0;
  var T_film = (T_s + T_w) / 2;
  var gp = gasMixProps(gasKey, T_film);
  var dT = T_s - T_w;

  /* Gas density at pressure: ρ = P·M / (R·T) */
  var rho = P_Pa * gp.M / (R_GAS * T_film);
  if (rho < 1e-10) return 0;

  /* Kinematic viscosity & thermal diffusivity */
  var nu = gp.mu / rho;                   /* m²/s */
  var alpha = gp.k / (rho * gp.Cp);       /* m²/s */

  /* Knudsen number */
  var mfp = meanFreePath(gp.d_mol, T_film, P_Pa);
  var Kn = mfp / D_char;

  /* Free molecular regime — negligible gas cooling */
  if (Kn > 0.1) return 0;

  /* Effective conductivity in slip regime */
  var k_eff = gp.k;
  if (Kn > 0.01) {
    k_eff = gp.k / (1 + 2 * Kn);
  }

  /* Rayleigh number: Ra = g·β·ΔT·D³ / (ν·α), where β = 1/T_film for ideal gas */
  var beta = 1.0 / T_film;
  var Ra = G_ACC * beta * dT * D_char * D_char * D_char / (nu * alpha);
  if (Ra < 0) Ra = 0;

  /* Low Ra — pure conduction limit: Nu ≈ 2 for cylinder */
  if (Ra < 1) {
    return 2 * k_eff / D_char;
  }

  /* Churchill-Chu correlation: Nu = {0.60 + 0.387 × [Ra·f(Pr)]^(1/6)}² */
  var fPr = Math.pow(1 + Math.pow(0.559 / gp.Pr, 9.0 / 16), -16.0 / 9);
  var Nu = Math.pow(0.60 + 0.387 * Math.pow(Ra * fPr, 1.0 / 6), 2);

  return Nu * k_eff / D_char;
}

/* Linearized radiation: h_rad = ε·σ·(T_s² + T_w²)·(T_s + T_w) */
function computeHrad(T_s, T_w, emissivity) {
  if (T_s <= T_w || emissivity <= 0) return 0;
  return emissivity * SIGMA_SB * (T_s * T_s + T_w * T_w) * (T_s + T_w);
}

/* Emissivity lookup (typical values at 800–1200K elevated temperature) */
var EMISS_DB = {
  W: 0.20, Mo: 0.20, Nb: 0.20, Ta: 0.20, Re: 0.25,
  Ti: 0.40, Zr: 0.40, Hf: 0.35, V: 0.35,
  Ni: 0.30, Co: 0.30, Fe: 0.60, Cr: 0.35, Mn: 0.50,
  Cu: 0.20, Ag: 0.10, Au: 0.05, Pt: 0.10, Ir: 0.20, Rh: 0.15, Pd: 0.15,
  Al: 0.12, Ga: 0.20, In: 0.15, Sn: 0.20, Pb: 0.25, Bi: 0.30, Tl: 0.20,
  Zn: 0.25, Cd: 0.25, Sc: 0.35, Y: 0.35, Ru: 0.25, Os: 0.25,
  Mg: 0.20, Ca: 0.30, Sr: 0.30, Ba: 0.30,
  Li: 0.20, Na: 0.20, K: 0.20,
  La: 0.35, Ce: 0.35, Nd: 0.35, Gd: 0.35, Dy: 0.35, Er: 0.35, Lu: 0.35,
  Th: 0.40, U: 0.40,
  /* Alloys */
  "304SS": 0.60, "316SS": 0.60, "316LSS": 0.60, "310SS": 0.60, "Duplex2205": 0.60,
  IN718: 0.35, IN625: 0.35, HasX: 0.35, Wasp: 0.35, H230: 0.35, Rene41: 0.35,
  Ti64: 0.40, Ti6242: 0.40, CPTi2: 0.40, B21S: 0.40,
  Al6061: 0.12, Al7075: 0.12, Al2024: 0.12, Al5083: 0.12,
  SAC305: 0.20, SAC387: 0.20, SnPb: 0.25,
  Cantor: 0.40, CCFN: 0.40, ACCFN: 0.40, TZHNT: 0.30,
  Brass: 0.25, Bronze: 0.30,
  NiTi: 0.35, Kovar: 0.50, AZ31: 0.20
};
function getEmissivity(metalKey) { return EMISS_DB[metalKey] || 0.40; }

/* Main entry: compute total effective h at a single temperature */
function computeHtotal(gasKey, P_torr, T_s, T_w, D_char, emissivity) {
  var P_Pa = P_torr * 133.322;  /* 1 torr = 133.322 Pa */
  var hc = computeHconv(gasKey, D_char, T_s, T_w, P_Pa);
  var hr = computeHrad(T_s, T_w, emissivity);
  return { h_conv: hc, h_rad: hr, h_total: hc + hr };
}

/* Temperature-averaged h from RT to T_m in 50K steps (trapezoidal rule).
   Returns h_avg for physics, plus spot values at RT and T_m for display. */
function computeHprofile(gasKey, P_torr, T_m, T_w, D_char, emissivity) {
  var stepK = 50;
  var nSteps = Math.max(1, Math.ceil((T_m - T_w) / stepK));
  var dT = (T_m - T_w) / nSteps;
  var sum = 0;
  for (var i = 0; i <= nSteps; i++) {
    var T = T_w + i * dT;
    var ht = computeHtotal(gasKey, P_torr, T, T_w, D_char, emissivity);
    var w = (i === 0 || i === nSteps) ? 0.5 : 1.0;
    sum += w * ht.h_total;
  }
  var h_avg = sum / nSteps;
  var hRT = computeHtotal(gasKey, P_torr, T_w + 1, T_w, D_char, emissivity);
  var hTm = computeHtotal(gasKey, P_torr, T_m, T_w, D_char, emissivity);
  return { h_avg: h_avg, hRT: hRT, hTm: hTm };
}

/* Characteristic length for convection given geometry.
   Foil: width (strip width governs buoyant flow, not thickness).
   Wire: diameter.  Tube: outer diameter. */
function geoDchar(geo, t_um, w_mm, d_um, tubeID_mm, tubeWall_um) {
  if (geo === "wire") return (d_um || 250) * 1e-6;
  if (geo === "tube") {
    var id_m = (tubeID_mm || 1) / 1000;
    var wall_m = (tubeWall_um || 50) * 1e-6;
    return id_m + 2 * wall_m;  /* outer diameter */
  }
  return (w_mm || 6) / 1000;   /* foil: strip width */
}

function finCooling(mp, geo, t_um, w_mm, d_um, L_mm, h, tubeID_mm, tubeWall_um) {
  var Lm = L_mm / 1000;
  var g = geoAP(geo, t_um, w_mm, d_um, tubeID_mm, tubeWall_um);
  var A = g.A; var P = g.P;
  var saV = P / A;
  var m = Math.sqrt(h * P / (mp.k_th * A));
  var mL2 = Math.min(m * Lm / 2, 20);
  var qConv = h * saV;
  var qClip = 2 * mp.k_th * m * Math.tanh(mL2) / Lm;
  var qTot = qConv + qClip;
  var tau = mp.rho_m * mp.Cp / qTot;
  return { qTot: qTot, qClip: qClip, tau: tau, saV: saV, A: A, P: P };
}

function estimateJloc(key, geo, t_um, w_mm, d_um, L_mm, jdot, h, tubeID_mm, tubeWall_um) {
  var mp = DB[key];
  var dT = mp.Tm - 300;
  var cool = finCooling(mp, geo, t_um, w_mm, d_um, L_mm, h, tubeID_mm, tubeWall_um);
  var Jss = Math.sqrt(cool.qTot * dT / mp.rhoM) / 1e6;

  if (mp.ref_Jloc != null && mp.ref_jdot != null) {
    var cRef = finCooling(mp, "foil", mp.ref_t, mp.ref_w, 0, mp.ref_L, h, 0, 0);
    var JssRef = Math.sqrt(cRef.qTot * dT / mp.rhoM) / 1e6;
    if (JssRef > 0) {
      var geoScale = Jss / JssRef;
      var refOS = mp.ref_Jloc / JssRef;
      var rampScale = Math.pow(Math.max(jdot, 50) / mp.ref_jdot, 0.1);
      var Jloc = JssRef * refOS * geoScale * rampScale;
      return { Jloc: Math.max(Jloc, Jss), Jss: Jss, cool: cool };
    }
  }
  return { Jloc: Jss * 2.8, Jss: Jss, cool: cool };
}

function buildEJ(key, Jloc, n) {
  var mp = DB[key];
  var pts = [];
  if (Jloc <= 0) return pts;
  var step = Math.max(0.3, (Jloc * 1.05) / n);
  for (var J = step; J <= Jloc * 1.05; J += step) {
    var frac = Math.min(1, Math.pow(J / Jloc, 1.5));
    var rho = mp.rho0 + (mp.rhoM - mp.rho0) * frac;
    var E = rho * J * 1e6 / 100;
    pts.push({ J: Math.round(J * 10) / 10, E: E });
  }
  return pts;
}


function transientEpeak(mp, geo, t_um, w_mm, d_um, L_mm, Imax, jdot, tubeID_mm, tubeWall_um, gasKey, P_torr, D_char, emissivity) {
  var g = geoAP(geo, t_um, w_mm, d_um, tubeID_mm, tubeWall_um);
  var A_m2 = g.A;
  if (A_m2 < 1e-15) A_m2 = 1e-15;
  var A_mm2 = A_m2 * 1e6;
  var saV = g.P / g.A;
  var Lm = L_mm / 1000;
  var dIdt = jdot * A_mm2 / 60;
  if (dIdt < 0.01) dIdt = 0.01;

  /* Pre-build h(T) lookup table at 25K intervals for fast interpolation */
  var hasCooling = gasKey && P_torr != null;
  var hStep = 25;
  var hTable = [];   /* array of h_total values at T = 300, 325, 350, ... */
  if (hasCooling) {
    for (var Tt = 300; Tt <= mp.Tm + hStep; Tt += hStep) {
      hTable.push(computeHtotal(gasKey, P_torr, Math.max(Tt, 301), 300, D_char, emissivity).h_total);
    }
  }
  function hLookup(T) {
    var idx = (T - 300) / hStep;
    var i0 = Math.max(0, Math.min(hTable.length - 2, Math.floor(idx)));
    var f = idx - i0;
    return hTable[i0] + f * (hTable[i0 + 1] - hTable[i0]);
  }

  var T = 300; var Epk = 0; var dt = 0.002;
  var tMelt = 0; var Imelt = 0; var Jmelt = 0;
  for (var step = 0; step < 10000; step++) {
    var t = step * dt;
    var I = Math.min(dIdt * t, Imax);
    var J = I / A_m2;
    var frac = Math.min(1, Math.max(0, (T - 300) / (mp.Tm - 300)));
    var rho = mp.rho0 + (mp.rhoM - mp.rho0) * frac;
    var E = rho * J / 100;
    if (E > Epk) Epk = E;
    /* Joule heating */
    var qJoule = rho * J * J / (mp.rho_m * mp.Cp);
    /* Dynamic cooling: h(T)·SA/V·ΔT + clip conduction */
    var qCool = 0;
    if (hasCooling && T > 301) {
      var hT = hLookup(T);
      qCool += hT * saV * (T - 300) / (mp.rho_m * mp.Cp);
      var mFin = Math.sqrt(hT * g.P / (mp.k_th * g.A));
      var mL2 = Math.min(mFin * Lm / 2, 20);
      qCool += 2 * mp.k_th * mFin * Math.tanh(mL2) / Lm / (mp.rho_m * mp.Cp);
    }
    T += (qJoule - qCool) * dt;
    if (T < 300) T = 300;
    if (T >= mp.Tm) { tMelt = t; Imelt = I; Jmelt = J / 1e6; break; }
    if (t > 20) break;
  }
  return { Epeak: Epk, tMelt: tMelt, Imelt: Imelt, Jmelt: Jmelt, dIdt: dIdt };
}


var R_FACTOR = 0.0834;
function flashThreshold(lam, L_mm) {
  var r = R_FACTOR * L_mm * 1000;
  if (r < 1) r = 1;
  return lam / r;
}

/* Find J where E(J) curve crosses E_flash.
   E(J) = [rho0 + (rhoM-rho0)*(J/Jloc)^1.5] * J * 1e6/100
   Solve E(J) = Eflash by bisection. */
function findJonset(mp, Jloc, Eflash) {
  if (Eflash <= 0 || Jloc <= 0) return 0;
  // Check if E at Jloc > Eflash (otherwise flash never occurs)
  var Eloc = mp.rhoM * Jloc * 1e6 / 100;
  if (Eloc < Eflash) return 0;
  // Check if E at J=0+ > Eflash (onset is at ~0)
  var lo = 0.1, hi = Jloc;
  for (var i = 0; i < 60; i++) {
    var mid = (lo + hi) / 2;
    var frac = Math.min(1, Math.pow(mid / Jloc, 1.5));
    var rho = mp.rho0 + (mp.rhoM - mp.rho0) * frac;
    var E = rho * mid * 1e6 / 100;
    if (E < Eflash) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

var FONT_M = "monospace";
var FONT_S = "system-ui, sans-serif";

function Chip(props) {
  var st = {
    padding: "2px 7px", border: "none", borderRadius: 4, cursor: "pointer",
    fontSize: "0.7rem", fontWeight: 600, fontFamily: FONT_M,
    background: props.active ? props.color : "#e2e8f0",
    color: props.active ? "#fff" : "#64748b",
    outline: props.active ? ("2px solid " + props.color) : "none", outlineOffset: 1,
  };
  return <button onClick={props.onClick} style={st}>{props.children}</button>;
}

function InfoRow(props) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "1.5px 0", borderBottom: "1px solid rgba(0,0,0,0.04)"
    }}>
      <span style={{ fontSize: "0.63rem", color: props.dim ? "#94a3b8" : "#64748b" }}>{props.label}</span>
      <span style={{
        fontSize: "0.74rem", fontFamily: FONT_M, fontWeight: props.hl ? 700 : 500,
        color: props.warn ? "#d97706" : props.hl ? "#e94560" : props.dim ? "#94a3b8" : "#1e293b"
      }}>
        {props.val}
        {props.unit ? <span style={{ fontSize: "0.56rem", color: "#94a3b8" }}>{" "}{props.unit}</span> : null}
      </span>
    </div>
  );
}

function Sl(props) {
  var c = props.color || "#e94560";
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: "0.63rem", color: "#64748b" }}>{props.label}</span>
        <span style={{ fontSize: "0.74rem", fontFamily: FONT_M, fontWeight: 700, color: c }}>
          {props.fmt ? props.fmt(props.value) : props.value}
          {props.unit ? <span style={{ fontSize: "0.54rem", color: "#94a3b8" }}>{" "}{props.unit}</span> : null}
        </span>
      </div>
      <input type="range" min={props.min} max={props.max} step={props.step} value={props.value}
        onChange={function (e) { props.set(Number(e.target.value)); }}
        style={{ width: "100%", accentColor: c, height: 3, margin: "1px 0" }} />
    </div>
  );
}

function MapTip(props) {
  if (!props.active || !props.payload || !props.payload[0]) return null;
  var d = props.payload[0].payload;
  if (!d) return null;
  var c = d.flash ? "#16a34a" : "#dc2626";
  return (
    <div style={{
      background: "#ffffff", color: "#1e293b", padding: "6px 10px",
      borderRadius: 6, fontSize: "0.7rem", lineHeight: 1.5,
      border: "1px solid " + c, maxWidth: 210,
      fontFamily: FONT_S, boxShadow: "0 4px 16px rgba(0,0,0,0.12)"
    }}>
      <div style={{ fontWeight: 700, color: c }}>{d.label || "?"}{d.isUser ? " *" : ""}</div>
      <div>{"Emax = " + (d.Emax != null ? d.Emax.toFixed(3) : "?") + " V/cm"}</div>
      <div>{"(NR) = " + (d.NR != null ? d.NR.toFixed(3) : "?")}</div>
      {d.Jloc != null ? <div>{"J_LOC = " + Math.round(d.Jloc)}</div> : null}
      <div style={{ fontWeight: 700, color: c, marginTop: 1 }}>
        {d.flash ? "FLASH" : "LOC only"}
      </div>
    </div>
  );
}

export default function ProcessWindowV5(props) {
  var _s = useState("Ti"); var metal = _s[0]; var setMetal = _s[1];
  var _g = useState("foil"); var geo = _g[0]; var setGeo = _g[1];
  var _t = useState(100); var thick = _t[0]; var setThick = _t[1];
  var _w = useState(6); var width = _w[0]; var setWidth = _w[1];
  var _d = useState(250); var diam = _d[0]; var setDiam = _d[1];
  var _tid = useState(5); var tubeID = _tid[0]; var setTubeID = _tid[1];
  var _tw = useState(200); var tubeWall = _tw[0]; var setTubeWall = _tw[1];
  var _l = useState(50); var gauge = _l[0]; var setGauge = _l[1];
  var _j = useState(500); var jdot = _j[0]; var setJdot = _j[1];
  var _v = useState(10); var vOff = _v[0]; var setVOff = _v[1];
  var _im = useState(100); var Imax = _im[0]; var setImax = _im[1];
  var _he = useState(true); var hideExp = _he[0]; var setHideExp = _he[1];
  var _ho = useState(false); var hideOther = _ho[0]; var setHideOther = _ho[1];
  /* Gas cooling model state */
  var _gas = useState("forming"); var gasAtm = _gas[0]; var setGasAtm = _gas[1];
  var _pr = useState(760); var chamberP = _pr[0]; var setChamberP = _pr[1];
  var _em = useState(-1); var emissOvr = _em[0]; var setEmissOvr = _em[1]; /* -1 = auto */

  var mp = DB[metal];
  var dum = geo === "wire" ? diam : 0;

  /* Compute temperature-averaged h from RT→T_m (50K steps) */
  var hInfo = useMemo(function () {
    var Dch = geoDchar(geo, thick, width, dum, tubeID, tubeWall);
    var eps = emissOvr >= 0 ? emissOvr : getEmissivity(metal);
    var T_w = 300;
    var prof = computeHprofile(gasAtm, chamberP, mp.Tm, T_w, Dch, eps);
    prof.Dch = Dch;
    prof.eps = eps;
    return prof;
  }, [gasAtm, chamberP, emissOvr, metal, mp, geo, thick, width, dum, tubeID, tubeWall]);
  var hEff = hInfo.h_avg;

  var uc = useMemo(function () {
    var est = estimateJloc(metal, geo, thick, width, dum, gauge, jdot, hEff, tubeID, tubeWall);
    var Jloc = est.Jloc;
    var Emax = mp.rhoM * Jloc * 1e6 / 100;
    var tr = Jloc / Math.max(jdot / 60, 0.001);
    var NR = tr / Math.max(est.cool.tau, 0.001);
    var Amm2 = geoAP(geo, thick, width, diam, tubeID, tubeWall).A * 1e6;
    var Am2 = Amm2 * 1e-6;
    var Lm = gauge / 1000;
    var I = Jloc * Amm2;
    var V10 = mp.rho0 * (Jloc * 0.1 * 1e6) * Lm;
    var s10 = V10 > 0 ? (vOff / 1000) / V10 : 99;
    var R0 = Am2 > 0 ? mp.rho0 * Lm / Am2 : 0;
    var clipPct = est.cool.qTot > 0 ? est.cool.qClip / est.cool.qTot * 100 : 0;
    var Ef = flashThreshold(mp.lam, gauge);
    var Jflash = findJonset(mp, Jloc, Ef);
    var Ionset = Jflash * Amm2;
    /* T_onset: estimated temperature when flash begins, from rho(J) model */
    var TmC = mp.Tm - 273;
    var Tonset = Jflash > 0 && Jloc > 0
      ? 25 + (TmC - 25) * Math.pow(Math.min(Jflash / Jloc, 1), 1.5)
      : 0;
    var flashWin = Jflash > 0 && Jloc > 0 ? (Jloc - Jflash) / Jloc * 100 : 0;
    var willLOC = Jflash > 0 && Jflash < Jloc; /* flash onset before LOC → defect LOC */
    var trans = transientEpeak(mp, geo, thick, width, dum, gauge, Imax, jdot, tubeID, tubeWall, gasAtm, chamberP, hInfo.Dch, hInfo.eps);
    return {
      Jloc: Jloc, Emax: Emax, Ef: Ef, Jflash: Jflash, tr: tr, NR: NR, tau: est.cool.tau,
      Epeak: trans.Epeak, tMelt: trans.tMelt, Imelt: trans.Imelt, Jmelt: trans.Jmelt, dIdt: trans.dIdt,
      I: I, Ionset: Ionset, Amm2: Amm2, s10: s10, R0: R0, Jss: est.Jss, clipPct: clipPct,
      Tonset: Tonset, flashWin: flashWin, willLOC: willLOC, TmC: TmC
    };
  }, [metal, geo, thick, width, diam, gauge, jdot, hEff, vOff, mp, dum, Imax, tubeID, tubeWall, gasAtm, chamberP, hInfo]);

  /* h at flash onset temperature (for display) */
  var hAtOnset = useMemo(function () {
    var Dch = geoDchar(geo, thick, width, dum, tubeID, tubeWall);
    var eps = emissOvr >= 0 ? emissOvr : getEmissivity(metal);
    var T_onset_K = uc.Tonset + 273;
    return computeHtotal(gasAtm, chamberP, T_onset_K, 300, Dch, eps);
  }, [gasAtm, chamberP, emissOvr, metal, geo, thick, width, dum, tubeID, tubeWall, uc.Tonset]);

  var curves = useMemo(function () {
    var c = {};
    CHART_METALS.forEach(function (m) {
      var est = estimateJloc(m, geo, thick, width, dum, gauge, jdot, hEff, tubeID, tubeWall);
      var pts = buildEJ(m, est.Jloc, 100);
      var tr = transientEpeak(DB[m], geo, thick, width, dum, gauge, Imax, jdot, tubeID, tubeWall, gasAtm, chamberP, hInfo.Dch, emissOvr >= 0 ? emissOvr : getEmissivity(m));
      var mEf = flashThreshold(DB[m].lam, gauge);
      var mJflash = findJonset(DB[m], est.Jloc, mEf);
      c[m] = { pts: pts, Jloc: est.Jloc, Emax: DB[m].rhoM * est.Jloc * 1e6 / 100, Epeak: tr.Epeak, Jmelt: tr.Jmelt, Ef: mEf, Jflash: mJflash };
    });
    return c;
  }, [geo, thick, width, diam, gauge, jdot, hEff, dum, Imax, tubeID, tubeWall, gasAtm, chamberP, hInfo, emissOvr]);

  var ejData = useMemo(function () {
    var map = {};
    CHART_METALS.forEach(function (m) {
      if (!curves[m]) return;
      curves[m].pts.forEach(function (pt) {
        var key = String(pt.J);
        if (!map[key]) map[key] = { J: pt.J };
        map[key]["E_" + m] = pt.E;
      });
    });
    return Object.values(map).sort(function (a, b) { return a.J - b.J; });
  }, [curves]);

  var maxJ = useMemo(function () {
    var vals = CHART_METALS.map(function (m) { return curves[m] ? curves[m].Jloc : 0; });
    return Math.max.apply(null, vals) * 1.1;
  }, [curves]);

  var maxE = useMemo(function () {
    var vals = CHART_METALS.map(function (m) { return curves[m] ? curves[m].Emax : 0; });
    return Math.max(Math.max.apply(null, vals), 0.8) * 1.15;
  }, [curves]);

  var scatter = useMemo(function () {
    var pts = EXP.map(function (e) {
      var emp = DB[e.m];
      var cl = finCooling(emp, "foil", e.t, e.w, 0, e.L, hEff, 0, 0);
      var tr = e.Jloc / (e.jdot / 60);
      return Object.assign({}, e, { NR: tr / cl.tau, Emax: emp.rhoM * e.Jloc * 1e6 / 100 });
    });
    var Ebest = Math.max(uc.Emax, uc.Epeak);
    var isFlash = uc.Ef > 0 ? Ebest > uc.Ef * 0.8 : Ebest > 0.5;
    pts.push({
      label: "Your design", m: metal, jdot: jdot, Jloc: uc.Jloc,
      NR: uc.NR, Emax: Ebest, flash: isFlash, isUser: true
    });
    return pts;
  }, [metal, jdot, hEff, uc, mp, Imax]);

  var fa = useMemo(function () {
    var E = Math.max(uc.Emax, uc.Epeak);
    var Ef = uc.Ef;
    var outcome = uc.willLOC
      ? "\u2192 LOC below Tm (" + uc.Tonset.toFixed(0) + "\u2013" + uc.TmC.toFixed(0) + "°C). Flash window " + uc.flashWin.toFixed(0) + "%."
      : "\u2192 No flash onset \u2014 sample will MELT at Tm=" + uc.TmC.toFixed(0) + "°C.";
    if (Ef > 0) {
      if (E > Ef * 1.2) return {
        tag: uc.willLOC ? "\u26A1 FLASH \u2192 LOC" : "E > threshold", c: "#22c55e",
        msg: E.toFixed(3) + " > " + Ef.toFixed(2) + " V/cm. " + outcome
      };
      if (E > Ef * 0.8) return {
        tag: "E near threshold", c: "#f59e0b",
        msg: E.toFixed(3) + " ~ " + Ef.toFixed(2) + " V/cm. Borderline. " + outcome
      };
      return {
        tag: uc.willLOC ? "E < threshold" : "\u2622 NO FLASH \u2192 MELT", c: "#ef4444",
        msg: E.toFixed(3) + " < " + Ef.toFixed(2) + ". Need " + (Ef / Math.max(E, 0.001)).toFixed(1) + "x more. " + outcome
      };
    }
    if (E > 0.5) return {
      tag: "High E -- plausible", c: "#22c55e",
      msg: E.toFixed(3) + " V/cm. No known threshold for " + mp.name + ". " + outcome
    };
    if (E > 0.1) return { tag: "Moderate E", c: "#f59e0b", msg: E.toFixed(3) + " V/cm. " + outcome };
    return { tag: "Low E", c: "#ef4444", msg: E.toFixed(3) + " V/cm. " + outcome };
  }, [uc, mp]);

  var geoStr = geo === "foil"
    ? thick + "\u00b5m x " + width + "mm foil, L=" + gauge + "mm"
    : geo === "wire"
      ? "d" + diam + "\u00b5m wire, L=" + gauge + "mm"
      : "ID " + tubeID + "mm, wall " + tubeWall + "\u00b5m tube, L=" + gauge + "mm";

  return (
    <div style={{
      fontFamily: FONT_S, maxWidth: 1100, margin: "0 auto", padding: "0.7rem",
      background: "#f0f2f5", minHeight: "100vh", color: "#1e293b"
    }}>
      <div style={{
        textAlign: "center", marginBottom: "0.5rem", paddingBottom: "0.3rem",
        borderBottom: "1px solid #cbd5e1"
      }}>
        <div style={{
          fontSize: "0.56rem", fontFamily: FONT_M, color: "#64748b",
          letterSpacing: "0.05em", marginBottom: 4, padding: "3px 0",
          borderBottom: "1px solid #cbd5e122"
        }}>
          © 2026. Written by Ric Fulop, MIT Center for Bits and Atoms
        </div>
        <h1 style={{
          fontSize: "1.2rem", fontWeight: 800,
          background: "linear-gradient(135deg,#1e293b,#475569)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0
        }}>
          Flash Process Parameters for Metals
        </h1>
        <p style={{ fontFamily: FONT_M, fontSize: "0.58rem", color: "#64748b", margin: "1px 0 0" }}>
          fin+clip thermal model | dynamic E(J) | {ALL_METALS.length} metals + {ALL_ALLOYS.length} alloys | Voltivity DFT Handbook v12
        </p>
        {props.onOpenGuide ? (
          <button onClick={props.onOpenGuide} style={{
            marginTop: 6, background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff", border: "none", borderRadius: 6,
            padding: "5px 16px", cursor: "pointer", fontSize: "0.7rem",
            fontFamily: FONT_M, fontWeight: 600, letterSpacing: "0.02em",
            boxShadow: "0 1px 4px rgba(37,99,235,0.3)",
            transition: "opacity 0.15s"
          }}>
            📖 Technical Guide — Flash in Solid Metals
          </button>
        ) : null}
      </div>
      {/* ── FULL PERIODIC TABLE SELECTOR ── */}
      <div style={{
        background: "#ffffff", borderRadius: 6, padding: "6px 8px", border: "1px solid #e2e8f0",
        marginBottom: "0.4rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              fontSize: "0.54rem", color: "#475569", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600
            }}>Select Material ({ALL_MATERIALS.length})</div>
            <label style={{
              display: "flex", alignItems: "center", gap: 4, cursor: "pointer",
              fontSize: "0.5rem", color: "#475569"
            }}>
              <input type="checkbox" checked={hideExp}
                onChange={function () { setHideExp(!hideExp); }}
                style={{ accentColor: "#e94560", width: 12, height: 12 }} />
              Hide exp. data
            </label>
            <label style={{
              display: "flex", alignItems: "center", gap: 4, cursor: "pointer",
              fontSize: "0.5rem", color: "#475569"
            }}>
              <input type="checkbox" checked={hideOther}
                onChange={function () { setHideOther(!hideOther); }}
                style={{ accentColor: "#3b82f6", width: 12, height: 12 }} />
              Hide other E(J)
            </label>
          </div>
          <div style={{ fontSize: "0.5rem", color: "#475569", fontFamily: FONT_M, lineHeight: 1.4, textAlign: "right" }}>
            <span style={{ fontWeight: 700, color: mp.color }}>{mp.name}</span>
            {" (" + (mp.cat || "") + ") Tm=" + (mp.Tm - 273) + "°C"}
            {" | ρ: " + (mp.rho0 * 1e8).toFixed(1) + "→" + (mp.rhoM * 1e8).toFixed(0) + " µΩ·cm | k=" + mp.k_th.toFixed(0) + " W/mK | λ=" + mp.lam}
          </div>
        </div>
        {(function () {
          var CW = 30; var CH = 22; var GAP = 1;
          var renderCell = function (sym, ci) {
            if (sym === null) return <div key={ci} style={{ width: CW, height: CH }} />;
            /* Special lanthanide/actinide placeholder markers */
            if (sym === "*Ln") return <div key={ci} style={{
              width: CW, height: CH, fontSize: "0.36rem", fontFamily: FONT_M, display: "flex",
              alignItems: "center", justifyContent: "center", color: "#94a3b8", fontStyle: "italic",
              background: "#f8fafc", borderRadius: 2, border: "1px dashed #cbd5e1"
            }}>Ln▾</div>;
            if (sym === "*An") return <div key={ci} style={{
              width: CW, height: CH, fontSize: "0.36rem", fontFamily: FONT_M, display: "flex",
              alignItems: "center", justifyContent: "center", color: "#94a3b8", fontStyle: "italic",
              background: "#f8fafc", borderRadius: 2, border: "1px dashed #cbd5e1"
            }}>An▾</div>;
            /* Element in our database — clickable */
            if (DB[sym]) return <Chip key={ci} active={metal === sym} color={DB[sym].color}
              onClick={function () { setMetal(sym); }}>{sym}</Chip>;
            /* Element NOT in database — greyed out */
            return <div key={ci} style={{
              width: CW, height: CH, fontSize: "0.5rem", fontFamily: FONT_S,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 3, color: "#c0c8d4", background: "#f1f5f9",
              border: "1px solid #e2e8f0", cursor: "default",
              userSelect: "none"
            }}>{sym}</div>;
          };
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: GAP, alignItems: "center" }}>
              {/* Main 7 rows */}
              {PT_ROWS.map(function (row, ri) {
                return (
                  <div key={ri} style={{ display: "flex", gap: GAP }}>
                    {row.map(renderCell)}
                  </div>
                );
              })}
              {/* Spacer */}
              <div style={{ height: 3 }} />
              {/* Lanthanide row */}
              <div style={{ display: "flex", gap: GAP }}>
                <div style={{ width: CW * 2 + GAP, height: CH, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 3, fontSize: "0.4rem", color: "#94a3b8", fontFamily: FONT_M, fontWeight: 600 }}>Ln</div>
                {PT_LN.map(renderCell)}
                <div style={{ width: CW, height: CH }} />
              </div>
              {/* Actinide row */}
              <div style={{ display: "flex", gap: GAP }}>
                <div style={{ width: CW * 2 + GAP, height: CH, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 3, fontSize: "0.4rem", color: "#94a3b8", fontFamily: FONT_M, fontWeight: 600 }}>An</div>
                {PT_AN.map(renderCell)}
                <div style={{ width: CW, height: CH }} />
              </div>
            </div>
          );
        })()}
        {/* ── ALLOY SELECTOR ── */}
        <div style={{ marginTop: 4 }}>
          <div style={{
            fontSize: "0.48rem", color: "#64748b", letterSpacing: "0.08em",
            textTransform: "uppercase", fontWeight: 600, marginBottom: 3
          }}>Alloys ({ALL_ALLOYS.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {Object.entries(ALLOY_CATEGORIES).map(function (entry) {
              var catName = entry[0];
              var keys = entry[1];
              return (
                <div key={catName} style={{ marginRight: 6, marginBottom: 2 }}>
                  <div style={{
                    fontSize: "0.38rem", color: "#94a3b8", fontFamily: FONT_M,
                    fontWeight: 600, letterSpacing: "0.05em", marginBottom: 1,
                    textTransform: "uppercase"
                  }}>{catName}</div>
                  <div style={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {keys.map(function (k) {
                      return <Chip key={k} active={metal === k} color={DB[k].color}
                        onClick={function () { setMetal(k); }}>{k}</Chip>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "0.5rem" }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ background: "#ffffff", borderRadius: 6, padding: "6px 8px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
              <Chip active={geo === "foil"} color="#e94560"
                onClick={function () { setGeo("foil"); }}>Foil</Chip>
              <Chip active={geo === "wire"} color="#e94560"
                onClick={function () { setGeo("wire"); }}>Wire</Chip>
              <Chip active={geo === "tube"} color="#e94560"
                onClick={function () { setGeo("tube"); }}>Tube</Chip>
            </div>
            {geo === "foil" ? (
              <div>
                <Sl label="Thickness" value={thick} set={setThick}
                  min={5} max={1000} step={5} unit="µm" />
                <Sl label="Width" value={width} set={setWidth}
                  min={0.25} max={25} step={0.25} unit="mm"
                  fmt={function (v) { return v.toFixed(2); }} />
              </div>
            ) : geo === "wire" ? (
              <Sl label="Diameter" value={diam} set={setDiam}
                min={10} max={5000} step={10} unit="µm" />
            ) : (
              <div>
                <Sl label="Inner diameter (ID)" value={tubeID} set={setTubeID}
                  min={0.5} max={50} step={0.5} unit="mm"
                  fmt={function (v) { return v.toFixed(1); }} />
                <Sl label="Wall thickness" value={tubeWall} set={setTubeWall}
                  min={10} max={2000} step={10} unit="µm" />
              </div>
            )}
            <Sl label="Gauge length L" value={gauge} set={setGauge}
              min={2} max={400} step={1} unit="mm" color="#f59e0b" />
          </div>
          <div style={{ background: "#ffffff", borderRadius: 6, padding: "6px 8px", border: "1px solid #e2e8f0" }}>
            <Sl label="Ramp rate" value={jdot} set={setJdot}
              min={10} max={50000} step={10} unit="A/mm²/min" color="#3b82f6" />
            <Sl label="I_max (supply)" value={Imax} set={setImax}
              min={10} max={500} step={5} unit="A" color="#ef4444" />
            <Sl label="V offset" value={vOff} set={setVOff}
              min={0} max={50} step={0.5} unit="mV" color="#475569"
              fmt={function (v) { return v.toFixed(1); }} />
          </div>
          {/* Chamber Environment */}
          <div style={{ background: "#ffffff", borderRadius: 6, padding: "6px 8px", border: "1px solid #e2e8f0" }}>
            <div style={{
              fontSize: "0.52rem", color: "#475569", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 3, fontWeight: 600
            }}>Chamber Environment</div>
            {/* Gas selector */}
            <div style={{ display: "flex", gap: 2, marginBottom: 4, flexWrap: "wrap" }}>
              {Object.keys(GASES).map(function (gk) {
                return <Chip key={gk} active={gasAtm === gk} color="#0891b2"
                  onClick={function () { setGasAtm(gk); }}>{GASES[gk].label}</Chip>;
              })}
            </div>
            {/* Pressure — log slider */}
            <Sl label="Pressure" value={chamberP} set={setChamberP}
              min={0.1} max={760} step={0.1} unit="torr" color="#0891b2"
              fmt={function (v) { return v >= 1 ? Math.round(v) : v.toFixed(1); }} />
            {/* Emissivity */}
            <Sl label={"ε (emissivity)"} value={emissOvr >= 0 ? emissOvr : getEmissivity(metal)}
              set={function (v) { setEmissOvr(v); }}
              min={0.01} max={1.0} step={0.01} unit="" color="#64748b"
              fmt={function (v) { return v.toFixed(2); }} />
            {emissOvr >= 0 ? (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -2 }}>
                <button onClick={function () { setEmissOvr(-1); }} style={{
                  fontSize: "0.44rem", color: "#3b82f6", background: "none", border: "none",
                  cursor: "pointer", textDecoration: "underline", padding: 0
                }}>reset to auto</button>
              </div>
            ) : null}
            {/* h breakdown at RT, onset, Tm */}
            {(function () {
              var rows = [
                { label: "RT (27°C)", h: hInfo.hRT },
                { label: "Onset (" + Math.round(uc.Tonset) + "°C)", h: hAtOnset },
                { label: "T_m (" + Math.round(mp.Tm - 273) + "°C)", h: hInfo.hTm }
              ];
              var radPctAvg = hInfo.h_avg > 0
                ? (hInfo.hTm.h_rad / hInfo.hTm.h_total * 100) : 0;
              return (
                <div style={{ marginTop: 4, fontSize: "0.48rem", fontFamily: FONT_M, color: "#64748b" }}>
                  {/* header */}
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 1, marginBottom: 1 }}>
                    <span style={{ width: 72 }}></span>
                    <span style={{ width: 55, textAlign: "right", fontSize: "0.40rem", color: "#94a3b8" }}>h_conv</span>
                    <span style={{ width: 55, textAlign: "right", fontSize: "0.40rem", color: "#94a3b8" }}>h_rad</span>
                    <span style={{ width: 55, textAlign: "right", fontSize: "0.40rem", color: "#94a3b8" }}>h_total</span>
                  </div>
                  {rows.map(function (r) {
                    return (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5px 0" }}>
                        <span style={{ width: 72, fontSize: "0.44rem" }}>{r.label}</span>
                        <span style={{ width: 55, textAlign: "right", color: "#0891b2" }}>{r.h.h_conv.toFixed(1)}</span>
                        <span style={{ width: 55, textAlign: "right", color: "#ef4444" }}>{r.h.h_rad.toFixed(1)}</span>
                        <span style={{ width: 55, textAlign: "right", fontWeight: 600, color: "#1e293b" }}>{r.h.h_total.toFixed(1)}</span>
                      </div>
                    );
                  })}
                  {/* avg used for physics */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", borderTop: "1px solid #e2e8f0",
                    marginTop: 2, paddingTop: 2, fontWeight: 700, color: "#1e293b"
                  }}>
                    <span style={{ fontSize: "0.44rem" }}>h_avg (used)</span>
                    <span>{hInfo.h_avg.toFixed(1)} <span style={{ fontSize: "0.40rem", color: "#94a3b8", fontWeight: 400 }}>W/m²K</span></span>
                  </div>
                  <div style={{ marginTop: 2, height: 4, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      width: radPctAvg + "%", height: "100%",
                      background: "linear-gradient(90deg, #ef4444, #f97316)", borderRadius: 2
                    }} />
                  </div>
                  <div style={{ fontSize: "0.40rem", color: "#94a3b8", marginTop: 1 }}>
                    Radiation: {radPctAvg.toFixed(0)}% at T_m · averaged over 50K steps
                  </div>
                </div>
              );
            })()}
          </div>
          {/* Power Supply Settings box */}
          <div style={{ background: "#ffffff", borderRadius: 6, padding: "6px 8px", border: "1px solid #e2e8f0" }}>
            <div style={{
              fontSize: "0.52rem", color: "#475569", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 3, fontWeight: 600
            }}>Power Supply Settings</div>
            {(function () {
              var Amm2 = geoAP(geo, thick, width, diam, tubeID, tubeWall).A * 1e6;
              var dIdt_Amin = jdot * Amm2;  /* A/min */
              var dIdt_As = dIdt_Amin / 60;  /* A/s */
              var Ionset = uc.Jflash * Amm2;
              var Iloc = uc.Jloc * Amm2;
              var tOnset_s = Ionset > 0 ? Ionset / dIdt_As : 0;
              var tLOC_s = Iloc > 0 ? Iloc / dIdt_As : 0;
              return (
                <div style={{ fontSize: "0.56rem", fontFamily: FONT_M, lineHeight: 1.7 }}>
                  <InfoRow label="Cross-section A" val={Amm2.toFixed(3)} unit="mm²" />
                  <InfoRow label="Current ramp dI/dt" val={dIdt_Amin.toFixed(1)} unit="A/min" hl />
                  <InfoRow label="Current ramp dI/dt" val={dIdt_As.toFixed(2)} unit="A/s" />
                  <InfoRow label="I at flash onset" val={Ionset.toFixed(1)} unit="A" />
                  <InfoRow label="I at LOC" val={Iloc.toFixed(1)} unit="A" />
                  <InfoRow label="Time to flash onset" val={tOnset_s > 0 ? tOnset_s.toFixed(1) : "--"} unit={tOnset_s > 0 ? "s" : ""} />
                  <InfoRow label="Time to LOC" val={tLOC_s > 0 ? tLOC_s.toFixed(1) : "--"} unit={tLOC_s > 0 ? "s" : ""} />
                  <InfoRow label="Max supply current" val={Imax.toFixed(0)} unit="A" dim />
                </div>
              );
            })()}
          </div>
          <div style={{ background: "#ffffff", borderRadius: 6, padding: "6px 8px", border: "1px solid #e2e8f0" }}>
            <div style={{
              fontSize: "0.52rem", color: "#64748b", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 2
            }}>
              {"Results -- " + mp.name}
            </div>
            <InfoRow label="E_max (at Tm)" val={uc.Emax.toFixed(3)} unit="V/cm" hl />
            <InfoRow label="J_LOC (thermal)" val={uc.Jloc.toFixed(0)} unit="A/mm2" />
            <InfoRow label="J_onset (flash)" val={uc.Jflash.toFixed(0)} unit="A/mm2" />
            <InfoRow label="I_onset" val={uc.Ionset.toFixed(1)} unit="A" />
            <InfoRow label="T at onset" val={uc.Tonset > 0 ? uc.Tonset.toFixed(0) : "--"} unit={uc.Tonset > 0 ? "°C" : ""} />
            <InfoRow label="Flash window" val={uc.flashWin > 0 ? uc.flashWin.toFixed(1) : "--"} unit={uc.flashWin > 0 ? "%" : ""} />
            <InfoRow label="E_flash (threshold)" val={uc.Ef.toFixed(3)} unit="V/cm" />
            <InfoRow label="E_peak (transient)" val={uc.Epeak.toFixed(3)} unit="V/cm" hl />
            <InfoRow label="J at melt" val={uc.Jmelt.toFixed(0)} unit="A/mm2" dim />
            <InfoRow label="I at melt" val={uc.Imelt.toFixed(1)} unit="A" dim />
            <InfoRow label="t to melt" val={(uc.tMelt * 1000).toFixed(0)} unit="ms" dim />
            <InfoRow label="J_ss (steady)" val={uc.Jss.toFixed(0)} unit="A/mm2" dim />
            <InfoRow label="Clip share" val={uc.clipPct.toFixed(0)} unit="%" dim />
            <InfoRow label="(N_R)" val={uc.NR.toFixed(3)} />
            <InfoRow label="tau_cool" val={uc.tau.toFixed(1)} unit="s" dim />
            <InfoRow label="I at LOC" val={uc.I.toFixed(1)} unit="A" />
            <InfoRow label="Tm" val={uc.TmC.toFixed(0)} unit="°C" dim />
            <InfoRow label="Voff/V @10%J" val={(uc.s10 * 100).toFixed(1)} unit="%"
              warn={uc.s10 > 0.15} />
            <InfoRow label="R0" val={(uc.R0 * 1000).toFixed(2)} unit="mOhm" dim />
          </div>
          <div style={{
            background: fa.c + "15", border: "1px solid " + fa.c + "40",
            borderRadius: 5, padding: "4px 7px"
          }}>
            <div style={{ fontSize: "0.66rem", fontWeight: 700, color: fa.c }}>{fa.tag}</div>
            <div style={{ fontSize: "0.54rem", color: "#64748b", marginTop: 1 }}>{fa.msg}</div>
          </div>
          <div style={{ background: "#ffffff", borderRadius: 6, padding: "6px 8px", border: "1px solid #e2e8f0" }}>
            <div style={{
              fontSize: "0.52rem", color: "#475569", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 3, fontWeight: 600
            }}>Flash Thresholds (E_flash = λ / r) at L={gauge}mm</div>
            <div style={{ fontSize: "0.48rem", fontFamily: FONT_M, lineHeight: 1.6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 10px" }}>
              {TABLE_METALS.map(function (k) {
                var m = DB[k];
                var ef = flashThreshold(m.lam, gauge);
                return (
                  <div key={k} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: m.color, fontWeight: 700 }}>{k}</span>
                    {" "}<b>{ef.toFixed(2)}</b>
                    <span style={{ color: "#94a3b8", fontSize: "0.40rem" }}>{" V/cm"}</span>
                    <span style={{ color: "#64748b", fontSize: "0.40rem" }}>{" λ=" + m.lam}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {/* Process map */}
          <div style={{
            background: "#ffffff", borderRadius: 8, padding: "5px 4px 2px",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              fontSize: "0.58rem", fontFamily: FONT_M, color: "#64748b",
              textAlign: "center"
            }}>
              PROCESS WINDOW -- Emax vs (NR)
            </div>
            <ResponsiveContainer width="100%" height={235}>
              <ScatterChart margin={{ top: 14, right: 16, bottom: 18, left: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <ReferenceArea x1={0.003} x2={1} fill="#3b82f6" fillOpacity={0.06}
                  label={{ value: "ADIABATIC", position: "insideTopLeft", style: { fontSize: 8, fill: "#3b82f6a0", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }} />
                <ReferenceArea x1={1} x2={300} fill="#f59e0b" fillOpacity={0.04}
                  label={{ value: "COOLING LIMITED", position: "insideTopRight", style: { fontSize: 8, fill: "#d97706a0", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }} />
                {uc.Ef > 0 && uc.Emax > 0 && uc.Ef < uc.Emax ? (
                  <ReferenceArea y1={uc.Ef} y2={Math.min(uc.Emax, 8)} x1={0.003} x2={300}
                    fill="#22c55e" fillOpacity={0.08} />
                ) : null}
                <ReferenceLine x={1} stroke="#94a3b8" strokeDasharray="6 3" strokeWidth={1}
                  label={{ value: "NR=1", position: "top", style: { fontSize: 7, fill: "#64748b", fontFamily: "'IBM Plex Mono', monospace" } }} />
                <XAxis dataKey="NR" type="number" scale="log" domain={[0.003, 300]}
                  ticks={[0.01, 0.1, 1, 10, 100]}
                  tickFormatter={function (v) { return String(v); }}
                  tick={{ fontSize: 8, fill: "#475569" }} stroke="#cbd5e1">
                  <Label value="(NR) = t_ramp / tau_cool" position="insideBottom" offset={-7}
                    style={{ fontSize: 8, fill: "#64748b" }} />
                </XAxis>
                <YAxis dataKey="Emax" type="number" scale="log" domain={[0.02, 10]}
                  ticks={[0.05, 0.1, 0.5, 1, 2, 5]}
                  tick={{ fontSize: 8, fill: "#475569" }} stroke="#cbd5e1">
                  <Label value="E_max (V/cm)" angle={-90} position="insideLeft" offset={4}
                    style={{ fontSize: 8, fill: "#64748b" }} />
                </YAxis>
                <Tooltip content={MapTip} />
                {uc.Ef > 0 && uc.Ef < 8 ? (
                  <ReferenceLine y={uc.Ef} stroke={mp.color} strokeDasharray="6 4" strokeWidth={2}
                    label={{ value: metal + " E_flash " + uc.Ef.toFixed(2) + (uc.willLOC ? " (LOC)" : ""), position: "right", style: { fontSize: 8, fill: mp.color, fontWeight: 700 } }} />
                ) : null}
                {uc.Emax > 0 && uc.Emax < 8 ? (
                  <ReferenceLine y={uc.Emax} stroke={mp.color + "80"} strokeDasharray="3 3" strokeWidth={0.8}
                    label={{ value: metal + " E_ss " + uc.Emax.toFixed(2), position: "insideTopRight", style: { fontSize: 6, fill: mp.color + "80" } }} />
                ) : null}
                {metal !== "Ti" && flashThreshold(DB.Ti.lam, gauge) < 8 ? (
                  <ReferenceLine y={flashThreshold(DB.Ti.lam, gauge)} stroke="#2563eb40" strokeDasharray="4 4" strokeWidth={0.7}
                    label={{ value: "Ti " + flashThreshold(DB.Ti.lam, gauge).toFixed(2), position: "insideTopRight", style: { fontSize: 6, fill: "#2563eb60" } }} />
                ) : null}
                {!hideExp ? (
                  <Scatter data={scatter.filter(function (d) { return !d.isUser; })}>
                    {scatter.filter(function (d) { return !d.isUser; }).map(function (d, i) {
                      return <Cell key={i}
                        fill={d.flash ? "#22c55e" : "#ffffff"}
                        stroke={DB[d.m] ? DB[d.m].color : "#999"}
                        strokeWidth={2} r={d.flash ? 6 : 4} />;
                    })}
                  </Scatter>
                ) : null}
                <Scatter data={scatter.filter(function (d) { return d.isUser; })}>
                  {scatter.filter(function (d) { return d.isUser; }).map(function (d, i) {
                    return <Cell key={i} fill={fa.c} stroke="#1e293b" strokeWidth={2.5} r={8} />;
                  })}
                </Scatter>
                {uc.Ef > 0 && uc.Ef < 8 ? (
                  <Scatter data={[{ NR: uc.NR, Emax: uc.Ef, label: metal + " onset", flash: true, isUser: true }]}>
                    {[0].map(function (_, i) {
                      return <Cell key={i} fill="none" stroke={mp.color} strokeWidth={2} r={6} />;
                    })}
                  </Scatter>
                ) : null}
              </ScatterChart>
            </ResponsiveContainer>
            <div style={{
              fontSize: "0.42rem", fontFamily: FONT_M, color: "#94a3b8",
              textAlign: "center", marginBottom: 2, lineHeight: 1.4
            }}>
              {"Adiabatic (NR<1): ramp is faster than cooling \u2014 sample heats nearly without loss. "}
              {"Cooling limited (NR>1): ramp is slow \u2014 cooling fights Joule heating, higher J needed for LOC."}
            </div>
            <div style={{
              display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap",
              fontSize: "0.55rem", fontFamily: FONT_M, color: "#475569"
            }}>
              {!hideExp ? ["Ti", "Cu", "Ni", "Al"].map(function (k) {
                return (
                  <span key={k} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      border: "2px solid " + DB[k].color, display: "inline-block"
                    }} />
                    {k}
                  </span>
                );
              }) : null}
              {!hideExp ? (
                <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
                    display: "inline-block"
                  }} />{" flash"}
                </span>
              ) : null}
              <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", background: fa.c,
                  border: "2px solid #1e293b", display: "inline-block"
                }} />{" you"}
              </span>
            </div>
          </div>
          {/* E(J) chart */}
          <div style={{
            background: "#ffffff", borderRadius: 8, padding: "5px 4px 2px",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              fontSize: "0.58rem", fontFamily: FONT_M, color: "#64748b",
              textAlign: "center"
            }}>
              {"E(J) AT " + geoStr.toUpperCase() + ", \u0307J = " + jdot + " A/mm\u00B2/min"}
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ejData} margin={{ top: 4, right: 12, bottom: 32, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="J" type="number" domain={[0, Math.ceil(maxJ / 10) * 10]}
                  tick={{ fontSize: 8, fill: "#475569" }} stroke="#cbd5e1">
                  <Label value={"J (A/mm\u00B2)  \u2502  I (A) at A=" + uc.Amm2.toFixed(2) + "mm\u00B2: J\u00D7" + uc.Amm2.toFixed(2)} position="insideBottom" offset={-18}
                    style={{ fontSize: 7, fill: "#64748b" }} />
                </XAxis>
                <YAxis type="number" domain={[0, Math.ceil(maxE * 10) / 10]}
                  tick={{ fontSize: 8, fill: "#475569" }} stroke="#cbd5e1">
                  <Label value="E (V/cm)" angle={-90} position="insideLeft" offset={5}
                    style={{ fontSize: 8, fill: "#64748b" }} />
                </YAxis>
                {uc.Ef > 0 && uc.Emax > 0 && uc.Jflash > 0 && uc.Ef < uc.Emax ? (
                  <ReferenceArea x1={uc.Jflash} x2={Math.round(uc.Jloc * 10) / 10}
                    y1={uc.Ef} y2={Math.min(uc.Emax, Math.ceil(maxE * 10) / 10)}
                    fill="#22c55e" fillOpacity={0.1} />
                ) : null}
                {(hideOther ? [metal] : CHART_METALS).map(function (m) {
                  return <Line key={m} dataKey={"E_" + m} stroke={DB[m].color}
                    strokeWidth={m === metal ? 3 : 1.5} dot={false} name={m} connectNulls
                    strokeDasharray={m === metal ? undefined : "4 2"}
                    strokeOpacity={m === metal ? 1 : 0.7} />;
                })}
                {uc.Ef > 0 && uc.Ef < 8 ? (
                  <ReferenceLine y={uc.Ef} stroke={mp.color} strokeDasharray="6 3" strokeWidth={1.5}
                    label={{ value: metal + " E_flash " + uc.Ef.toFixed(2), position: "right", style: { fontSize: 8, fill: mp.color } }} />
                ) : null}
                {(function () {
                  var close = uc.Jflash > 0 && uc.Jloc > 0 && (uc.Jloc - uc.Jflash) / uc.Jloc < 0.35;
                  var inJ = Math.ceil(maxJ / 10) * 10;
                  var lines = [];
                  /* J_onset line — always visible */
                  if (uc.Jflash > 0 && uc.Jflash < inJ) {
                    lines.push(
                      <ReferenceLine key="jonset" x={Math.round(uc.Jflash * 10) / 10} stroke={mp.color} strokeDasharray="2 3" strokeWidth={1}
                        label={close ? undefined : { value: "J_onset " + uc.Jflash.toFixed(0) + " (I=" + uc.Ionset.toFixed(1) + "A)", position: "insideBottomLeft", style: { fontSize: 7, fill: mp.color } }} />
                    );
                  }
                  /* J_LOC line — combined label when close */
                  if (uc.Jloc > 0 && uc.Jloc < inJ) {
                    var lbl = close
                      ? "J_onset " + uc.Jflash.toFixed(0) + " | " + metal + " LOC " + uc.Jloc.toFixed(0)
                      : metal + " LOC " + uc.Jloc.toFixed(0);
                    lines.push(
                      <ReferenceLine key="jloc" x={Math.round(uc.Jloc * 10) / 10} stroke={mp.color} strokeDasharray="4 3" strokeWidth={1.5}
                        label={{ value: lbl, position: "insideTop", style: { fontSize: 7, fill: mp.color, fontWeight: 700 } }} />
                    );
                  }
                  return lines;
                })()}
                {metal !== "Ti" && flashThreshold(DB.Ti.lam, gauge) < 8 ? (
                  <ReferenceLine y={flashThreshold(DB.Ti.lam, gauge)} stroke="#2563eb40" strokeDasharray="4 4" strokeWidth={0.7} />
                ) : null}
                <Legend wrapperStyle={{ fontSize: 9, paddingTop: 0 }} verticalAlign="top" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{
              display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap",
              fontSize: "0.44rem", fontFamily: FONT_M, color: "#475569"
            }}>
              {CHART_METALS.map(function (m) {
                var c = curves[m];
                if (!c) return null;
                return (
                  <span key={m} style={{ color: DB[m].color }}>
                    {m + " " + c.Emax.toFixed(2)}
                  </span>
                );
              })}
            </div>
          </div>
          <div style={{
            background: "#ffffff", borderRadius: 8, padding: "5px 8px",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              fontSize: "0.52rem", fontFamily: FONT_M, color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2
            }}>
              {"All " + TABLE_METALS.length + " metals at " + geoStr}
            </div>
            <div>
              <table style={{
                width: "100%", fontSize: "0.56rem", fontFamily: FONT_M, color: "#334155",
                borderCollapse: "collapse"
              }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #cbd5e1", color: "#64748b", fontSize: "0.54rem" }}>
                    <th style={{ textAlign: "left", padding: "1px 2px" }}>{""}</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>{"\u03BB"}</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>{"r (\u00B5m)"}</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>{"rho(Tm)"}</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>{"k(th)"}</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>J_flash</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>J_LOC</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>E_max</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>Clip%</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>{"E_pk"}</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>{"E_flash"}</th>
                    <th style={{ textAlign: "right", padding: "1px 2px" }}>Gap</th>
                    <th style={{ textAlign: "center", padding: "1px 2px" }}>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_METALS.map(function (k) {
                    var m = DB[k];
                    var est = estimateJloc(k, geo, thick, width, dum, gauge, jdot, hEff, tubeID, tubeWall);
                    var E = m.rhoM * est.Jloc * 1e6 / 100;
                    var clip = est.cool.qTot > 0 ? est.cool.qClip / est.cool.qTot * 100 : 0;
                    var tr_res = transientEpeak(m, geo, thick, width, dum, gauge, Imax, jdot, tubeID, tubeWall, gasAtm, chamberP, hInfo.Dch, emissOvr >= 0 ? emissOvr : getEmissivity(k));
                    var tr_E = tr_res.Epeak;
                    var ef = flashThreshold(m.lam, gauge);
                    var Jfl = findJonset(m, est.Jloc, ef);
                    var rEst = E > 0 ? m.lam / E : 0;
                    var Ebest = Math.max(E, tr_E);
                    var gap = ef != null ? (Ebest / ef) : null;
                    var ok = ef != null ? gap > 0.8 : Ebest > 0.5;
                    var mTmC = m.Tm - 273;
                    var mTonset = Jfl > 0 && est.Jloc > 0
                      ? 25 + (mTmC - 25) * Math.pow(Math.min(Jfl / est.Jloc, 1), 1.5)
                      : 0;
                    var mWillLOC = Jfl > 0 && Jfl < est.Jloc;
                    return (
                      <tr key={k} style={{
                        borderBottom: "1px solid rgba(226,232,240,0.7)",
                        background: k === metal ? "rgba(59,130,246,0.08)" : "transparent"
                      }}>
                        <td style={{ padding: "1px 2px", color: m.color, fontWeight: 700 }}>{k}</td>
                        <td style={{ textAlign: "right", color: "#475569" }}>{m.lam}</td>
                        <td style={{ textAlign: "right", color: "#64748b" }}>{rEst.toFixed(0)}</td>
                        <td style={{ textAlign: "right" }}>{(m.rhoM * 1e8).toFixed(0)}</td>
                        <td style={{ textAlign: "right", color: "#94a3b8" }}>{m.k_th.toFixed(0)}</td>
                        <td style={{ textAlign: "right", color: "#0284c7" }}>{Jfl.toFixed(0)}</td>
                        <td style={{ textAlign: "right" }}>{est.Jloc.toFixed(0)}</td>
                        <td style={{
                          textAlign: "right", fontWeight: 700,
                          color: ok ? "#16a34a" : E > 0.1 ? "#d97706" : "#dc2626"
                        }}>{E.toFixed(3)}</td>
                        <td style={{ textAlign: "right", color: "#64748b" }}>{clip.toFixed(0)}</td>
                        <td style={{ textAlign: "right", color: "#6d28d9", fontWeight: 600 }}>{tr_E.toFixed(2)}</td>
                        <td style={{ textAlign: "right", color: ef != null ? "#d97706" : "#cbd5e1" }}>
                          {ef != null ? ef.toFixed(1) : "?"}</td>
                        <td style={{
                          textAlign: "right", fontSize: "0.54rem",
                          color: gap != null ? (gap > 1 ? "#16a34a" : gap > 0.5 ? "#d97706" : "#dc2626") : "#cbd5e1"
                        }}>
                          {gap != null ? (gap.toFixed(1) + "x") : "--"}</td>
                        <td style={{
                          textAlign: "center", fontSize: "0.5rem", fontWeight: 700,
                          color: mWillLOC ? "#16a34a" : "#dc2626"
                        }}>
                          {mWillLOC
                            ? "LOC " + mTonset.toFixed(0) + "°"
                            : "MELT " + mTmC.toFixed(0) + "°"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Formulas & Definitions — inside RIGHT column, under table */}
          <div style={{
            background: "#ffffff", borderRadius: 8, padding: "10px 14px",
            border: "1px solid #e2e8f0", fontSize: "0.56rem", fontFamily: FONT_M,
            color: "#64748b", lineHeight: 1.7
          }}>
            <div style={{
              fontSize: "0.58rem", color: "#1e293b", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6
            }}>Formulas & Variable Definitions</div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>Variable Definitions</div>
              <div><b style={{ color: "#0284c7" }}>{"\u03C1\u2080"}</b>{" (rho0) — Electrical resistivity at room temperature [\u03A9\u00B7m]"}</div>
              <div><b style={{ color: "#0284c7" }}>{"\u03C1\u2098"}</b>{" (rhoM) — Electrical resistivity at melting point [\u03A9\u00B7m]"}</div>
              <div><b style={{ color: "#0284c7" }}>T<sub>m</sub></b>{" — Melting temperature of the metal [K]"}</div>
              <div><b style={{ color: "#0284c7" }}>C<sub>p</sub></b>{" — Specific heat capacity [J/(kg\u00B7K)]"}</div>
              <div><b style={{ color: "#0284c7" }}>{"\u03C1_m"}</b>{" — Mass density [kg/m\u00B3]"}</div>
              <div><b style={{ color: "#0284c7" }}>k<sub>th</sub></b>{" — Thermal conductivity [W/(m\u00B7K)]"}</div>
              <div><b style={{ color: "#0284c7" }}>{"\u03BB"}</b>{" (voltivity) — Fundamental material constant [V/cm \u00D7 \u00B5m]. Quantifies the threshold for resonant coupling between applied electric fields and phonon modes. \u03BB = E \u00D7 r. Invariant per material (CV < 2%). Spans ~1,000 V\u00B7\u00B5m (metals) to ~27,000 V\u00B7\u00B5m (covalent carbides)."}</div>
              <div><b style={{ color: "#0284c7" }}>r</b>{" — Defect nucleation coherence length [\u00B5m]. r = \u03BB / E. The spatial region within which phonon-softened barriers enable defect nucleation. r = \u221A(\u03B1_th \u00D7 \u03C4_nuc). Varies per metal."}</div>
              <div><b style={{ color: "#0284c7" }}>J</b>{" — Current density [A/mm\u00B2]"}</div>
              <div><b style={{ color: "#0284c7" }}>E</b>{" — Electric field [V/cm]. E = \u03C1 \u00D7 J"}</div>
              <div><b style={{ color: "#0284c7" }}>J_LOC</b>{" — Loss of Cohesion current density [A/mm\u00B2]. The J at which the compact loses structural integrity. LOC is a structural failure distinct from simply reaching T\u2098; it depends on geometry, ramp rate, and cooling."}</div>
              <div><b style={{ color: "#0284c7" }}>J_flash</b>{" — Current density at which E = E_flash (flash onset). J_flash = E_flash / \u03C1\u2098 [A/mm\u00B2]"}</div>
              <div><b style={{ color: "#0284c7" }}>E_max</b>{" — Peak electric field at LOC: E_max = \u03C1\u2098 \u00D7 J_LOC [V/cm]"}</div>
              <div><b style={{ color: "#0284c7" }}>E_flash</b>{" — Flash onset threshold: E_flash = \u03BB / r [V/cm]"}</div>
              <div><b style={{ color: "#0284c7" }}>(N<sub>R</sub>)</b>{" — Normalized ramp: (N_R) = t_ramp / \u03C4_cool. <1 means fast ramp (adiabatic), >1 means cooling-limited"}</div>
              <div><b style={{ color: "#0284c7" }}>{"\u03C4_cool"}</b>{" — Cooling time constant: \u03C4 = \u03C1_m \u00D7 C_p / q_total [s]"}</div>
              <div><b style={{ color: "#0284c7" }}>J_ss</b>{" — Steady-state LOC current density (no ramp-rate overshoot) [A/mm\u00B2]"}</div>
              <div><b style={{ color: "#0284c7" }}>Clip %</b>{" — Fraction of heat loss via axial conduction to clips vs. total (convection + clip) [%]"}</div>
              <div><b style={{ color: "#0284c7" }}>E_pk</b>{" — Transient peak E-field during current ramp (may exceed steady-state E_max) [V/cm]"}</div>
              <div><b style={{ color: "#0284c7" }}>Gap</b>{" — Ratio of max achievable E (max of E_max, E_pk) to E_flash. Gap > 1 means flash is expected."}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>Thermal Model — Fin + Clip Cooling</div>
              <div>{"The sample is modelled as a thin conductor (foil or wire) with two heat-loss paths:"}</div>
              <div style={{ paddingLeft: 10 }}>{"1. Convective cooling: q_conv = h \u00D7 (P/A), where P = perimeter, A = cross-section area, h = convection coefficient."}</div>
              <div style={{ paddingLeft: 10 }}>{"2. Axial clip conduction (fin model): q_clip = 2 \u00D7 k_th \u00D7 m \u00D7 tanh(mL/2) / L, where m = \u221A(h\u00D7P / (k_th\u00D7A))."}</div>
              <div>{"Total cooling: q_total = q_conv + q_clip. Cooling time constant: \u03C4 = \u03C1_m \u00D7 C_p / q_total."}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>Steady-State LOC (J_ss)</div>
              <div>{"At steady state, Joule heating balances cooling: \u03C1\u2098 \u00D7 J\u00B2 = q_total \u00D7 \u0394T, where \u0394T = T_m - 300K."}</div>
              <div>{"Solving: J_ss = \u221A(q_total \u00D7 \u0394T / \u03C1\u2098). This is the thermal baseline; actual LOC occurs at higher J due to dynamic overshoot during ramping."}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>Dynamic J_LOC Estimation</div>
              <div>{"For metals with experimental calibration data (Ti, Ni, Cu, Al), J_LOC is estimated by scaling the reference measurement:"}</div>
              <div style={{ paddingLeft: 10 }}>{"J_LOC = J_ss_ref \u00D7 (J_LOC_ref / J_ss_ref) \u00D7 (J_ss / J_ss_ref) \u00D7 (jdot / jdot_ref)^0.1"}</div>
              <div>{"The geometric scaling (J_ss / J_ss_ref) accounts for different sample dimensions. The ramp-rate exponent (0.1) captures the weak overshoot effect."}</div>
              <div>{"For metals without calibration data, a default overshoot factor of 2.8\u00D7 is used: J_LOC = J_ss \u00D7 2.8."}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>E(J) Curve Construction</div>
              <div>{"The E-J relationship is built by interpolating resistivity from \u03C1\u2080 to \u03C1\u2098 as a function of J/J_LOC:"}</div>
              <div style={{ paddingLeft: 10 }}>{"\u03C1(J) = \u03C1\u2080 + (\u03C1\u2098 - \u03C1\u2080) \u00D7 (J / J_LOC)^1.5"}</div>
              <div style={{ paddingLeft: 10 }}>{"E(J) = \u03C1(J) \u00D7 J"}</div>
              <div>{"The 1.5 exponent models the non-linear resistivity increase as the sample approaches LOC."}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>Transient Solver (E_peak)</div>
              <div>{"A time-stepping simulation ramps current at dI/dt = jdot \u00D7 A / 60 (A/s), capped at I_max:"}</div>
              <div style={{ paddingLeft: 10 }}>{"At each dt=2ms step: T += \u03C1(T) \u00D7 J\u00B2 / (\u03C1_m \u00D7 C_p) \u00D7 dt (adiabatic heating)"}</div>
              <div style={{ paddingLeft: 10 }}>{"\u03C1(T) = \u03C1\u2080 + (\u03C1\u2098 - \u03C1\u2080) \u00D7 (T - 300) / (T_m - 300)"}</div>
              <div style={{ paddingLeft: 10 }}>{"Track max E = \u03C1(T) \u00D7 J. Stop when T \u2265 T_m (used as proxy for LOC in thermal model)."}</div>
              <div>{"This captures the transient overshoot where E_peak can exceed the steady-state E_max because resistivity is still rising while current ramps. Note: actual LOC is a structural failure, not simply reaching T_m."}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>Voltivity Framework (Fulop, 2026)</div>
              <div>{"Momentum conservation forbids direct coupling between applied electric fields and the short-wavelength acoustic phonons that destabilize crystal lattices. Energy must cascade through intermediate excitations:"}</div>
              <div style={{ paddingLeft: 10 }}>{"Metals: Field \u2192 free electron acceleration \u2192 optical phonon emission \u2192 anharmonic decay to acoustic phonons (Klemens channel)"}</div>
              <div style={{ paddingLeft: 10 }}>{"Insulators: Field \u2192 polaron/carrier activation \u2192 lattice relaxation producing acoustic phonons"}</div>
              <div style={{ paddingLeft: 10 }}>{"Covalent: Field \u2192 carrier liberation from band gap \u2192 cascade (with activation bottleneck)"}</div>
              <div>{"The master equation: \u03BB = E_defect / (k_soft \u00D7 0.533), where k_soft = 1 \u2212 0.533\u03B2 (phonon softening factor) and E_defect is the rate-limiting defect energy."}</div>
              <div>{"\u03B2 formulas are class-specific: metals \u03B2 = 0.3\u03B3 (Gr\u00FCneisen), ionic oxides \u03B2 = 6400Z*/\u0398\u00B2_D + 1.30, perovskites \u03B2 = 1.0 + 0.11\u03B1_F."}</div>
              <div>{"r is the defect nucleation coherence length: the spatial region within which phonon-softened barriers must persist for defect nucleation. r = \u221A(\u03B1_th \u00D7 \u03C4_nuc). Ranges from ~2 \u00B5m (WC) to ~50 \u00B5m (BaTiO\u2083)."}</div>
            </div>

            <div>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>Flash Threshold</div>
              <div>{"\u03BB = E \u00D7 r, where \u03BB (voltivity) is a fundamental material constant and r is the defect nucleation coherence length."}</div>
              <div>{"E_flash = \u03BB / r [V/cm]. Flash onset occurs when the applied field reaches the voltivity threshold."}</div>
              <div>{"Flash sintering occurs when E_max (or E_peak) exceeds E_flash. The Gap column shows E_best / E_flash; Gap > 1 means flash is expected."}</div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ color: "#1e293b", fontWeight: 600, marginBottom: 2 }}>Process Window Regions (NR)</div>
              <div>{"The process window plots E_max (or E_peak) vs. the normalized ramp NR = t_ramp / \u03C4_cool. NR compares the current ramp time to the sample's thermal relaxation time, dividing the chart into two physically distinct regimes:"}</div>

              <div style={{ marginTop: 6 }}>
                <div style={{ color: "#60a5fa", fontWeight: 600 }}>{"Adiabatic regime (NR < 1) — left side"}</div>
                <div style={{ paddingLeft: 10 }}>{"The current ramp is faster than the sample can dissipate heat. Nearly all Joule energy stays in the sample."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Temperature rises steeply — the sample reaches high T (and high \u03C1) before steady state, producing transient E-field overshoot (E_peak \u226B E_ss)."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Flash is easier to achieve because E climbs quickly past the E_flash threshold."}</div>
                <div style={{ paddingLeft: 10 }}>{"• LOC risk is highest: the sample may lose cohesion before the operator can react, because I and T are rising simultaneously."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Typical for: thin samples, short gauge lengths, fast ramp rates, low convection (vacuum/inert gas)."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Design implication: Flash onset occurs rapidly. Use I_max limiting to control overshoot. The process is less sensitive to cooling geometry."}</div>
              </div>

              <div style={{ marginTop: 6 }}>
                <div style={{ color: "#f59e0b", fontWeight: 600 }}>{"Cooling-limited regime (NR > 1) — right side"}</div>
                <div style={{ paddingLeft: 10 }}>{"The ramp is slow enough that cooling removes a significant fraction of Joule heat during the ramp."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Temperature rises more gradually — the sample approaches thermal quasi-equilibrium at each J step."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Higher current (J) is required to reach the same E_max because the temperature (and \u03C1) stay lower at each J."}</div>
                <div style={{ paddingLeft: 10 }}>{"• E_peak \u2248 E_ss (transient overshoot is small). The achievable field is limited by the steady-state balance \u03C1\u2098\u00B7J\u00B2 = q\u00B7\u0394T."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Flash may require larger power supplies to reach E_flash, because the current must overcome continuous heat loss."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Typical for: thick/wide samples, long gauge lengths, high convection (air jet, forced gas)."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Design implication: Geometry and cooling dominate. Increasing L (more fin cooling) or h pushes NR higher, demanding more current. Reduce cooling or increase ramp rate to enter the adiabatic window."}</div>
              </div>

              <div style={{ marginTop: 6 }}>
                <div style={{ color: "#a78bfa", fontWeight: 600 }}>{"Sweet spot: NR \u2248 1"}</div>
                <div style={{ paddingLeft: 10 }}>{"The boundary NR = 1 (dashed vertical line) is where the ramp time equals the cooling time constant. Near NR = 1:"}</div>
                <div style={{ paddingLeft: 10 }}>{"• Some overshoot occurs but the process is still controllable — this is often the practical operating point."}</div>
                <div style={{ paddingLeft: 10 }}>{"• The sample heats efficiently without extreme adiabatic runaway, and the power supply isn't fighting excessive cooling."}</div>
                <div style={{ paddingLeft: 10 }}>{"• Most of the experimental flash data points in the literature fall near NR = 0.1 to 10."}</div>
              </div>

              <div style={{ marginTop: 6 }}>
                <div style={{ color: "#94a3b8", fontWeight: 600 }}>{"What the dot position tells you"}</div>
                <div style={{ paddingLeft: 10 }}>{"If your design dot (green circle) is above the E_flash line → flash is expected for the selected metal."}</div>
                <div style={{ paddingLeft: 10 }}>{"Moving the dot left (lower NR): increase ramp rate, decrease cooling (h), or use a thinner/shorter sample."}</div>
                <div style={{ paddingLeft: 10 }}>{"Moving the dot up (higher E): increase ramp rate (transient overshoot), increase I_max, or use higher-resistivity material."}</div>
                <div style={{ paddingLeft: 10 }}>{"Moving the dot right (higher NR): decrease ramp rate, increase cooling, or use a thicker/wider/longer sample."}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        textAlign: "center", marginTop: "0.3rem", fontSize: "0.5rem",
        fontFamily: FONT_M, color: "#64748b"
      }}>
        v8 -- {ALL_METALS.length} metals (Voltivity DFT Handbook v12) | fin+clip model | t 5-1000um, w 0.25-25mm, L 2-200mm, jdot 50-50k, h 2-200
      </div>
    </div>
  );
}
