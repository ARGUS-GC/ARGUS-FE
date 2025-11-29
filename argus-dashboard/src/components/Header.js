// components/Header.js
import React from 'react';

const Header = ({ systemStatus, activeAlerts }) => {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center">
        <h1 className="text-xl font-bold mr-4">Security Control Center</h1>
        <span className="flex items-center text-sm">
          <span className={`h-2 w-2 rounded-full mr-2 ${systemStatus === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          System {systemStatus}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {activeAlerts > 0 && (
          <button className="bg-red-900/50 text-red-300 px-3 py-1 rounded-md flex items-center text-sm font-semibold border border-red-800">
            ⚠️ {activeAlerts} Active Alerts
          </button>
        )}
         {/* 프로필 아이콘 등 추가 */}
        <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full mr-2"></div>
            <span>Operator</span>
        </div>
      </div>
    </header>
  );
};

export default Header;