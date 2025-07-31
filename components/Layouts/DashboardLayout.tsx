'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './SideBar';
import clsx from 'clsx';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true); 
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', mobileOpen);
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileOpen]);

  const handleToggleSidebar = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div 
        className={clsx(
          "min-h-screen transition-all duration-300",
          "ml-0 md:ml-20",
          !collapsed && "md:ml-52"
        )}
      >
        <Header collapsed={collapsed} onToggleSidebar={handleToggleSidebar} />
        
        <main className="p-4">
          <div className="bg-background p-4 rounded-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;