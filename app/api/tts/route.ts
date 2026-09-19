import { NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { text, speakingRate, pitch, voice } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'กรุณาระบุข้อความที่ต้องการแปลงเป็นเสียง' }, { status: 400 });
    }

    // ค้นหาไฟล์ .json ที่ขึ้นต้นด้วย gen-lang หรือมีคำว่า client ในโฟลเดอร์โปรเจกต์โดยอัตโนมัติ
    const rootDir = process.cwd();
    const findJsonFile = (dir: string): string | null => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          // ข้ามโฟลเดอร์ node_modules และ .next เพื่อความเร็ว
          if (file !== 'node_modules' && file !== '.next') {
            const found = findJsonFile(fullPath);
            if (found) return found;
          }
        } else if (file.endsWith('.json') && (file.includes('gen-lang') || file.includes('client'))) {
          return fullPath;
        }
      }
      return null;
    };

    const keyPath = findJsonFile(rootDir);

    if (!keyPath) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์ Service Account JSON ในโปรเจกต์ กรุณาตรวจสอบตำแหน่งไฟล์ครับ' },
        { status: 500 }
      );
    }

    const ttsClient = new textToSpeech.TextToSpeechClient({
      keyFilename: keyPath,
    });

    let voiceName = 'th-TH-Neural2-C'; 
    if (voice === 'th-male-1') {
      voiceName = 'th-TH-Neural2-B';  
    } else if (voice === 'th-girl-1') {
      voiceName = 'th-TH-Neural2-F';  
    }

    const requestPayload = {
      input: { text: text },
      voice: {
        languageCode: 'th-TH',
        name: voiceName,
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        speakingRate: parseFloat(speakingRate) || 1.0,
        pitch: parseFloat(pitch) || 0.0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(requestPayload);

    return NextResponse.json({
      success: true,
      audioContent: response.audioContent ? Buffer.from(response.audioContent).toString('base64') : null,
    });

  } catch (error: any) {
    console.error('Google TTS API Error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google TTS' },
      { status: 500 }
    );
  }
}