import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { mockData } from './data'; 
import Header from './components/Header';
import FixedCCTVCard from './components/FixedCCTVCard';
import MobileRobotCard from './components/MobileRobotCard';
import ThermalDetectionPanel from './components/ThermalDetectionPanel';
import RobotCommandPanel from './components/RobotCommandPanel';
import RobotStatusPanel from './components/RobotStatusPanel';
import IncidentPhotoArchive from './components/IncidentPhotoArchive';

function App() {
  const [systemStatus, setSystemStatus] = useState(mockData.systemStatus);
  const [incidents, setIncidents] = useState([]); 
  
  const cctvs = mockData.cctvs;
  const thermalStats = mockData.thermalStats;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const awsIp = "http://43.202.245.190:8000";

        const logRes = await axios.get(`${awsIp}/api/logs`);
        const statusRes = await axios.get(`${awsIp}/api/status`);
        
        const formattedLogs = logRes.data.map(log => ({
          id: log.id,
          type: log.event_type, 
          location: 'Cam 01',   
          time: log.created_at,
          img: log.image_path || 'https://via.placeholder.com/150/FF0000/FFFFFF?text=DETECTED' 
        }));

        setIncidents(formattedLogs);
        setSystemStatus(statusRes.data.system_status);

      } catch (error) {
        console.error("❌ AWS 연결 실패:", error);
      }
    };

    fetchData(); 
    const interval = setInterval(fetchData, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header systemStatus={systemStatus} activeAlerts={incidents.length} />

      <main className="p-4 grid grid-cols-12 gap-4">
        
        {/* 왼쪽: 실시간 영상 + CCTV 목록 */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          
          {/* 👇 1. 실시간 영상 */}
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 shadow-lg">
            <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Cam 01
            </h3>
            <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
              <img 
                src="http://43.202.245.190:8000/video_feed" 
                alt="연결 대기중..." 
                className="w-full h-full object-contain"
                //onError={(e) => {e.target.style.display='none'}}
                onError={(e) => {console.log("영상 로딩 실패!");e.target.style.border = "5px solid red"; }}
              />
              <div className="absolute inset-0 flex items-center justify-center -z-10 text-gray-500 text-xs">
                <p>신호 없음</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400 flex justify-between">
              <span>상태: <span className="text-green-400">온라인</span></span>
              <span>화질: 720p</span>
            </div>
          </div>

          {/* 2. 나머지 가짜 CCTV 목록들 */}
          {cctvs.slice(1).map(cctv => (
            <FixedCCTVCard key={cctv.id} data={cctv} />
          ))}
        </div>

        {/* 중앙: 로봇 상태 카드 + 열화상 패널 */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
          {/* 원래 있던 로봇 카드로 복구! */}
          <MobileRobotCard robotData={mockData.robot} />
          <ThermalDetectionPanel stats={thermalStats} />
        </div>

        {/* 오른쪽: 제어/상태 */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <RobotCommandPanel robotData={mockData.robot} />
          <RobotStatusPanel robotData={mockData.robot} />
        </div>

        {/* 하단: 실시간 감지 로그 */}
        <div className="col-span-12 mt-4">
          <h2 className="text-xl font-bold mb-4 text-red-400">🚨 AWS 실시간 감지 로그 (Live)</h2>
          <IncidentPhotoArchive incidents={incidents} />
        </div>

      </main>
    </div>
  );
}

export default App;