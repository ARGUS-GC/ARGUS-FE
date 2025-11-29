import React from 'react';
import Card from './Card';

const MobileRobotCard = ({ robotData }) => {
  return (
    <Card title="🤖 Mobile Robot View" className="h-full">
      <div className="relative bg-gray-900 aspect-video rounded-lg overflow-hidden flex justify-center items-center border border-gray-700">
        
        {/* 카메라 화면 (가상) */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black opacity-60"></div>
        <div className="z-10 text-gray-600 text-6xl">🤖</div>

        {/* 오버레이 정보 */}
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse mr-2">● LIVE</span>
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">{robotData.status}</span>
        </div>

        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded border border-gray-600">
            🧭 Direction: <span className="text-blue-400">{robotData.direction}</span>
          </div>
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded border border-gray-600">
            📍 {robotData.location}
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
            <button className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded border border-gray-600">
                Switch Camera Mode
            </button>
        </div>
      </div>
    </Card>
  );
};

export default MobileRobotCard;