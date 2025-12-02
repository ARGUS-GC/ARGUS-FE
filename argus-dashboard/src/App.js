import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
// mockData는 아직 API가 없는 로봇/CCTV용으로 남겨둠
import { mockData } from './data'; 
import Header from './components/Header';
import FixedCCTVCard from './components/FixedCCTVCard';
import MobileRobotCard from './components/MobileRobotCard';
import ThermalDetectionPanel from './components/ThermalDetectionPanel';
import RobotCommandPanel from './components/RobotCommandPanel';
import RobotStatusPanel from './components/RobotStatusPanel';
import IncidentPhotoArchive from './components/IncidentPhotoArchive';

function App() {
  // 1. 데이터 담을 그릇 (초기값은 비어있거나 가짜 데이터)
  const [systemStatus, setSystemStatus] = useState(mockData.systemStatus);
  const [incidents, setIncidents] = useState([]); 
  
  const cctvs = mockData.cctvs;
  const robotData = mockData.robot;
  const thermalStats = mockData.thermalStats;

  // 2. AWS 서버에서 데이터 가져오기 (3초마다 반복)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ★ 여기가 핵심! 선생님의 AWS 서버 주소 (FastAPI)
        const awsIp = "http://43.202.245.190:8000";

        // (1) 사고 기록 가져오기
        const logRes = await axios.get(`${awsIp}/api/logs`);
        
        // (2) 시스템 상태 가져오기
        const statusRes = await axios.get(`${awsIp}/api/status`);
        
        // 화면에 맞게 데이터 가공
        const formattedLogs = logRes.data.map(log => ({
          id: log.id,
          type: log.event_type, 
          location: 'Cam 01',   
          time: log.created_at,
          // 이미지가 없으면 빨간색 박스로 표시
          img: log.image_path || 'https://via.placeholder.com/150/FF0000/FFFFFF?text=DETECTED' 
        }));

        setIncidents(formattedLogs);
        setSystemStatus(statusRes.data.system_status);
        console.log("✅ AWS 데이터 수신 성공:", formattedLogs);

      } catch (error) {
        console.error("❌ AWS 연결 실패 (서버가 켜져 있는지 확인하세요!):", error);
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
        {/* 왼쪽: CCTV */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          {cctvs.map(cctv => (
            <FixedCCTVCard key={cctv.id} data={cctv} />
          ))}
        </div>

        {/* 중앙: 로봇/열화상 */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
          <MobileRobotCard robotData={robotData} />
          <ThermalDetectionPanel stats={thermalStats} />
        </div>

        {/* 오른쪽: 제어/상태 */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <RobotCommandPanel robotData={robotData} />
          <RobotStatusPanel robotData={robotData} />
        </div>

        {/* 하단: AWS 실제 데이터 표시 영역 */}
        <div className="col-span-12 mt-4">
          <h2 className="text-xl font-bold mb-4 text-red-400">🚨 AWS 실시간 감지 로그 (Live)</h2>
          <IncidentPhotoArchive incidents={incidents} />
        </div>

      </main>
    </div>
  );
}

export default App;