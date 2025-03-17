import * as React from 'react'

import { cn } from '@/lib/utils'

// Adicionando forwardRef no Textarea
const Textarea = React.forwardRef<
  HTMLTextAreaElement, // O tipo da ref, que neste caso é HTMLTextAreaElement
  React.ComponentProps<'textarea'> // As props do textarea
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref} // Passando a ref para o elemento <textarea>
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props} // Passando todas as outras props para o textarea
    />
  )
})

Textarea.displayName = 'Textarea' // Para uma boa depuração, defina um nome de display

export { Textarea }
