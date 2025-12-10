// components/RobotCommandPanel.js
import React, { useState } from 'react';
import axios from 'axios';
import Card from './Card';

const RobotCommandPanel = ({ robotData, apiUrl }) => {
  // 사용자가 선택한 작업과 목표 지점 상태 관리
  const [selectedTask, setSelectedTask] = useState('Patrol');
  const [targetLocation, setTargetLocation] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendCommand = async () => {
    if (!apiUrl) {
      alert("⚠️ 서버 URL이 설정되지 않았습니다.");
      return;
    }

    setIsSending(true);
    try {
      // API 명세서에 맞춘 페이로드
      const payload = {
        command: selectedTask === 'Patrol' ? 'start_patrol' : 'return_home', // 서버가 이해하는 명령어로 변환
        target_zone: targetLocation || "Zone A" // 비어있으면 기본값
      };

      // 4.1 로봇 명령 전송 API 호출
      await axios.post(`${apiUrl}/api/v1/robot/command`, payload);
      
      alert(`✅ 명령 전송 성공!\nTask: ${selectedTask}\nTarget: ${payload.target_zone}`);
      setTargetLocation(''); // 입력창 초기화

    } catch (error) {
      console.error("명령 전송 실패:", error);
      alert("❌ 명령 전송에 실패했습니다. 서버 상태를 확인하세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card title="📝 Robot Task Command">
      <div className="flex flex-col gap-3">
        <div>
            <label className="text-sm text-gray-400 block mb-1">Select Task</label>
            <select 
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
                <option value="Patrol">Patrol (순찰)</option>
                <option value="Return Home">Return Home (복귀)</option>
            </select>
        </div>
        <div>
            <label className="text-sm text-gray-400 block mb-1">Target Location (Optional)</label>
             <input 
               type="text" 
               placeholder="e.g., Zone C" 
               className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
               value={targetLocation}
               onChange={(e) => setTargetLocation(e.target.value)}
             />
        </div>
        
        <button 
          onClick={handleSendCommand}
          disabled={isSending}
          className={`py-2 rounded-md font-semibold transition mt-2 flex justify-center items-center text-white
            ${isSending ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
          `}
        >
            {isSending ? '⏳ Sending...' : '🚀 Send Task'}
        </button>

        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Current Task</span>
                <span className="text-green-400">In Progress</span>
            </div>
            {/* robotData가 없을 경우를 대비한 안전 처리 */}
            <div className="font-semibold mb-2">{robotData?.currentTask || "Idle"}</div>
            
            {/* 프로그레스 바 */}
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full transition-all duration-500" 
                  style={{ width: `${robotData?.progress || 0}%` }}
                ></div>
            </div>
            <div className="text-xs text-right text-gray-400 mt-1">{robotData?.progress || 0}% Complete</div>
        </div>
      </div>
    </Card>
  );
};

export default RobotCommandPanel;