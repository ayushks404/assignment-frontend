import Button from './components/Button'
import Card from './components/Card'
import WaveBackground from './components/WaveBackground'

function App() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-ocean-dark via-ocean-mid to-blue-900 text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Visual content container (elevated above waves) */}
      <Card className="w-full max-w-md text-center z-10">
        <div className="flex justify-center mb-4">
          {/* SVG Water Droplet Icon */}
          <svg className="w-14 h-14 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Water Tracker
        </h1>
        <p className="text-cyan-100/70 mb-6 text-sm">
          Theme foundation is established. The water color scheme, glassy components, and animated waves are fully integrated.
        </p>

        <div className="flex flex-col gap-3">
          <Button variant="primary">
            Primary Action
          </Button>
          <Button variant="secondary">
            Secondary Action
          </Button>
        </div>
      </Card>

      {/* Animated waves at bottom */}
      <WaveBackground />
    </div>
  )
}

export default App
