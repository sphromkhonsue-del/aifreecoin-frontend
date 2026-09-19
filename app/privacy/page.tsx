import React from 'react';

const privacyPolicies = [
  {
    lang: "ภาษาไทย (Thai)",
    title: "นโยบายความเป็นส่วนตัว (Privacy Policy)",
    content: `
      1. การเก็บรวบรวมข้อมูล: เราเก็บรวบรวมข้อมูลเท่าที่จำเป็น เช่น อีเมล และประวัติการทำกิจกรรมภายในแพลตฟอร์มเพื่อการให้บริการ
      2. การใช้ข้อมูล: ข้อมูลทั้งหมดใช้เพื่อยืนยันตัวตน คำนวณเหรียญรางวัล และป้องกันการทุจริต เราไม่มีนโยบายจำหน่ายข้อมูลส่วนบุคคลของคุณ
      3. ความปลอดภัย: เราใช้ระบบรักษาความปลอดภัยฐานข้อมูลที่ได้มาตรฐานเพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต
      4. การติดต่อ: หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อผู้ดูแลระบบได้ผ่านช่องทางในแพลตฟอร์ม
    `
  },
  {
    lang: "English",
    title: "Privacy Policy",
    content: `
      1. Data Collection: We collect only necessary information, such as your email and platform activity history, to provide our services.
      2. Use of Information: All data is used for authentication, coin calculation, and fraud prevention. We never sell your personal data.
      3. Security: We use industry-standard database security measures to protect your information from unauthorized access.
      4. Contact: If you have any questions regarding our privacy policy, please contact administration through the platform.
    `
  },
  {
    lang: "中文 (Chinese)",
    title: "隐私政策",
    content: `
      1. 数据收集：我们仅收集提供服务所必需的信息，例如您的电子邮件和平台活动历史记录。
      2. 信息使用：所有数据均用于身份验证、金币计算和防止欺诈。我们绝不出售您的个人数据。
      3. 安全保障：我们采用行业标准的数据库安全措施来保护您的信息免受未经授权的访问。
      4. 联系方式：如果您对隐私政策有任何疑问，请通过平台联系管理员。
    `
  },
  {
    lang: "日本語 (Japanese)",
    title: "プライバシーポリシー",
    content: `
      1. データの収集：サービス提供のため、メールアドレスやプラットフォーム上の利用履歴などの必要な情報のみを収集します。
      2. 情報の利用：すべてのデータは、認証、コインの計算、不正防止のために使用されます。個人情報を販売することは一切ありません。
      3. セキュリティ：不正アクセスから情報を保護するため、業界標準のデータベースセキュリティ対策を講じています。
      4. お問い合わせ：プライバシーポリシーに関するご質問は、プラットフォームを通じて管理者にお問い合わせください。
    `
  },
  {
    lang: "Español (Spanish)",
    title: "Política de Privacidad",
    content: `
      1. Recopilación de Datos: Recopilamos solo la información necesaria, como su correo electrónico y historial de actividad, para prestar el servicio.
      2. Uso de la Información: Todos los datos se utilizan para autenticación, cálculo de monedas y prevención de fraude. Nunca vendemos sus datos personales.
      3. Seguridad: Utilizamos medidas de seguridad de bases de datos estándar de la industria para proteger su información.
      4. Contacto: Si tiene alguna pregunta sobre nuestra política de privacidad, comuníquese con la administración a través de la plataforma.
    `
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-400">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm">
            Please scroll down to read the policy in your preferred language. / กรุณาเลื่อนลงด้านล่างเพื่ออ่านนโยบายในภาษาของคุณ
          </p>
        </div>

        {privacyPolicies.map((item, index) => (
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