'use client';

import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  Panel,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '../../lib/store/flow-store';
import { PBNodeType } from '../../types';
import { CustomNode } from './custom-node';
import { Button } from '../ui/button';
import { Trash2, RotateCcw, RotateCw, Download, Upload, Sparkles } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

export function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  const {
    doc,
    selectedNodeId,
    selectedEdgeId,
    addNode,
    updateNode,
    deleteNode,
    selectNode,
    addEdge,
    deleteEdge,
    selectEdge,
    undo,
    redo,
    clearCanvas,
    autoSave
  } = useFlowStore();

  // 转换节点格式
  const nodes: Node[] = doc.nodes.map(node => ({
    id: node.id,
    type: 'custom',
    position: node.position,
    data: { ...node }
  }));

  // 转换连线格式
  const edges: Edge[] = doc.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    data: { ...edge }
  }));

  const onConnect = useCallback((params: Connection) => {
    addEdge(params.source!, params.target!);
  }, [addEdge]);

  const onNodesDelete = useCallback((deleted: Node[]) => {
    deleted.forEach(node => deleteNode(node.id));
  }, [deleteNode]);

  const onEdgesDelete = useCallback((deleted: Edge[]) => {
    deleted.forEach(edge => deleteEdge(edge.id));
  }, [deleteEdge]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    updateNode(node.id, { position: node.position });
  }, [updateNode]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    selectEdge(edge.id);
  }, [selectEdge]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    if (!reactFlowWrapper.current || !reactFlowInstance) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const data = event.dataTransfer.getData('application/reactflow');

    if (!data) return;

    const { type } = JSON.parse(data);
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    addNode(type as PBNodeType, position);
  }, [reactFlowInstance, addNode]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedNodeId) {
        deleteNode(selectedNodeId);
      } else if (selectedEdgeId) {
        deleteEdge(selectedEdgeId);
      }
    } else if (event.metaKey || event.ctrlKey) {
      if (event.key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    }
  }, [selectedNodeId, selectedEdgeId, deleteNode, deleteEdge, undo, redo]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 自动保存
  React.useEffect(() => {
    const interval = setInterval(autoSave, 1000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const handleExport = () => {
    const dataStr = JSON.stringify(doc, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name}.pb.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedDoc = JSON.parse(e.target?.result as string);
            useFlowStore.getState().setDoc(importedDoc);
          } catch (error) {
            console.error('Import failed:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        
        {/* 工具栏 */}
        <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-2 m-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={false}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={false}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Panel>

        {/* 导出导入按钮 */}
        <Panel position="top-right" className="bg-white rounded-lg shadow-lg p-2 m-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI Fill
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
