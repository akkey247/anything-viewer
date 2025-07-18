import { useState, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'
import PageList from './components/PageList'
import PagePreview from './components/PagePreview'
import { pages, type Page } from './pages'
import { loadAppState, saveAppState, getSelectedPageFromState } from './utils/cookies'

function App() {
  // クッキーから初期状態を読み込み
  const initialState = loadAppState()
  const initialSelectedPage = getSelectedPageFromState(pages, initialState)
  
  const [selectedPage, setSelectedPage] = useState<Page | null>(initialSelectedPage)
  const [drawerOpen, setDrawerOpen] = useState(initialState.drawerOpen)
  const [isPinned, setIsPinned] = useState(initialState.isPinned)

  // 状態変更時にクッキーに保存
  useEffect(() => {
    saveAppState({
      isPinned,
      selectedPageId: selectedPage?.id || null,
      drawerOpen
    })
  }, [isPinned, selectedPage, drawerOpen])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isPinned ? (
        // ピン留め時：サイドバーレイアウト
        <div className="flex h-screen">
          {/* サイドバー */}
          <div className="w-[450px] border-r border-gray-200 dark:border-gray-700">
            <PageList
              pages={pages}
              selectedPage={selectedPage}
              onSelectPage={setSelectedPage}
              sidebarOpen={true}
              onToggleSidebar={() => {}}
              isPinned={isPinned}
              onTogglePin={() => {
                setIsPinned(false)
                setDrawerOpen(true) // ピン留め解除時にドロワーを開く
              }}
            />
          </div>
          
          {/* プレビュー */}
          <div className="flex-1">
            <PagePreview page={selectedPage} />
          </div>
        </div>
      ) : (
        // 通常時：ドロワーレイアウト
        <>
          {/* メインコンテンツエリア（全画面） */}
          <div className="h-screen">
            <PagePreview page={selectedPage} />
          </div>

          {/* PC用：左上ホバーエリア */}
          <div className="fixed top-0 left-0 w-20 h-16 z-[100] group hidden md:block">
            {/* ホバーで現れるドロワー開閉ボタン（フェードイン） */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="absolute top-2 left-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* スマホ用：画面中央上部の常時表示ボタン */}
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-40 md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-20 h-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-lg border border-gray-200 dark:border-gray-700 border-t-0 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* オーバーレイ */}
          {drawerOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300"
              onClick={() => setDrawerOpen(false)}
            />
          )}

          {/* ドロワー */}
          <div
            className={`fixed top-0 left-0 h-full w-[450px] max-w-[90vw] bg-white dark:bg-gray-800 shadow-xl z-[110] transform transition-transform duration-300 ease-in-out ${
              drawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* ドロワーコンテンツ */}
            <div className="h-full overflow-hidden">
              <PageList
                pages={pages}
                selectedPage={selectedPage}
                onSelectPage={(page) => {
                  setSelectedPage(page)
                  setDrawerOpen(false) // ページ選択時にドロワーを閉じる
                }}
                sidebarOpen={true}
                onToggleSidebar={() => {}} // ドロワーでは使用しない
                onCloseDrawer={() => setDrawerOpen(false)} // ドロワーを閉じる関数を追加
                isPinned={isPinned}
                onTogglePin={() => {
                  setIsPinned(true)
                  setDrawerOpen(false) // ピン留め時にドロワーを閉じる
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App 