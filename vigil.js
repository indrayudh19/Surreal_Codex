// ============================================================
// vigil.js — Shared persistence layer for the Hollow Moon site
// Uses localStorage with key 'hollowMoonVigil'
// ============================================================

const VIGIL_KEY = 'hollowMoonVigil';

function getVigil() {
  const raw = localStorage.getItem(VIGIL_KEY);
  if (!raw) {
    const fresh = {
      knightName: 'Unnamed Knight',
      hp: 100, maxHp: 100,
      mp: 50, maxMp: 50,
      inventory: [],
      codexFragments: [],
      questsCompleted: [],
      valentry: { started: false, completed: false, encounterLog: [] },
      lastVisit: new Date().toISOString()
    };
    localStorage.setItem(VIGIL_KEY, JSON.stringify(fresh));
    return fresh;
  }
  return JSON.parse(raw);
}

function saveVigil(vigil) {
  vigil.lastVisit = new Date().toISOString();
  localStorage.setItem(VIGIL_KEY, JSON.stringify(vigil));
}
