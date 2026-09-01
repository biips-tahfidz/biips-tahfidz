import './globals.css';
import Header from './header';

export const metadata = {
  title: 'Setoran Hafalan Tahfidz BIIPS',
  description: 'Aplikasi Web Setoran Hafalan Tahfidz Statis dengan Supabase Database dan Supabase File Storage',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>

        <footer className="bg-slate-800 text-slate-400 py-6 border-t border-slate-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Aplikasi Setoran Tahfidz BIIPS. Powered by Next.js Static Export & Supabase Client.</p>
        </footer>
      </body>
    </html>
  );
}
