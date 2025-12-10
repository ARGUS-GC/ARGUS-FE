import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { mockData } from './data'; // 구조 유지를 위해 import는 두되, 실제 데이터로 덮어씌움
import Header from './components/Header';
import FixedCCTVCard from './components/FixedCCTVCard';
import MobileRobotCard from './components/MobileRobotCard';
import ThermalDetectionPanel from './components/ThermalDetectionPanel';
import RobotCommandPanel from './components/RobotCommandPanel';
import RobotStatusPanel from './components/RobotStatusPanel';
import IncidentPhotoArchive from './components/IncidentPhotoArchive';

//  AWS 서버 주소 
const API_BASE_URL = "http://43.202.245.190:8000";

function App() {
  // 1. 상태 관리
  const [systemStatus, setSystemStatus] = useState('LOADING'); // NORMAL, ALERT, ERROR, LOADING
  const [activeAlertCount, setActiveAlertCount] = useState(0);
  const [incidents, setIncidents] = useState([]);
  
  // 기기 데이터 상태 (초기값은 mockData 구조를 따름)
  const [cctvList, setCctvList] = useState(mockData.cctvs);
  const [robotInfo, setRobotInfo] = useState(mockData.robot);
  
  // 열화상 데이터는 아직 API가 없으므로 mock 유지 (필요시 추가)
  const thermalStats = mockData.thermalStats;

  // 2. 데이터 가져오기 (3초 주기 Polling)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- (1) 대시보드 통계 API 호출 ---
        // 반환값: { "active_alerts": 5, "system_status": "ONLINE" }
        const statsRes = await axios.get(`${API_BASE_URL}/api/v1/dashboard/stats`);
        setSystemStatus(statsRes.data.system_status === 'ONLINE' ? 'NORMAL' : 'ALERT');
        setActiveAlertCount(statsRes.data.active_alerts);

        // --- (2) 기기 상태 API 호출 ---
        // 반환값: [ { device_id, type, status, metrics: {...} }, ... ]
        const deviceRes = await axios.get(`${API_BASE_URL}/api/v1/devices`);
        const devices = deviceRes.data;

        // 2-1. CCTV 데이터 가공
        // 서버에서 CCTV 타입인 것만 필터링하거나, 기본 1번 카메라에 매핑
        const cctvFromServer = devices.filter(d => d.type === 'CCTV');
        
        // 만약 서버에 CCTV가 연결되어 있다면 그 정보를 쓰고, 아니면 기존 mock에 영상만 연결
        const updatedCctvs = cctvList.map((cctv, index) => {
          const serverDevice = cctvFromServer[index]; // 순서대로 매핑 (단순화)
          return {
            ...cctv,
            status: serverDevice ? serverDevice.calculated_status : 'Offline', // 1분 timeout 적용된 status
            // ✅ 핵심: 실시간 영상 스트리밍 주소 연결
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
            battery: robotFromServer.metrics?.battery || prev.battery, // metrics JSON 활용
            location: robotFromServer.metrics?.location || prev.location
          }));
        }

        // --- (3) 사고 기록(로그) API 호출 ---
        // 반환값: [ { id, event_type, created_at, image_path, ... }, ... ]
        const logRes = await axios.get(`${API_BASE_URL}/api/v1/logs?limit=10`);
        
        const formattedLogs = logRes.data.map(log => ({
          id: log.id,                  // DB의 PK (SERIAL)
          type: log.event_type,        // FIRE, INTRUDER, LONE_WORKER
          location: log.device_id,     // 감지한 기기 ID
          time: new Date(log.created_at).toLocaleString(), // 날짜 포맷팅
          // ✅ 이미지 다운로드 API 경로 연결
          img: `${API_BASE_URL}/api/v1/logs/${log.id}/image` 
        }));

        setIncidents(formattedLogs);
        console.log("✅ AWS 데이터 동기화 완료");

      } catch (error) {
        console.error("❌ 서버 연결 실패:", error);
        setSystemStatus('ERROR');
      }
    };

    // 최초 실행 및 주기적 실행
    fetchData();
    const interval = setInterval(fetchData, 3000); // 3초마다 갱신
    return () => clearInterval(interval);
  }, []); // 의존성 배열 비움 (Mount 시 1회 설정)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* 헤더: 실제 알림 개수 전달 */}
      <Header systemStatus={systemStatus} activeAlerts={activeAlertCount} />

      <main className="p-4 grid grid-cols-12 gap-4">
        {/* 왼쪽: CCTV (실시간 영상 포함) */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          {cctvList.map(cctv => (
            <FixedCCTVCard key={cctv.id} data={cctv} />
          ))}
        </div>

        {/* 중앙: 로봇/열화상 */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
          <MobileRobotCard robotData={robotInfo} />
          <ThermalDetectionPanel stats={thermalStats} />
        </div>

        {/* 오른쪽: 제어/상태 */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          {/* 로봇 제어 패널에 API Base URL 전달 (내부에서 axios post 할 수 있도록) */}
          <RobotCommandPanel robotData={robotInfo} apiUrl={API_BASE_URL} />
          <RobotStatusPanel robotData={robotInfo} />
        </div>

        {/* 하단: AWS 실제 사고 로그 */}
        <div className="col-span-12 mt-4">
          <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
            🚨 실시간 위험 감지 로그
            <span className="text-sm text-gray-500 font-normal">(Server: {API_BASE_URL})</span>
          </h2>
          {/* 데이터가 없을 경우 안내 메시지 */}
          {incidents.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded text-center text-gray-400">
              현재 감지된 위험 기록이 없습니다.
            </div>
          ) : (
            <IncidentPhotoArchive incidents={incidents} />
          )}
        </div>
      </main>

      {/* 에러 오버레이 */}
      {systemStatus === 'ERROR' && (
        <div className="fixed bottom-0 left-0 w-full bg-red-600/90 text-white text-center p-3 font-bold z-50 backdrop-blur-sm animate-pulse">
          ⚠️ 서버({API_BASE_URL})와 연결할 수 없습니다. AWS 인스턴스 실행 상태와 보안 그룹(8000포트)을 확인하세요.
        </div>
      )}
    </div>
  );
}

export default App;