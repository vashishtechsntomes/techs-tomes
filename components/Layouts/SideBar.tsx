'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, X } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/button';
import { BarChart3 } from "lucide-react";

const links = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar = ({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden',
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        onClick={onCloseMobile}
      />

      {/* Mobile Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b">
          <span className="font-bold">Tech&Tomes</span>
          <Button 
            onClick={onCloseMobile}
            size="icon"
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onCloseMobile}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-md transition-colors border-2',
                  isActive
                    ? 'bg-secondary border-secondary text-white dark:text-black'
                    : 'text-gray-600 hover:bg-primary hover:text-white hover:border-primary border-transparent'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Sidebar - Fixed */}
      <aside
        className={clsx(
          'hidden md:block bg-background border-r transition-all duration-300 fixed left-0 top-0 z-30 h-full',
          collapsed ? 'w-20' : 'w-52'
        )}
      >
        <div className="h-16 flex items-center justify-center border-b shrink-0">
          {!collapsed && <span className="font-bold">Tech&Tomes</span>}
        </div>
        <nav className="flex flex-col p-4 gap-2 flex-1">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-3 transition-colors border-2 rounded-md',
                  isActive
                    ? 'bg-secondary border-secondary text-white dark:text-black'
                    : 'text-gray-600 hover:bg-primary hover:text-white hover:border-primary border-transparent',
                  collapsed ? 'justify-center px-2.5 py-2.5' : 'px-4 py-3'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;