export type NodeID = string;

export type PBNodeType = 
  | "persona" 
  | "context" 
  | "userInput" 
  | "system" 
  | "task" 
  | "ifElse" 
  | "loop" 
  | "format" 
  | "structured" 
  | "note";

export interface FlowDoc {
  id: string;
  name: string;
  nodes: PBNode[];
  edges: PBEdge[];
  settings: FlowSettings;
  updatedAt: number;
  version: number;
}

export interface PBNode {
  id: NodeID;
  type: PBNodeType;
  position: { x: number; y: number };
  data: Record<string, string | string[]>;
}

export interface PBEdge {
  id: string;
  source: NodeID;
  target: NodeID;
  points?: { x: number; y: number }[];
  condition?: string;
}

export interface FlowSettings {
  language?: string;
  joiner?: string;
  previewTemplate?: string;
  model?: string;
}

export interface NodeField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'list' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
  compile?: boolean;
}

export interface NodeDefinition {
  type: PBNodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  fields: NodeField[];
  template: string;
}

export interface CompileResult {
  compiledText: string;
  report: {
    missingRequired: NodeID[];
    warnings: string[];
  };
}
