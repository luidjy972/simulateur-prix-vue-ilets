import { useState, useMemo } from "react";

const ALL_LOTS = [
  { id: 'D01', bat: 'A', etage: 'DUPLEX', type: 'DUPLEX F4', habitable: 82, terrasse: 14, prix: 415000, statut: 'Option' },
  { id: 'D02', bat: 'A', etage: 'DUPLEX', type: 'DUPLEX F4', habitable: 82, terrasse: 14, prix: 415000, statut: '' },
  { id: '101', bat: 'A', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 345000, statut: '' },
  { id: '102', bat: 'A', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 252500, statut: '' },
  { id: '103', bat: 'A', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 252500, statut: '' },
  { id: '104', bat: 'A', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 345000, statut: '' },
  { id: '105', bat: 'A', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 358500, statut: '' },
  { id: '106', bat: 'A', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 264500, statut: '' },
  { id: '107', bat: 'A', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 264500, statut: '' },
  { id: '108', bat: 'A', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 358500, statut: '' },
  { id: '109', bat: 'A', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 362500, statut: '' },
  { id: '110', bat: 'A', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 268500, statut: '' },
  { id: '111', bat: 'A', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 268500, statut: '' },
  { id: '112', bat: 'A', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 362500, statut: '' },
  { id: '201', bat: 'B', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 342000, statut: '' },
  { id: '202', bat: 'B', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 248500, statut: '' },
  { id: '203', bat: 'B', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 248500, statut: '' },
  { id: '204', bat: 'B', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 342000, statut: '' },
  { id: '205', bat: 'B', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 357000, statut: '' },
  { id: '206', bat: 'B', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 262000, statut: '' },
  { id: '207', bat: 'B', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 262000, statut: '' },
  { id: '208', bat: 'B', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 357000, statut: '' },
  { id: '209', bat: 'B', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 360500, statut: '' },
  { id: '210', bat: 'B', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 263500, statut: '' },
  { id: '211', bat: 'B', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 263500, statut: '' },
  { id: '212', bat: 'B', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 360500, statut: '' },
  { id: '301', bat: 'C', etage: 'R-1', type: 'T3', habitable: 70, terrasse: 18, prix: 338000, statut: '' },
  { id: '302', bat: 'C', etage: 'R-1', type: 'T2', habitable: 42, terrasse: 15, prix: 247000, statut: '' },
  { id: '303', bat: 'C', etage: 'R-1', type: 'T2', habitable: 42, terrasse: 15, prix: 247000, statut: '' },
  { id: '304', bat: 'C', etage: 'R-1', type: 'T3', habitable: 70, terrasse: 18, prix: 338000, statut: '' },
  { id: '305', bat: 'C', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 345000, statut: '' },
  { id: '306', bat: 'C', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 249500, statut: '' },
  { id: '307', bat: 'C', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 249500, statut: '' },
  { id: '308', bat: 'C', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 345500, statut: '' },
  { id: '309', bat: 'C', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 345000, statut: '' },
  { id: '310', bat: 'C', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 265500, statut: '' },
  { id: '311', bat: 'C', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 265500, statut: '' },
  { id: '312', bat: 'C', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 352000, statut: 'Libre' },
  { id: '313', bat: 'C', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 352000, statut: '' },
  { id: '314', bat: 'C', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 263500, statut: '' },
  { id: '315', bat: 'C', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 263500, statut: '' },
  { id: '316', bat: 'C', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 352000, statut: 'Option' },
];

const FLOORS = ['R-1', 'RDC', 'R+1', 'R+2'];

const FLOOR_COLORS = {
  'R-1': '#94a3b8',
  'RDC': '#60a5fa',
  'R+1': '#34d399',
  'R+2': '#fbbf24',
  'DUPLEX': '#c084fc',
};

const FLOOR_LABELS = {
  'R-1': 'Sous-sol',
  'RDC': 'Rez-de-chaussée',
  'R+1': '1er étage',
  'R+2': '2ème étage',
};

const fmt = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

const fmtPct = (n) => (n >= 0 ? '+' : '') + (n * 100).toFixed(1) + '%';

export default function App() {
  const [coeffs, setCoeffs] = useState({ 'R-1': 1.0, 'RDC': 1.0, 'R+1': 1.0, 'R+2': 1.0 });
  const [activeBat, setActiveBat] = useState('all');
  const [showDuplex, setShowDuplex] = useState(true);

  const TOTAL_GLOBAL = useMemo(() => ALL_LOTS.reduce((s, l) => s + l.prix, 0), []);

  const standardLots = useMemo(() => ALL_LOTS.filter(l => l.etage !== 'DUPLEX'), []);
  const totalStandard = useMemo(() => standardLots.reduce((s, l) => s + l.prix, 0), [standardLots]);

  const weightedSum = useMemo(
    () => standardLots.reduce((s, l) => s + l.prix * (coeffs[l.etage] || 1), 0),
    [standardLots, coeffs]
  );

  const lambda = totalStandard / weightedSum;

  const computedLots = useMemo(
    () =>
      ALL_LOTS.map((lot) => {
        if (lot.etage === 'DUPLEX') return { ...lot, newPrix: lot.prix, delta: 0, coeff: null };
        const coeff = coeffs[lot.etage] || 1;
        const newPrix = Math.round((lot.prix * coeff * lambda) / 500) * 500;
        return { ...lot, newPrix, delta: newPrix - lot.prix, coeff };
      }),
    [coeffs, lambda]
  );

  const displayLots = useMemo(() => {
    let lots = activeBat === 'all' ? computedLots : computedLots.filter((l) => l.bat === activeBat);
    if (!showDuplex) lots = lots.filter((l) => l.etage !== 'DUPLEX');
    return lots;
  }, [computedLots, activeBat, showDuplex]);

  const totalNew = computedLots.reduce((s, l) => s + l.newPrix, 0);

  const impliedRates = useMemo(() => {
    return FLOORS.reduce((acc, f) => {
      const lotsFloor = standardLots.filter((l) => l.etage === f);
      const avgPrixM2 =
        lotsFloor.length > 0
          ? lotsFloor.reduce((s, l) => s + l.prix / l.habitable, 0) / lotsFloor.length
          : 0;
      const newAvgPrixM2 = avgPrixM2 * (coeffs[f] || 1) * lambda;
      acc[f] = { original: avgPrixM2, nouveau: newAvgPrixM2 };
      return acc;
    }, {});
  }, [standardLots, coeffs, lambda]);

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 60%, #091428 100%)',
        minHeight: '100vh',
        color: '#e2e8f0',
        padding: '28px 24px',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: '28px',
          borderBottom: '1px solid rgba(248,196,113,0.25)',
          paddingBottom: '20px',
        }}
      >
        <div
          style={{
            color: '#c084fc',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          BETERBAT · SIMULATEUR TARIFAIRE
        </div>
        <h1
          style={{
            fontSize: '28px',
            color: '#f8fafc',
            fontWeight: 'normal',
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px',
          }}
        >
          Résidence <span style={{ color: '#fbbf24' }}>Vue des Îlets</span>
          <span style={{ color: '#475569', fontSize: '16px', marginLeft: '10px' }}>· Trois-Îlets</span>
        </h1>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'TOTAL PROGRAMME', val: TOTAL_GLOBAL, color: '#fbbf24' },
            { label: 'TOTAL SIMULÉ', val: totalNew, color: Math.abs(totalNew - TOTAL_GLOBAL) < 10000 ? '#34d399' : '#f87171' },
            { label: 'ÉCART', val: totalNew - TOTAL_GLOBAL, color: '#94a3b8' },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.12em' }}>{item.label}</div>
              <div style={{ fontSize: '24px', color: item.color, fontWeight: 'bold', marginTop: '2px' }}>
                {item.val >= 0 ? '' : ''}
                {fmt(item.val)}
              </div>
            </div>
          ))}
          <div>
            <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.12em' }}>LOTS</div>
            <div style={{ fontSize: '24px', color: '#94a3b8', fontWeight: 'bold', marginTop: '2px' }}>
              {ALL_LOTS.length} lots
            </div>
          </div>
        </div>
      </div>

      {/* COEFFICIENT PANEL */}
      <div
        style={{
          background: 'rgba(30,41,59,0.6)',
          backdropFilter: 'blur(4px)',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(100,116,139,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.15em' }}>
            COEFFICIENTS PAR ÉTAGE — le total global reste verrouillé à{' '}
            <span style={{ color: '#fbbf24' }}>{fmt(TOTAL_GLOBAL)}</span>
          </div>
          <button
            onClick={() => setCoeffs({ 'R-1': 1.0, 'RDC': 1.0, 'R+1': 1.0, 'R+2': 1.0 })}
            style={{
              background: 'rgba(51,65,85,0.8)',
              color: '#94a3b8',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '5px 14px',
              cursor: 'pointer',
              fontSize: '11px',
              letterSpacing: '0.05em',
            }}
          >
            ↺ Réinitialiser
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {FLOORS.map((floor) => {
            const coeff = coeffs[floor];
            const color = FLOOR_COLORS[floor];
            const pct = (coeff - 1) * 100;
            const rate = impliedRates[floor];
            return (
              <div key={floor}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        background: color + '22',
                        color,
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {floor}
                    </span>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                      {FLOOR_LABELS[floor]}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        color: coeff > 1 ? '#34d399' : coeff < 1 ? '#f87171' : '#94a3b8',
                        fontWeight: 'bold',
                        fontSize: '18px',
                      }}
                    >
                      {coeff.toFixed(3)}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: coeff > 1 ? '#34d39988' : coeff < 1 ? '#f8717188' : '#475569',
                      }}
                    >
                      {pct >= 0 ? '+' : ''}
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.80"
                  max="1.20"
                  step="0.005"
                  value={coeff}
                  onChange={(e) => setCoeffs((p) => ({ ...p, [floor]: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: color, cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#334155', marginTop: '2px' }}>
                  <span>−20%</span>
                  <span>+20%</span>
                </div>
                {rate && (
                  <div
                    style={{
                      marginTop: '10px',
                      background: 'rgba(15,23,42,0.5)',
                      borderRadius: '6px',
                      padding: '8px',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ color: '#475569', marginBottom: '4px' }}>Prix moyen / m² hab.</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>{Math.round(rate.original).toLocaleString('fr-FR')} €</span>
                      <span style={{ color: '#64748b' }}>→</span>
                      <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{Math.round(rate.nouveau).toLocaleString('fr-FR')} €</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'A', 'B', 'C'].map((b) => (
            <button
              key={b}
              onClick={() => setActiveBat(b)}
              style={{
                background: activeBat === b ? '#fbbf24' : 'rgba(30,41,59,0.6)',
                color: activeBat === b ? '#0f172a' : '#94a3b8',
                border: '1px solid ' + (activeBat === b ? '#fbbf24' : '#334155'),
                borderRadius: '7px',
                padding: '6px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'all 0.15s',
              }}
            >
              {b === 'all' ? 'Tous' : `Bât. ${b}`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowDuplex((v) => !v)}
          style={{
            background: showDuplex ? 'rgba(192,132,252,0.2)' : 'rgba(30,41,59,0.6)',
            color: showDuplex ? '#c084fc' : '#475569',
            border: '1px solid ' + (showDuplex ? '#c084fc' : '#334155'),
            borderRadius: '7px',
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {showDuplex ? '◉' : '○'} Duplex
        </button>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: 'rgba(15,23,42,0.7)',
          borderRadius: '14px',
          overflow: 'auto',
          border: '1px solid rgba(100,116,139,0.2)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '700px' }}>
          <thead>
            <tr
              style={{
                background: 'rgba(0,0,0,0.4)',
                color: '#475569',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {['Lot', 'Bât.', 'Étage', 'Type', 'Hab.', 'Coeff.', 'Prix actuel', 'Nouveau prix', 'Écart €', 'Écart %'].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: '11px 12px',
                      textAlign: h === 'Lot' || h === 'Bât.' || h === 'Étage' || h === 'Type' ? 'left' : 'right',
                      fontWeight: 'normal',
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {displayLots.map((lot, i) => {
              const isDuplex = lot.etage === 'DUPLEX';
              const pct = lot.prix > 0 ? lot.delta / lot.prix : 0;
              return (
                <tr
                  key={lot.id}
                  style={{
                    borderTop: '1px solid rgba(30,41,59,0.8)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(15,23,42,0.3)',
                  }}
                >
                  <td style={{ padding: '9px 12px', fontWeight: 'bold', color: '#f1f5f9' }}>{lot.id}</td>
                  <td style={{ padding: '9px 12px', color: '#64748b' }}>{lot.bat}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span
                      style={{
                        background: (FLOOR_COLORS[lot.etage] || '#334155') + '28',
                        color: FLOOR_COLORS[lot.etage] || '#94a3b8',
                        padding: '2px 9px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      {lot.etage}
                    </span>
                  </td>
                  <td style={{ padding: '9px 12px', color: '#94a3b8' }}>{lot.type}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', color: '#64748b' }}>{lot.habitable} m²</td>
                  <td
                    style={{
                      padding: '9px 12px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: isDuplex
                        ? '#334155'
                        : lot.coeff > 1
                        ? '#34d399'
                        : lot.coeff < 1
                        ? '#f87171'
                        : '#64748b',
                    }}
                  >
                    {isDuplex ? '—' : lot.coeff?.toFixed(3)}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', color: '#475569' }}>{fmt(lot.prix)}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 'bold', color: '#f8fafc' }}>
                    {fmt(lot.newPrix)}
                  </td>
                  <td
                    style={{
                      padding: '9px 12px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: lot.delta > 0 ? '#34d399' : lot.delta < 0 ? '#f87171' : '#334155',
                    }}
                  >
                    {lot.delta > 0 ? '+' : ''}
                    {fmt(lot.delta)}
                  </td>
                  <td
                    style={{
                      padding: '9px 12px',
                      textAlign: 'right',
                      color: pct > 0 ? '#34d39988' : pct < 0 ? '#f8717188' : '#334155',
                      fontSize: '12px',
                    }}
                  >
                    {isDuplex ? '—' : fmtPct(pct)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'rgba(0,0,0,0.5)', borderTop: '2px solid #334155' }}>
              <td colSpan={5} style={{ padding: '12px 12px', color: '#475569', fontSize: '11px' }}>
                {displayLots.length} lots affichés
              </td>
              <td style={{ padding: '12px 12px', textAlign: 'right', color: '#475569', fontSize: '11px' }}>TOTAL</td>
              <td style={{ padding: '12px 12px', textAlign: 'right', color: '#64748b', fontWeight: 'bold' }}>
                {fmt(displayLots.reduce((s, l) => s + l.prix, 0))}
              </td>
              <td style={{ padding: '12px 12px', textAlign: 'right', color: '#fbbf24', fontWeight: 'bold', fontSize: '15px' }}>
                {fmt(displayLots.reduce((s, l) => s + l.newPrix, 0))}
              </td>
              <td
                style={{
                  padding: '12px 12px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  color:
                    displayLots.reduce((s, l) => s + l.delta, 0) > 0
                      ? '#34d399'
                      : displayLots.reduce((s, l) => s + l.delta, 0) < 0
                      ? '#f87171'
                      : '#334155',
                }}
              >
                {fmt(displayLots.reduce((s, l) => s + l.delta, 0))}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div
        style={{
          marginTop: '14px',
          fontSize: '10px',
          color: '#334155',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        Prix arrondis à la tranche de 500 € · Duplexes D01 & D02 exclus de la modulation · Formule : Prix nouveau = Prix actuel × Coeff × λ (facteur de normalisation)
      </div>
    </div>
  );
}
