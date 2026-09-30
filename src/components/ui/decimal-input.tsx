import * as React from 'react'
import { Input } from '@/components/ui/input'

/**
 * Text input for decimal numbers. Uses type="text" (not "number") because
 * native number inputs on mobile only accept "." as a decimal separator —
 * typing "," (common on bg/EU keyboards) makes the value invalid and silently
 * clears it. Parse the string with `parseDecimal` from lib/utils, which
 * accepts both "," and ".".
 */
export const DecimalInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>
>((props, ref) => (
  <Input ref={ref} type="text" inputMode="decimal" autoComplete="off" {...props} />
))
DecimalInput.displayName = 'DecimalInput'
