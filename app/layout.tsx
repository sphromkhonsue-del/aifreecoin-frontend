import './globals.css';

export const metadata = {
  title: 'Ad Room',
  description: 'Watch ads and get rewards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}