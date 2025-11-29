import React from 'react';
import Card from './Card';

const RobotStatusPanel = ({ robotData }) => {
  return (
    <Card title="ℹ️ Robot Status">
      <div className="space-y-4">
        {/* Battery */}
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Battery</span>
                <span className={robotData.battery < 20 ? 'text-red-500' : 'text-green-400'}>{robotData.battery}%</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${robotData.battery < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${robotData.battery}%` }}
                ></div>
            </div>
        </div>

        {/* Details List */}
        <div className="bg-gray-900/50 rounded p-3 text-sm space-y-2 border border-gray-700">
            <div className="flex justify-between">
                <span className="text-gray-400">State</span>
                <span className="text-blue-300">{robotData.status}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Speed</span>
                <span>{robotData.speed}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Location</span>
                <span className="text-right truncate ml-4">{robotData.location}</span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                <span className="text-gray-500">Last Update</span>
                <span className="text-gray-400">{robotData.lastUpdate}</span>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default RobotStatusPanel;