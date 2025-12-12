import React from 'react';
import Card from './Card';

const IncidentPhotoArchive = ({ incidents }) => {

  // 위험 유형에 따라 뱃지 색상을 반환하는 함수
  const getBadgeStyle = (typeString) => {
    // App.js에서 변환한 한글 텍스트 혹은 영문 코드를 모두 체크
    if (typeString.includes("화재") || typeString.includes("FIRE") || typeString.includes("침입")) {
      return "bg-red-600 text-white"; // 긴급 (빨강)
    }
    if (typeString.includes("단독") || typeString.includes("LONE")) {
      return "bg-orange-500 text-white"; // 경고 (주황)
    }
    if (typeString.includes("헬멧") || typeString.includes("HELMET") || typeString.includes("NO_HELMET")) {
      return "bg-yellow-600 text-white"; // 주의 (진한 노랑)
    }
    return "bg-gray-600 text-gray-200"; // 기타 (회색)
  };

  return (
    <Card title="📂 Incident Photo Archive">
      {/* 상단 필터 및 버튼 영역 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
            <select className="bg-gray-900 border border-gray-700 text-xs text-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500">
                <option>All Cameras</option>
                <option>Main CCTV</option>
                <option>Robot Cam</option>
            </select>
            <select className="bg-gray-900 border border-gray-700 text-xs text-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500">
                <option>All Hazards</option>
                <option>Fire</option>
                <option>Lone Worker</option>
                <option>PPE Violation</option>
            </select>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 rounded font-bold transition-colors">
            ⬇ Export Log
        </button>
      </div>

      {/* 썸네일 그리드 영역 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-2">
        {incidents.map((inc) => (
            <div 
                key={inc.id} 
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden group hover:border-blue-500 transition-all cursor-pointer shadow-lg"
            >
                {/* 썸네일 영역 */}
                <div className="h-28 bg-black relative flex items-center justify-center overflow-hidden">
                    <img 
                        src={inc.img} 
                        alt={inc.type} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://via.placeholder.com/150/1f2937/4b5563?text=No+Image"; // 이미지 로드 실패 시 대체 이미지
                        }}
                    />

                    {/* 위험 유형 라벨 (동적 색상 적용) */}
                    <div className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold rounded shadow-md ${getBadgeStyle(inc.type)}`}>
                        {inc.type}
                    </div>
                </div>
                
                {/* 텍스트 정보 */}
                <div className="p-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400">{inc.time.split(' ')[1]}</span> {/* 시간만 표시 */}
                        <span className="text-[10px] text-gray-500 bg-gray-900 px-1 rounded">{inc.location}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-200 truncate" title={inc.type}>
                        {inc.type}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </Card>
  );
};

export default IncidentPhotoArchive;