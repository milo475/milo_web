/* sound.js — жижиг WebAudio эффектүүд (файлгүй, кодоор үүсгэнэ) */

let ctx = null;
function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(ac, freq, start, dur, gain = 0.15) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur);
}

/* сорил давсан баярын дуу — өсөх арпеджио */
export function playWinSound() {
  const ac = audio();
  if (!ac) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((f, i) => tone(ac, f, i * 0.12, 0.35));
}

/* товч даралтын нарийн "тик" (одоогоор сонголтоор) */
export function playClick() {
  const ac = audio();
  if (!ac) return;
  tone(ac, 880, 0, 0.05, 0.05);
}

export default { playWinSound, playClick };
