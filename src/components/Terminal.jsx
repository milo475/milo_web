import { useState, useRef, useEffect, useCallback } from 'react';
import { runLine, cwdLabel, COMMAND_NAMES } from '../terminal/shell.js';
import Confetti from './Confetti.jsx';
import { playWinSound } from '../utils/sound.js';

const WELCOME = [
  '┌─────────────────────────────────────────────┐',
  '│   Виртуал Kali терминал · зөвхөн сурахад      │',
  '└─────────────────────────────────────────────┘',
  '',
  'Энэ бол вэб дотор ажилладаг симуляц терминал. Хичээлүүдэд',
  "заасан бүх командыг чөлөөтэй турш. Жинхэнэ систем биш тул",
  'юу ч эвдрэхгүй.',
  '',
  "Тусламж: `help` бичээд Enter дар. Дэлгэц цэвэрлэх: `clear`.",
  '',
];

/* one rendered prompt line: ┌──(kali㉿kali)-[~]  └─$ cmd */
function PromptLine({ path, cmd }) {
  return (
    <div className="t-entry__cmd">
      <span className="t-l1">
        ┌──(<span className="t-user">kali</span>㉿<span className="t-user">kali</span>)-[
        <span className="t-path">{path}</span>]
      </span>
      <span className="t-l2">
        └─<span className="t-dollar">$</span> {cmd}
      </span>
    </div>
  );
}

export default function Terminal({
  shell,
  entries,
  setEntries,
  input,
  setInput,
  onClose,
  onReset,
  bootCommand,
  onBootConsumed,
  onChallengeWin,
}) {
  const histIdx = useRef(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem('kali_sound') !== 'off';
    } catch {
      return true;
    }
  });

  const toggleSound = () => {
    setSoundOn((on) => {
      const next = !on;
      try {
        localStorage.setItem('kali_sound', next ? 'on' : 'off');
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const path = cwdLabel(shell);

  // keep view scrolled to the bottom as output grows / on reopen
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries]);

  // focus input when the terminal opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = useCallback(
    (raw) => {
      const promptPath = cwdLabel(shell);
      const { out, clear, celebrate, celebrateChallenge } = runLine(shell, raw);
      if (clear) setEntries([]);
      else setEntries((prev) => [...prev, { path: promptPath, cmd: raw, out }]);
      histIdx.current = -1;
      if (celebrate) {
        setShowConfetti(true);
        if (soundOn) playWinSound();
        if (celebrateChallenge) onChallengeWin?.(celebrateChallenge);
      }
    },
    [shell, setEntries, soundOn, onChallengeWin]
  );

  // СОРИЛ автоматаар эхлүүлэх (Lessons-оос дамжуулсан команд)
  useEffect(() => {
    if (bootCommand) {
      submit(bootCommand);
      onBootConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootCommand]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const h = shell.history;
      if (!h.length) return;
      histIdx.current =
        histIdx.current === -1 ? h.length - 1 : Math.max(0, histIdx.current - 1);
      setInput(h[histIdx.current]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const h = shell.history;
      if (histIdx.current === -1) return;
      if (histIdx.current >= h.length - 1) {
        histIdx.current = -1;
        setInput('');
      } else {
        histIdx.current += 1;
        setInput(h[histIdx.current]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  // small tab-completion: command names (first word) or child names in cwd
  const complete = () => {
    const parts = input.split(' ');
    const last = parts[parts.length - 1];
    let pool;
    if (parts.length === 1) {
      pool = COMMAND_NAMES;
    } else {
      let dirNode = shell.fs;
      for (const s of shell.cwd) dirNode = dirNode.children?.[s] ?? dirNode;
      pool = dirNode?.children ? Object.keys(dirNode.children) : [];
    }
    const matches = pool.filter((c) => c.startsWith(last));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      setInput(parts.join(' '));
    }
  };

  return (
    <section className="terminal-view" aria-label="Виртуал терминал">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      <div className="terminal-view__head">
        <div>
          <p className="eyebrow eyebrow--kali">VIRTUAL TERMINAL</p>
          <h1 className="terminal-view__title">Туршиж үзэх терминал</h1>
        </div>
        <button className="btn btn--ghost terminal-view__back" onClick={onClose}>
          ← ХИЧЭЭЛ РҮҮ
        </button>
      </div>

      <div className="t-window" onClick={() => inputRef.current?.focus()}>
        <div className="t-bar">
          <button
            className="t-dot t-dot--r t-dot--btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            aria-label="Терминал хаах"
            title="Хаах"
          />
          <span className="t-dot t-dot--y" />
          <span className="t-dot t-dot--g" />
          <span className="t-bar__title">kali@kali: {path}</span>
          <button
            className="t-tool"
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            aria-label="Дуу асаах/унтраах"
            title={soundOn ? 'Дуу: асаалттай' : 'Дуу: унтраалттай'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button
            className="t-tool"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Терминалыг анхдагч руу шинэчлэх үү? Бүх файл, түүх арилна.'))
                onReset?.();
            }}
            aria-label="Терминал шинэчлэх"
            title="Шинэчлэх (reset)"
          >
            ↻
          </button>
          <button
            className="t-close"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            aria-label="Терминал хаах"
            title="Хаах"
          >
            ✕ ХААХ
          </button>
        </div>

        <div className="t-body" ref={bodyRef}>
          <div className="t-welcome">{WELCOME.join('\n')}</div>

          {entries.map((en, i) => (
            <div className="t-entry" key={i}>
              <PromptLine path={en.path} cmd={en.cmd} />
              {en.out !== '' && <div className="t-entry__out">{en.out}</div>}
            </div>
          ))}

          {/* live input line */}
          <div className="t-input-line">
            <span className="t-l1">
              ┌──(<span className="t-user">kali</span>㉿<span className="t-user">kali</span>)-[
              <span className="t-path">{path}</span>]
            </span>
            <label className="t-l2">
              └─<span className="t-dollar">$</span>{' '}
              <input
                ref={inputRef}
                className="t-input"
                value={input}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="командын мөр"
              />
            </label>
          </div>
        </div>
      </div>

      <p className="t-hint">
        ↑ ↓ — командын түүх · Tab — нэр гүйцээх · <code>help</code> — командын жагсаалт ·{' '}
        <code>clear</code> — цэвэрлэх
      </p>
    </section>
  );
}
