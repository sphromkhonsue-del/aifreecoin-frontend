'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AdBanner from '@/app/components/AdBanner'; // คอมโพเนนต์โฆษณาที่มีในระบบปัจจุบัน

export default function AdRoomPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userCoins, setUserCoins] = useState<number>(0);
  
  const [adStep, setAdStep] = useState<number>(1); 
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false); 
  const [adCountdown, setAdCountdown] = useState<number>(30); // เปลี่ยนเป็น 30 วินาที

  const [isBreakTime, setIsBreakTime] = useState<boolean>(false); 
  const [breakCountdown, setBreakCountdown] = useState<number>(120); 
  const [currentVideo, setCurrentVideo] = useState<any>(null); 
  
  const [clipIndex, setClipIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkUserAndFetchCoins();
  }, []);

  const checkUserAndFetchCoins = async () => {
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

  const handleStartAd = () => {
    setIsWatchingAd(true);
    setAdCountdown(30); // เริ่มต้นนับที่ 30 วินาที
  };

  // ตัวจับเวลาโฆษณา 30 วินาที
  useEffect(() => {
    let timer: any;
    if (isWatchingAd && adCountdown > 0) {
      timer = setInterval(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (adCountdown === 0 && isWatchingAd) {
      setIsWatchingAd(false);
      
      recordAdSession(adStep);

      const nextStep = adStep + 1;

      if (adStep === 5 || adStep === 10) {
        triggerBreakTime();
      } else if (nextStep > 15) {
        completeAllAds();
      } else {
        setAdStep(nextStep);
      }
    }
    return () => clearInterval(timer);
  }, [isWatchingAd, adCountdown, adStep]);

  const recordAdSession = async (stepNum: number) => {
    if (!user) return;
    try {
      await supabase.from('เซสชันการดูโฆษณา').insert([
        { 
          user_id: user.id, 
          ad_step: stepNum 
        }
      ]);
    } catch (err) {
      console.error('Error recording ad session:', err);
    }
  };

  const extractYouTubeId = (input: string) => {
    if (!input) return '';
    let videoId = input.trim();

    if (videoId.includes('v=')) {
      const match = videoId.match(/[?&]v=([^&#]*)/);
      if (match && match[1]) {
        videoId = match[1];
      }
    } else if (videoId.includes('youtu.be/')) {
      const parts = videoId.split('youtu.be/');
      if (parts[1]) {
        videoId = parts[1].split('?')[0].split('&')[0];
      }
    }

    if (videoId.includes('&')) videoId = videoId.split('&')[0];
    if (videoId.includes('?')) videoId = videoId.split('?')[0];

    return videoId;
  };

  const triggerBreakTime = async () => {
    setIsBreakTime(true);
    setBreakCountdown(120); 

    try {
      const { data, error } = await supabase
        .from('youtube_clips')
        .select('*')
        .eq('is_active', true)
        .order('sequence', { ascending: true });

      if (error) {
        console.error('Supabase error:', error.message);
        setCurrentVideo({ title: 'เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message, video_id: '' });
        return;
      }

      if (data && data.length > 0) {
        const currentIndex = clipIndex % data.length;
        const selectedClip = data[currentIndex];

        const rawVideoField = selectedClip.video_id || '';
        const titleField = selectedClip.title || 'ไม่มีชื่อคลิป';
        const videoId = extractYouTubeId(rawVideoField);

        setCurrentVideo({
          title: titleField,
          video_id: videoId
        });

        setClipIndex((prev) => prev + 1);
      } else {
        setCurrentVideo({
          title: 'ไม่พบวิดีโอที่เปิดใช้งาน (is_active = true) ในระบบ',
          video_id: ''
        });
      }
    } catch (err: any) {
      console.error('Fetch exception:', err);
      setCurrentVideo({ title: 'เกิดข้อผิดพลาด: ' + err.message, video_id: '' });
    }
  };

  useEffect(() => {
    let timer: any;
    if (isBreakTime && breakCountdown > 0) {
      timer = setInterval(() => {
        setBreakCountdown((prev) => prev - 1);
      }, 1000);
    } else if (breakCountdown === 0 && isBreakTime) {
      setIsBreakTime(false);
      setAdStep((prev) => prev + 1);
    }
    return () => clearInterval(timer);
  }, [isBreakTime, breakCountdown]);

  const completeAllAds = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('add_user_coins', {
        target_user_id: user.id,
        coin_amount: 15,
        note: 'ดูโฆษณาครบ 15 ครั้ง รับ 15 เหรียญ',
      });

      if (error) throw error;

      setUserCoins(data);
      alert('🎉 ยินดีด้วย! คุณได้รับ 15 Coins เข้าบัญชีเรียบร้อยแล้ว');
      router.push('/'); 
    } catch (err: any) {
      alert('เกิดข้อผิดพลาด: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-6">
        
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-2 rounded-xl transition cursor-pointer"
          >
            ← กลับหน้าแดชบอร์ด
          </button>
          <div className="bg-emerald-950/70 border border-emerald-500/40 px-4 py-2 rounded-xl flex items-center gap-2">
            <span>💰</span>
            <span className="font-bold text-emerald-400">{userCoins} Coins</span>
          </div>
        </div>

        {!isBreakTime && !isWatchingAd && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center space-y-6 shadow-xl">
            <span className="text-4xl">📺</span>
            <h1 className="text-2xl font-bold text-white">ห้องดูโฆษณา (Ad Room)</h1>
            <p className="text-sm text-slate-400">
              รับชมโฆษณาเพื่อสะสมความคืบหน้า (ครบ 15 ครั้ง รับทันที 15 Coins)
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>ความคืบหน้าปัจจุบัน</span>
                <span className="font-bold text-emerald-400">{adStep} / 15 โฆษณา</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(adStep / 15) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleStartAd}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg text-base cursor-pointer"
            >
              รับชมโฆษณาชุดที่ {adStep} (30 วินาที) 🚀
            </button>
          </div>
        )}

        {!isBreakTime && isWatchingAd && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-emerald-500/30 text-center space-y-6 shadow-xl">
            <span className="text-4xl">⏳</span>
            <h2 className="text-xl font-bold text-emerald-400">กำลังรับชมโฆษณาชุดที่ {adStep}</h2>
            <p className="text-xs text-slate-400">กรุณารอสักครู่ ระบบกำลังนับถอยหลัง 30 วินาที...</p>

            {/* แสดงค่ายโฆษณาที่มีอยู่แล้วในระบบ */}
            <div className="my-4">
              <AdBanner />
            </div>

            <div className="inline-block bg-emerald-950/50 border border-emerald-500/50 px-8 py-4 rounded-full text-emerald-300 font-mono text-2xl font-bold">
              {adCountdown} วินาที
            </div>

            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-full transition-all duration-1000"
                style={{ width: `${((30 - adCountdown) / 30) * 100}%` }}
              ></div>
            </div>

            <button
              onClick={() => setAdCountdown(0)}
              className="text-xs text-slate-500 hover:text-slate-300 underline pt-2 block mx-auto cursor-pointer"
            >
              [ข้ามเวลาโฆษณาสำหรับทดสอบ]
            </button>
          </div>
        )}

        {isBreakTime && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-amber-500/30 text-center space-y-6 shadow-xl">
            <span className="text-4xl">☕</span>
            <h2 className="text-xl font-bold text-amber-400">เวลาพักผ่อนสมอง (Break Time)</h2>
            <p className="text-xs text-slate-300">
              พักผ่อนสายตา เพลิดเพลินกับคลิปตามลำดับในระบบ
            </p>

            <div className="inline-block bg-amber-950/50 border border-amber-500/50 px-6 py-2 rounded-full text-amber-300 font-mono text-lg font-bold">
              พักต่ออีก: {Math.floor(breakCountdown / 60)}:{('0' + (breakCountdown % 60)).slice(-2)} นาที
            </div>

            {currentVideo && currentVideo.video_id ? (
              <div className="space-y-3">
                <p className="text-xs text-amber-400 font-semibold">📌 กำลังเล่น: {currentVideo.title}</p>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 shadow">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentVideo.video_id}?autoplay=1`}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 p-6">
                <p className="text-xs text-amber-500 text-center">{currentVideo?.title || 'กำลังโหลดคลิป...'}</p>
              </div>
            )}

            <button
              onClick={() => {
                setIsBreakTime(false);
                setAdStep((prev) => prev + 1);
              }}
              className="text-xs text-slate-400 hover:text-white underline pt-2 block mx-auto cursor-pointer"
            >
              ข้ามช่วงพัก (ไปดูโฆษณาต่อ)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}