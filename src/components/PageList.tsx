import { FileCode, ChevronLeft, ChevronRight, Pin, FileText, Image, FileIcon, Eye, EyeOff } from 'lucide-react'
import type { Page } from '../pages'
import { useState } from 'react'
import { getCookie, setCookie } from '../utils/cookies'

interface PageListProps {
  pages: Page[]
  selectedPage: Page | null
  onSelectPage: (page: Page) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onCloseDrawer?: () => void // ドロワーを閉じる関数（オプショナル）
  isPinned?: boolean // ピン留め状態
  onTogglePin?: () => void // ピン留め切り替え関数
}

// ファイル形式に応じたアイコンを取得する関数
const getFileIcon = (page: Page) => {
  switch (page.type) {
    case 'tsx':
      return <FileCode className="w-4 h-4 text-blue-500" />
    case 'md':
      return <FileText className="w-4 h-4 text-green-500" />
    case 'svg':
      return <Image className="w-4 h-4 text-purple-500" />
    case 'mermaid':
      return <FileIcon className="w-4 h-4 text-cyan-500" />
    case 'txt':
      return <FileText className="w-4 h-4 text-gray-500" />
    default:
      return <FileIcon className="w-4 h-4 text-gray-500" />
  }
}

// 表示コントロールモードのフィルター種別
type VisibilityFilter = 'all' | 'visible' | 'hidden'

export default function PageList({ pages, selectedPage, onSelectPage, sidebarOpen, onToggleSidebar, onCloseDrawer, isPinned, onTogglePin }: PageListProps) {
  // 表示/非表示機能のstate
  const [showVisibilityControls, setShowVisibilityControls] = useState(false)
  
  // 表示コントロールモードのフィルター状態
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all')
  
  // クッキーから初期値を読み込み
  const [hiddenPages, setHiddenPages] = useState<Set<string>>(() => {
    try {
      const saved = getCookie('hiddenPages')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch (error) {
      console.warn('Failed to load hidden pages from cookie:', error)
      return new Set()
    }
  })

  // ページの表示/非表示を切り替える関数
  const togglePageVisibility = (pageId: string) => {
    setHiddenPages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pageId)) {
        newSet.delete(pageId)
      } else {
        newSet.add(pageId)
      }
      
      // クッキーに保存
      try {
        setCookie('hiddenPages', JSON.stringify([...newSet]), 30) // 30日間保存
      } catch (error) {
        console.warn('Failed to save hidden pages to cookie:', error)
      }
      
      return newSet
    })
  }

  // 全て表示にする関数
  const showAllPages = () => {
    setHiddenPages(new Set())
    try {
      setCookie('hiddenPages', JSON.stringify([]), 30)
    } catch (error) {
      console.warn('Failed to save hidden pages to cookie:', error)
    }
  }

  // 全て非表示にする関数
  const hideAllPages = () => {
    const allPageIds = pages.map(page => page.id)
    setHiddenPages(new Set(allPageIds))
    try {
      setCookie('hiddenPages', JSON.stringify(allPageIds), 30)
    } catch (error) {
      console.warn('Failed to save hidden pages to cookie:', error)
    }
  }

  // ヘッダーの目のアイコンをクリックした時の処理
  const handleHeaderEyeClick = () => {
    setShowVisibilityControls(!showVisibilityControls)
    // 表示コントロールモードを開始する時はフィルターを「すべて」にリセット
    if (!showVisibilityControls) {
      setVisibilityFilter('all')
    }
  }

  // 表示するページをフィルタリング
  const visiblePages = (() => {
    if (!showVisibilityControls) {
      // 通常モード：表示状態の項目のみ表示
      return pages.filter(page => !hiddenPages.has(page.id))
    } else {
      // 表示コントロールモード：フィルターに応じて表示
      switch (visibilityFilter) {
        case 'all':
          return pages // すべて表示
        case 'visible':
          return pages.filter(page => !hiddenPages.has(page.id)) // 表示のみ
        case 'hidden':
          return pages.filter(page => hiddenPages.has(page.id)) // 非表示のみ
        default:
          return pages
      }
    }
  })()

  if (!sidebarOpen) {
    // 畳まれた状態：50px幅で>>アイコンのみ表示
    return (
      <div className="h-full bg-white dark:bg-gray-800 flex flex-col">
        {/* タイトル部分（畳まれた状態） */}
        <div className="bg-gray-800 dark:bg-gray-900 flex items-center justify-center py-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label="サイドバーを開く"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    )
  }

  // 開いた状態：通常のサイドバー表示
  return (
    <div className="h-full bg-white dark:bg-gray-800">
      {/* タイトル部分 */}
      <div className="bg-gray-800 dark:bg-gray-900 p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white whitespace-nowrap">
          Document Viewer
        </h1>
        <div className="flex items-center gap-2">
          {/* ピン留めボタン */}
          {onTogglePin && (
            <button
              onClick={onTogglePin}
              className="p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              aria-label={isPinned ? "ピン留めを解除" : "ピン留めする"}
            >
              <Pin 
                className={`w-4 h-4 text-white ${isPinned ? 'fill-current' : ''}`}
              />
            </button>
          )}
          
          {/* 閉じる/畳むボタン（ピン留め時は非表示） */}
          {!isPinned && (
            <button
              onClick={onCloseDrawer || onToggleSidebar} // ドロワーの場合はonCloseDrawer、サイドバーの場合はonToggleSidebar
              className="p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              aria-label={onCloseDrawer ? "ドロワーを閉じる" : "サイドバーを畳む"}
            >
              {onCloseDrawer ? (
                // ドロワーの場合は×アイコン
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // サイドバーの場合は<アイコン
                <ChevronLeft className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Item Listヘッダー */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Item List
          </h2>
          <div className="flex items-center gap-2">
            {/* 表示コントロールモード時のアクション・フィルターボタン */}
            {showVisibilityControls && (
              <>
                {/* アクション操作 */}
                <div className="flex items-center gap-1 mr-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">ACTION:</span>
                  <button
                    onClick={showAllPages}
                    className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="全て表示"
                  >
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={hideAllPages}
                    className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="全て非表示"
                  >
                    <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                
                {/* フィルター操作 */}
                <div className="flex items-center gap-1 mr-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">FILTER:</span>
                  <button
                    onClick={() => setVisibilityFilter('all')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      visibilityFilter === 'all' 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="すべて表示"
                  >
                    ALL
                  </button>
                  <button
                    onClick={() => setVisibilityFilter('visible')}
                    className={`p-1 rounded transition-colors ${
                      visibilityFilter === 'visible' 
                        ? 'bg-blue-100 dark:bg-blue-900' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="表示のみ"
                  >
                    <Eye className={`w-4 h-4 ${
                      visibilityFilter === 'visible' 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`} />
                  </button>
                  <button
                    onClick={() => setVisibilityFilter('hidden')}
                    className={`p-1 rounded transition-colors ${
                      visibilityFilter === 'hidden' 
                        ? 'bg-blue-100 dark:bg-blue-900' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="非表示のみ"
                  >
                    <EyeOff className={`w-4 h-4 ${
                      visibilityFilter === 'hidden' 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`} />
                  </button>
                </div>
              </>
            )}
            
            {/* 目のアイコンボタン */}
            <button
              onClick={handleHeaderEyeClick}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              aria-label={showVisibilityControls ? "通常モードに切り替え" : "表示コントロールモードに切り替え"}
            >
              <Eye className={`w-4 h-4 ${showVisibilityControls ? 'text-gray-600 dark:text-gray-400' : 'text-gray-300 dark:text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* リストエリア */}
      <div className="overflow-y-auto" style={{height: 'calc(100% - 113px)'}}>
        {visiblePages.map((page) => (
          <button
            key={page.id}
            onClick={() => onSelectPage(page)}
            className={`w-full p-4 text-left border-b border-b-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedPage?.id === page.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-r-blue-500'
                : ''
            }`}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                {/* 表示コントロールモード時の目のアイコン */}
                {showVisibilityControls && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // 親のonSelectPageを呼ばないようにする
                      togglePageVisibility(page.id)
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label={hiddenPages.has(page.id) ? "表示する" : "非表示にする"}
                  >
                    {hiddenPages.has(page.id) ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                )}
                {getFileIcon(page)}
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {page.name}
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  .{page.extension}
                </span>
              </div>
              {page.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {page.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 