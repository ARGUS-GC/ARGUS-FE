import React from 'react';
import Card from './Card';

const IncidentPhotoArchive = ({ incidents }) => {
  return (
    <Card title="📂 Incident Photo Archive">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
            <select className="bg-gray-900 border border-gray-700 text-xs text-gray-300 rounded px-2 py-1">
                <option>All Cameras</option>
            </select>
            <select className="bg-gray-900 border border-gray-700 text-xs text-gray-300 rounded px-2 py-1">
                <option>All Hazards</option>
            </select>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 rounded font-bold">
            ⬇ Export Log
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-x-auto pb-2">
        {incidents.map(inc => (
            <div key={inc.id} className="bg-gray-900 rounded border border-gray-700 overflow-hidden group hover:border-blue-500 transition cursor-pointer">
                {/* 썸네일 영역 */}
                <div className="h-24 bg-gray-800 relative flex items-center justify-center">
                    {/* 색상 띠 */}
                    <div className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white rounded bg-${inc.color}-600`}>
                        {inc.type}
                    </div>
                    <span className="text-4xl opacity-50">
                        {inc.type === 'FIRE' ? '🔥' : inc.type === 'INTRUSION' ? '🕵️' : '⚠️'}
                    </span>
                </div>
                {/* 텍스트 정보 */}
                <div className="p-2">
                    <div className="text-xs text-gray-500 mb-1">{inc.time} | {inc.source}</div>
                    <div className={`text-xs font-bold text-${inc.color}-400 truncate`}>{inc.desc}</div>
                </div>
            </div>
        ))}
      </div>
    </Card>
  );
};

export default IncidentPhotoArchive;