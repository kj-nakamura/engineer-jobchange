import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'エンジニア転職支援サイト',
  description: 'エンジニア向けの転職支援サイト。最適な転職サービスを推薦します。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}