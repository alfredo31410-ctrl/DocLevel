import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'DocLevel - Cursos médicos impartidos por especialistas',
  description: 'Plataforma de educación médica digital con cursos impartidos por doctores especialistas para profesionales de la salud.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);' }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
