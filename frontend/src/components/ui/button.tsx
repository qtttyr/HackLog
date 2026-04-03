import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }>

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`${variant === 'primary' ? 'btn-primary' : 'btn-ghost'} ${className}`.trim()}
    >
      {children}
    </button>
  )
}
