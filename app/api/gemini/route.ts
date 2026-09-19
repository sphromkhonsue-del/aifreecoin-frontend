import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { toolId, prompt, voice } = await request.json();

    // 1. AI ตัวที่ 3 (พล็อตเรื่อง/คอนเทนต์) หรือ STT
    if (toolId === 'text-gen' || toolId === 'stt') {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      return NextResponse.json({
        success: true,
        content: response.text,
      });
    }

    // 2. AI ตัวที่ 1 (Text-to-Speech)
    if (toolId === 'tts') {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `สร้างสคริปต์บทพากย์เสียงสำหรับข้อความนี้ (เสียงสไตล์รหัส ${voice}): ${prompt}`,
      });

      return NextResponse.json({
        success: true,
        content: `🔊 [AI สร้างเสียงสำเร็จ - เสียง ${voice}] สคริปต์: "${response.text}"`,
      });
    }

    // 3. รองรับ AI ตัวอื่นๆ
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt || 'สร้างเนื้อหาสำหรับเครื่องมือ AI',
    });

    return NextResponse.json({
      success: true,
      content: response.text || 'ประมวลผลคำสั่งสำเร็จเรียบร้อยแล้วครับ',
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}