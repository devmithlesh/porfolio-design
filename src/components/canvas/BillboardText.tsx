import { Billboard, Text } from '@react-three/drei'
import type { ComponentProps, ReactNode } from 'react'

type TextProps = ComponentProps<typeof Text>

interface BillboardTextProps extends TextProps {
  children: ReactNode
}

/** Hamesha camera ki taraf — text kabhi ulta nahi dikhega */
export function BillboardText({ children, ...props }: BillboardTextProps) {
  return (
    <Billboard follow>
      <Text {...props}>{children}</Text>
    </Billboard>
  )
}
