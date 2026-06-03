export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  position: [number, number, number]
  category: 'experience' | 'certification' | 'award' | 'project'
}

export const achievements: Achievement[] = [
  {
    id: 'exp-senior',
    title: '5+ Years Experience',
    description: 'Senior-level full-stack development across multiple industries.',
    icon: '⭐',
    position: [22, 3.5, 26],
    category: 'experience',
  },
  {
    id: 'cert-aws',
    title: 'AWS Solutions Architect',
    description: 'Certified in designing distributed systems on AWS.',
    icon: '☁️',
    position: [26, 3.5, 30],
    category: 'certification',
  },
  {
    id: 'cert-react',
    title: 'React Advanced Certification',
    description: 'Expert-level React patterns and performance.',
    icon: '⚛️',
    position: [30, 3.5, 26],
    category: 'certification',
  },
  {
    id: 'award-hackathon',
    title: 'Hackathon Winner 2024',
    description: 'First place at Global Web3 Hackathon — 200+ teams.',
    icon: '🏆',
    position: [34, 3.5, 30],
    category: 'award',
  },
  {
    id: 'award-opensource',
    title: 'Open Source Contributor',
    description: '500+ contributions to popular OSS projects.',
    icon: '🌟',
    position: [22, 3.5, 30],
    category: 'award',
  },
  {
    id: 'proj-50',
    title: '50+ Projects Delivered',
    description: 'Successfully shipped products for startups and enterprises.',
    icon: '🚀',
    position: [30, 3.5, 30],
    category: 'project',
  },
]
