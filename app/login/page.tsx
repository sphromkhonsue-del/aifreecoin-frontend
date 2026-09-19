'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [lang, setLang] = useState<'th' | 'en' | 'ja' | 'zh' | 'es'>('th');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันสุ่มรหัสผ่านปลอดภัย 12 หลัก
  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  // ฟังก์ชันคัดลอกรหัสผ่านลง Clipboard
  const handleCopyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = {
    th: {
      brand: 'เหรียญ AI ฟรี',
      title: isRegister ? 'สร้างบัญชีผู้ใช้' : 'เข้าสู่ระบบ AI Free Coin',
      subtitle: isRegister ? 'กรอกข้อมูลเพื่อเริ่มต้นใช้งาน' : 'เลือกช่องทางเพื่อดำเนินการต่อ',
      google: 'เข้าสู่ระบบด้วย Google',
      facebook: 'เข้าสู่ระบบด้วย Facebook',
      or: 'หรือใช้ อีเมล / รหัสผ่าน',
      email: 'อีเมล',
      password: 'รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)',
      submit: isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ',
      switch: isRegister ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก',
      genPass: '🎲 สุ่มรหัสให้',
      copyPass: copied ? '✓ คัดลอกแล้ว' : '📋 คัดลอก',
      passNotice: 'อย่าลืมบันทึกหรือคัดลอกรหัสผ่านไว้เพื่อเข้าสู่ระบบครั้งถัดไป',
      loading: 'กำลังดำเนินการ...',
    },
    en: {
      brand: 'AI Free Coin',
      title: isRegister ? 'Create Account' : 'Sign In to AI Free Coin',
      subtitle: isRegister ? 'Enter your details to get started' : 'Choose a method to continue',
      google: 'Continue with Google',
      facebook: 'Continue with Facebook',
      or: 'Or with Email / Password',
      email: 'Email',
      password: 'Password (min. 8 characters)',
      submit: isRegister ? 'Sign Up' : 'Sign In',
      switch: isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up",
      genPass: '🎲 Auto Generate',
      copyPass: copied ? '✓ Copied' : '📋 Copy',
      passNotice: 'Please save or copy your password for future logins',
      loading: 'Processing...',
    },
    ja: {
      brand: 'AIフリーコイン',
      title: isRegister ? 'アカウント作成' : 'AI Free Coin にログイン',
      subtitle: isRegister ? '詳細を入力して開始します' : '続行する方法を選択してください',
      google: 'Google でログイン',
      facebook: 'Facebook でログイン',
      or: 'またはメール / パスワード',
      email: 'メールアドレス',
      password: 'パスワード（8文字以上）',
      submit: isRegister ? '新規登録' : 'ログイン',
      switch: isRegister ? 'アカウントをお持ちですか？ログイン' : 'アカウントをお持ちでないですか？新規登録',
      genPass: '🎲 自動生成',
      copyPass: copied ? '✓ コピー完了' : '📋 コピー',
      passNotice: '次回ログインのためにパスワードを保存またはコピーしてください',
      loading: '処理中...',
    },
    zh: {
      brand: 'AI 免费金币',
      title: isRegister ? '创建账户' : '登录 AI Free Coin',
      subtitle: isRegister ? '输入您的详细信息以开始' : '选择一种方式以继续',
      google: '使用 Google 继续',
      facebook: '使用 Facebook 继续',
      or: '或使用 电子邮件 / 密码',
      email: '电子邮件',
      password: '密码（至少 8 个字符）',
      submit: isRegister ? '注册' : '登录',
      switch: isRegister ? '已有账户？登录' : '还没有账户？注册',
      genPass: '🎲 自动生成',
      copyPass: copied ? '✓ 已复制' : '📋 复制',
      passNotice: '请保存或复制您的密码以备日后登录',
      loading: '处理中...',
    },
    es: {
      brand: 'Moneda Gratis AI',
      title: isRegister ? 'Crear cuenta' : 'Iniciar sesión en AI Free Coin',
      subtitle: isRegister ? 'Ingrese sus datos para comenzar' : 'Elija un método para continuar',
      google: 'Continuar con Google',
      facebook: 'Continuar con Facebook',
      or: 'O con Correo / Contraseña',
      email: 'Correo electrónico',
      password: 'Contraseña (mín. 8 caracteres)',
      submit: isRegister ? 'Registrarse' : 'Iniciar sesión',
      switch: isRegister ? '¿Ya tienes una cuenta? Iniciar sesión' : '¿No tienes una cuenta? Registrarse',
      genPass: '🎲 Generar auto',
      copyPass: copied ? '✓ Copiado' : '📋 Copiar',
      passNotice: 'Guarde o copie su contraseña para futuros inicios de sesión',
      loading: 'Procesando...',
    },
  }[lang];

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      alert(lang === 'th' ? 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' : 'Password must be at least 8 characters');
      return;
    }
    setLoading(true);

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert('Error: ' + error.message);
      else {
        alert('สมัครสมาชิกสำเร็จ!');
        window.location.href = '/'; // เปลี่ยนมาที่หน้าแดชบอร์ดหลัก
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert('Error: ' + error.message);
      else window.location.href = '/'; // เปลี่ยนมาที่หน้าแดชบอร์ดหลัก
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` }, // เปลี่ยนมาที่หน้าแดชบอร์ดหลัก
    });
    if (error) alert('Error: ' + error.message);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4" translate="no">
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl mx-auto w-full pt-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          💎 {t.brand}
        </h1>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          className="bg-slate-800 border border-slate-700 text-xs px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none text-white"
        >
          <option value="th">🇹🇭 ไทย (TH)</option>
          <option value="en">🇺🇸 English (EN)</option>
          <option value="ja">🇯🇵 日本語 (JA)</option>
          <option value="zh">🇨🇳 中文 (ZH)</option>
          <option value="es">🇪🇸 Español (ES)</option>
        </select>
      </div>

      {/* Main Form */}
      <div className="max-w-md w-full mx-auto bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-xl my-8">
        <h2 className="text-2xl font-bold text-center mb-2">{t.title}</h2>
        <p className="text-slate-400 text-sm text-center mb-6">{t.subtitle}</p>

        {/* Social Logins */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleAuth}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition border border-slate-700 text-sm"
          >
            🌐 {t.google}
          </button>
          <button
            onClick={() => alert('Facebook Login จะพร้อมใช้งานเร็วๆ นี้')}
            className="w-full bg-blue-900/40 hover:bg-blue-900/60 text-blue-200 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition border border-blue-800/50 text-sm"
          >
            👤 {t.facebook}
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-xs text-slate-500 uppercase">
            {t.or}
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition text-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-400">{t.password}</label>
              {isRegister && (
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  {t.genPass}
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-20 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition text-white"
              />
              <div className="absolute right-3 flex items-center gap-2">
                {isRegister && password && (
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition"
                  >
                    {t.copyPass}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>
            {isRegister && password && (
              <p className="text-[10px] text-amber-400/80 mt-1">
                ⚠️ {t.passNotice}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50"
          >
            {loading ? t.loading : `${t.submit} →`}
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setPassword('');
            }}
            className="text-xs text-slate-400 hover:text-white transition underline"
          >
            {t.switch}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 pb-4">
        © 2026 AI Free Coin. All rights reserved.
      </footer>
    </div>
  );
}