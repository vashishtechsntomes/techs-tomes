'use client';

import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const Header = ({ collapsed, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-16 px-4 flex items-center justify-between border-b bg-background sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Button
          onClick={onToggleSidebar}
          size="icon"
          variant="secondary"
          className="transition h-10 w-10"
        >
          <Menu className="!h-6 !w-6 md:hidden" />
          {collapsed ? (
            <ChevronRight className="!h-6 !w-6 hidden md:block" />
          ) : (
            <ChevronLeft className="!h-6 !w-6 hidden md:block" />
          )}
        </Button>
        
        <h1 className="text-lg font-semibold md:hidden">Dashboard</h1>
      </div>
      
      <ModeToggle />
    </header>
  );
};

export default Header;