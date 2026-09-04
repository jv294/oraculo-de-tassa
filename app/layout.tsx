import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Oráculo de Tassa',
  description: 'Procurador mágico baseado em IA para Magic: The Gathering, recomendando cartas e combos.',
  keywords: ['MTG', 'Magic: The Gathering', 'Scryfall', 'Deckbuilder', 'AI'],
};

export const viewport: Viewport = {
  themeColor: '#0a0e1a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-thassa-900 min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-amber-500/30">
        {children}
      </body>
    </html>
  );
}
