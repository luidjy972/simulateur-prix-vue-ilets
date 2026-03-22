import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ALL_LOTS = [
  { id: 'D01', bat: 'A', etage: 'DUPLEX', type: 'DUPLEX F4', habitable: 82, terrasse: 14, prix: 415000, statut: 'Option' },
  { id: 'D02', bat: 'A', etage: 'DUPLEX', type: 'DUPLEX F4', habitable: 82, terrasse: 14, prix: 415000, statut: '' },
  { id: '101', bat: 'A', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 345000 },
  { id: '102', bat: 'A', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 252500 },
  { id: '103', bat: 'A', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 252500 },
  { id: '104', bat: 'A', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 345000 },
  { id: '105', bat: 'A', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 358500 },
  { id: '106', bat: 'A', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 264500 },
  { id: '107', bat: 'A', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 264500 },
  { id: '108', bat: 'A', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 358500 },
  { id: '109', bat: 'A', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 362500 },
  { id: '110', bat: 'A', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 268500 },
  { id: '111', bat: 'A', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 268500 },
  { id: '112', bat: 'A', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 362500 },
  { id: '201', bat: 'B', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 342000 },
  { id: '202', bat: 'B', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 248500 },
  { id: '203', bat: 'B', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 248500 },
  { id: '204', bat: 'B', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 342000 },
  { id: '205', bat: 'B', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 357000 },
  { id: '206', bat: 'B', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 262000 },
  { id: '207', bat: 'B', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 262000 },
  { id: '208', bat: 'B', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 357000 },
  { id: '209', bat: 'B', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 360500 },
  { id: '210', bat: 'B', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 263500 },
  { id: '211', bat: 'B', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 263500 },
  { id: '212', bat: 'B', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 360500 },
  { id: '301', bat: 'C', etage: 'R-1', type: 'T3', habitable: 70, terrasse: 18, prix: 338000 },
  { id: '302', bat: 'C', etage: 'R-1', type: 'T2', habitable: 42, terrasse: 15, prix: 247000 },
  { id: '303', bat: 'C', etage: 'R-1', type: 'T2', habitable: 42, terrasse: 15, prix: 247000 },
  { id: '304', bat: 'C', etage: 'R-1', type: 'T3', habitable: 70, terrasse: 18, prix: 338000 },
  { id: '305', bat: 'C', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 345000 },
  { id: '306', bat: 'C', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 249500 },
  { id: '307', bat: 'C', etage: 'RDC', type: 'T2', habitable: 42, terrasse: 15, prix: 249500 },
  { id: '308', bat: 'C', etage: 'RDC', type: 'T3', habitable: 70, terrasse: 18, prix: 345500 },
  { id: '309', bat: 'C', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 345000 },
  { id: '310', bat: 'C', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 265500 },
  { id: '311', bat: 'C', etage: 'R+1', type: 'T2', habitable: 42, terrasse: 15, prix: 265500 },
  { id: '312', bat: 'C', etage: 'R+1', type: 'T3', habitable: 70, terrasse: 18, prix: 352000, statut: 'Libre' },
  { id: '313', bat: 'C', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 352000 },
  { id: '314', bat: 'C', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 263500 },
  { id: '315', bat: 'C', etage: 'R+2', type: 'T2', habitable: 42, terrasse: 15, prix: 263500 },
  { id: '316', bat: 'C', etage: 'R+2', type: 'T3', habitable: 70, terrasse: 18, prix: 352000, statut: 'Option' },
];

const FLOORS = ['R-1', 'RDC', 'R+1', 'R+2'];
const FLOOR_COLORS = { 'R-1': '#94a3b8', 'RDC': '#60a5fa', 'R+1': '#34d399', 'R+2': '#fbbf24', 'DUPLEX': '#c084fc' };
const FLOOR_LABELS = { 'R-1': 'Sous-sol', 'RDC': 'Rez-de-chaussée', 'R+1': '1er étage', 'R+2': '2ème étage' };
const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n) => (n >= 0 ? '+' : '') + (n * 100).toFixed(1) + '%';

export default function App() {
  const [coeffs, setCoeffs] = useState({ 'R-1': 1.0, 'RDC': 1.0, 'R+1': 1.0, 'R+2': 1.0 });
  const [activeBat, setActiveBat] = useState('all');
  const [showDuplex, setShowDuplex] = useState(true);
  const [configs, setConfigs] = useState([]);
  const [nomConfig, setNomConfig] = useState('');
  const [toast, setToast] = useState(null);
  const [showSavePanel, setShowSavePanel] = useState(false);

  const TOTAL_GLOBAL = useMemo(() => ALL_LOTS.reduce((s, l) => s + l.prix, 0), []);
  const standardLots = useMemo(() => ALL_LOTS.filter(l => l.etage !== 'DUPLEX'), []);
  const totalStandard = useMemo(() => standardLots.reduce((s, l) => s + l.prix, 0), [standardLots]);
  const weightedSum = useMemo(() => standardLots.reduce((s, l) => s + l.prix * (coeffs[l.etage] || 1), 0), [standardLots, coeffs]);
  const lambda = totalStandard / weightedSum;

  const computedLots = useMemo(() => ALL_LOTS.map((lot) => {
    if (lot.etage === 'DUPLEX') return { ...lot, newPrix: lot.prix, delta: 0, coeff: null };
    const coeff = coeffs[lot.etage] || 1;
    const newPrix = Math.round((lot.prix * coeff * lambda) / 500) * 500;
    return { ...lot, newPrix, delta: newPrix - lot.prix, coeff };
  }), [coeffs, lambda]);

  const displayLots = useMemo(() => {
    let lots = activeBat === 'all' ? computedLots : computedLots.filter(l => l.bat === activeBat);
    if (!showDuplex) lots = lots.filter(l => l.etage !== 'DUPLEX');
    return lots;
  }, [computedLots, activeBat, showDuplex]);

  const totalNew = computedLots.reduce((s, l) => s + l.newPrix, 0);

  useEffect(() => { chargerConfigs(); }, []);

  async function chargerConfigs() {
    const { data } = await supabase.from('configurations').select('*').order('created_at', { ascending: false });
    if (data) setConfigs(data);
  }

  async function sauvegarderConfig() {
    if (!nomConfig.trim()) { afficherToast('Donne un nom !', 'warning'); return; }
    const { error } = await supabase.from('configurations').insert({
      nom: nomConfig.trim(),
      coeff_r1: coeffs['R-1'],
      coeff_rdc: coeffs['RDC'],
      coeff_r1_etage: coeffs['R+1'],
      coeff_r2: coeffs['R+2'],
    });
    if (!error) {
      afficherToast('✅ Sauvegardé !', 'success');
      setNomConfig(''); setShowSavePanel(false); chargerConfigs();
    }
  }

  function appliquerConfig(c) {
    setCoeffs({ 'R-1': c.coeff_r1, 'RDC': c.coeff_rdc, 'R+1': c.coeff_r1_etage, 'R+2': c.coeff_r2 });
    afficherToast(`📂 "${c.nom}" chargée !`, 'success');
  }

  async function supprimerConfig(id) {
    await supabase.from('configurations').delete().eq('id', id);
    afficherToast('Supprimée', 'info'); chargerConfigs();
  }

function exporterCSV() {
  const header = 'Étage;Lots;Prix unitaire;Total\n';
  const rows = [];
  const csv = header + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'simulation-prix.csv';
  a.click();
}
