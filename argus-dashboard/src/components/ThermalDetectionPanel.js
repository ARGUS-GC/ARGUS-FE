import React from 'react';
import Card from './Card';

const ThermalDetectionPanel = ({ stats }) => {
  return (
    <Card title="🌡️ Thermal Detection Panel">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700 text-center">
            <div className="text-xs text-gray-400">Avg Temp</div>
            <div className="text-2xl font-bold text-green-400">{stats.avgTemp}°C</div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700 text-center">
            <div className="text-xs text-gray-400">Peak Temp</div>
            <div className="text-2xl font-bold text-orange-400">{stats.peakTemp}°C</div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700 text-center">
            <div className="text-xs text-gray-400">Alerts</div>
            <div className="text-2xl font-bold text-red-500">{stats.alertsCount}</div>
        </div>
      </div>

      <div className="space-y-2">
        {stats.alerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded border flex justify-between items-center ${alert.level === 'CRITICAL' || alert.level === 'HIGH' ? 'bg-red-900/20 border-red-800' : 'bg-yellow-900/20 border-yellow-800'}`}>
                <div>
                    <div className={`text-sm font-bold ${alert.level === 'CRITICAL' || alert.level === 'HIGH' ? 'text-red-400' : 'text-yellow-400'}`}>
                        🔥 {alert.title}
                    </div>
                    <div className="text-xs text-gray-400">{alert.desc}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold ${alert.level === 'CRITICAL' || alert.level === 'HIGH' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-black'}`}>
                    {alert.level}
                </span>
            </div>
        ))}
        {stats.alerts.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">No Active Thermal Alerts</div>
        )}
      </div>
    </Card>
  );
};

export default ThermalDetectionPanel;