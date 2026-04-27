import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'DocLevel - Aprende con video',
  description: 'Plataforma educativa con cursos en video de fiscal, contabilidad, innovación, marketing y tecnología.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="bg-background text-foreground min-h-screen antialiased">
        {children}
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  )
}
