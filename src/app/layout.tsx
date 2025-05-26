import type { Metadata } from 'next';
import './globals.css';
import ShowcaseNav from './components/ShowcaseNav';

export const metadata: Metadata = {
  title: 'Wallet Survey Frames',
  description: 'Interactive surveys for wallet users via Farcaster Frames',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ShowcaseNav />
        {children}
      </body>
    </html>
  );
}
