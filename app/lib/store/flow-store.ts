import { create } from 'zustand';
import { FlowDoc, PBNode, PBEdge, NodeID, PBNodeType } from '../../types';

interface FlowState {
  // 文档状态
  doc: FlowDoc;
  
  // 画布状态
  selectedNodeId: NodeID | null;
  selectedEdgeId: string | null;
  
  // 操作历史
  history: FlowDoc[];
  historyIndex: number;
  
  // 动作
  setDoc: (doc: FlowDoc) => void;
  updateDoc: (updates: Partial<FlowDoc>) => void;
  
  // 节点操作
  addNode: (type: PBNodeType, position: { x: number; y: number }) => void;
  updateNode: (id: NodeID, updates: Partial<PBNode>) => void;
  deleteNode: (id: NodeID) => void;
  selectNode: (id: NodeID | null) => void;
  
  // 连线操作
  addEdge: (source: NodeID, target: NodeID, condition?: string) => void;
  updateEdge: (id: string, updates: Partial<PBEdge>) => void;
  deleteEdge: (id: string) => void;
  selectEdge: (id: string | null) => void;
  
  // 历史操作
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  // 画布操作
  clearCanvas: () => void;
  autoSave: () => void;
  loadFromStorage: () => void;
}

const createInitialDoc = (): FlowDoc => ({
  id: `pb_${Date.now()}`,
  name: '新项目',
  nodes: [],
  edges: [],
  settings: {
    language: 'zh-CN',
    joiner: '\n\n',
    model: 'gpt-3.5-turbo'
  },
  updatedAt: Date.now(),
  version: 1
});

export const useFlowStore = create<FlowState>((set, get) => ({
  doc: createInitialDoc(),
  selectedNodeId: null,
  selectedEdgeId: null,
  history: [createInitialDoc()],
  historyIndex: 0,
  
  setDoc: (doc) => {
    set({ doc });
    get().saveToHistory();
  },
  
  updateDoc: (updates) => {
    const { doc } = get();
    const newDoc = { ...doc, ...updates, updatedAt: Date.now() };
    set({ doc: newDoc });
    get().saveToHistory();
  },
  
  addNode: (type, position) => {
    const { doc } = get();
    const newNode: PBNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position,
      data: {}
    };
    
    const newNodes = [...doc.nodes, newNode];
    get().updateDoc({ nodes: newNodes });
  },
  
  updateNode: (id, updates) => {
    const { doc } = get();
    const newNodes = doc.nodes.map(node => 
      node.id === id ? { ...node, ...updates } : node
    );
    get().updateDoc({ nodes: newNodes });
  },
  
  deleteNode: (id) => {
    const { doc } = get();
    const newNodes = doc.nodes.filter(node => node.id !== id);
    const newEdges = doc.edges.filter(edge => 
      edge.source !== id && edge.target !== id
    );
    get().updateDoc({ nodes: newNodes, edges: newEdges });
    get().selectNode(null);
  },
  
  selectNode: (id) => {
    set({ selectedNodeId: id, selectedEdgeId: null });
  },
  
  addEdge: (source, target, condition) => {
    const { doc } = get();
    const newEdge: PBEdge = {
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source,
      target,
      condition
    };
    
    const newEdges = [...doc.edges, newEdge];
    get().updateDoc({ edges: newEdges });
  },
  
  updateEdge: (id, updates) => {
    const { doc } = get();
    const newEdges = doc.edges.map(edge => 
      edge.id === id ? { ...edge, ...updates } : edge
    );
    get().updateDoc({ edges: newEdges });
  },
  
  deleteEdge: (id) => {
    const { doc } = get();
    const newEdges = doc.edges.filter(edge => edge.id !== id);
    get().updateDoc({ edges: newEdges });
    get().selectEdge(null);
  },
  
  selectEdge: (id) => {
    set({ selectedEdgeId: id, selectedNodeId: null });
  },
  
  saveToHistory: () => {
    const { doc, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...doc });
    
    set({ 
      history: newHistory, 
      historyIndex: newHistory.length - 1 
    });
    
    // 限制历史记录数量
    if (newHistory.length > 50) {
      set({ 
        history: newHistory.slice(-50), 
        historyIndex: 49 
      });
    }
  },
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({ 
        doc: history[historyIndex - 1],
        historyIndex: historyIndex - 1 
      });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({ 
        doc: history[historyIndex + 1],
        historyIndex: historyIndex + 1 
      });
    }
  },
  
  clearCanvas: () => {
    get().updateDoc({ 
      nodes: [], 
      edges: [] 
    });
  },
  
  autoSave: () => {
    const { doc } = get();
    try {
      localStorage.setItem(`pb:auto:${doc.id}`, JSON.stringify(doc));
    } catch (error) {
      console.error('Auto save failed:', error);
    }
  },
  
  loadFromStorage: () => {
    try {
      const saved = localStorage.getItem(`pb:auto:${get().doc.id}`);
      if (saved) {
        const savedDoc = JSON.parse(saved);
        set({ doc: savedDoc });
      }
    } catch (error) {
      console.error('Load from storage failed:', error);
    }
  }
}));
