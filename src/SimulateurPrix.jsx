import { useState } from "react";

/* ── Google Fonts ──────────────────────────────────────────────────────────── */
if (!document.getElementById("gf-beterbat")) {
  const l = document.createElement("link");
  l.id = "gf-beterbat";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

/* ── Données initiales ─────────────────────────────────────────────────────── */
const BATS_INIT = {
  A: {
    label: "Bâtiment A",
    accent: "#2563EB",
    floors: [
      { id: "A-R-1", etage: "R-1", nb: 4, prix: 148000 },
      { id: "A-RDC", etage: "RDC", nb: 5, prix: 175000 },
      { id: "A-R+1", etage: "R+1", nb: 4, prix: 188000 },
      { id: "A-R+2", etage: "R+2", nb: 3, prix: 210000 },
    ],
  },
  B: {
    label: "Bâtiment B",
    accent: "#0891B2",
    floors: [
      { id: "B-R-1", etage: "R-1", nb: 3, prix: 145000 },
      { id: "B-RDC", etage: "RDC", nb: 6, prix: 172000 },
      { id: "B-R+1", etage: "R+1", nb: 5, prix: 185000 },
      { id: "B-R+2", etage: "R+2", nb: 4, prix: 198000 },
      { id: "B-R+3", etage: "R+3", nb: 3, prix: 215000 },
    ],
  },
  C: {
    label: "Bâtiment C",
    accent: "#7C3AED",
    floors: [
      { id: "C-RDC", etage: "RDC", nb: 5, prix: 168000 },
      { id: "C-R+1", etage: "R+1", nb: 5, prix: 182000 },
      { id: "C-R+2", etage: "R+2", nb: 4, prix: 205000 },
    ],
  },
};

function freshState(key) {
  return {
    floors: BATS_INIT[key].floors.map((f) => ({ ...f })),
    locked: {},
  };
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const sumBat = (floors) => floors.reduce((s, f) => s + f.nb * f.prix, 0);

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  fTitle:   "'Cormorant Garamond', Georgia, serif",
  fBody:    "'DM Sans', system-ui, sans-serif",
  title:    "#1E3A5F",
  body:     "#334155",
  border:   "#BFDBFE",
  white:    "#FFFFFF",
  shadow:   "0 2px 14px rgba(37,99,235,0.09)",
  green:    "#15803D",
  orange:   "#D97706",
  bgGreen:  "#DCFCE7",
  bgOrange: "#FEF3C7",
  bdGreen:  "#86EFAC",
  bdOrange: "#FCD34D",
  muted:    "#64748b",
  rowAlt:   "#F8FAFC",
  hover:    "#EFF6FF",
};

/* ── Sous-composant KPI ────────────────────────────────────────────────────── */
function KPI({ label, value, color, badge, badgeOk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontFamily: T.fBody, fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: T.fTitle, fontSize: 23, fontWeight: 700, color, lineHeight: 1.1 }}>
        {value}
      </span>
      {badge && (
        <span style={{
          alignSelf: "flex-start", fontSize: 11, fontWeight: 600,
          padding: "2px 9px", borderRadius: 5,
          background: badgeOk ? T.bgGreen  : T.bgOrange,
          color:      badgeOk ? T.green    : T.orange,
          border:    `1px solid ${badgeOk  ? T.bdGreen : T.bdOrange}`,
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

/* ── Composant principal ───────────────────────────────────────────────────── */
export default function SimulateurPrix() {
  const [bats,    setBats]    = useState({ A: freshState("A"), B: freshState("B"), C: freshState("C") });
  const [active,  setActive]  = useState("A");
  const [mode,    setMode]    = useState("auto");   // "auto" | "manual"
  const [editId,  setEditId]  = useState(null);
  const [editVal, setEditVal] = useState("");
  const [panel,   setPanel]   = useState(null);     // { changedId, newPrix, diff, vals }
  const [toast,   setToast]   = useState(null);

  const info  = BATS_INIT[active];
  const state = bats[active];
  const fixed = sumBat(BATS_INIT[active].floors);
  const curr  = sumBat(state.floors);
  const delta = curr - fixed;
  const ok    = Math.abs(delta) < 5;

  /* ── Toast ── */
  function showToast(msg, success = true) {
    setToast({ msg, success });
    setTimeout(() => setToast(null), 3000);
  }

  /* ── Réinitialiser ── */
  function reset() {
    setBats((p) => ({ ...p, [active]: freshState(active) }));
    setEditId(null);
    setPanel(null);
    showToast("Données réinitialisées.");
  }

  /* ── Verrou ── */
  function canLock(floorId) {
    return state.floors.filter((f) => f.id !== floorId && !state.locked[f.id]).length >= 1;
  }

  function toggleLock(floorId) {
    const isLocked = !!state.locked[floorId];
    if (!isLocked && !canLock(floorId)) {
      showToast("Au moins un étage doit rester libre.", false);
      return;
    }
    setBats((p) => {
      const locked = { ...p[active].locked };
      if (isLocked) delete locked[floorId];
      else locked[floorId] = true;
      return { ...p, [active]: { ...p[active], locked } };
    });
  }

  /* ── Édition prix ── */
  function startEdit(f) { setEditId(f.id); setEditVal(String(f.prix)); setPanel(null); }
  function cancelEdit() { setEditId(null); setEditVal(""); }

  function commitEdit(floorId) {
    const newPrix = parseInt(editVal.replace(/\s/g, ""), 10);
    if (isNaN(newPrix) || newPrix <= 0) { showToast("Prix invalide.", false); cancelEdit(); return; }
    const orig = state.floors.find((f) => f.id === floorId);
    if (newPrix === orig.prix) { cancelEdit(); return; }
    const free = state.floors.filter((f) => f.id !== floorId && !state.locked[f.id]);
    if (free.length === 0) { showToast("Aucun étage libre pour redistribuer.", false); cancelEdit(); return; }
    const diff = (newPrix - orig.prix) * orig.nb;
    if (mode === "auto") {
      const freeNb = free.reduce((s, f) => s + f.nb, 0);
      setBats((p) => ({
        ...p,
        [active]: {
          ...p[active],
          floors: p[active].floors.map((f) => {
            if (f.id === floorId)   return { ...f, prix: newPrix };
            if (p[active].locked[f.id]) return f;
            return { ...f, prix: Math.round(f.prix - diff / freeNb) };
          }),
        },
      }));
      showToast("Prix mis à jour, redistribution automatique effectuée.");
      cancelEdit();
    } else {
      const vals = Object.fromEntries(free.map((f) => [f.id, 0]));
      setPanel({ changedId: floorId, newPrix, diff, vals });
      cancelEdit();
    }
  }

  /* ── Panneau manuel ── */
  function setVal(id, raw) {
    setPanel((p) => ({ ...p, vals: { ...p.vals, [id]: raw === "" ? "" : parseInt(raw, 10) || 0 } }));
  }

  const remaining = panel
    ? -panel.diff - Object.values(panel.vals).reduce((s, v) => s + (parseInt(v) || 0), 0)
    : 0;

  function applyManual() {
    if (Math.abs(remaining) >= 1) { showToast("Le restant doit être 0 € pour appliquer.", false); return; }
    const { changedId, newPrix, vals } = panel;
    setBats((p) => ({
      ...p,
      [active]: {
        ...p[active],
        floors: p[active].floors.map((f) => {
          if (f.id === changedId)       return { ...f, prix: newPrix };
          if (vals[f.id] !== undefined) return { ...f, prix: f.prix + Math.round((parseInt(vals[f.id]) || 0) / f.nb) };
          return f;
        }),
      },
    }));
    setPanel(null);
    showToast("Redistribution manuelle appliquée.");
  }

  function cancelManual() { setPanel(null); showToast("Modification annulée.", false); }

  const globalTotal = ["A", "B", "C"].reduce((s, k) => s + sumBat(bats[k].floors), 0);

  /* ───────────────────────────── RENDU ─────────────────────────────────── */
  return (
    <div style={{ fontFamily: T.fBody, background: "linear-gradient(155deg,#E0F2FE 0%,#BAE6FD 100%)", minHeight: "100vh", padding: "28px 16px 64px", color: T.body, boxSizing: "border-box" }}>

      {/* CSS global + print + animations */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px) }
          to   { opacity: 1; transform: translateY(0)   }
        }
        .sp-row { animation: fadeUp .28s ease both }
        .sp-row:hover { background: ${T.hover} !important }
        .sp-pcell { cursor: pointer }
        .sp-pcell:hover span { text-decoration: underline dotted #94a3b8 }
        @media print {
          .sp-np { display: none !important }
          body   { background: #fff !important }
          .sp-card { box-shadow: none !important; border: 1px solid #ccc !important }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="sp-np" style={{
          position: "fixed", top: 18, right: 18, zIndex: 9999,
          padding: "11px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600,
          fontFamily: T.fBody, boxShadow: "0 4px 18px rgba(0,0,0,0.13)",
          background: toast.success ? T.bgGreen : "#FEE2E2",
          color:      toast.success ? T.green   : "#B91C1C",
          border:    `1px solid ${toast.success ? T.bdGreen : "#FCA5A5"}`,
        }}>
          {toast.success ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ maxWidth: 960, margin: "0 auto 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: T.fTitle, fontSize: 42, fontWeight: 700, color: T.title, margin: "0 0 4px", letterSpacing: -0.5 }}>
          Simulateur de Prix
        </h1>
        <p style={{ fontFamily: T.fTitle, fontSize: 19, color: "#2563EB", fontWeight: 600, margin: "0 0 22px", letterSpacing: 0.3 }}>
          BETERBAT — Domaine du Diamant 2
        </p>

        {/* Totaux */}
        <div className="sp-np" style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {["A", "B", "C"].map((k) => {
            const tot = sumBat(bats[k].floors);
            const eq  = Math.abs(tot - sumBat(BATS_INIT[k].floors)) < 5;
            return (
              <div key={k} style={{ background: T.white, border: `1.5px solid ${BATS_INIT[k].accent}33`, borderRadius: 12, padding: "10px 20px", boxShadow: T.shadow, minWidth: 158, textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: BATS_INIT[k].accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                  {BATS_INIT[k].label}
                </div>
                <div style={{ fontFamily: T.fTitle, fontSize: 20, fontWeight: 700, color: eq ? T.green : T.orange }}>
                  {fmt(tot)}
                </div>
              </div>
            );
          })}
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "10px 20px", boxShadow: T.shadow, minWidth: 158, textAlign: "left" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
              Total global
            </div>
            <div style={{ fontFamily: T.fTitle, fontSize: 20, fontWeight: 700, color: T.title }}>
              {fmt(globalTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div className="sp-np" style={{ maxWidth: 960, margin: "0 auto 16px", display: "flex", gap: 4, borderBottom: `2px solid ${T.border}` }}>
        {["A", "B", "C"].map((k) => {
          const act = active === k;
          const tot = sumBat(bats[k].floors);
          const eq  = Math.abs(tot - sumBat(BATS_INIT[k].floors)) < 5;
          return (
            <button key={k}
              onClick={() => { setActive(k); setEditId(null); setPanel(null); }}
              style={{
                padding: "10px 26px", border: "none", cursor: "pointer",
                borderBottom: act ? `3px solid ${BATS_INIT[k].accent}` : "3px solid transparent",
                background: act ? T.white : "transparent",
                color: act ? BATS_INIT[k].accent : T.muted,
                fontFamily: T.fBody, fontWeight: 700, fontSize: 14,
                borderRadius: "10px 10px 0 0", transition: "all .15s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              }}>
              <span>{BATS_INIT[k].label}</span>
              <span style={{ fontFamily: T.fTitle, fontSize: 13, fontWeight: 700, color: eq ? T.green : T.orange }}>
                {fmt(tot)}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* ── Barre de budget ── */}
        <div className="sp-card" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14, boxShadow: T.shadow }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 10 }}>
            <KPI label="Budget fixe"  value={fmt(fixed)} color={T.title} />
            <KPI label="Total actuel" value={fmt(curr)}  color={ok ? T.green : T.orange} />
            <KPI
              label="Écart"
              value={(delta >= 0 ? "+" : "") + fmt(delta)}
              color={ok ? T.green : T.orange}
              badge={ok ? "✓ Équilibré" : "⚠ Déséquilibré"}
              badgeOk={ok}
            />
          </div>
          <div style={{ height: 6, borderRadius: 4, background: "#E0F2FE", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4, transition: "width .4s ease",
              background: ok ? T.green : T.orange,
              width: Math.min(100, Math.max(0, (curr / fixed) * 100)) + "%",
            }} />
          </div>
        </div>

        {/* ── Barre d'outils ── */}
        <div className="sp-np" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          {/* Mode */}
          <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 10, padding: 3, gap: 3 }}>
            {[{ k: "auto", label: "Automatique" }, { k: "manual", label: "Manuelle" }].map((m) => (
              <button key={m.k} onClick={() => setMode(m.k)} style={{
                padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: T.fBody, fontSize: 13, fontWeight: 600, transition: "all .15s",
                background: mode === m.k ? info.accent : "transparent",
                color:      mode === m.k ? "#fff"       : T.muted,
              }}>
                {m.label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={reset} style={{
            padding: "8px 18px", borderRadius: 9, border: `1.5px solid ${T.border}`,
            background: T.white, color: T.muted, fontFamily: T.fBody, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>
            ↺ Réinitialiser
          </button>
          <button onClick={() => window.print()} style={{
            padding: "8px 18px", borderRadius: 9, border: "none",
            background: info.accent, color: "#fff", fontFamily: T.fBody, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>
            🖨 Imprimer
          </button>
        </div>

        {/* ── Tableau ── */}
        <div className="sp-card" style={{ background: T.white, borderRadius: 14, boxShadow: T.shadow, overflow: "hidden", border: `1.5px solid ${T.border}`, marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: info.accent + "14", borderBottom: `2px solid ${info.accent}33` }}>
                {["Étage", "Nb lots", "Prix unitaire", "Total étage", "% budget", "Verrou"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 18px",
                    textAlign: h === "Étage" || h === "Verrou" ? "left" : "right",
                    fontFamily: T.fBody, fontWeight: 700, fontSize: 11,
                    color: info.accent, textTransform: "uppercase", letterSpacing: .8, whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.floors.map((f, i) => {
                const locked   = !!state.locked[f.id];
                const disabled = !locked && !canLock(f.id);
                const editing  = editId === f.id;
                const ftotal   = f.nb * f.prix;
                const pct      = ((ftotal / curr) * 100).toFixed(1);
                return (
                  <tr key={f.id} className="sp-row" style={{
                    background: i % 2 === 0 ? T.white : T.rowAlt,
                    borderBottom: `1px solid ${T.border}`,
                    animationDelay: `${i * 55}ms`,
                  }}>
                    {/* Étage */}
                    <td style={{ padding: "12px 18px" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 6,
                        background: info.accent + "1A", color: info.accent, fontWeight: 700, fontSize: 13,
                      }}>
                        {f.etage}
                      </span>
                    </td>

                    {/* Nb lots */}
                    <td style={{ padding: "12px 18px", textAlign: "right", fontWeight: 600, color: T.body }}>
                      {f.nb}
                    </td>

                    {/* Prix unitaire */}
                    <td
                      style={{ padding: "12px 18px", textAlign: "right" }}
                      className={editing ? "" : "sp-pcell"}
                      onClick={() => !editing && startEdit(f)}
                    >
                      {editing ? (
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
                          <input
                            autoFocus
                            value={editVal}
                            onChange={(e) => setEditVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")  commitEdit(f.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            style={{
                              width: 112, padding: "5px 8px",
                              border: `1.5px solid ${info.accent}`, borderRadius: 7,
                              fontFamily: T.fBody, fontSize: 13, textAlign: "right",
                              outline: "none", color: T.body,
                            }}
                          />
                          <button onClick={() => commitEdit(f.id)} style={{ background: info.accent, color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>✓</button>
                          <button onClick={cancelEdit}             style={{ background: "#F1F5F9",   color: T.muted, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 14 }}>✕</button>
                        </div>
                      ) : (
                        <span style={{ fontFamily: T.fTitle, fontSize: 15, fontWeight: 700, color: T.title }}>
                          {fmt(f.prix)}
                        </span>
                      )}
                    </td>

                    {/* Total étage */}
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      <span style={{ fontFamily: T.fTitle, fontSize: 15, fontWeight: 700, color: ok ? T.green : T.orange }}>
                        {fmt(ftotal)}
                      </span>
                    </td>

                    {/* % budget */}
                    <td style={{ padding: "12px 18px", textAlign: "right", fontSize: 13, fontWeight: 600, color: T.muted }}>
                      {pct} %
                    </td>

                    {/* Verrou */}
                    <td style={{ padding: "12px 18px" }}>
                      <button
                        onClick={() => !disabled && toggleLock(f.id)}
                        title={disabled ? "Dernier étage libre — verrouillage impossible" : locked ? "Déverrouiller" : "Verrouiller"}
                        style={{
                          background: locked ? info.accent + "22" : "#F1F5F9",
                          border: `1.5px solid ${locked ? info.accent : T.border}`,
                          borderRadius: 7, padding: "4px 11px",
                          cursor: disabled ? "not-allowed" : "pointer",
                          fontSize: 15, opacity: disabled ? 0.28 : 1,
                          transition: "all .15s",
                        }}
                      >
                        {locked ? "🔒" : "🔓"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Panneau redistribution manuelle ── */}
        {panel && (
          <div className="sp-np" style={{
            background: T.white, border: `1.5px solid ${info.accent}55`,
            borderRadius: 14, padding: "20px 24px", boxShadow: T.shadow,
            marginBottom: 16, animation: "fadeUp .25s ease both",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <h3 style={{ margin: 0, fontFamily: T.fTitle, fontSize: 22, color: T.title, fontWeight: 700 }}>
                Redistribution manuelle
              </h3>
              <span style={{ fontFamily: T.fTitle, fontSize: 15, fontWeight: 700, color: T.muted }}>
                Écart à redistribuer :{" "}
                <span style={{ color: info.accent }}>
                  {(-panel.diff >= 0 ? "+" : "") + fmt(-panel.diff)}
                </span>
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(176px, 1fr))", gap: 14, marginBottom: 18 }}>
              {state.floors.filter((f) => panel.vals[f.id] !== undefined).map((f) => (
                <div key={f.id}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: info.accent, textTransform: "uppercase", letterSpacing: .8, marginBottom: 6 }}>
                    {f.etage}
                  </label>
                  <input
                    type="number"
                    value={panel.vals[f.id] === 0 ? "" : panel.vals[f.id]}
                    onChange={(e) => setVal(f.id, e.target.value)}
                    placeholder="0"
                    style={{ width: "100%", padding: "8px 10px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontFamily: T.fBody, fontSize: 14, color: T.body, outline: "none" }}
                    onFocus={(e) => (e.target.style.borderColor = info.accent)}
                    onBlur={(e)  => (e.target.style.borderColor = T.border)}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{
                padding: "8px 18px", borderRadius: 9,
                background: Math.abs(remaining) < 1 ? T.bgGreen  : T.bgOrange,
                border:    `1.5px solid ${Math.abs(remaining) < 1 ? T.bdGreen : T.bdOrange}`,
                fontFamily: T.fTitle, fontSize: 15, fontWeight: 700,
                color: Math.abs(remaining) < 1 ? T.green : T.orange,
              }}>
                Restant : {remaining >= 0 ? "+" : ""}{fmt(remaining)}{Math.abs(remaining) < 1 ? " ✅" : ""}
              </div>
              <button
                onClick={applyManual}
                disabled={Math.abs(remaining) >= 1}
                style={{
                  padding: "9px 22px", borderRadius: 9, border: "none",
                  background: Math.abs(remaining) < 1 ? info.accent : "#CBD5E1",
                  color: "#fff", fontFamily: T.fBody, fontWeight: 700, fontSize: 14,
                  cursor: Math.abs(remaining) < 1 ? "pointer" : "not-allowed",
                  transition: "background .15s",
                }}
              >
                Appliquer
              </button>
              <button
                onClick={cancelManual}
                style={{ padding: "9px 22px", borderRadius: 9, border: `1.5px solid ${T.border}`, background: T.white, color: T.muted, fontFamily: T.fBody, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
