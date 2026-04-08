import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Circle, Clock, CheckCircle, ChevronDown, ChevronRight, Lightbulb, Sparkles } from 'lucide-react'

interface RoadmapNode {
  id: string
  title: string
  description?: string
  status: 'todo' | 'doing' | 'done'
  children: RoadmapNode[]
}

const mockRoadmap: RoadmapNode[] = []

function RoadmapItem({ node, depth = 0 }: { node: RoadmapNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const [status, setStatus] = useState(node.status)

  const statusColors = {
    todo: 'bg-gray-100 text-gray-600 border-gray-300',
    doing: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    done: 'bg-green-100 text-green-700 border-green-400',
  }

  const statusIcons = { todo: Circle, doing: Clock, done: CheckCircle }

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className={`rounded-lg border-2 p-3 mb-2 ${statusColors[status]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {node.children.length > 0 && (
              <button onClick={() => setExpanded(!expanded)} className="p-1">
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            <span className="font-medium">{node.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setStatus(status === 'done' ? 'todo' : status === 'todo' ? 'doing' : 'done')} className="p-1 hover:scale-110 transition-transform">
              {(() => {
                const Icon = statusIcons[status]
                return <Icon className="h-5 w-5" />
              })()}
            </button>
          </div>
        </div>
        {node.description && <p className="mt-1 text-sm opacity-70">{node.description}</p>}
      </div>
      {expanded && node.children.map(child => (
        <RoadmapItem key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export function RoadmapPage() {
  const [roadmap] = useState(mockRoadmap)
  const [isGenerating, setIsGenerating] = useState(false)

  function generateWithAI() {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      alert('AI Roadmap generation would analyze your hackathon and project idea to create a personalized roadmap!')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Roadmap</h1>
          <p className="text-sm text-gray-600">Tree-structured project timeline</p>
        </div>
        <Button onClick={generateWithAI} disabled={isGenerating}>
          {isGenerating ? '🤖 Generating...' : <><Sparkles className="h-4 w-4 inline mr-1" />Generate with AI</>}
        </Button>
      </div>

      <div className="rounded-xl border-2 border-black bg-[#c7e7ff] p-4">
        <p className="text-sm">
          <Lightbulb className="h-4 w-4 inline mr-1" /><strong>Tip:</strong> Click on status icons to change progress. Expand/collapse branches to see details.
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.map(node => (
          <RoadmapItem key={node.id} node={node} />
        ))}
      </div>
    </div>
  )
}