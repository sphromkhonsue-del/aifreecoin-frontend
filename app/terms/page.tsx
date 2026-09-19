import React from 'react';

const termsPolicies = [
  {
    lang: "ภาษาไทย (Thai)",
    title: "เงื่อนไขการให้บริการ (Terms of Service)",
    content: `
      1. การยอมรับเงื่อนไข: การเข้าใช้งานเว็บไซต์และระบบสะสมเหรียญนี้ ถือว่าท่านยอมรับและตกลงที่จะปฏิบัติตามเงื่อนไขการให้บริการทุกประการ
      2. กติการับเหรียญรางวัล: ผู้ใช้งานต้องปฏิบัติตามขั้นตอนการรับชมโฆษณา ห้ามใช้โปรแกรมอัตโนมัติ (Bot) หรือสคริปต์โกงในการปั๊มเหรียญโดยเด็ดขาด
      3. สิทธิ์การระงับบัญชี: หากตรวจพบการทุจริต ทางผู้ดูแลระบบมีสิทธิ์เด็ดขาดในการระงับบัญชีผู้ใช้งาน และริบเหรียญรางวัลทั้งหมดในระบบทันที
      4. การเปลี่ยนแปลงเงื่อนไข: ขอสงวนสิทธิ์ในการเปลี่ยนแปลง แก้ไข หรือปรับปรุงเงื่อนไขและอัตราผลตอบแทนได้ตลอดเวลาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
    `
  },
  {
    lang: "English",
    title: "Terms of Service",
    content: `
      1. Acceptance of Terms: By accessing this website and coin-reward system, you agree to comply with and be bound by these Terms of Service.
      2. Earning Rules: Users must follow the proper ad-viewing process. The use of bots, automated scripts, or fraudulent tools to farm coins is strictly prohibited.
      3. Account Suspension: If any fraudulent activity is detected, administrators reserve the right to suspend the user account and forfeit all accumulated coins immediately.
      4. Modifications: We reserve the right to modify these terms and reward rates at any time without prior notice.
    `
  },
  {
    lang: "中文 (Chinese)",
    title: "服务条款",
    content: `
      1. 接受条款：访问本网站及积分系统即表示您同意遵守并受本服务条款的约束。
      2. 收益规则：用户必须按照规定流程观看广告。严禁使用机器人、自动脚本或欺诈工具刷取金币。
      3. 账号冻结：如发现任何欺诈行为，管理员有权立即冻结用户账号并没收所有积分。
      4. 修改条款：我们保留随时修改本条款及奖励机制的权利，恕不另行通知。
    `
  },
  {
    lang: "日本語 (Japanese)",
    title: "利用規約",
    content: `
      1. 規約への同意：当ウェブサイトおよびコイン獲得システムを利用することにより、本利用規約に同意したものとみなされます。
      2. コイン獲得のルール：広告視聴の正しい手順に従う必要があります。ボットや自動スクリプト、不正ツールを使用してコインを稼ぐことは厳禁です。
      3. アカウント停止：不正行為が検出された場合、管理者はアカウントを停止し、すべてのコインを没収する権利を有します。
      4. 規約の変更：当社は事前の通知なしに、本規約および報酬レートをいつでも変更する権利を留保します。
    `
  },
  {
    lang: "Español (Spanish)",
    title: "Términos de Servicio",
    content: `
      1. Aceptación de Términos: Al acceder a este sitio web y al sistema de recompensas, acepta cumplir con estos Términos de Servicio.
      2. Reglas de Ganancias: Los usuarios deben seguir el proceso de visualización de anuncios. Está estrictamente prohibido el uso de bots o scripts para hacer trampa.
      3. Suspensión de Cuenta: Si se detecta actividad fraudulenta, los administradores se reservan el derecho de suspender la cuenta y confiscar todas las monedas.
      4. Modificaciones: Nos reservamos el derecho de modificar estos términos y tasas de recompensa en cualquier momento sin previo aviso.
    `
  }
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-400">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm">
            Please scroll down to read the terms in your preferred language. / กรุณาเลื่อนลงด้านล่างเพื่ออ่านเงื่อนไขในภาษาของคุณ
          </p>
        </div>

        {termsPolicies.map((item, index) => (
          <section key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-amber-200">{item.title}</h2>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-medium">
                {item.lang}
              </span>
            </div>
            <div className="text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {item.content}
            </div>
          </section>
        ))}

        <div className="text-center pt-6">
          <a href="/" className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-6 py-3 rounded-xl transition shadow-lg">
            กลับสู่หน้าหลัก / Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}