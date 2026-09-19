'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AdBanner from '@/app/components/AdBanner';

const AI_TOOLS = [
  { 
    id: 'tts', 
    name: 'AI ตัวที่ 1: Text-to-Speech', 
    desc: 'แปลงข้อความ เป็นเสียงพูดสมจริง พร้อมตัวเลือกเสียงหลากหลายและระบบทดลองฟัง', 
    cost: 2, 
    icon: '🔊', 
    type: 'audio',
    outputFormats: ['.mp3', '.wav'],
    voices: [
      { id: 'th-female-1', name: '👩‍🦰 หญิง: นุ่มนวล/ธรรมชาติ', sampleText: 'สวัสดีค่ะ ขอให้วันนี้เป็นวันที่ดีและมีความสุขมากๆ นะคะ' },
      { id: 'th-male-1', name: '👨‍🦰 ชาย: นุ่มทุ้ม/อบอุ่น', sampleText: 'สวัสดีครับ ไม่ว่าคุณจะเจออะไรมา ขอให้เชื่อมั่นในตัวเองนะครับ' },
      { id: 'th-girl-1', name: '👧 เด็ก: สดใส/น่ารัก', sampleText: 'พี่ขา หนูอยากกินไอติมรสช็อกโกแลตจังเลยค่ะ' }
    ],
    placeholder: 'พิมพ์ข้อความภาษาไทยที่ต้องการให้ AI แปลงเป็นสคริปต์พากย์เสียง...'
  },
  { 
    id: 'stt', 
    name: 'AI ตัวที่ 2: Speech-to-Text', 
    desc: 'แปลงไฟล์เสียงพูด เป็นข้อความ', 
    cost: 2, 
    icon: '🎙️', 
    type: 'text',
    outputFormats: ['.txt', '.docx', '.srt'],
  },
  { 
    id: 'text-gen', 
    name: 'AI ตัวที่ 3: พล็อตเรื่อง & คอนเทนต์', 
    desc: 'แต่งนิยาย เขียนโค้ด บทละคร สร้างบทภาพยนตร์ ฯลฯ', 
    cost: 1, 
    icon: '✍️', 
    type: 'text',
    outputFormats: ['.txt', '.md', '.docx'],
    placeholder: 'พิมพ์หัวข้อ ไอเดีย หรือโจทย์ที่ต้องการให้ AI ช่วยเขียน...'
  },
  { 
    id: 'image-gen', 
    name: 'AI ตัวที่ 4: Text-to-Image (3D/2D)', 
    desc: 'สร้างภาพตาม Prompt และสไตล์ที่ต้องการ', 
    cost: 3, 
    icon: '🎨', 
    type: 'image',
    outputFormats: ['.png', '.jpg', '.webp'],
    placeholder: 'อธิบายลักษณะภาพที่ต้องการ เช่น "แมวน้อยสไตล์การ์ตูน 3D น่ารัก"...',
    supportsImageUpload: true
  }
];

export default function AIHubPage() {
  const [userCoins, setUserCoins] = useState<number>(0);
  const [selectedTool, setSelectedTool] = useState<any>(AI_TOOLS[0]);
  const [prompt, setPrompt] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(AI_TOOLS[0].voices?.[0]?.id || '');
  const [selectedFormat, setSelectedFormat] = useState(AI_TOOLS[0].outputFormats[0]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State สำหรับไฟล์เสียง AI ตัวที่ 2
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);

  // State เพิ่มเติมสำหรับ Google TTS (ความเร็ว, ระดับเสียง, แหล่งเล่นเสียง)
  const [speakingRate, setSpeakingRate] = useState('1.0');
  const [pitch, setPitch] = useState('0.0');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: string;
    content: string;
    mediaUrl?: string;
    toolName: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchUserCoins();
  }, []);

  const fetchUserCoins = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('coins_balance')
      .eq('id', user.id)
      .single();
    
    if (data) setUserCoins(data.coins_balance);
  };

  const handleToolChange = (tool: any) => {
    setSelectedTool(tool);
    setResult(null);
    setPrompt('');
    setAudioFile(null);
    setAudioSrc(null);
    setSelectedFormat(tool.outputFormats[0]);
    if (tool.voices && tool.voices.length > 0) {
      setSelectedVoice(tool.voices[0].id);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAudio(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAudio(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAudio(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setAudioFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAudioFile(files[0]);
    }
  };

  const handleExecuteAI = async () => {
    if (!selectedTool) return;

    if (selectedTool.id === 'stt') {
      if (!audioFile) {
        alert('กรุณาลากไฟล์เสียงมาวาง หรือเลือกไฟล์เสียงก่อนครับ');
        return;
      }
    } else {
      if (!prompt.trim()) {
        alert('กรุณากรอกข้อความ Prompt ก่อนสั่งให้ AI ทำงานครับ');
        return;
      }
    }

    setLoading(true);
    setResult(null);
    setAudioSrc(null);

    try {
      // ถ้าเลือก AI ตัวที่ 1 (Text-to-Speech) ให้วิ่งไปเรียก API Google TTS
      if (selectedTool.id === 'tts') {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: prompt, 
            speakingRate, 
            pitch,
            voice: selectedVoice 
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างเสียง');

        if (data.audioContent) {
          const src = `data:audio/mp3;base64,${data.audioContent}`;
          setAudioSrc(src);
          setResult({
            type: 'audio',
            content: 'สร้างไฟล์เสียง Google TTS สำเร็จ! คุณสามารถกดฟังเสียงตัวอย่างด้านล่างได้ทันทีครับ',
            mediaUrl: src,
            toolName: selectedTool.name,
          });
        }
        setLoading(false);
        return;
      }

      // สำหรับ AI ตัวอื่นๆ (STT, Text-Gen, Image-Gen)
      const payloadPrompt = selectedTool.id === 'stt' ? `ถอดเสียงจากไฟล์: ${audioFile?.name}` : prompt;

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool.id,
          prompt: payloadPrompt,
          voice: selectedVoice,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการประมวลผล');
      }

      let mediaUrl = '';
      if (selectedTool.id === 'image-gen') {
        mediaUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60';
      }

      setResult({
        type: selectedTool.type,
        content: data.content,
        mediaUrl: mediaUrl,
        toolName: selectedTool.name,
      });

    } catch (err: any) {
      alert('AI Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResult = async () => {
    if (userCoins < selectedTool.cost) {
      alert(`เหรียญทองของคุณไม่พอสำหรับดาวน์โหลดผลงาน (ต้องการ ${selectedTool.cost} Coins แต่คุณมี ${userCoins} Coins)`);
      router.push('/adroom');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('deduct_ai_coins', {
        p_ai_tool_name: selectedTool.name,
        p_coins_used: selectedTool.cost
      });

      if (error) throw error;
      const res = data[0];

      if (!res.success) {
        alert(res.message);
        return;
      }

      setUserCoins(res.new_balance);
      alert(`หักสำเร็จ ${selectedTool.cost} Coins! เริ่มดาวน์โหลดไฟล์ฉบับเต็มเรียบร้อยแล้ว 📥`);
      
      if (result?.mediaUrl) {
        window.open(result.mediaUrl, '_blank');
      }

    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการหักเหรียญ: ' + err.message);
    }
  };

  const handlePlayResultVoice = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'th-TH';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <button 
            onClick={() => router.push('/adroom')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            ← กลับไปห้องดูโฆษณา (Ad Room)
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950/70 border border-emerald-500/40 px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner">
              <span className="text-xl">💰</span>
              <span className="font-bold text-emerald-400 text-lg">{userCoins} Coins</span>
            </div>
          </div>
        </div>

        {/* หัวข้อหลัก */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-emerald-400">🤖 AI Hub - ศูนย์รวมเครื่องมืออัจฉริยะ</h1>
          <p className="text-slate-400 text-sm">ทดลองสร้างผลงานดูตัวอย่างฟรีทุก AI Tool และหักเหรียญเฉพาะตอนดาวน์โหลดไฟล์ฉบับเต็ม</p>
        </div>

        {/* Grid เลือก AI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_TOOLS.map((tool) => {
            const isSelected = selectedTool?.id === tool.id;
            return (
              <div 
                key={tool.id}
                onClick={() => handleToolChange(tool)}
                className={`cursor-pointer bg-slate-900 p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:border-slate-600 ${
                  isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-slate-900/90 shadow-lg' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-3xl">{tool.icon}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'
                    }`}>
                      ค่าโหลด {tool.cost} Coin(s)
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{tool.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{tool.desc}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                  <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isSelected ? 'กำลังเลือกใช้งาน ✓' : 'คลิกเพื่อเลือก'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ส่วนกล่องทำงานของ AI ที่เลือก */}
        {selectedTool && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-emerald-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <span>{selectedTool.icon}</span> {selectedTool.name}
                </h2>
                <p className="text-xs text-slate-400">{selectedTool.desc}</p>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg self-start sm:self-auto">
                ค่าดาวน์โหลด: <strong>{selectedTool.cost} Coins</strong> (ทดลองสร้างดูฟรี!)
              </span>
            </div>

            {selectedTool.id === 'stt' ? (
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300 block">📥 กล่องที่ 1: ลากไฟล์เสียงมาวาง หรือคลิกเพื่อเลือกไฟล์</label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('audioFileInput')?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer ${
                    isDraggingAudio 
                      ? 'border-emerald-400 bg-emerald-950/40 scale-[1.01]' 
                      : 'border-slate-700 bg-slate-950 hover:border-emerald-500/60'
                  }`}
                >
                  <span className="text-5xl animate-bounce">🎙️</span>
                  {audioFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-400">✅ เลือกไฟล์แล้ว: {audioFile.name}</p>
                      <p className="text-xs text-slate-400">ขนาด: {(audioFile.size / (1024 * 1024)).toFixed(2)} MB — (คลิกหรือลากไฟล์ใหม่เพื่อเปลี่ยน)</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">ลากไฟล์เสียง (MP3, WAV, M4A) มาวางที่นี่</p>
                      <p className="text-xs text-slate-400">หรือคลิกบริเวณนี้เพื่อเลือกไฟล์จากเครื่อง</p>
                    </div>
                  )}

                  <input 
                    id="audioFileInput"
                    type="file" 
                    accept="audio/*" 
                    onChange={handleFileSelect} 
                    className="hidden" 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* ถ้าเลือก AI ตัวที่ 1 (TTS) ให้แสดงแผงควบคุมเสียงพิเศษ */}
                {selectedTool.id === 'tts' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">เลือกเสียงพากย์:</label>
                      <select 
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs cursor-pointer"
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                      >
                        {selectedTool.voices?.map((v: any) => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">ความเร็วเสียง (Speed):</label>
                      <select 
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs cursor-pointer"
                        value={speakingRate}
                        onChange={(e) => setSpeakingRate(e.target.value)}
                      >
                        <option value="0.75">ช้า (0.75x)</option>
                        <option value="1.0">ปกติ (1.0x)</option>
                        <option value="1.25">เร็ว (1.25x)</option>
                        <option value="1.5">เร็วมาก (1.5x)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">ระดับเสียง (Pitch):</label>
                      <select 
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs cursor-pointer"
                        value={pitch}
                        onChange={(e) => setPitch(e.target.value)}
                      >
                        <option value="-2.0">ทุ้มต่ำ</option>
                        <option value="0.0">ปกติ</option>
                        <option value="2.0">แหลมสูง</option>
                      </select>
                    </div>
                  </div>
                )}

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={selectedTool.placeholder}
                  className="w-full h-24 p-4 bg-slate-950 rounded-xl text-white border border-slate-800 focus:outline-none focus:border-emerald-500 text-sm placeholder:text-slate-600 resize-none"
                />
              </div>
            )}

            <button
              onClick={handleExecuteAI}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-lg">⏳</span> กำลังให้ AI ประมวลผล...
                </>
              ) : (
                <>
                  สั่งให้ AI เริ่มประมวลผล (ฟรี) 🚀
                </>
              )}
            </button>
          </div>
        )}

        {/* ส่วนแสดงผลลัพธ์ด้านล่าง */}
        {result && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-emerald-500/50 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <span>✨</span> กล่องที่ 2: ผลลัพธ์ ({result.toolName})
              </h3>
              
              {selectedTool.id !== 'tts' && (
                <button
                  onClick={() => handlePlayResultVoice(result.content)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  🔊 ฟังเสียงอ่านข้อความนี้
                </button>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-200 relative overflow-hidden space-y-3">
              <p className="whitespace-pre-line relative z-10">{result.content}</p>
              
              {/* ถ้ามีไฟล์เสียง (กรณีใช้งาน TTS) ให้แสดงเครื่องเล่นเสียงตรงนี้ทันที */}
              {audioSrc && (
                <div className="pt-2">
                  <audio controls className="w-full" src={audioSrc} autoPlay />
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs font-medium text-slate-300">เลือกรูปแบบไฟล์ดาวน์โหลด:</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {selectedTool.outputFormats.map((fmt: string) => (
                    <option key={fmt} value={fmt}>
                      {fmt.toUpperCase()} (ฉบับเต็มไร้ลายน้ำ)
                    </option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleDownloadResult}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                📥 ดาวน์โหลดฉบับเต็ม (ใช้ {selectedTool.cost} Coins)
              </button>
            </div>
          </div>
        )}

        {/* แบนเนอร์โฆษณา */}
        <AdBanner />

      </div>
    </div>
  );
}