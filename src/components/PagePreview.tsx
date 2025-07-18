import React, { Suspense, useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import type { Page } from '../pages'
import { getComponent } from '../pages'
import FileRenderer from './FileRenderer'

interface PagePreviewProps {
  page: Page | null
}

export default function PagePreview({ page }: PagePreviewProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!page) {
      setComponent(null)
      return
    }

    // TSXファイル以外の場合は動的読み込みをスキップ
    if (page.type !== 'tsx') {
      setComponent(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    
    getComponent(page.id)
      .then((comp) => {
        if (comp) {
          setComponent(() => comp)
        } else {
          setError('コンポーネントの読み込みに失敗しました')
        }
      })
      .catch((err) => {
        setError(`エラー: ${err.message}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page])

  if (!page) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 text-center">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">ページを選択してプレビューを表示</p>
        </div>
      </div>
    )
  }

  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    try {
      return <>{children}</>
    } catch (error) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-red-600 dark:text-red-400">
            コンポーネントの読み込みエラー: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )
    }
  }

  return (
    <div className="h-full bg-white dark:bg-gray-800">
      {/* コンテンツ */}
      <div className="h-full overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">
              読み込み中...
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        ) : page.type === 'tsx' ? (
          // TSXファイルの場合：従来通りReactコンポーネントとして表示
          Component ? (
            <ErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500 dark:text-gray-400">
                    読み込み中...
                  </div>
                </div>
              }>
                <Component />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">
                コンポーネントが見つかりません
              </div>
            </div>
          )
        ) : (
          // その他のファイル形式：FileRendererを使用
          <FileRenderer page={page} />
        )}
      </div>
    </div>
  )
} 