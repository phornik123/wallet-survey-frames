'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ShowcaseNav() {
  const pathname = usePathname();
  
  if (!pathname?.startsWith('/showcase')) return null;
  
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center space-x-6">
          <Link href="/showcase" className="font-bold text-lg text-gray-900 hover:text-blue-600">
            Wallet Survey Showcase
          </Link>
          <Link href="/showcase/demo-react" 
                className={`hover:text-blue-600 transition-colors ${pathname === '/showcase/demo-react' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
            React Demo
          </Link>
          <Link href="/showcase/demo-frame"
                className={`hover:text-purple-600 transition-colors ${pathname === '/showcase/demo-frame' ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
            Frame Demo
          </Link>
          <Link href="/showcase/comparison"
                className={`hover:text-gray-800 transition-colors ${pathname === '/showcase/comparison' ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>
            Comparison
          </Link>
        </div>
      </div>
    </nav>
  );
}
