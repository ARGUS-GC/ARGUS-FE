// components/FixedCCTVCard.js
import React from 'react';
import Card from './Card';

const FixedCCTVCard = ({ data }) => {
  const isThermal = data.mode === 'thermal';

  return (
    <Card title={`📷 ${data.name}`}>
      <div className="relative bg-gray-900 h-48 rounded-lg overflow-hidden flex justify-center items-center border border-gray-700">
        
        {/*실제 구현 위해 video tag 사용 */}
        {data.videoUrl ? (
          <img 
            src={data.videoUrl} 
            alt={data.name}
            className="w-full h-full object-contain bg-black" // 영상 비율 유지, 배경 검정
            onError={(e) => {
              // 이미지 로딩 실패 시 숨김 처리
              e.target.style.display = 'none'; 
            }}
          />
        ) : (
          // 영상 주소가 없을 때 보여줄 배경
          <div className={`absolute inset-0 ${isThermal ? 'bg-gradient-to-tr from-red-900 via-orange-800 to-yellow-900 opacity-80' : 'bg-black/50'}`}></div>
        )}

        {/* 아이콘: 영상이 없거나, 영상 로딩이 실패해서 videoUrl은 있지만 이미지가 안 보일 때를 대비해 z-index 낮춰서 뒤에 깔아둠 */}
        <span className="text-gray-500 text-4xl z-0 opacity-50 absolute">📹</span>

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