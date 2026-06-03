export interface Project {
  id: string
  title: string
  description: string
  image: string
  tech: string[]
  github: string
  demo: string
  position: [number, number, number]
  color: string
}

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Nebula Commerce',
    description: 'Headless e-commerce platform with real-time inventory, Stripe payments, and admin analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop',
    tech: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    github: 'https://github.com',
    demo: 'https://example.com',
    position: [22, 3.5, -22],
    color: '#8b5cf6',
  },
  {
    id: 'p2',
    title: 'Pulse Analytics',
    description: 'Real-time data visualization dashboard processing millions of events with WebSocket streaming.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tech: ['React', 'D3.js', 'Node.js', 'Redis'],
    github: 'https://github.com',
    demo: 'https://example.com',
    position: [26, 3.5, -18],
    color: '#06b6d4',
  },
  {
    id: 'p3',
    title: 'Verdant AR Garden',
    description: 'Augmented reality plant care app with ML disease detection and community features.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
    tech: ['React Native', 'TensorFlow', 'Firebase'],
    github: 'https://github.com',
    demo: 'https://example.com',
    position: [30, 3.5, -22],
    color: '#22c55e',
  },
  {
    id: 'p4',
    title: 'Echo Chat',
    description: 'End-to-end encrypted messaging with voice rooms, file sharing, and custom emoji reactions.',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop',
    tech: ['React', 'Socket.io', 'MongoDB', 'WebRTC'],
    github: 'https://github.com',
    demo: 'https://example.com',
    position: [34, 3.5, -18],
    color: '#ec4899',
  },
  {
    id: 'p5',
    title: 'SkyForge 3D',
    description: 'Browser-based 3D model editor with collaborative editing and GLTF export pipeline.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    tech: ['Three.js', 'React', 'WebGL', 'Rust/WASM'],
    github: 'https://github.com',
    demo: 'https://example.com',
    position: [22, 3.5, -14],
    color: '#f59e0b',
  },
  {
    id: 'p6',
    title: 'TaskFlow Pro',
    description: 'Kanban project management with AI task prioritization, time tracking, and team workspaces.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
    tech: ['Vue 3', 'TypeScript', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com',
    demo: 'https://example.com',
    position: [26, 3.5, -10],
    color: '#3b82f6',
  },
  {
    id: 'p7',
    title: 'CryptoVault',
    description: 'Secure portfolio tracker with multi-chain support, price alerts, and DeFi yield analytics.',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop',
    tech: ['React', 'ethers.js', 'GraphQL', 'AWS'],
    github: 'https://github.com',
    demo: 'https://example.com',
    position: [30, 3.5, -14],
    color: '#a855f7',
  },
  {
    id: 'p8',
    title: 'SoundScape',
    description: 'Generative ambient music player with spatial audio, mood presets, and social playlists.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop',
    tech: ['React', 'Web Audio API', 'Tone.js', 'Supabase'],
    github: 'https://github.com',
    demo: 'https://example.com',
    position: [34, 3.5, -10],
    color: '#ef4444',
  },
]
