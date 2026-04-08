import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { ArrowUp, Sparkles } from 'lucide-react'

interface Idea {
  id: string
  title: string
  description: string
  votes: number
  tags: string[]
}

const mockIdeas: Idea[] = [
  { id: '1', title: 'AI-Powered Code Review', description: 'Real-time code analysis that suggests improvements during hackathon', votes: 12, tags: ['AI', 'Developer Tools'] },
  { id: '2', title: 'Collaborative Whiteboard', description: 'Visual workspace for brainstorming with AI-suggested layouts', votes: 8, tags: ['Collaboration', 'Design'] },
  { id: '3', title: 'Pitch Deck Generator', description: 'AI generates pitch deck from your project description', votes: 15, tags: ['AI', 'Presentation'] },
  { id: '4', title: 'Live Demo Recorder', description: 'Record and share demos automatically with timestamped notes', votes: 6, tags: ['Demo', 'Collaboration'] },
  { id: '5', title: 'Team Energy Tracker', description: 'Gamify team progress with points, streaks, and achievements', votes: 9, tags: ['Gamification', 'Team'] },
]

export function BrainstormPage() {
  const [ideas, setIdeas] = useState(mockIdeas)
  const [isGenerating, setIsGenerating] = useState(false)
  const [filter, setFilter] = useState<string | null>(null)

  function vote(id: string) {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
    ))
  }

  function generateWithAI() {
    setIsGenerating(true)
    setTimeout(() => {
      const newIdeas: Idea[] = [
        { id: crypto.randomUUID(), title: 'Smart Time Manager', description: 'AI schedules optimal work sessions based on team energy levels', votes: 0, tags: ['AI', 'Productivity'] },
        { id: crypto.randomUUID(), title: 'Instant API Generator', description: 'Describe your data needs, get a working API in seconds', votes: 0, tags: ['Developer Tools', 'AI'] },
      ]
      setIdeas([...newIdeas, ...ideas])
      setIsGenerating(false)
    }, 2000)
  }

  const allTags = [...new Set(ideas.flatMap(i => i.tags))]
  const filteredIdeas = filter ? ideas.filter(i => i.tags.includes(filter)) : ideas

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Brainstorm</h1>
          <p className="text-sm text-gray-600">Generated project ideas for your hackathon</p>
        </div>
        <Button onClick={generateWithAI} disabled={isGenerating}>
          {isGenerating ? '🤖 Analyzing...' : <><Sparkles className="h-4 w-4 inline mr-1" />Generate Ideas</>}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`rounded-lg px-4 py-2 text-sm font-bold border-2 transition-all ${!filter ? 'border-black bg-black text-white' : 'border-black bg-white hover:bg-gray-100'}`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(filter === tag ? null : tag)}
            className={`rounded-lg px-4 py-2 text-sm font-bold border-2 transition-all ${filter === tag ? 'border-black bg-black text-white' : 'border-black bg-white hover:bg-gray-100'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredIdeas.map(idea => (
          <div key={idea.id} className="brutal-card bg-white p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{idea.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{idea.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {idea.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button 
                  onClick={() => vote(idea.id)} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
                <span className="font-bold text-lg">{idea.votes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No ideas match this filter</p>
        </div>
      )}
    </div>
  )
}