'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userCoins, setUserCoins] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);

    const { data } = await supabase
      .from('profiles')
      .select('coins_balance')
      .eq('id', user.id)
      .single();
    
    if (data) setUserCoins(data.coins_balance);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <div className="max-w-5xl w-full space-y-6">
        
        {/* แถบบน */}
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💎</span>
            <h1 className="font-bold text-lg text-emerald-400">AI Free Coin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-950/70 border border-emerald-500/40 px-4 py-2 rounded-xl flex items-center gap-2">
              <span>💰</span>
              <span className="font-bold text-emerald-400">{userCoins} Coins</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold rounded-xl border border-red-800/50 transition"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* ข้อความต้อนรับ */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">ยินดีต้อนรับสู่ระบบสะสมเหรียญ AI</h2>
            <p className="text-xs text-slate-400 mt-1">เลือกเข้าใช้งานห้องต่างๆ หรืออ่านรายละเอียดคำแนะนำได้ด้านล่าง</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl text-right">
            <p className="text-xs text-slate-400">เหรียญทองของคุณ</p>
            <p className="text-xl font-extrabold text-amber-400">{userCoins} Coins</p>
          </div>
        </div>

        {/* เมนูเลือกห้อง (ห้องดูโฆษณา และ ห้อง AI Hub) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* การ์ดห้องดูโฆษณา */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-3xl">📺</span>
              <h3 className="text-lg font-bold text-white">ห้องดูโฆษณา (Ad Room)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                สะสมเหรียญทองได้ง่ายๆ เพียงรับชมโฆษณาสั้นๆ ไม่กี่วินาที เพื่อนำไปใช้กับเครื่องมือ AI
              </p>
            </div>
            <button
              onClick={() => router.push('/adroom')}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow text-sm"
            >
              เข้าสู่ห้องดูโฆษณา 🚀
            </button>
          </div>

          {/* การ์ดห้อง AI Hub */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-3xl">🤖</span>
              <h3 className="text-lg font-bold text-white">ห้องรวมเครื่องมือ AI Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                เดินชมและเลือกใช้งาน AI ทั้งหมด (เช็คราคาและเรทบริการก่อนใช้งานจริงได้ฟรี)
              </p>
            </div>
            <button
              onClick={() => router.push('/ai-hub')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow text-sm"
            >
              เข้าใช้งานห้อง AI Hub 🤖 (ชมสินค้าฟรี)
            </button>
          </div>

        </div>
{/* ส่วนท้ายเว็บไซต์ (Footer) สำหรับลิงก์นโยบาย */}
      <footer className="mt-12 text-center text-slate-500 text-xs sm:text-sm border-t border-slate-800/60 pt-6 pb-4 space-y-2">
        <p>© 2026 AI Free Coin Platform. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a href="/terms" className="hover:text-amber-400 transition underline underline-offset-4">
            เงื่อนไขการให้บริการ / Terms of Service
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-amber-400 transition underline underline-offset-4">
            นโยบายความเป็นส่วนตัว / Privacy Policy
          </a>
        </div>
      </footer>
      </div>
    </div>
  );
}