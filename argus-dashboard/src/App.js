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

// ⚠️ 백엔드 서버 IP (로컬이면 localhost, AWS면 해당 IP)
// const API_BASE_URL = "http://43.202.245.190:8000";
const API_BASE_URL = "http://localhost:8000";

function App() {
  // 1. 상태 관리
  const [systemStatus, setSystemStatus] = useState('LOADING'); 
  const [activeAlertCount, setActiveAlertCount] = useState(0);
  const [incidents, setIncidents] = useState([]);
  
  const [cctvList, setCctvList] = useState(mockData.cctvs);
  const [robotInfo, setRobotInfo] = useState(mockData.robot);
  
  const thermalStats = mockData.thermalStats;

  // 2. 데이터 가져오기 (3초 주기 Polling)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- (1) 대시보드 통계 API 호출 ---
        const statsRes = await axios.get(`${API_BASE_URL}/api/v1/dashboard/stats`);
        // statsRes 호출이 성공했다는 건 서버가 살아있다는 뜻
        setSystemStatus('NORMAL'); 
        setActiveAlertCount(statsRes.data.active_alerts);

        // --- (2) 기기 상태 API 호출 ---
        const deviceRes = await axios.get(`${API_BASE_URL}/api/v1/devices`);
        const devices = deviceRes.data;

        // 2-1. CCTV 데이터 가공 
        const updatedCctvs = cctvList.map((cctv) => {
          return {
            ...cctv,
            // RTSP는 서버가 직접 수신하므로, 시스템이 정상이면 카메라도 Live로 간주
            status: statsRes.data.system_status === 'ONLINE' ? 'Live Monitoring' : 'Connecting', 
            // 실시간 영상 스트리밍 주소 (백엔드 RTSP 중계)
            videoUrl: `${API_BASE_URL}/video_feed` 
          };
        });
        setCctvList(updatedCctvs);

        // 2-2. 로봇 데이터 가공
        const robotFromServer = devices.find(d => d.type === 'ROBOT');
        if (robotFromServer) {
          setRobotInfo(prev => ({
            ...prev,
            status: robotFromServer.calculated_status === 'ONLINE' ? 'Active' : 'Offline',
            battery: robotFromServer.metrics?.battery || prev.battery,
            location: robotFromServer.metrics?.location || prev.location
          }));
        }

        // --- (3) 사고 기록(로그) 데이터 가공 ---
        const logRes = await axios.get(`${API_BASE_URL}/api/v1/logs?limit=10`);
        
        const formattedLogs = logRes.data.map(log => {
          let displayType = "알 수 없는 위험";
          let severity = "High"; 

          if (log.event_type === "FIRE") {
            displayType = "🔥 화재 감지";
          } else if (log.event_type === "NO_HELMET") {
            displayType = "👷 헬멧 미착용";
            severity = "Medium"; 
          } else if (log.event_type.includes("LONE_WORKER")) {
            const zoneNum = log.event_type.split('_').pop(); 
            displayType = `⚠️ 나홀로 작업 (구역 ${zoneNum})`;
          } else if (log.event_type === "INTRUDER") {
            displayType = "🏃 침입자 감지";
          } else {
             displayType = log.event_type; 
          }

          return {
            id: log.id,
            type: displayType,          
            rawType: log.event_type,    
            location: log.device_id === "SERVER_AI" ? "Main CCTV" : log.device_id,
            time: new Date(log.created_at).toLocaleString('ko-KR'), 
            img: `${API_BASE_URL}/api/v1/logs/${log.id}/image`,
            severity: severity
          };
        });

        setIncidents(formattedLogs);

      } catch (error) {
        console.error("❌ 서버 연결 실패:", error);
        setSystemStatus('ERROR');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // 3초마다 갱신
    return () => clearInterval(interval);
  }, [cctvList]); 

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header systemStatus={systemStatus} activeAlerts={activeAlertCount} />

      <main className="p-4 grid grid-cols-12 gap-4">
        {/* CCTV 영역 */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          {cctvList.map(cctv => (
            <FixedCCTVCard key={cctv.id} data={cctv} />
          ))}
        </div>

        {/* 중앙 모니터링 영역 */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
          <MobileRobotCard robotData={robotInfo} />
          <ThermalDetectionPanel stats={thermalStats} />
        </div>

        {/* 제어 영역 */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <RobotCommandPanel robotData={robotInfo} apiUrl={API_BASE_URL} />
          <RobotStatusPanel robotData={robotInfo} />
        </div>

        {/* 로그 아카이브 영역 */}
        <div className="col-span-12 mt-4">
          <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
            🚨 실시간 통합 관제 로그
            <span className="text-sm text-gray-500 font-normal">
              (Source: RTSP Stream @ {API_BASE_URL})
            </span>
          </h2>
          
          {incidents.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded text-center text-gray-400 border border-gray-700">
              <p>현재 감지된 위험 요소가 없습니다.</p>
              <p className="text-xs text-gray-600 mt-2">화재, 안전모 착용, 작업 구역 모니터링 중...</p>
            </div>
          ) : (
            <IncidentPhotoArchive incidents={incidents} />
          )}
        </div>
      </main>

      {/* 에러 모달 */}
      {systemStatus === 'ERROR' && (
        <div className="fixed bottom-0 left-0 w-full bg-red-600/90 text-white text-center p-3 font-bold z-50 backdrop-blur-sm animate-pulse">
          ⚠️ 서버 연결 끊김: {API_BASE_URL} 확인 필요
        </div>
      )}
    </div>
  );
}

export default App;