export const areValuesEqual = (a: any, b: any) => {
  if (a === b) return true
  if (typeof a === 'string' && typeof b === 'number') return a === String(b)
  if (typeof a === 'number' && typeof b === 'string') return String(a) === b
  return false
}