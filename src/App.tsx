import Scene from './components/Scene'
import Toolbar from './components/Toolbar'
import Palette from './components/Palette'
import HelpHint from './components/HelpHint'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Scene />
      <Toolbar />
      <Palette />
      <HelpHint />
    </div>
  )
}
