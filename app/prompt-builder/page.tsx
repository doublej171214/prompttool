'use client';

import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { NodeLibrary } from '../components/panels/node-library';
import { FlowCanvas } from '../components/canvas/flow-canvas';
import { PropertiesPanel } from '../components/panels/properties-panel';
import { PreviewPanel } from '../components/panels/preview-panel';
import { useFlowStore } from '../lib/store/flow-store';
import { Sparkles, Zap, BookOpen } from 'lucide-react';

export default function PromptBuilderPage() {
  const { doc, updateDoc } = useFlowStore();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDoc({ name: e.target.value });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">PromptBuilder</h1>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={doc.name}
                onChange={handleNameChange}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="项目名称"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
              <Sparkles className="h-4 w-4" />
              AI Fill
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              <BookOpen className="h-4 w-4" />
              帮助
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧节点库 */}
        <NodeLibrary />
        
        {/* 中央画布区域 */}
        <div className="flex-1 flex flex-col">
          <ReactFlowProvider>
            <div className="flex-1 relative">
              <FlowCanvas />
            </div>
          </ReactFlowProvider>
          
          {/* 底部预览面板 */}
          <PreviewPanel />
        </div>
        
        {/* 右侧属性面板 */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
