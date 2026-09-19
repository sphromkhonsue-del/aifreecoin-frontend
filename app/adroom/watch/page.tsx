'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function WatchAdPage() {
  const [lang, setLang] = useState<'th' | 'en' | 'ja' | 'zh' | 'es'>('th');
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [coins, setCoins] = useState<number>(160);

  // ระบบหมุนเวียนค่ายโฆษณา (1 - 15) และเวลาพัก 5 นาที
  const [currentNetwork, setCurrentNetwork] = useState<number>(1);
  const [isCoolingDown, setIsCoolingDown] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(300); // 300 วินาที = 5 นาที

  // ตัวนับเวลาเล่นโฆษณา 15 วินาที
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setIsCompleted(true);
      setCoins((prev) => prev + 10);

      // เมื่อดูจบ เปลี่ยนไปค่ายถัดไป
      if (currentNetwork < 15) {
        setCurrentNetwork((prev) => prev + 1);
      } else {
        // ถ้าดูครบ 15 ค่าย ให้เริ่มพัก 5 นาที
        setCurrentNetwork(1);
        setIsCoolingDown(true);
        setCooldownTime(300);
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, currentNetwork]);

  // ตัวนับเวลาพัก 5 นาที (Cooldown)
  useEffect(() => {
    let coolTimer: NodeJS.Timeout;
    if (isCoolingDown && cooldownTime > 0) {
      coolTimer = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    } else if (isCoolingDown && cooldownTime === 0) {
      setIsCoolingDown(false);
    }
    return () => clearInterval(coolTimer);
  }, [isCoolingDown, cooldownTime]);

  const startAd = () => {
    if (isCoolingDown) return;
    setTimeLeft(15);
    setIsCompleted(false);
    setIsPlaying(true);
  };

  // แปลงวินาทีพักเป็น นาที:วินาที
  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const t = {
    th: {
      title: 'ห้องชมโฆษณาเพื่อรับเหรียญ',
      subtitle: 'ชมโฆษณาให้จบเพื่อรับ +10 เหรียญทองเข้ากระเป๋าของคุณ',
      back: '← กลับหน้าหลัก',
      startBtn: `▶️ เริ่มชมโฆษณา ค่ายที่ ${currentNetwork}/15 (15 วินาที)`,
      watching: `กำลังเล่นโฆษณาจาก ค่ายที่ ${currentNetwork}...`,
      wait: 'เหลือเวลา',
      sec: 'วินาที',
      successTitle: `🎉 ยินดีด้วย! ชมโฆษณาค่ายที่ ${currentNetwork === 1 ? 15 : currentNetwork - 1} สำเร็จ (+10 Coins)`,
      watchAgain: `🎬 ชมโฆษณาค่ายที่ ${currentNetwork} ต่อไป`,
      currentCoins: 'เหรียญสะสมปัจจุบัน:',
      cooldownTitle: '⏳ อยู่ระหว่างช่วงพักระบบ 5 นาที',
      cooldownDesc: 'คุณชมโฆษณาครบทั้ง 15 ค่ายเรียบร้อยแล้ว ระบบจะเปิดให้รับชมรอบใหม่ในอีก',
    },
    en: {
      title: 'Watch Ad & Earn Coins',
      subtitle: 'Watch the complete video to get +10 Gold Coins.',
      back: '← Back to Dashboard',
      startBtn: `▶️ Start Ad Provider #${currentNetwork}/15 (15s)`,
      watching: `Playing Ad from Provider #${currentNetwork}...`,
      wait: 'Time Remaining:',
      sec: 's',
      successTitle: `🎉 Reward Claimed from Provider #${currentNetwork === 1 ? 15 : currentNetwork - 1}! (+10 Coins)`,
      watchAgain: `🎬 Watch Next Ad (Provider #${currentNetwork})`,
      currentCoins: 'Current Coins:',
      cooldownTitle: '⏳ System 5-Minute Break Rate Limit',
      cooldownDesc: 'You have completed all 15 Ad Providers. Next session starts in:',
    },
    ja: {
      title: '広告視聴ルーム',
      subtitle: '広告を最後まで視聴して +10 ゴールドコインを獲得しましょう。',
      back: '← ダッシュボードに戻る',
      startBtn: `▶️ 広告再生 ネットワーク #${currentNetwork}/15 (15秒)`,
      watching: `ネットワーク #${currentNetwork} の広告を再生中...`,
      wait: '残り時間:',
      sec: '秒',
      successTitle: `🎉 おめでとうございます！ネットワーク #${currentNetwork === 1 ? 15 : currentNetwork - 1} 完了！`,
      watchAgain: `🎬 次の広告を視聴する (#${currentNetwork})`,
      currentCoins: '現在の所持コイン:',
      cooldownTitle: '⏳ 5分間の休憩モード',
      cooldownDesc: '15の広告をすべて視聴しました。次のセッション開始まで:',
    },
    zh: {
      title: '看广告赚金币',
      subtitle: '完整观看视频即可获得 +10 金币。',
      back: '← 返回主页',
      startBtn: `▶️ 开始观看广告 平台 #${currentNetwork}/15 (15秒)`,
      watching: `正在播放来自 平台 #${currentNetwork} 的广告...`,
      wait: '剩余时间：',
      sec: '秒',
      successTitle: `🎉 恭喜完成 平台 #${currentNetwork === 1 ? 15 : currentNetwork - 1} 观看！(+10 金币)`,
      watchAgain: `🎬 观看下一个广告 (平台 #${currentNetwork})`,
      currentCoins: '当前金币：',
      cooldownTitle: '⏳ 5分钟系统休息冷却中',
      cooldownDesc: '您已完成所有 15 个平台的广告观看。距离下一轮开放在：',
    },
    es: {
      title: 'Sala de Anuncios',
      subtitle: 'Mira el video completo para recibir +10 Monedas.',
      back: '← Volver al Panel',
      startBtn: `▶️ Ver Anuncio Proveedor #${currentNetwork}/15 (15s)`,
      watching: `Reproduciendo del Proveedor #${currentNetwork}...`,
      wait: 'Tiempo restante:',
      sec: 's',
      successTitle: `🎉 ¡Recompensa del Proveedor #${currentNetwork === 1 ? 15 : currentNetwork - 1}!`,
      watchAgain: `🎬 Ver siguiente anuncio (#${currentNetwork})`,
      currentCoins: 'Monedas actuales:',
      cooldownTitle: '⏳ Descanso de 5 Minutos',
      cooldownDesc: 'Has completado los 15 proveedores. Próxima sesión en:',
    },
  }[lang];

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-between p-4" translate="no">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center pt-2">
        <Link href="/adroom" className="text-xs text-slate-400 hover:text-emerald-400 transition flex items-center gap-1">
          {t.back}
        </Link>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          className="bg-slate-900 border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg text-white focus:outline-none"
        >
          <option value="th">🇹🇭 TH</option>
          <option value="en">🇺🇸 EN</option>
          <option value="ja">🇯🇵 JA</option>
          <option value="zh">🇨🇳 ZH</option>
          <option value="es">🇪🇸 ES</option>
        </select>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto bg-[#0e1626] border border-slate-800 rounded-2xl p-6 shadow-2xl my-6 text-center">
        <h1 className="text-2xl font-bold mb-1">{t.title}</h1>
        <p className="text-slate-400 text-xs mb-6">{t.subtitle}</p>

        {/* Video Player Box Simulation */}
        <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center mb-6 shadow-inner p-4">
          {isCoolingDown ? (
            /* หน้าต่าง Cooldown พัก 5 นาที */
            <div className="space-y-3">
              <span className="text-4xl animate-pulse">☕</span>
              <h3 className="text-amber-400 font-bold text-sm">{t.cooldownTitle}</h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                {t.cooldownDesc}
              </p>
              <div className="bg-amber-400/10 border border-amber-400/30 px-6 py-2 rounded-full inline-block mt-2">
                <span className="text-amber-400 font-mono font-extrabold text-2xl">
                  {formatCooldown(cooldownTime)}
                </span>
              </div>
            </div>
          ) : isPlaying ? (
            /* กำลังเล่นโฆษณา */
            <div className="space-y-3">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-slate-300 font-medium">{t.watching}</p>
              <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full inline-block">
                <span className="text-emerald-400 font-bold text-lg">{timeLeft}</span> <span className="text-xs text-slate-300">{t.sec}</span>
              </div>
            </div>
          ) : isCompleted ? (
            /* เล่นโฆษณาจบ ได้รับเหรียญ */
            <div className="space-y-3">
              <div className="text-4xl animate-bounce">🎁</div>
              <p className="text-emerald-400 font-bold text-xs sm:text-sm px-2">{t.successTitle}</p>
              <button
                onClick={startAd}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-6 rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                {t.watchAgain}
              </button>
            </div>
          ) : (
            /* หน้าเริ่มเล่น */
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-2">
                <span className="text-5xl opacity-80">🎬</span>
              </div>
              <div>
                <button
                  onClick={startAd}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm py-3 px-8 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  {t.startBtn}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current Coin Status */}
        <div className="bg-[#070c18] border border-slate-800 rounded-xl p-3 flex justify-between items-center text-xs">
          <span className="text-slate-400">{t.currentCoins}</span>
          <span className="font-extrabold text-amber-400 text-base">{coins} Coins 🪙</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 pb-2">
        © 2026 AI Free Coin. All rights reserved.
      </footer>
    </div>
  );
}