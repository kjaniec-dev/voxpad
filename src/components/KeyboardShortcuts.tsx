import { useEffect } from 'react'
import { useVoxelStore, Tool } from '../store/voxelStore'

const TOOL_SHORTCUTS: Record<string, Tool> = {
  '1': 'add',
  '2': 'remove',
  '3': 'paint',
}

function shouldIgnoreShortcut(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select'
}

export default function KeyboardShortcuts() {
  const setTool = useVoxelStore((s) => s.setTool)
  const setClearConfirmOpen = useVoxelStore((s) => s.setClearConfirmOpen)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || shouldIgnoreShortcut(event.target)) return

      const tool = TOOL_SHORTCUTS[event.key]
      if (tool) {
        event.preventDefault()
        setTool(tool)
        return
      }

      if (event.key.toLowerCase() === 'c') {
        event.preventDefault()
        setClearConfirmOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setTool, setClearConfirmOpen])

  return null
}

