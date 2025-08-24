'use client';

import React from 'react';
import { NODE_DEFINITIONS } from '../../lib/node-definitions';
import { PBNodeType } from '../../types';
import { useFlowStore } from '../../lib/store/flow-store';
import { cn } from '../../lib/utils/cn';
import { 
  User, FileText, MessageSquare, Settings, Target, 
  GitBranch, Repeat, Type, Database, StickyNote,
  Search, ChevronDown, ChevronRight
} from 'lucide-react';

const iconMap = {
  User,
  FileText,
  MessageSquare,
  Settings,
  Target,
  GitBranch,
  Repeat,
  Type,
  Database,
  StickyNote
};

const nodeCategories = {
  basic: {
    name: '基础节点',
    nodes: ['persona', 'context', 'userInput', 'system', 'task'] as PBNodeType[]
  },
  control: {
    name: '控制流',
    nodes: ['ifElse', 'loop'] as PBNodeType[]
  },
  output: {
    name: '输出格式',
    nodes: ['format', 'structured'] as PBNodeType[]
  },
  utility: {
    name: '工具',
    nodes: ['note'] as PBNodeType[]
  }
};

export function NodeLibrary() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [collapsedCategories, setCollapsedCategories] = React.useState<Set<string>>(new Set());
  const addNode = useFlowStore(state => state.addNode);

  const handleDragStart = (e: React.DragEvent, nodeType: PBNodeType) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      position: { x: 0, y: 0 }
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = (nodeType: PBNodeType) => {
    // 在画布中心添加节点
    const position = { x: 400, y: 300 };
    addNode(nodeType, position);
  };

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const filteredCategories = Object.entries(nodeCategories).map(([key, category]) => {
    const filteredNodes = category.nodes.filter(nodeType => {
      const definition = NODE_DEFINITIONS[nodeType];
      return definition.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
             definition.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return { key, category, nodes: filteredNodes };
  }).filter(({ nodes }) => nodes.length > 0);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">节点库</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="搜索节点..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 节点列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCategories.map(({ key, category, nodes }) => (
          <div key={key} className="mb-4">
            <button
              onClick={() => toggleCategory(key)}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900 py-2"
            >
              <span>{category.name}</span>
              {collapsedCategories.has(key) ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {!collapsedCategories.has(key) && (
              <div className="space-y-2 mt-2">
                {nodes.map(nodeType => {
                  const definition = NODE_DEFINITIONS[nodeType];
                  const IconComponent = iconMap[definition.icon as keyof typeof iconMap];
                  
                  return (
                    <div
                      key={nodeType}
                      draggable
                      onDragStart={(e) => handleDragStart(e, nodeType)}
                      onClick={() => handleNodeClick(nodeType)}
                      className={cn(
                        "flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer",
                        "hover:border-blue-300 hover:bg-blue-50 transition-colors",
                        "group"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                        definition.color
                      )}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-blue-700">
                          {definition.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {definition.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
