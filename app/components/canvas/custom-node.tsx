'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NODE_DEFINITIONS } from '../../lib/node-definitions';
import { cn } from '../../lib/utils/cn';
import { 
  User, FileText, MessageSquare, Settings, Target, 
  GitBranch, Repeat, Type, Database, StickyNote
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

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const definition = NODE_DEFINITIONS[data.type];
  if (!definition) return null;

  const IconComponent = iconMap[definition.icon as keyof typeof iconMap];

  return (
    <div
      className={cn(
        "bg-white border-2 rounded-lg shadow-lg p-4 min-w-[200px]",
        selected ? "border-blue-500 shadow-blue-200" : "border-gray-200",
        "hover:shadow-xl transition-all duration-200"
      )}
    >
      {/* 输入连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />

      {/* 节点头部 */}
      <div className="flex items-center mb-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
          definition.color
        )}>
          <IconComponent className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="font-semibold text-sm text-gray-900">
            {definition.label}
          </div>
          <div className="text-xs text-gray-500">
            {definition.description}
          </div>
        </div>
      </div>

      {/* 节点内容预览 */}
      <div className="text-xs text-gray-600 space-y-1">
        {definition.fields.slice(0, 2).map(field => {
          const value = data.data[field.key];
          if (!value) return null;
          
          let displayValue = '';
          if (field.type === 'list' && Array.isArray(value)) {
            displayValue = value.join(', ');
          } else {
            displayValue = String(value);
          }
          
          if (displayValue.length > 30) {
            displayValue = displayValue.substring(0, 30) + '...';
          }
          
          return (
            <div key={field.key} className="truncate">
              <span className="font-medium">{field.label}:</span> {displayValue}
            </div>
          );
        })}
        
        {definition.fields.length > 2 && (
          <div className="text-gray-400 italic">
            +{definition.fields.length - 2} 更多字段
          </div>
        )}
      </div>

      {/* 输出连接点 */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
