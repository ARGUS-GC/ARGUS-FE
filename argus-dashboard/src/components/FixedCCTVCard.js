// components/FixedCCTVCard.js
import React from 'react';
import Card from './Card';

const FixedCCTVCard = ({ data }) => {
  const isThermal = data.mode === 'thermal';

  return (
    <Card title={`📷 ${data.name}`}>
      <div className="relative bg-gray-900 h-48 rounded-lg overflow-hidden flex justify-center items-center border border-gray-700">
        
        {/* 비디오 플레이스홀더 (실제 구현 시 video 태그 사용) */}
        <div className={`absolute inset-0 ${isThermal ? 'bg-gradient-to-tr from-red-900 via-orange-800 to-yellow-900 opacity-80' : 'bg-black/50'}`}></div>
        <span className="text-gray-500 text-4xl z-10 opacity-50">📹</span>

        {/* 상태 배지 */}
        <div className="absolute top-2 left-2 flex gap-2">
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">● LIVE</span>
        </div>
        
        {/* 열화상 모드일 때 온도 표시 */}
        {isThermal && data.temp && (
             <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">
                {data.temp}°C
            </div>
        )}

         {/* 하단 뷰 모드 라벨 */}
        <div className="absolute bottom-2 left-2 bg-gray-900/80 text-gray-300 text-xs px-2 py-1 rounded">
            {isThermal ? 'Thermal View' : 'Live View'}
        </div>
      </div>
    </Card>
  );
};

export default FixedCCTVCard;