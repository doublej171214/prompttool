'use client';

import React from 'react';
import { useFlowStore } from '../../lib/store/flow-store';
import { NODE_DEFINITIONS } from '../../lib/node-definitions';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Trash2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils/cn';
import { NodeField } from '../../types';

export function PropertiesPanel() {
  const { doc, selectedNodeId, selectedEdgeId, updateNode, deleteNode } = useFlowStore();
  
  const selectedNode = selectedNodeId ? doc.nodes.find(n => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? doc.edges.find(e => e.id === selectedEdgeId) : null;
  
  const definition = selectedNode ? NODE_DEFINITIONS[selectedNode.type] : null;

  const handleFieldChange = (fieldKey: string, value: string | string[]) => {
    if (!selectedNode) return;
    
    const newData = { ...selectedNode.data, [fieldKey]: value };
    updateNode(selectedNode.id, { data: newData });
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    deleteNode(selectedNode.id);
  };

  const renderField = (field: NodeField) => {
    const value = selectedNode?.data[field.key] || '';
    const isRequired = field.required;
    const hasError = isRequired && !value;

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Input
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={cn(hasError && "border-red-500")}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {hasError && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                此字段为必填项
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={cn(hasError && "border-red-500")}
              rows={4}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {hasError && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                此字段为必填项
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                hasError && "border-red-500"
              )}
            >
              <option value="">请选择...</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {hasError && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                此字段为必填项
              </div>
            )}
          </div>
        );

      case 'list':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {(Array.isArray(value) ? value : []).map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newList = [...(value || [])];
                      newList[index] = e.target.value;
                      handleFieldChange(field.key, newList);
                    }}
                    placeholder={field.placeholder}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentValue = Array.isArray(value) ? value : [];
                      const newList = currentValue.filter((_: string, i: number) => i !== index);
                      handleFieldChange(field.key, newList);
                    }}
                  >
                    删除
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newList = [...(value || []), ''];
                  handleFieldChange(field.key, newList);
                }}
              >
                添加项目
              </Button>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {hasError && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                此字段为必填项
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">属性面板</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>选择一个节点或连线来编辑属性</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">连线属性</h2>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">连线ID</label>
              <p className="text-sm text-gray-600 mt-1">{selectedEdge.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">源节点</label>
              <p className="text-sm text-gray-600 mt-1">{selectedEdge.source}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">目标节点</label>
              <p className="text-sm text-gray-600 mt-1">{selectedEdge.target}</p>
            </div>
            {selectedEdge.condition && (
              <div>
                <label className="text-sm font-medium text-gray-700">条件</label>
                <p className="text-sm text-gray-600 mt-1">{selectedEdge.condition}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">节点属性</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteNode}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {definition && (
          <p className="text-sm text-gray-500 mt-1">{definition.description}</p>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {definition?.fields.map(renderField)}
        </div>
      </div>
    </div>
  );
}
