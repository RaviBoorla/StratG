import type { Metadata } from 'next';
import './globals.css';
import { initDemoData } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Strat101.com - Enabling Transformation Journeys',
  description: 'SaaS Program Management Tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Initialize demo data once */}
        <script dangerouslySetInnerHTML={{ __html: `(${initDemoData.toString()})();` }} />
      </body>
    </html>
  );
}