export const metadata = {
  title: 'Auth Demo API',
  description: 'Backend Next.js + SQLite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
