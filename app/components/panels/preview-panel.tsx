'use client';

import React, { useState, useEffect } from 'react';
import { useFlowStore } from '../../lib/store/flow-store';
import { compilePrompt } from '../../lib/compiler/prompt-compiler';
import { CompileResult } from '../../types';
import { Button } from '../ui/button';
import { Copy, Check, AlertCircle, Eye, Code } from 'lucide-react';

export function PreviewPanel() {
  const { doc } = useFlowStore();
  const [compiledResult, setCompiledResult] = useState<CompileResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'json'>('text');

  useEffect(() => {
    const result = compilePrompt(doc);
    setCompiledResult(result);
  }, [doc]);

  const handleCopy = async () => {
    if (!compiledResult) return;
    
    const textToCopy = viewMode === 'text' 
      ? compiledResult.compiledText 
      : JSON.stringify(doc, null, 2);
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const hasErrors = (compiledResult?.report.missingRequired?.length ?? 0) > 0 || 
                   (compiledResult?.report.warnings?.length ?? 0) > 0;

  return (
    <div className="h-80 bg-white border-t border-gray-200 flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">实时预览</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('text')}
            >
              <Eye className="h-4 w-4 mr-1" />
              文本
            </Button>
            <Button
              variant={viewMode === 'json' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('json')}
            >
              <Code className="h-4 w-4 mr-1" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!compiledResult}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied ? '已复制' : '复制'}
            </Button>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {hasErrors && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">编译警告</h3>
              {compiledResult && compiledResult.report.missingRequired && compiledResult.report.missingRequired.length > 0 && (
                <div className="mt-1">
                  <p className="text-sm text-yellow-700">
                    缺少必填字段的节点: {compiledResult.report.missingRequired.length} 个
                  </p>
                </div>
              )}
              {compiledResult && compiledResult.report.warnings && compiledResult.report.warnings.length > 0 && (
                <div className="mt-1">
                  <p className="text-sm text-yellow-700">
                    警告: {compiledResult.report.warnings.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'text' ? (
          <div className="p-4">
            {compiledResult?.compiledText ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-gray-50 p-4 rounded-lg border">
                {compiledResult.compiledText}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>添加节点并连线来生成Prompt</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-gray-50 p-4 rounded-lg border overflow-auto">
              {JSON.stringify(doc, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* 底部统计 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>节点: {doc.nodes.length}</span>
            <span>连线: {doc.edges.length}</span>
          </div>
          <div className="flex items-center gap-4">
            {viewMode === 'text' && compiledResult?.compiledText && (
              <span>字符数: {compiledResult.compiledText.length}</span>
            )}
            <span>更新时间: {new Date(doc.updatedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
