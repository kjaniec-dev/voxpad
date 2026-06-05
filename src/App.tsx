import Scene from './components/Scene'
import Toolbar from './components/Toolbar'
import Palette from './components/Palette'
import HelpHint from './components/HelpHint'
import KeyboardShortcuts from './components/KeyboardShortcuts'

export default function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <Scene />
      <Toolbar />
      <Palette />
      <HelpHint />
      <KeyboardShortcuts />
    </div>
  )
}
