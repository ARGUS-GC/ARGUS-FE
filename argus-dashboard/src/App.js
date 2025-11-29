// App.js
import React from 'react';
import { mockData } from './data';
import Header from './components/Header';
import FixedCCTVCard from './components/FixedCCTVCard';
import MobileRobotCard from './components/MobileRobotCard';
import ThermalDetectionPanel from './components/ThermalDetectionPanel';
import RobotCommandPanel from './components/RobotCommandPanel';
import RobotStatusPanel from './components/RobotStatusPanel';
import IncidentPhotoArchive from './components/IncidentPhotoArchive';

function App() {
  const data = mockData;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* 1. 헤더 */}
      <Header systemStatus={data.systemStatus} activeAlerts={data.activeAlerts} />

      {/* 메인 컨테이너 */}
      <main className="p-4 grid grid-cols-12 gap-4">
        
        {/* 왼쪽 컬럼 (CCTV) - 3칸 차지 */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          {data.cctvs.map(cctv => (
            <FixedCCTVCard key={cctv.id} data={cctv} />
          ))}
        </div>

        {/* 중앙 컬럼 (로봇 영상, 열감지) - 6칸 차지 */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
          <MobileRobotCard robotData={data.robot} />
          <ThermalDetectionPanel stats={data.thermalStats} />
        </div>

        {/* 오른쪽 컬럼 (명령, 상태) - 3칸 차지 */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <RobotCommandPanel robotData={data.robot} />
          <RobotStatusPanel robotData={data.robot} />
        </div>

        {/* 하단 로우 (아카이브) - 12칸 전체 차지 */}
        <div className="col-span-12 mt-4">
          <IncidentPhotoArchive incidents={data.incidents} />
        </div>

      </main>
    </div>
  );
}

export default App;