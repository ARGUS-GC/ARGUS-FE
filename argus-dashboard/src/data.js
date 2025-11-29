// ----------------------------------------------------------------------
// 1. [DB Mock] 실제 데이터베이스(device_status)에 저장된 형태라고 가정
// ----------------------------------------------------------------------
const rawDeviceStatus = [
    {
      device_id: 'cctv_01',
      type: 'CCTV',
      status: 'ONLINE',
      last_heartbeat: '2025-11-29 14:30:00',
      metrics: {
        location_label: 'Zone A - Entrance',
        temperature: 24.5,
        mode: 'normal', // CCTV 모드
        ip: '192.168.0.101'
      }
    },
    {
      device_id: 'cctv_02',
      type: 'CCTV',
      status: 'ONLINE',
      last_heartbeat: '2025-11-29 14:29:55',
      metrics: {
        location_label: 'Zone B - Server Room',
        temperature: 38.2, // 약간 높음
        mode: 'thermal', // 열화상 모드
        ip: '192.168.0.102'
      }
    },
    {
      device_id: 'robot_t1',
      type: 'ROBOT',
      status: 'ONLINE', // 또는 'PATROLLING'
      last_heartbeat: '2025-11-29 14:30:05',
      metrics: {
        battery_level: 82,
        current_location: { x: 12, y: 45, label: 'Zone C - Corridor' },
        speed: 1.2, // m/s
        heading: 'North',
        current_task: 'Patrol Route A'
      }
    }
  ];
  
  // ----------------------------------------------------------------------
  // 2. [DB Mock] 실제 데이터베이스(safety_logs)에 저장된 형태라고 가정
  // ----------------------------------------------------------------------
  const rawSafetyLogs = [
    {
      id: 101,
      device_id: 'cctv_02',
      source_type: 'CCTV',
      event_type: 'FIRE',
      image_path: '/images/snapshot_fire_01.jpg', // 실제론 URL이나 base64
      created_at: '2025-11-29 14:15:22',
      detail_info: {
        severity: 'HIGH',
        detected_temp: 85,
        confidence: 0.98,
        location: 'Zone B'
      }
    },
    {
      id: 102,
      device_id: 'robot_t1',
      source_type: 'ROBOT',
      event_type: 'HELMET_OFF',
      image_path: '/images/snapshot_helmet_02.jpg',
      created_at: '2025-11-29 13:40:10',
      detail_info: {
        severity: 'WARNING',
        person_count: 1,
        location: 'Zone C'
      }
    },
    {
      id: 103,
      device_id: 'cctv_01',
      source_type: 'CCTV',
      event_type: 'INTRUSION',
      image_path: '/images/snapshot_int_03.jpg',
      created_at: '2025-11-29 12:05:00',
      detail_info: {
        severity: 'CRITICAL',
        zone_id: 'Restricted Area 1'
      }
    },
    {
      id: 104,
      device_id: 'robot_t1',
      source_type: 'ROBOT',
      event_type: 'FALL',
      image_path: '/images/snapshot_fall_04.jpg',
      created_at: '2025-11-29 11:20:30',
      detail_info: {
        severity: 'HIGH',
        status: 'Check Required'
      }
    }
  ];
  
  // ----------------------------------------------------------------------
  // 3. UI 컴포넌트용 데이터 변환 (Mapping)
  //    DB의 Raw Data를 React 컴포넌트가 사용하기 편한 형태로 가공합니다.
  // ----------------------------------------------------------------------
  
  // 로봇 데이터 추출
  const robotDevice = rawDeviceStatus.find(d => d.type === 'ROBOT');
  const robotData = {
    status: robotDevice.metrics.current_task || 'Idle', // metrics 내부 task 사용
    battery: robotDevice.metrics.battery_level,
    speed: `${robotDevice.metrics.speed} m/s`,
    location: robotDevice.metrics.current_location.label,
    direction: robotDevice.metrics.heading,
    lastUpdate: 'Just now', // last_heartbeat 기반으로 계산 가능
    currentTask: robotDevice.metrics.current_task,
    progress: 75 // 예시값 (DB에 없다면 계산 필요)
  };
  
  // CCTV 리스트 추출
  const cctvList = rawDeviceStatus
    .filter(d => d.type === 'CCTV')
    .map(cctv => ({
      id: cctv.device_id, // device_id 사용
      name: `Fixed ${cctv.device_id.toUpperCase()}`,
      status: cctv.status === 'ONLINE' ? 'live' : 'offline',
      temp: cctv.metrics.temperature, // metrics 내부 값 사용
      mode: cctv.metrics.mode,
      location: cctv.metrics.location_label
    }));
  
  // 사고 기록(Incidents) 추출
  const incidentsList = rawSafetyLogs.map(log => ({
    id: log.id,
    type: log.event_type, // FIRE, FALL 등
    source: log.device_id,
    time: log.created_at.split(' ')[1], // 시간만 표시
    desc: `${log.detail_info.severity} Alert @ ${log.detail_info.location || 'Unknown'}`,
    // 심각도에 따른 색상 매핑
    color: log.detail_info.severity === 'HIGH' || log.detail_info.severity === 'CRITICAL' ? 'red' : 
           log.event_type === 'HELMET_OFF' ? 'purple' : 'yellow'
  }));
  
  // 통계 데이터 (가공 예시)
  const activeAlertsCount = rawSafetyLogs.filter(
    log => log.detail_info.severity === 'HIGH' || log.detail_info.severity === 'CRITICAL'
  ).length;
  
  const thermalStatsData = {
    avgTemp: 26, // 실제론 센서 평균 계산
    peakTemp: 85, // 로그 중 최고 온도
    alertsCount: activeAlertsCount,
    alerts: rawSafetyLogs
      .filter(log => log.event_type === 'FIRE' || log.detail_info.severity === 'HIGH')
      .map(log => ({
        id: log.id,
        level: log.detail_info.severity,
        title: `${log.event_type} DETECTED`,
        desc: `Source: ${log.device_id} | ${log.created_at}`
      }))
  };
  
  
  // ----------------------------------------------------------------------
  // 4. 최종 Export
  // ----------------------------------------------------------------------
  export const mockData = {
    systemStatus: 'Online',
    activeAlerts: activeAlertsCount,
    cctvs: cctvList,
    robot: robotData,
    thermalStats: thermalStatsData,
    incidents: incidentsList
  };