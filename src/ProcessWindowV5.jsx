import { useState, useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, Label, Cell, LineChart, Line, Legend
} from "recharts";

const DB = {
  Ti: {
    name: "Titanium", rho0: 4.2e-7, rhoM: 1.78e-6, Tm: 1941, Cp: 523,
    rho_m: 4510, k_th: 21.9, lam: 1168,
    ref_jdot: 500, ref_Jloc: 68, ref_t: 100, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#2563eb"
  },
  Ni: {
    name: "Nickel", rho0: 6.99e-8, rhoM: 3.5e-7, Tm: 1728, Cp: 444,
    rho_m: 8908, k_th: 90.9, lam: 1090,
    ref_jdot: 1000, ref_Jloc: 39, ref_t: 200, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#666"
  },
  Cu: {
    name: "Copper", rho0: 1.68e-8, rhoM: 1.0e-7, Tm: 1358, Cp: 385,
    rho_m: 8960, k_th: 401, lam: 818,
    ref_jdot: 244, ref_Jloc: 229, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#B87333"
  },
  Al: {
    name: "Aluminum", rho0: 2.65e-8, rhoM: 1.2e-7, Tm: 933, Cp: 897,
    rho_m: 2700, k_th: 237, lam: 970,
    ref_jdot: 244, ref_Jloc: 150, ref_t: 25, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#ef4444"
  },
  Fe: {
    name: "Iron", rho0: 9.71e-8, rhoM: 1.3e-6, Tm: 1811, Cp: 449,
    rho_m: 7874, k_th: 80.4, lam: 1192,
    ref_jdot: null, ref_Jloc: null, ref_t: 100, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#8B4513"
  },
  W: {
    name: "Tungsten", rho0: 5.28e-8, rhoM: 2.5e-7, Tm: 3695, Cp: 132,
    rho_m: 19300, k_th: 173, lam: 1026,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#555"
  },
  Pt: {
    name: "Platinum", rho0: 1.06e-7, rhoM: 3.8e-7, Tm: 2041, Cp: 133,
    rho_m: 21450, k_th: 71.6, lam: 493,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#8aa"
  },
  Re: {
    name: "Rhenium", rho0: 1.93e-7, rhoM: 9.0e-7, Tm: 3459, Cp: 137,
    rho_m: 21020, k_th: 47.9, lam: 1337,
    ref_jdot: null, ref_Jloc: null, ref_t: 50, ref_w: 6, ref_L: 20,
    Eflash: null, Efsrc: null, color: "#6b21a8"
  },
};

var CHART_METALS = ["Ti", "Cu", "Ni", "Al", "W", "Pt", "Fe"];
var TABLE_METALS = ["Ti", "Ni", "Pt", "Fe", "W", "Cu", "Al", "Re"];

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

function finCooling(mp, t_um, w_mm, d_um, L_mm, h, isWire) {
  var Lm = L_mm / 1000;
  var A, P;
  if (isWire) {
    var d = d_um * 1e-6;
    A = Math.PI / 4 * d * d;
    P = Math.PI * d;
  } else {
    A = (t_um * 1e-6) * (w_mm / 1000);
    P = 2 * ((t_um * 1e-6) + (w_mm / 1000));
  }
  if (A < 1e-15) A = 1e-15;
  var saV = P / A;
  var m = Math.sqrt(h * P / (mp.k_th * A));
  var mL2 = Math.min(m * Lm / 2, 20);
  var qConv = h * saV;
  var qClip = 2 * mp.k_th * m * Math.tanh(mL2) / Lm;
  var qTot = qConv + qClip;
  var tau = mp.rho_m * mp.Cp / qTot;
  return { qTot: qTot, qClip: qClip, tau: tau, saV: saV, A: A, P: P };
}

function estimateJloc(key, geo, t_um, w_mm, d_um, L_mm, jdot, h) {
  var mp = DB[key];
  var isW = (geo === "wire");
  var dT = mp.Tm - 300;
  var cool = finCooling(mp, t_um, w_mm, d_um, L_mm, h, isW);
  var Jss = Math.sqrt(cool.qTot * dT / mp.rhoM) / 1e6;

  if (mp.ref_Jloc != null && mp.ref_jdot != null) {
    var cRef = finCooling(mp, mp.ref_t, mp.ref_w, 0, mp.ref_L, h, false);
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


function transientEpeak(mp, t_um, w_mm, d_um, L_mm, Imax, jdot, isWire) {
  var A_m2;
  if (isWire) { var d = d_um * 1e-6; A_m2 = Math.PI / 4 * d * d; }
  else { A_m2 = (t_um * 1e-6) * (w_mm / 1000); }
  if (A_m2 < 1e-15) A_m2 = 1e-15;
  var A_mm2 = A_m2 * 1e6;
  var dIdt = jdot * A_mm2 / 60;
  if (dIdt < 0.01) dIdt = 0.01;
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
    T += rho * J * J / (mp.rho_m * mp.Cp) * dt;
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

var FONT_M = "monospace";
var FONT_S = "system-ui, sans-serif";

function Chip(props) {
  var st = {
    padding: "2px 7px", border: "none", borderRadius: 4, cursor: "pointer",
    fontSize: "0.7rem", fontWeight: 600, fontFamily: FONT_M,
    background: props.active ? props.color : "#222a3a",
    color: props.active ? "#fff" : "#667",
    outline: props.active ? ("2px solid " + props.color) : "none", outlineOffset: 1,
  };
  return <button onClick={props.onClick} style={st}>{props.children}</button>;
}

function InfoRow(props) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "1.5px 0", borderBottom: "1px solid rgba(255,255,255,0.02)"
    }}>
      <span style={{ fontSize: "0.63rem", color: props.dim ? "#556" : "#899" }}>{props.label}</span>
      <span style={{
        fontSize: "0.74rem", fontFamily: FONT_M, fontWeight: props.hl ? 700 : 500,
        color: props.warn ? "#f59e0b" : props.hl ? "#e94560" : props.dim ? "#667" : "#dde"
      }}>
        {props.val}
        {props.unit ? <span style={{ fontSize: "0.56rem", color: "#556" }}>{" "}{props.unit}</span> : null}
      </span>
    </div>
  );
}

function Sl(props) {
  var c = props.color || "#e94560";
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: "0.63rem", color: "#899" }}>{props.label}</span>
        <span style={{ fontSize: "0.74rem", fontFamily: FONT_M, fontWeight: 700, color: c }}>
          {props.fmt ? props.fmt(props.value) : props.value}
          {props.unit ? <span style={{ fontSize: "0.54rem", color: "#556" }}>{" "}{props.unit}</span> : null}
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
  var c = d.flash ? "#22c55e" : "#ef4444";
  return (
    <div style={{
      background: "#111827", color: "#e2e8f0", padding: "6px 10px",
      borderRadius: 6, fontSize: "0.7rem", lineHeight: 1.5,
      border: "1px solid " + c, maxWidth: 210,
      fontFamily: FONT_S, boxShadow: "0 4px 16px rgba(0,0,0,0.5)"
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

export default function ProcessWindowV5() {
  var _s = useState("Ti"); var metal = _s[0]; var setMetal = _s[1];
  var _g = useState("foil"); var geo = _g[0]; var setGeo = _g[1];
  var _t = useState(100); var thick = _t[0]; var setThick = _t[1];
  var _w = useState(6); var width = _w[0]; var setWidth = _w[1];
  var _d = useState(250); var diam = _d[0]; var setDiam = _d[1];
  var _l = useState(20); var gauge = _l[0]; var setGauge = _l[1];
  var _j = useState(500); var jdot = _j[0]; var setJdot = _j[1];
  var _h = useState(8); var hConv = _h[0]; var setHConv = _h[1];
  var _v = useState(10); var vOff = _v[0]; var setVOff = _v[1];
  var _im = useState(100); var Imax = _im[0]; var setImax = _im[1];
  var _he = useState(false); var hideExp = _he[0]; var setHideExp = _he[1];

  var mp = DB[metal];
  var dum = geo === "wire" ? diam : 0;

  var uc = useMemo(function () {
    var est = estimateJloc(metal, geo, thick, width, dum, gauge, jdot, hConv);
    var Jloc = est.Jloc;
    var Emax = mp.rhoM * Jloc * 1e6 / 100;
    var tr = Jloc / Math.max(jdot / 60, 0.001);
    var NR = tr / Math.max(est.cool.tau, 0.001);
    var Amm2 = geo === "wire" ? (Math.PI / 4 * Math.pow(diam / 1000, 2)) : ((thick / 1000) * width);
    var Am2 = Amm2 * 1e-6;
    var Lm = gauge / 1000;
    var I = Jloc * Amm2;
    var V10 = mp.rho0 * (Jloc * 0.1 * 1e6) * Lm;
    var s10 = V10 > 0 ? (vOff / 1000) / V10 : 99;
    var R0 = Am2 > 0 ? mp.rho0 * Lm / Am2 : 0;
    var clipPct = est.cool.qTot > 0 ? est.cool.qClip / est.cool.qTot * 100 : 0;
    var Ef = flashThreshold(mp.lam, gauge);
    var Jflash = Ef > 0 && mp.rhoM > 0 ? (Ef * 100 / mp.rhoM) / 1e6 : 0;
    var trans = transientEpeak(mp, thick, width, dum, gauge, Imax, jdot, geo === "wire");
    return {
      Jloc: Jloc, Emax: Emax, Ef: Ef, Jflash: Jflash, tr: tr, NR: NR, tau: est.cool.tau,
      Epeak: trans.Epeak, tMelt: trans.tMelt, Imelt: trans.Imelt, Jmelt: trans.Jmelt, dIdt: trans.dIdt,
      I: I, s10: s10, R0: R0, Jss: est.Jss, clipPct: clipPct
    };
  }, [metal, geo, thick, width, diam, gauge, jdot, hConv, vOff, mp, dum, Imax]);

  var curves = useMemo(function () {
    var c = {};
    CHART_METALS.forEach(function (m) {
      var est = estimateJloc(m, geo, thick, width, dum, gauge, jdot, hConv);
      var pts = buildEJ(m, est.Jloc, 100);
      var tr = transientEpeak(DB[m], thick, width, dum, gauge, Imax, jdot, geo === "wire");
      var mEf = flashThreshold(DB[m].lam, gauge);
      var mJflash = mEf > 0 && DB[m].rhoM > 0 ? (mEf * 100 / DB[m].rhoM) / 1e6 : 0;
      c[m] = { pts: pts, Jloc: est.Jloc, Emax: DB[m].rhoM * est.Jloc * 1e6 / 100, Epeak: tr.Epeak, Jmelt: tr.Jmelt, Ef: mEf, Jflash: mJflash };
    });
    return c;
  }, [geo, thick, width, diam, gauge, jdot, hConv, dum, Imax]);

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
      var cl = finCooling(emp, e.t, e.w, 0, e.L, hConv, false);
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
  }, [metal, jdot, hConv, uc, mp, Imax]);

  var fa = useMemo(function () {
    var E = Math.max(uc.Emax, uc.Epeak);
    var Ef = uc.Ef;
    if (Ef > 0) {
      if (E > Ef * 1.2) return {
        tag: "E > threshold", c: "#22c55e",
        msg: E.toFixed(3) + " > " + Ef.toFixed(2) + " V/cm. Flash expected."
      };
      if (E > Ef * 0.8) return {
        tag: "E near threshold", c: "#f59e0b",
        msg: E.toFixed(3) + " ~ " + Ef.toFixed(2) + " V/cm. Borderline."
      };
      return {
        tag: "E < threshold", c: "#ef4444",
        msg: E.toFixed(3) + " < " + Ef.toFixed(2) + ". Need " + (Ef / Math.max(E, 0.001)).toFixed(1) + "x more."
      };
    }
    if (E > 0.5) return {
      tag: "High E -- plausible", c: "#22c55e",
      msg: E.toFixed(3) + " V/cm. No known threshold for " + mp.name + "."
    };
    if (E > 0.1) return { tag: "Moderate E", c: "#f59e0b", msg: E.toFixed(3) + " V/cm." };
    return { tag: "Low E", c: "#ef4444", msg: E.toFixed(3) + " V/cm." };
  }, [uc, mp]);

  var geoStr = geo === "foil"
    ? thick + "um x " + width + "mm foil, L=" + gauge + "mm"
    : "d" + diam + "um wire, L=" + gauge + "mm";

  return (
    <div style={{
      fontFamily: FONT_S, maxWidth: 1100, margin: "0 auto", padding: "0.7rem",
      background: "#0f1117", minHeight: "100vh", color: "#e2e8f0"
    }}>
      <div style={{
        textAlign: "center", marginBottom: "0.5rem", paddingBottom: "0.3rem",
        borderBottom: "1px solid #1e293b"
      }}>
        <div style={{
          fontSize: "0.56rem", fontFamily: FONT_M, color: "#94a3b8",
          letterSpacing: "0.05em", marginBottom: 4, padding: "3px 0",
          borderBottom: "1px solid #1e293b22"
        }}>
          © 2026. Written by Ric Fulop, MIT Center for Bits and Atoms
        </div>
        <h1 style={{
          fontSize: "1.2rem", fontWeight: 800,
          background: "linear-gradient(135deg,#e2e8f0,#94a3b8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0
        }}>
          Metal Flash Process Window v6
        </h1>
        <p style={{ fontFamily: FONT_M, fontSize: "0.58rem", color: "#64748b", margin: "1px 0 0" }}>
          fin+clip thermal model | dynamic E(J) | 8 metals | extended ranges
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: "0.5rem" }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ background: "#1e293b", borderRadius: 6, padding: "6px 8px" }}>
            <label style={{
              display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
              fontSize: "0.52rem", color: "#94a3b8", marginBottom: 4
            }}>
              <input type="checkbox" checked={hideExp}
                onChange={function () { setHideExp(!hideExp); }}
                style={{ accentColor: "#e94560", width: 12, height: 12 }} />
              Hide experimental calibration dataset
            </label>
            <div style={{
              fontSize: "0.54rem", color: "#94a3b8", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 2
            }}>Metal</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {Object.keys(DB).map(function (k) {
                return <Chip key={k} active={metal === k} color={DB[k].color}
                  onClick={function () { setMetal(k); }}>{k}</Chip>;
              })}
            </div>
            <div style={{ fontSize: "0.54rem", color: "#64748b", marginTop: 2, fontFamily: FONT_M }}>
              {"resistivity: " + (mp.rho0 * 1e8).toFixed(1) + " (RT) to " + (mp.rhoM * 1e8).toFixed(0) + " (melt) uOhm-cm | thermal cond: " + mp.k_th.toFixed(0) + " W/mK"}
            </div>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 6, padding: "6px 8px" }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
              <Chip active={geo === "foil"} color="#e94560"
                onClick={function () { setGeo("foil"); }}>Foil</Chip>
              <Chip active={geo === "wire"} color="#e94560"
                onClick={function () { setGeo("wire"); }}>Wire</Chip>
            </div>
            {geo === "foil" ? (
              <div>
                <Sl label="Thickness" value={thick} set={setThick}
                  min={5} max={1000} step={5} unit="um" />
                <Sl label="Width" value={width} set={setWidth}
                  min={0.25} max={25} step={0.25} unit="mm"
                  fmt={function (v) { return v.toFixed(2); }} />
              </div>
            ) : (
              <Sl label="Diameter" value={diam} set={setDiam}
                min={10} max={5000} step={10} unit="um" />
            )}
            <Sl label="Gauge length L" value={gauge} set={setGauge}
              min={2} max={200} step={1} unit="mm" color="#f59e0b" />
          </div>
          <div style={{ background: "#1e293b", borderRadius: 6, padding: "6px 8px" }}>
            <Sl label="Ramp rate" value={jdot} set={setJdot}
              min={50} max={50000} step={50} unit="A/mm2/min" color="#3b82f6" />
            <Sl label="h (convection)" value={hConv} set={setHConv}
              min={2} max={200} step={1} unit="W/m2K" color="#64748b" />
            <Sl label="I_max (supply)" value={Imax} set={setImax}
              min={10} max={500} step={5} unit="A" color="#ef4444" />
            <Sl label="V offset" value={vOff} set={setVOff}
              min={0} max={50} step={0.5} unit="mV" color="#64748b"
              fmt={function (v) { return v.toFixed(1); }} />
          </div>
          <div style={{ background: "#1e293b", borderRadius: 6, padding: "6px 8px" }}>
            <div style={{
              fontSize: "0.52rem", color: "#94a3b8", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 2
            }}>
              {"Results -- " + mp.name}
            </div>
            <InfoRow label="E_max (at Tm)" val={uc.Emax.toFixed(3)} unit="V/cm" hl />
            <InfoRow label="J_LOC (thermal)" val={uc.Jloc.toFixed(0)} unit="A/mm2" />
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
            <InfoRow label="Voff/V @10%J" val={(uc.s10 * 100).toFixed(1)} unit="%"
              warn={uc.s10 > 0.15} />
            <InfoRow label="R0" val={(uc.R0 * 1000).toFixed(2)} unit="mOhm" dim />
          </div>
          <div style={{
            background: fa.c + "15", border: "1px solid " + fa.c + "40",
            borderRadius: 5, padding: "4px 7px"
          }}>
            <div style={{ fontSize: "0.66rem", fontWeight: 700, color: fa.c }}>{fa.tag}</div>
            <div style={{ fontSize: "0.54rem", color: "#94a3b8", marginTop: 1 }}>{fa.msg}</div>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 6, padding: "6px 8px" }}>
            <div style={{
              fontSize: "0.52rem", color: "#94a3b8", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 3
            }}>Known Flash Thresholds</div>
            <div style={{ fontSize: "0.56rem", fontFamily: FONT_M, lineHeight: 1.6 }}>
              {TABLE_METALS.map(function (k) {
                var m = DB[k];
                var ef = flashThreshold(m.lam, gauge);
                return (
                  <div key={k}>
                    <span style={{ color: m.color, fontWeight: 700 }}>{k}</span>
                    {": "}<b>{ef.toFixed(2)}</b>{" V/cm "}
                    <span style={{ color: "#94a3b8", fontSize: "0.46rem" }}>{"(voltivity \u03BB=" + m.lam + ")"}</span>
                  </div>
                );
              })}
              <div style={{ color: "#94a3b8", fontSize: "0.48rem", marginTop: 2 }}>
                {"E_flash = \u03BB / r. \u03BB (voltivity) is a material property. r = \u03BB / E_flash. Calibrated from Ti at L=20mm."}
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {/* Process map */}
          <div style={{
            background: "#111827", borderRadius: 8, padding: "5px 4px 2px",
            border: "1px solid #1e293b"
          }}>
            <div style={{
              fontSize: "0.58rem", fontFamily: FONT_M, color: "#94a3b8",
              textAlign: "center"
            }}>
              PROCESS WINDOW -- Emax vs (NR)
            </div>
            <ResponsiveContainer width="100%" height={215}>
              <ScatterChart margin={{ top: 5, right: 16, bottom: 18, left: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <ReferenceArea x1={0.003} x2={1} fill="#3b82f6" fillOpacity={0.06} />
                <ReferenceArea x1={1} x2={300} fill="#f59e0b" fillOpacity={0.04} />
                <ReferenceLine x={1} stroke="#475569" strokeDasharray="6 3" strokeWidth={1}
                  label={{ value: "NR=1", position: "top", style: { fontSize: 7, fill: "#64748b", fontFamily: "'IBM Plex Mono', monospace" } }} />
                <XAxis dataKey="NR" type="number" scale="log" domain={[0.003, 300]}
                  ticks={[0.01, 0.1, 1, 10, 100]}
                  tickFormatter={function (v) { return String(v); }}
                  tick={{ fontSize: 8, fill: "#64748b" }} stroke="#334155">
                  <Label value="(NR) = t_ramp / tau_cool" position="insideBottom" offset={-7}
                    style={{ fontSize: 8, fill: "#94a3b8" }} />
                </XAxis>
                <YAxis dataKey="Emax" type="number" scale="log" domain={[0.02, 10]}
                  ticks={[0.05, 0.1, 0.5, 1, 2, 5]}
                  tick={{ fontSize: 8, fill: "#64748b" }} stroke="#334155">
                  <Label value="E_max (V/cm)" angle={-90} position="insideLeft" offset={4}
                    style={{ fontSize: 8, fill: "#94a3b8" }} />
                </YAxis>
                <Tooltip content={MapTip} />
                {uc.Ef > 0 && uc.Ef < 8 ? (
                  <ReferenceLine y={uc.Ef} stroke={mp.color} strokeDasharray="6 4" strokeWidth={1.5}
                    label={{ value: metal + " onset " + uc.Ef.toFixed(2), position: "right", style: { fontSize: 8, fill: mp.color } }} />
                ) : null}
                {uc.Emax > 0 && uc.Emax < 8 ? (
                  <ReferenceLine y={uc.Emax} stroke={mp.color} strokeDasharray="3 3" strokeWidth={1}
                    label={{ value: metal + " LOC " + uc.Emax.toFixed(2), position: "insideTopRight", style: { fontSize: 7, fill: mp.color } }} />
                ) : null}
                {metal !== "Ti" && flashThreshold(DB.Ti.lam, gauge) < 8 ? (
                  <ReferenceLine y={flashThreshold(DB.Ti.lam, gauge)} stroke="#2563eb40" strokeDasharray="4 4" strokeWidth={0.7}
                    label={{ value: "Ti " + flashThreshold(DB.Ti.lam, gauge).toFixed(2), position: "insideTopRight", style: { fontSize: 6, fill: "#2563eb60" } }} />
                ) : null}
                {!hideExp ? (
                  <Scatter data={scatter.filter(function (d) { return !d.isUser; })}>
                    {scatter.filter(function (d) { return !d.isUser; }).map(function (d, i) {
                      return <Cell key={i}
                        fill={d.flash ? "#22c55e" : "#1e293b"}
                        stroke={DB[d.m] ? DB[d.m].color : "#999"}
                        strokeWidth={2} r={d.flash ? 6 : 4} />;
                    })}
                  </Scatter>
                ) : null}
                <Scatter data={scatter.filter(function (d) { return d.isUser; })}>
                  {scatter.filter(function (d) { return d.isUser; }).map(function (d, i) {
                    return <Cell key={i} fill={fa.c} stroke="#fff" strokeWidth={2.5} r={8} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div style={{
              display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap",
              fontSize: "0.55rem", fontFamily: FONT_M, color: "#64748b"
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
                  border: "2px solid white", display: "inline-block"
                }} />{" you"}
              </span>
            </div>
          </div>
          {/* E(J) chart */}
          <div style={{
            background: "#111827", borderRadius: 8, padding: "5px 4px 2px",
            border: "1px solid #1e293b"
          }}>
            <div style={{
              fontSize: "0.58rem", fontFamily: FONT_M, color: "#94a3b8",
              textAlign: "center"
            }}>
              {"E(J) AT " + geoStr.toUpperCase() + ", jdot=" + jdot}
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ejData} margin={{ top: 4, right: 12, bottom: 32, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="J" type="number" domain={[0, Math.ceil(maxJ / 10) * 10]}
                  tick={{ fontSize: 8, fill: "#64748b" }} stroke="#334155">
                  <Label value="J (A/mm²)" position="insideBottom" offset={-18}
                    style={{ fontSize: 8, fill: "#94a3b8" }} />
                </XAxis>
                <YAxis type="number" domain={[0, Math.ceil(maxE * 10) / 10]}
                  tick={{ fontSize: 8, fill: "#64748b" }} stroke="#334155">
                  <Label value="E (V/cm)" angle={-90} position="insideLeft" offset={5}
                    style={{ fontSize: 8, fill: "#94a3b8" }} />
                </YAxis>
                {CHART_METALS.map(function (m) {
                  return <Line key={m} dataKey={"E_" + m} stroke={DB[m].color}
                    strokeWidth={m === metal ? 3 : 1.5} dot={false} name={m} connectNulls
                    strokeDasharray={m === metal ? undefined : "4 2"}
                    strokeOpacity={m === metal ? 1 : 0.7} />;
                })}
                {uc.Ef > 0 && uc.Ef < 8 ? (
                  <ReferenceLine y={uc.Ef} stroke={mp.color} strokeDasharray="6 3" strokeWidth={1.5}
                    label={{ value: metal + " onset " + uc.Ef.toFixed(2), position: "right", style: { fontSize: 8, fill: mp.color } }} />
                ) : null}
                {uc.Jloc > 0 && uc.Jloc < Math.ceil(maxJ / 10) * 10 ? (
                  <ReferenceLine x={Math.round(uc.Jloc * 10) / 10} stroke={mp.color} strokeDasharray="4 3" strokeWidth={1.5}
                    label={{ value: metal + " LOC " + uc.Jloc.toFixed(0), position: "insideTopRight", style: { fontSize: 8, fill: mp.color } }} />
                ) : null}
                {metal !== "Ti" && flashThreshold(DB.Ti.lam, gauge) < 8 ? (
                  <ReferenceLine y={flashThreshold(DB.Ti.lam, gauge)} stroke="#2563eb40" strokeDasharray="4 4" strokeWidth={0.7} />
                ) : null}
                <Legend wrapperStyle={{ fontSize: 9, paddingTop: 0 }} verticalAlign="top" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{
              display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap",
              fontSize: "0.52rem", fontFamily: FONT_M, color: "#64748b"
            }}>
              {CHART_METALS.map(function (m) {
                var c = curves[m];
                if (!c) return null;
                return (
                  <span key={m} style={{ color: DB[m].color }}>
                    {m + ": E_ss=" + c.Emax.toFixed(2) + " E_pk=" + c.Epeak.toFixed(2)}
                  </span>
                );
              })}
            </div>
          </div>
          {/* Table */}
          <div style={{
            background: "#111827", borderRadius: 8, padding: "5px 8px",
            border: "1px solid #1e293b"
          }}>
            <div style={{
              fontSize: "0.52rem", fontFamily: FONT_M, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2
            }}>
              {"All metals at " + geoStr}
            </div>
            <table style={{
              width: "100%", fontSize: "0.62rem", fontFamily: FONT_M, color: "#c8d0da",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: "0.54rem" }}>
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
                </tr>
              </thead>
              <tbody>
                {TABLE_METALS.map(function (k) {
                  var m = DB[k];
                  var est = estimateJloc(k, geo, thick, width, dum, gauge, jdot, hConv);
                  var E = m.rhoM * est.Jloc * 1e6 / 100;
                  var clip = est.cool.qTot > 0 ? est.cool.qClip / est.cool.qTot * 100 : 0;
                  var tr_res = transientEpeak(m, thick, width, dum, gauge, Imax, jdot, geo === "wire");
                  var tr_E = tr_res.Epeak;
                  var ef = flashThreshold(m.lam, gauge);
                  var Jfl = ef > 0 && m.rhoM > 0 ? (ef * 100 / m.rhoM) / 1e6 : 0;
                  var rEst = E > 0 ? m.lam / E : 0;
                  var Ebest = Math.max(E, tr_E);
                  var gap = ef != null ? (Ebest / ef) : null;
                  var ok = ef != null ? gap > 0.8 : Ebest > 0.5;
                  return (
                    <tr key={k} style={{
                      borderBottom: "1px solid rgba(30,41,59,0.12)",
                      background: k === metal ? "rgba(30,41,59,0.25)" : "transparent"
                    }}>
                      <td style={{ padding: "1px 2px", color: m.color, fontWeight: 700 }}>{k}</td>
                      <td style={{ textAlign: "right", color: "#94a3b8" }}>{m.lam}</td>
                      <td style={{ textAlign: "right", color: "#667" }}>{rEst.toFixed(0)}</td>
                      <td style={{ textAlign: "right" }}>{(m.rhoM * 1e8).toFixed(0)}</td>
                      <td style={{ textAlign: "right", color: "#667" }}>{m.k_th.toFixed(0)}</td>
                      <td style={{ textAlign: "right", color: "#8be9fd" }}>{Jfl.toFixed(0)}</td>
                      <td style={{ textAlign: "right" }}>{est.Jloc.toFixed(0)}</td>
                      <td style={{
                        textAlign: "right", fontWeight: 700,
                        color: ok ? "#22c55e" : E > 0.1 ? "#f59e0b" : "#ef4444"
                      }}>{E.toFixed(3)}</td>
                      <td style={{ textAlign: "right", color: "#556" }}>{clip.toFixed(0)}</td>
                      <td style={{ textAlign: "right", color: "#c084fc", fontWeight: 600 }}>{tr_E.toFixed(2)}</td>
                      <td style={{ textAlign: "right", color: ef != null ? "#f59e0b" : "#334155" }}>
                        {ef != null ? ef.toFixed(1) : "?"}</td>
                      <td style={{
                        textAlign: "right", fontSize: "0.54rem",
                        color: gap != null ? (gap > 1 ? "#22c55e" : gap > 0.5 ? "#f59e0b" : "#ef4444") : "#334155"
                      }}>
                        {gap != null ? (gap.toFixed(1) + "x") : "--"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Formulas & Definitions */}
      <div style={{
        background: "#111827", borderRadius: 8, padding: "10px 14px", marginTop: "0.5rem",
        border: "1px solid #1e293b", fontSize: "0.56rem", fontFamily: FONT_M,
        color: "#94a3b8", lineHeight: 1.7
      }}>
        <div style={{
          fontSize: "0.58rem", color: "#e2e8f0", fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6
        }}>Formulas & Variable Definitions</div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>Variable Definitions</div>
          <div><b style={{ color: "#8be9fd" }}>{"\u03C1\u2080"}</b>{" (rho0) — Electrical resistivity at room temperature [\u03A9\u00B7m]"}</div>
          <div><b style={{ color: "#8be9fd" }}>{"\u03C1\u2098"}</b>{" (rhoM) — Electrical resistivity at melting point [\u03A9\u00B7m]"}</div>
          <div><b style={{ color: "#8be9fd" }}>T<sub>m</sub></b>{" — Melting temperature of the metal [K]"}</div>
          <div><b style={{ color: "#8be9fd" }}>C<sub>p</sub></b>{" — Specific heat capacity [J/(kg\u00B7K)]"}</div>
          <div><b style={{ color: "#8be9fd" }}>{"\u03C1_m"}</b>{" — Mass density [kg/m\u00B3]"}</div>
          <div><b style={{ color: "#8be9fd" }}>k<sub>th</sub></b>{" — Thermal conductivity [W/(m\u00B7K)]"}</div>
          <div><b style={{ color: "#8be9fd" }}>{"\u03BB"}</b>{" (voltivity) — Flash threshold parameter, material-specific [V/cm \u00D7 \u00B5m]. \u03BB = E \u00D7 r"}</div>
          <div><b style={{ color: "#8be9fd" }}>r</b>{" — Defect nucleation coherence length [\u00B5m]. r = \u03BB / E. The spatial region within which phonon-softened barriers enable defect nucleation. r = \u221A(\u03B1_th \u00D7 \u03C4_nuc). Varies per metal."}</div>
          <div><b style={{ color: "#8be9fd" }}>J</b>{" — Current density [A/mm\u00B2]"}</div>
          <div><b style={{ color: "#8be9fd" }}>E</b>{" — Electric field [V/cm]. E = \u03C1 \u00D7 J"}</div>
          <div><b style={{ color: "#8be9fd" }}>J_LOC</b>{" — Loss of Cohesion current density: the J at which the compact loses structural integrity [A/mm\u00B2]. Distinct from T\u2098."}</div>
          <div><b style={{ color: "#8be9fd" }}>J_flash</b>{" — Current density at which E = E_flash (flash onset). J_flash = E_flash / \u03C1\u2098 [A/mm\u00B2]"}</div>
          <div><b style={{ color: "#8be9fd" }}>E_max</b>{" — Peak electric field at LOC: E_max = \u03C1\u2098 \u00D7 J_LOC [V/cm]"}</div>
          <div><b style={{ color: "#8be9fd" }}>E_flash</b>{" — Flash onset threshold: E_flash = \u03BB / r [V/cm]"}</div>
          <div><b style={{ color: "#8be9fd" }}>(N<sub>R</sub>)</b>{" — Normalized ramp: (N_R) = t_ramp / \u03C4_cool. <1 means fast ramp (adiabatic), >1 means cooling-limited"}</div>
          <div><b style={{ color: "#8be9fd" }}>{"\u03C4_cool"}</b>{" — Cooling time constant: \u03C4 = \u03C1_m \u00D7 C_p / q_total [s]"}</div>
          <div><b style={{ color: "#8be9fd" }}>J_ss</b>{" — Steady-state LOC current density (no ramp-rate overshoot) [A/mm\u00B2]"}</div>
          <div><b style={{ color: "#8be9fd" }}>Clip %</b>{" — Fraction of heat loss via axial conduction to clips vs. total (convection + clip) [%]"}</div>
          <div><b style={{ color: "#8be9fd" }}>E_pk</b>{" — Transient peak E-field during current ramp (may exceed steady-state E_max) [V/cm]"}</div>
          <div><b style={{ color: "#8be9fd" }}>Gap</b>{" — Ratio of max achievable E (max of E_max, E_pk) to E_flash. Gap > 1 means flash is expected."}</div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>Thermal Model — Fin + Clip Cooling</div>
          <div>{"The sample is modelled as a thin conductor (foil or wire) with two heat-loss paths:"}</div>
          <div style={{ paddingLeft: 10 }}>{"1. Convective cooling: q_conv = h \u00D7 (P/A), where P = perimeter, A = cross-section area, h = convection coefficient."}</div>
          <div style={{ paddingLeft: 10 }}>{"2. Axial clip conduction (fin model): q_clip = 2 \u00D7 k_th \u00D7 m \u00D7 tanh(mL/2) / L, where m = \u221A(h\u00D7P / (k_th\u00D7A))."}</div>
          <div>{"Total cooling: q_total = q_conv + q_clip. Cooling time constant: \u03C4 = \u03C1_m \u00D7 C_p / q_total."}</div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>Steady-State LOC (J_ss)</div>
          <div>{"At steady state, Joule heating balances cooling: \u03C1\u2098 \u00D7 J\u00B2 = q_total \u00D7 \u0394T, where \u0394T = T_m - 300K."}</div>
          <div>{"Solving: J_ss = \u221A(q_total \u00D7 \u0394T / \u03C1\u2098). This is the minimum current density to reach T_m."}</div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>Dynamic J_LOC Estimation</div>
          <div>{"For metals with experimental calibration data (Ti, Ni, Cu, Al), J_LOC is estimated by scaling the reference measurement:"}</div>
          <div style={{ paddingLeft: 10 }}>{"J_LOC = J_ss_ref \u00D7 (J_LOC_ref / J_ss_ref) \u00D7 (J_ss / J_ss_ref) \u00D7 (jdot / jdot_ref)^0.1"}</div>
          <div>{"The geometric scaling (J_ss / J_ss_ref) accounts for different sample dimensions. The ramp-rate exponent (0.1) captures the weak overshoot effect."}</div>
          <div>{"For metals without calibration data, a default overshoot factor of 2.8\u00D7 is used: J_LOC = J_ss \u00D7 2.8."}</div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>E(J) Curve Construction</div>
          <div>{"The E-J relationship is built by interpolating resistivity from \u03C1\u2080 to \u03C1\u2098 as a function of J/J_LOC:"}</div>
          <div style={{ paddingLeft: 10 }}>{"\u03C1(J) = \u03C1\u2080 + (\u03C1\u2098 - \u03C1\u2080) \u00D7 (J / J_LOC)^1.5"}</div>
          <div style={{ paddingLeft: 10 }}>{"E(J) = \u03C1(J) \u00D7 J"}</div>
          <div>{"The 1.5 exponent models the non-linear resistivity increase as the sample approaches melting."}</div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>Transient Solver (E_peak)</div>
          <div>{"A time-stepping simulation ramps current at dI/dt = jdot \u00D7 A / 60 (A/s), capped at I_max:"}</div>
          <div style={{ paddingLeft: 10 }}>{"At each dt=2ms step: T += \u03C1(T) \u00D7 J\u00B2 / (\u03C1_m \u00D7 C_p) \u00D7 dt (adiabatic heating)"}</div>
          <div style={{ paddingLeft: 10 }}>{"\u03C1(T) = \u03C1\u2080 + (\u03C1\u2098 - \u03C1\u2080) \u00D7 (T - 300) / (T_m - 300)"}</div>
          <div style={{ paddingLeft: 10 }}>{"Track max E = \u03C1(T) \u00D7 J. Stop when T \u2265 T_m."}</div>
          <div>{"This captures the transient overshoot where E_peak can exceed the steady-state E_max because resistivity is still rising while current ramps."}</div>
        </div>

        <div>
          <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>Flash Threshold</div>
          <div>{"\u03BB = E \u00D7 r, where \u03BB (voltivity) is a material-specific property and r is the estimated neck radius."}</div>
          <div>{"r = \u03BB / E_max (\u00B5m). Each metal has a different r because \u03BB and E_max vary per material."}</div>
          <div>{"Flash sintering occurs when E_max (or E_peak) exceeds E_flash. The Gap column in the table shows E_best / E_flash."}</div>
        </div>
      </div>
      <div style={{
        textAlign: "center", marginTop: "0.3rem", fontSize: "0.5rem",
        fontFamily: FONT_M, color: "#475569"
      }}>
        v6 -- 8 metals | fin+clip model | t 5-1000um, w 0.25-25mm, L 2-200mm, jdot 50-50k, h 2-200
      </div>
    </div>
  );
}
