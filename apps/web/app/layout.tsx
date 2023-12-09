import './globals.css';
import SideBar from './sideBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex h-screen w-full flex-row">
          {/* @ts-expect-error Server Component */}
          <SideBar />
          {children}
        </main>
      </body>
    </html>
  );
}
