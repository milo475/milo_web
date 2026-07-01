import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      if (mode === 'login') await login(username.trim(), password);
      else await register(username.trim(), password);
      onClose();
    } catch (e2) {
      setErr(e2.message || 'Алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__x" onClick={onClose} aria-label="Хаах">✕</button>
        <p className="eyebrow eyebrow--kali">{mode === 'login' ? 'НЭВТРЭХ' : 'БҮРТГҮҮЛЭХ'}</p>
        <h2 className="auth-modal__title">
          {mode === 'login' ? 'Тавтай морил' : 'Шинэ хэрэглэгч'}
        </h2>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-form__field">
            <span>Хэрэглэгчийн нэр</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              spellCheck={false}
              required
            />
          </label>
          <label className="auth-form__field">
            <span>Нууц үг</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {err && <p className="auth-form__err">{err}</p>}

          <button className="btn btn--primary auth-form__submit" disabled={busy}>
            {busy ? '...' : mode === 'login' ? 'НЭВТРЭХ' : 'БҮРТГҮҮЛЭХ'}
          </button>
        </form>

        <p className="auth-modal__switch">
          {mode === 'login' ? 'Шинэ хэрэглэгч үү?' : 'Бүртгэлтэй юу?'}{' '}
          <button
            className="auth-modal__link"
            onClick={() => {
              setErr('');
              setMode(mode === 'login' ? 'register' : 'login');
            }}
          >
            {mode === 'login' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </p>
      </div>
    </div>
  );
}
