
import React from 'react';
import { Link, useLocation } from 'wouter';

export const UnifiedNavigation = () => {
  const [location] = useLocation();
  
  const menuItems = [
    // TeleMed Original
    { path: '/', label: 'Home TeleMed', section: 'telemed' },
    { path: '/consulta', label: 'Video Consulta', section: 'telemed' },
    { path: '/consulta', label: 'Consulta Avançada', section: 'telemed' },
    
    // Health Connect
    { path: '/health-connect/patients', label: 'Pacientes HC', section: 'health-connect' },
    { path: '/health-connect/consultation', label: 'Consulta HC', section: 'health-connect' },
    { path: '/health-connect/exam-request', label: 'Exames HC', section: 'health-connect' },
  ];

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-4">TeleMed + Health Connect</h1>
        <div className="grid grid-cols-2 gap-4">
          
          <div>
            <h3 className="font-semibold mb-2">TeleMed Sistema</h3>
            {menuItems.filter(item => item.section === 'telemed').map(item => (
              <Link key={item.path} href={item.path}>
                <div className={`block p-2 rounded hover:bg-white/20 ${location === item.path ? 'bg-white/30' : ''}`}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Health Connect</h3>
            {menuItems.filter(item => item.section === 'health-connect').map(item => (
              <Link key={item.path} href={item.path}>
                <div className={`block p-2 rounded hover:bg-white/20 ${location === item.path ? 'bg-white/30' : ''}`}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
          
        </div>
      </div>
    </nav>
  );
};
