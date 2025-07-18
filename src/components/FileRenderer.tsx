import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Page } from '../pages'
import { removeMetadata, getComponent, getContent } from '../pages'

interface FileRendererProps {
  page: Page
}

// Markdownレンダラー
const MarkdownRenderer = ({ page }: { page: Page }) => {
  const [content, setContent] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string>('')

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        setError('')
        
        const rawContent = await getContent(page.id, 'md')
        const cleanContent = removeMetadata(rawContent, 'md')
        setContent(cleanContent)
      } catch (err) {
        console.error('Markdown content loading error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [page.id])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-full">
        <div className="text-gray-500 dark:text-gray-400">
          Markdownを読み込み中...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
          <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">
            Markdownの読み込みエラー
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {error}
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({children}) => <h1 className="text-3xl font-bold mb-6 mt-8 border-b border-gray-300 pb-2">{children}</h1>,
            h2: ({children}) => <h2 className="text-2xl font-bold mb-4 mt-6 border-b border-gray-200 pb-1">{children}</h2>,
            h3: ({children}) => <h3 className="text-xl font-bold mb-3 mt-5">{children}</h3>,
            h4: ({children}) => <h4 className="text-lg font-semibold mb-2 mt-4">{children}</h4>,
            h5: ({children}) => <h5 className="text-base font-semibold mb-2 mt-3">{children}</h5>,
            h6: ({children}) => <h6 className="text-sm font-semibold mb-2 mt-3">{children}</h6>,
            p: ({children}) => <p className="mb-4">{children}</p>,
            ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
            li: ({children}) => <li className="mb-1">{children}</li>,
            blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
            code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
            pre: ({children}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
            table: ({children}) => <table className="w-full border-collapse border border-gray-300 mb-4">{children}</table>,
            th: ({children}) => <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">{children}</th>,
            td: ({children}) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
            hr: () => <hr className="border-0 border-t-2 border-gray-300 my-6" />,
            strong: ({children}) => <strong className="font-bold">{children}</strong>,
            em: ({children}) => <em className="italic">{children}</em>,
            a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

// SVGレンダラー
const SVGRenderer = ({ page }: { page: Page }) => {
  const [content, setContent] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string>('')

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        setError('')
        
        const rawContent = await getContent(page.id, 'svg')
        const cleanContent = removeMetadata(rawContent, 'svg')
        setContent(cleanContent)
      } catch (err) {
        console.error('SVG content loading error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [page.id])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-full">
        <div className="text-gray-500 dark:text-gray-400">
          SVGを読み込み中...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
          <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">
            SVGの読み込みエラー
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {error}
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 flex items-center justify-center min-h-full bg-gray-50 dark:bg-gray-900">
      <div 
        className="max-w-full max-h-full"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

// Mermaidレンダラー
const MermaidRenderer = ({ page }: { page: Page }) => {
  const [content, setContent] = React.useState<string>('')
  const [diagramSvg, setDiagramSvg] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string>('')

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        setError('')
        
        const rawContent = await getContent(page.id, 'mermaid')
        const cleanContent = removeMetadata(rawContent, 'mermaid')
        setContent(cleanContent)
      } catch (err) {
        console.error('Mermaid content loading error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    loadContent()
  }, [page.id])

  React.useEffect(() => {
    const renderMermaid = async () => {
      try {
        setLoading(true)
        setError('')
        
        // 動的にmermaidをインポート
        const mermaid = await import('mermaid')
        
        // ガントチャートかどうかを判定
        const isGanttChart = content.includes('gantt')
        
        // mermaidを初期化（ガントチャート用の特別設定）
        if (isGanttChart) {
          mermaid.default.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            gantt: {
              useMaxWidth: true,
              topPadding: 50,
              rightPadding: 100,
              leftPadding: 150,
              barHeight: 35,
              fontSize: 14,
              titleTopMargin: 25,
              gridLineStartPadding: 35,
              barGap: 8,
              sectionFontSize: 18,
              numberSectionStyles: 4
            }
          } as any)
        } else {
          // 通常のMermaid図表用の設定
          mermaid.default.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            themeVariables: {
              lineColor: '#9ca3af', // 矢印の色を若干濃くする
              primaryColor: '#dbeafe', // ノードの背景色を薄い青に
              primaryBorderColor: '#3b82f6', // ノードの境界線を青に
              primaryTextColor: '#1e40af', // ノード内のテキストを濃い青に
              secondaryColor: '#bfdbfe', // セカンダリノードも薄い青系に
              tertiaryColor: '#93c5fd', // ターシャリノードも青系に
              background: '#ffffff', // 背景色
              mainBkg: '#dbeafe', // メインノードの背景を薄い青に
              secondBkg: '#bfdbfe', // セカンドノードの背景を薄い青に
              edgeLabelBackground: 'transparent', // 矢印の上の文字の背景を無しに
              cLabel0: '#1f2937', // 矢印の上の文字色を濃い目に
              cLabel1: '#1f2937',
              cLabel2: '#1f2937',
              // stateDiagram-v2 用の設定
              stateLabelColor: '#1f2937', // ステート図のラベル色
              transitionColor: '#9ca3af', // ステート図の矢印色を若干濃くする
              transitionLabelColor: '#1f2937', // ステート図の矢印上の文字色
              // ステート図のノードの色も薄い青系に
              primaryStateColor: '#dbeafe',
              primaryStateBorderColor: '#3b82f6',
              primaryStateTextColor: '#1e40af',
              // flowchartの各ノードタイプの色設定
              c0: '#dbeafe', // ノードタイプ0
              c1: '#bfdbfe', // ノードタイプ1
              c2: '#93c5fd', // ノードタイプ2
              c3: '#60a5fa'  // ノードタイプ3
            },
            flowchart: {
              htmlLabels: true,
              curve: 'basis',
              useMaxWidth: true
            }
          } as any)
        }

        // 図を生成
        const { svg } = await mermaid.default.render('mermaid-diagram', content)
        
        // SVGにスタイルを埋め込む
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml')
        const svgElement = svgDoc.documentElement
        
        // スタイル要素を作成
        const styleElement = document.createElement('style')
        styleElement.textContent = `
          /* ガントチャート専用スタイル */
          .mermaid .gantt .taskText {
            font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            fill: #0d47a1 !important;
          }
          
          .mermaid .gantt .taskTextOutsideRight {
            font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            fill: #424242 !important;
          }
          
          .mermaid .gantt .sectionTitle {
            font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            fill: #1565c0 !important;
          }
          
          .mermaid .gantt .titleText {
            font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-size: 20px !important;
            font-weight: 700 !important;
            fill: #0d47a1 !important;
          }
          
          .mermaid .gantt .grid .tick text {
            font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-size: 11px !important;
            fill: #616161 !important;
          }
          
          /* タスクバーのスタイル改善 */
          .mermaid .gantt rect.task {
            rx: 4 !important;
            ry: 4 !important;
            stroke-width: 1.5px !important;
          }
          
          .mermaid .gantt rect.task.active0,
          .mermaid .gantt rect.task.active1,
          .mermaid .gantt rect.task.active2,
          .mermaid .gantt rect.task.active3 {
            stroke: #0d47a1 !important;
            stroke-width: 2px !important;
          }
          
          /* マイルストーンのスタイル */
          .mermaid .gantt .milestone {
            fill: #f44336 !important;
            stroke: #d32f2f !important;
            stroke-width: 2px !important;
          }
          
          /* グリッドラインの改善 */
          .mermaid .gantt .grid line {
            stroke: #e0e0e0 !important;
            stroke-width: 1px !important;
          }
          
          /* 今日のライン */
          .mermaid .gantt .today {
            stroke: #f44336 !important;
            stroke-width: 2px !important;
            stroke-dasharray: 5,5 !important;
          }
          
          /* フローチャートとステート図の既存スタイル */
          .node rect {
            rx: 8 !important;
            ry: 8 !important;
          }
          .node rect {
            stroke: #3b82f6 !important;
          }
          .flowchart .node rect,
          .flowchart .node polygon,
          .flowchart .node circle,
          .flowchart .node ellipse,
          .flowchart .node path {
            stroke: #3b82f6 !important;
          }
          .flowchart .node polygon,
          .flowchart-v2 .node polygon,
          .flowchart .label polygon,
          g.node polygon {
            stroke: #3b82f6 !important;
          }
          .statediagram-state rect {
            stroke: #3b82f6 !important;
          }
          .statediagram-state rect {
            fill: #dbeafe !important;
            stroke: #3b82f6 !important;
          }
          .statediagram-state text {
            fill: #1e40af !important;
          }
          .edgeLabel rect {
            fill: transparent !important;
            stroke: none !important;
          }
          .edgeLabel text {
            fill: #1f2937 !important;
            font-weight: 500 !important;
          }
          .statediagram-state .transition .arrowhead {
            fill: #9ca3af !important;
            stroke: #9ca3af !important;
          }
          marker[id*="arrowhead"] path {
            fill: #9ca3af !important;
            stroke: #9ca3af !important;
          }
          defs marker path {
            fill: #9ca3af !important;
            stroke: #9ca3af !important;
          }
        `
        
        // SVGの最初の子要素としてスタイルを追加
        svgElement.insertBefore(styleElement, svgElement.firstChild)
        
        // ガントチャートの場合、SVGの修正を行う
        if (content.includes('gantt')) {
          // 負の幅を持つrect要素を修正
          const rects = svgElement.querySelectorAll('rect')
          rects.forEach(rect => {
            const width = rect.getAttribute('width')
            if (width && parseFloat(width) < 0) {
              rect.setAttribute('width', '0')
            }
          })
          
          // viewBoxの修正
          const viewBox = svgElement.getAttribute('viewBox')
          if (viewBox && viewBox.includes('0 0 0')) {
            svgElement.setAttribute('viewBox', viewBox.replace('0 0 0', '0 0 800'))
          }
          
          // 最小幅を設定
          svgElement.setAttribute('width', '100%')
          svgElement.style.maxWidth = '100%'
          svgElement.style.minWidth = '600px'
        }
        
        setDiagramSvg(svgElement.outerHTML)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (content) {
      renderMermaid()
    }
  }, [content])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-full">
        <div className="text-gray-500 dark:text-gray-400">
          Mermaid図を読み込み中...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
          <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">
            Mermaid図の描画エラー
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {error}
          </p>
          <details className="text-sm">
            <summary className="text-red-700 dark:text-red-400 cursor-pointer">
              元のコード
            </summary>
            <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-red-800 dark:text-red-300 overflow-x-auto">
              {content}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 flex items-center justify-center min-h-full bg-gray-50 dark:bg-gray-900">
      <div 
        className="w-full max-h-full"
        dangerouslySetInnerHTML={{ __html: diagramSvg }}
      />
    </div>
  )
}

// テキストレンダラー
const TextRenderer = ({ page }: { page: Page }) => {
  const [content, setContent] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string>('')

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        setError('')
        
        const rawContent = await getContent(page.id, 'txt')
        const cleanContent = removeMetadata(rawContent, 'txt')
        setContent(cleanContent)
      } catch (err) {
        console.error('Text content loading error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [page.id])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-full">
        <div className="text-gray-500 dark:text-gray-400">
          テキストを読み込み中...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
          <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">
            テキストの読み込みエラー
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {error}
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6">
      <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded border overflow-x-auto">
        {content}
      </pre>
    </div>
  )
}

// TSXレンダラー
const TSXRenderer = ({ page }: { page: Page }) => {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string>('')

  React.useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true)
        setError('')
        
        const ComponentModule = await getComponent(page.id)
        if (ComponentModule) {
          setComponent(() => ComponentModule)
        } else {
          setError('コンポーネントの読み込みに失敗しました')
        }
      } catch (err) {
        console.error('TSX component loading error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadComponent()
  }, [page.id])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-full">
        <div className="text-gray-500 dark:text-gray-400">
          コンポーネントを読み込み中...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
          <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">
            コンポーネントの読み込みエラー
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (!Component) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        コンポーネントが見つかりません
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <Component />
    </div>
  )
}

export default function FileRenderer({ page }: FileRendererProps) {
  switch (page.type) {
    case 'tsx':
      return <TSXRenderer page={page} />
    case 'md':
      return <MarkdownRenderer page={page} />
    case 'svg':
      return <SVGRenderer page={page} />
    case 'mermaid':
      return <MermaidRenderer page={page} />
    case 'txt':
      return <TextRenderer page={page} />
    default:
      return <TextRenderer page={page} />
  }
} 