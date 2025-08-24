import { FlowDoc, PBNode, PBEdge, CompileResult, NodeID } from '../../types';
import { NODE_DEFINITIONS } from '../node-definitions';

export class PromptCompiler {
  private doc: FlowDoc;
  private nodes: Map<NodeID, PBNode>;
  private edges: PBEdge[];
  private adjacencyList: Map<NodeID, NodeID[]>;
  private inDegree: Map<NodeID, number>;

  constructor(doc: FlowDoc) {
    this.doc = doc;
    this.nodes = new Map(doc.nodes.map(node => [node.id, node]));
    this.edges = doc.edges;
    this.adjacencyList = new Map();
    this.inDegree = new Map();
    this.buildGraph();
  }

  private buildGraph() {
    // 初始化邻接表和入度
    this.doc.nodes.forEach(node => {
      this.adjacencyList.set(node.id, []);
      this.inDegree.set(node.id, 0);
    });

    // 构建图
    this.edges.forEach(edge => {
      const sourceList = this.adjacencyList.get(edge.source) || [];
      sourceList.push(edge.target);
      this.adjacencyList.set(edge.source, sourceList);

      const targetInDegree = this.inDegree.get(edge.target) || 0;
      this.inDegree.set(edge.target, targetInDegree + 1);
    });
  }

  private topologicalSort(): NodeID[] {
    const result: NodeID[] = [];
    const queue: NodeID[] = [];
    const inDegreeCopy = new Map(this.inDegree);

    // 找到所有入度为0的节点
    inDegreeCopy.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    // 按x,y坐标排序，保证稳定性
    queue.sort((a, b) => {
      const nodeA = this.nodes.get(a)!;
      const nodeB = this.nodes.get(b)!;
      if (nodeA.position.y !== nodeB.position.y) {
        return nodeA.position.y - nodeB.position.y;
      }
      return nodeA.position.x - nodeB.position.x;
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const neighbors = this.adjacencyList.get(current) || [];
      neighbors.forEach(neighbor => {
        const neighborInDegree = inDegreeCopy.get(neighbor)! - 1;
        inDegreeCopy.set(neighbor, neighborInDegree);
        if (neighborInDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    return result;
  }

  private renderNode(node: PBNode): string {
    const definition = NODE_DEFINITIONS[node.type];
    if (!definition) return '';

    let template = definition.template;
    const data = node.data;

    // 替换模板变量
    definition.fields.forEach(field => {
      if (field.compile) {
        const value = data[field.key];
        if (value !== undefined && value !== '') {
          if (field.type === 'list' && Array.isArray(value)) {
            template = template.replace(`{{${field.key}}}`, value.join('; '));
          } else {
            template = template.replace(`{{${field.key}}}`, String(value));
          }
        } else {
          template = template.replace(`{{${field.key}}}`, '');
        }
      }
    });

    return template.trim();
  }

  private renderIfElse(node: PBNode): string {
    const ifEdges = this.edges.filter(edge => 
      edge.source === node.id && edge.condition === 'if'
    );
    const elseEdges = this.edges.filter(edge => 
      edge.source === node.id && edge.condition === 'else'
    );

    let result = `IF(${node.data.conditionExpr || 'condition'}):\n`;
    
    // 渲染if分支
    ifEdges.forEach(edge => {
      const targetNode = this.nodes.get(edge.target);
      if (targetNode) {
        const branchContent = this.renderNode(targetNode);
        if (branchContent) {
          result += `  ${branchContent}\n`;
        }
      }
    });

    result += 'ELSE:\n';
    
    // 渲染else分支
    elseEdges.forEach(edge => {
      const targetNode = this.nodes.get(edge.target);
      if (targetNode) {
        const branchContent = this.renderNode(targetNode);
        if (branchContent) {
          result += `  ${branchContent}\n`;
        }
      }
    });

    return result;
  }

  private renderLoop(node: PBNode): string {
    const loopEdges = this.edges.filter(edge => 
      edge.source === node.id
    );

    let result = `LOOP(${node.data.times || 'until condition'}):\n`;
    
    loopEdges.forEach(edge => {
      const targetNode = this.nodes.get(edge.target);
      if (targetNode) {
        const bodyContent = this.renderNode(targetNode);
        if (bodyContent) {
          result += `  ${bodyContent}\n`;
        }
      }
    });

    return result;
  }

  private validateNodes(): { missingRequired: NodeID[]; warnings: string[] } {
    const missingRequired: NodeID[] = [];
    const warnings: string[] = [];

    this.doc.nodes.forEach(node => {
      const definition = NODE_DEFINITIONS[node.type];
      if (!definition) return;

      definition.fields.forEach(field => {
        if (field.required) {
          const value = node.data[field.key];
          if (value === undefined || value === '' || 
              (Array.isArray(value) && value.length === 0)) {
            missingRequired.push(node.id);
          }
        }
      });
    });

    // 检查循环依赖
    const visited = new Set<NodeID>();
    const recStack = new Set<NodeID>();

    const hasCycle = (nodeId: NodeID): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = this.adjacencyList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true;
      }

      recStack.delete(nodeId);
      return false;
    };

    this.doc.nodes.forEach(node => {
      if (hasCycle(node.id)) {
        warnings.push(`检测到循环依赖: ${node.id}`);
      }
    });

    return { missingRequired, warnings };
  }

  public compile(): CompileResult {
    const validation = this.validateNodes();
    const sortedNodes = this.topologicalSort();
    const compiledParts: string[] = [];

    sortedNodes.forEach(nodeId => {
      const node = this.nodes.get(nodeId);
      if (!node) return;

      let nodeContent = '';
      
      switch (node.type) {
        case 'ifElse':
          nodeContent = this.renderIfElse(node);
          break;
        case 'loop':
          nodeContent = this.renderLoop(node);
          break;
        case 'note':
          // 备注节点不参与编译
          break;
        default:
          nodeContent = this.renderNode(node);
          break;
      }

      if (nodeContent) {
        compiledParts.push(nodeContent);
      }
    });

    const joiner = this.doc.settings.joiner || '\n\n';
    const compiledText = compiledParts.join(joiner);

    return {
      compiledText,
      report: validation
    };
  }
}

export function compilePrompt(doc: FlowDoc): CompileResult {
  const compiler = new PromptCompiler(doc);
  return compiler.compile();
}
