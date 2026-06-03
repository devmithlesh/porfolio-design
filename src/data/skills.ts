export interface Skill {
  id: string
  name: string
  icon: string
  color: string
  description: string
  position: [number, number, number]
}

export const skills: Skill[] = [
  { id: 'react', name: 'React', icon: '⚛️', color: '#61dafb', description: 'Component architecture, hooks, performance optimization', position: [-28, 3.5, 26] },
  { id: 'nextjs', name: 'Next.js', icon: '▲', color: '#ffffff', description: 'SSR, SSG, API routes, App Router', position: [-24, 3.5, 30] },
  { id: 'typescript', name: 'TypeScript', icon: 'TS', color: '#3178c6', description: 'Type-safe applications, generics, advanced patterns', position: [-20, 3.5, 26] },
  { id: 'nodejs', name: 'Node.js', icon: '🟢', color: '#68a063', description: 'REST APIs, microservices, real-time systems', position: [-16, 3.5, 30] },
  { id: 'threejs', name: 'Three.js', icon: '🎮', color: '#ffffff', description: 'WebGL, shaders, 3D experiences, R3F', position: [-28, 3.5, 30] },
  { id: 'tailwind', name: 'Tailwind', icon: '🎨', color: '#38bdf8', description: 'Utility-first CSS, responsive design systems', position: [-20, 3.5, 30] },
  { id: 'mongodb', name: 'MongoDB', icon: '🍃', color: '#47a248', description: 'Document modeling, aggregation, Atlas', position: [-24, 3.5, 26] },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', color: '#336791', description: 'Relational design, queries, optimization', position: [-16, 3.5, 26] },
]
