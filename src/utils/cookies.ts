import type { Page } from '../pages'

// クッキーの保存期間（1日）
const COOKIE_EXPIRES_DAYS = 1

// アプリの状態を表すインターface
interface AppState {
  isPinned: boolean
  selectedPageId: string | null
  drawerOpen: boolean
  timestamp: number
}

// デフォルトの状態
const DEFAULT_STATE: AppState = {
  isPinned: true,
  selectedPageId: null,
  drawerOpen: false,
  timestamp: Date.now()
}

// クッキーにデータを保存する関数
export function setCookie(name: string, value: string, days: number): void {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

// クッキーからデータを読み込む関数
export function getCookie(name: string): string | null {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// アプリの状態をクッキーに保存する関数
export function saveAppState(state: Partial<Omit<AppState, 'timestamp'>>): void {
  try {
    const currentState = loadAppState()
    const newState: AppState = {
      ...currentState,
      ...state,
      timestamp: Date.now()
    }
    setCookie('app_state', JSON.stringify(newState), COOKIE_EXPIRES_DAYS)
  } catch (error) {
    console.warn('Failed to save app state to cookie:', error)
  }
}

// クッキーからアプリの状態を読み込む関数
export function loadAppState(): AppState {
  try {
    const cookieValue = getCookie('app_state')
    if (!cookieValue) {
      return DEFAULT_STATE
    }

    const state = JSON.parse(cookieValue) as AppState
    
    // データの有効性をチェック
    if (typeof state.isPinned !== 'boolean' || 
        (state.selectedPageId !== null && typeof state.selectedPageId !== 'string') ||
        typeof state.drawerOpen !== 'boolean') {
      console.warn('Invalid app state in cookie, using default')
      return DEFAULT_STATE
    }

    return state
  } catch (error) {
    console.warn('Failed to load app state from cookie:', error)
    return DEFAULT_STATE
  }
}

// 選択中のページオブジェクトを取得する関数
export function getSelectedPageFromState(pages: Page[], state: AppState): Page | null {
  if (!state.selectedPageId) {
    return null
  }
  
  const page = pages.find(p => p.id === state.selectedPageId)
  return page || null
} 