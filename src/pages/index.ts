// ページの型定義
export interface Page {
  id: string
  name: string
  description?: string
  type: 'tsx' | 'md' | 'svg' | 'mermaid' | 'txt'
  content?: string // 非TSXファイルの場合はコンテンツを保存
  extension: string
}

// 各ファイル形式に応じたメタデータ抽出関数
const extractMetadataFromContent = (content: string, type: Page['type']) => {
  let nameMatch, descriptionMatch
  
  switch (type) {
    case 'md':
    case 'svg':
      // HTMLコメント形式: <!-- Name: ... Description: ... -->
      const htmlCommentMatch = content.match(/^<!--\s*([\s\S]*?)\s*-->/m)
      if (htmlCommentMatch) {
        const commentContent = htmlCommentMatch[1]
        nameMatch = commentContent.match(/Name\s*:\s*(.+)/i)
        descriptionMatch = commentContent.match(/Description\s*:\s*(.+)/i)
      }
      break
      
    case 'mermaid':
      // Mermaidコメント形式: %%{ "Name": "...", "Description": "..." }%%
      const mermaidCommentMatch = content.match(/^%%\s*\{\s*([\s\S]*?)\s*\}\s*%%/m)
      if (mermaidCommentMatch) {
        try {
          const jsonContent = `{${mermaidCommentMatch[1]}}`
          const metadata = JSON.parse(jsonContent)
          return {
            name: metadata.Name,
            description: metadata.Description
          }
        } catch (e) {
          console.warn('Failed to parse Mermaid metadata JSON:', e)
        }
      }
      break
      
    case 'txt':
      // テキストファイル用: # Name: ... # Description: ...
      nameMatch = content.match(/^#\s*Name\s*:\s*(.+)/im)
      descriptionMatch = content.match(/^#\s*Description\s*:\s*(.+)/im)
      break
      
    case 'tsx':
    default:
      // JSコメント形式: /* Name: ... Description: ... */
      const jsCommentMatch = content.match(/^\/\*\s*([\s\S]*?)\s*\*\//m)
      if (jsCommentMatch) {
        const commentContent = jsCommentMatch[1]
        nameMatch = commentContent.match(/Name\s*:\s*(.+)/i)
        descriptionMatch = commentContent.match(/Description\s*:\s*(.+)/i)
      }
      break
  }
  
  return {
    name: nameMatch ? nameMatch[1].trim() : undefined,
    description: descriptionMatch ? descriptionMatch[1].trim() : undefined
  }
}

// メタデータコメントを除去する関数（ファイル形式に応じて）
export const removeMetadata = (content: string, type: Page['type']): string => {
  let cleanContent = content
  
  switch (type) {
    case 'md':
    case 'svg':
      // HTMLコメント形式を除去: <!-- ... -->
      cleanContent = content.replace(/^<!--[\s\S]*?-->\s*/m, '')
      break
      
    case 'mermaid':
      // Mermaidコメント形式を除去: %%{ ... }%%
      cleanContent = content.replace(/^%%\s*\{[\s\S]*?\}\s*%%\s*/m, '')
      break
      
    case 'txt':
      // テキストファイルの先頭の#コメント行を除去
      cleanContent = content.replace(/^(#[^\n]*\n)+/m, '')
      break
      
    case 'tsx':
    default:
      // JSコメント形式を除去: /* ... */
      cleanContent = content.replace(/^\/\*[\s\S]*?\*\/\s*/m, '')
      break
  }
  
  return cleanContent.trim()
}

// 様々なファイル形式を動的に取得
const tsxModules = import.meta.glob('./*.tsx', { eager: false })
const tsxRawModules = import.meta.glob('./*.tsx', { eager: true, query: '?raw', import: 'default' })

// メタデータ抽出用（静的読み込み）
const mdMetadataModules = import.meta.glob('./*.md', { eager: true, query: '?raw', import: 'default' })
const svgMetadataModules = import.meta.glob('./*.svg', { eager: true, query: '?raw', import: 'default' })
const mermaidMetadataModules = import.meta.glob('./*.mermaid', { eager: true, query: '?raw', import: 'default' })
const txtMetadataModules = import.meta.glob('./*.txt', { eager: true, query: '?raw', import: 'default' })

// コンテンツ用（動的読み込み）
const mdContentModules = import.meta.glob('./*.md', { eager: false, query: '?raw', import: 'default' })
const svgContentModules = import.meta.glob('./*.svg', { eager: false, query: '?raw', import: 'default' })
const mermaidContentModules = import.meta.glob('./*.mermaid', { eager: false, query: '?raw', import: 'default' })
const txtContentModules = import.meta.glob('./*.txt', { eager: false, query: '?raw', import: 'default' })



// ファイル形式を判定する関数
const getFileType = (path: string): Page['type'] => {
  if (path.endsWith('.tsx')) return 'tsx'
  if (path.endsWith('.md')) return 'md'
  if (path.endsWith('.svg')) return 'svg'
  if (path.endsWith('.mermaid')) return 'mermaid'
  if (path.endsWith('.txt')) return 'txt'
  return 'txt' // デフォルト
}

// ファイル名からページデータを生成する関数
const createPageFromFile = (path: string, content: string): Page => {
  const extension = path.split('.').pop() || ''
  const filename = path.replace('./', '').replace(`.${extension}`, '')
  const type = getFileType(path)
  
  // ファイル内容からメタデータを抽出（ファイル形式に応じて）
  const metadata = extractMetadataFromContent(content, type)
  
  // デフォルトの名前（ファイル名をタイトルケースに変換）
  const defaultName = filename.replace(/([A-Z])/g, ' $1').trim()
  
  return {
    id: filename,
    name: metadata.name || defaultName,
    description: metadata.description,
    type,
    extension,
    content: type === 'tsx' ? undefined : undefined // TSX以外もcontentは保存しない（動的読み込みのため）
  }
}

// ファイル名の先頭に_が付いているファイルを除外する関数
const shouldExcludeFile = (path: string): boolean => {
  const filename = path.replace('./', '').split('.')[0]
  return filename.startsWith('_') || path.includes('index.')
}

// 全てのファイルからページデータを生成（メタデータのみ）
export const pages: Page[] = [
  ...Object.entries(tsxRawModules)
    .filter(([path]) => !shouldExcludeFile(path)) // index.tsxと_で始まるファイルは除外
    .map(([path, content]) => createPageFromFile(path, content as string)),
  
  ...Object.entries(mdMetadataModules)
    .filter(([path]) => !shouldExcludeFile(path)) // _で始まるファイルは除外
    .map(([path, content]) => createPageFromFile(path, content as string)),
  
  ...Object.entries(svgMetadataModules)
    .filter(([path]) => !shouldExcludeFile(path)) // _で始まるファイルは除外
    .map(([path, content]) => createPageFromFile(path, content as string)),
  
  ...Object.entries(mermaidMetadataModules)
    .filter(([path]) => !shouldExcludeFile(path)) // _で始まるファイルは除外
    .map(([path, content]) => createPageFromFile(path, content as string)),
  
  ...Object.entries(txtMetadataModules)
    .filter(([path]) => !shouldExcludeFile(path)) // _で始まるファイルは除外
    .map(([path, content]) => createPageFromFile(path, content as string))
].sort((a, b) => a.id.localeCompare(b.id)) // ID順でソート

// 動的にコンポーネントを取得する関数
export const getComponent = async (id: string) => {
  try {
    const modulePath = `./${id}.tsx`
    const moduleLoader = tsxModules[modulePath]
    if (moduleLoader) {
      const module = await moduleLoader()
      return (module as any).default
    }
    console.error(`Module not found: ${modulePath}`)
    return null
  } catch (error) {
    console.error(`Failed to load component: ${id}`, error)
    return null
  }
}

// 動的にコンテンツを取得する関数
export const getContent = async (id: string, type: Page['type']): Promise<string> => {
  try {
    const modulePath = `./${id}.${type}`
    let moduleLoader
    
    switch (type) {
      case 'md':
        moduleLoader = mdContentModules[modulePath]
        break
      case 'svg':
        moduleLoader = svgContentModules[modulePath]
        break
      case 'mermaid':
        moduleLoader = mermaidContentModules[modulePath]
        break
      case 'txt':
        moduleLoader = txtContentModules[modulePath]
        break
      default:
        throw new Error(`Unsupported content type: ${type}`)
    }
    
    if (moduleLoader) {
      const content = await moduleLoader()
      return content as string
    }
    
    console.error(`Content not found: ${modulePath}`)
    return ''
  } catch (error) {
    console.error(`Failed to load content: ${id}`, error)
    return ''
  }
} 