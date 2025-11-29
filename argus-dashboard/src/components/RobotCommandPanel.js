// components/RobotCommandPanel.js
import React from 'react';
import Card from './Card';

const RobotCommandPanel = ({ robotData }) => {
  return (
    <Card title="📝 Robot Task Command">
      <div className="flex flex-col gap-3">
        <div>
            <label className="text-sm text-gray-400 block mb-1">Select Task</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500">
                <option>Patrol</option>
                <option>Return Home</option>
            </select>
        </div>
        <div>
            <label className="text-sm text-gray-400 block mb-1">Target Location (Optional)</label>
             <input type="text" placeholder="e.g., Zone C" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500" />
        </div>
        
        <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition mt-2 flex justify-center items-center">
            🚀 Send Task
        </button>

        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Current Task</span>
                <span className="text-green-400">In Progress</span>
            </div>
            <div className="font-semibold mb-2">{robotData.currentTask}</div>
            {/* 프로그레스 바 */}
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${robotData.progress}%` }}></div>
            </div>
            <div className="text-xs text-right text-gray-400 mt-1">{robotData.progress}% Complete</div>
        </div>
      </div>
    </Card>
  );
};

export default RobotCommandPanel;