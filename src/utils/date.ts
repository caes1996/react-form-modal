export const toISODate = (d?: Date | null) => {
  if (!d) return ''
  const off = d.getTimezoneOffset()
  const d2 = new Date(d.getTime() - off * 60 * 1000)
  return d2.toISOString().slice(0, 10)
}

export const toISOLocal = (d?: Date | null, withSeconds = false) => {
  if (!d) return ''
  const off = d.getTimezoneOffset()
  const d2 = new Date(d.getTime() - off * 60 * 1000)
  return d2.toISOString().slice(0, withSeconds ? 19 : 16)
}

export const parseDateValue = (value: any, type: string): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  if (type === 'date') return new Date(`${value}T00:00:00`)
  if (type === 'datetime-local') return new Date(value)
  if (type === 'time') {
    const [h, m = '00'] = String(value).split(':')
    const d = new Date()
    d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0)
    return d
  }
  return new Date(value)
}
