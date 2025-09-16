export const isFileTypeValid = (file: File, acceptedTypes?: string | string[]) => {
  if (!acceptedTypes) return true
  const arr = Array.isArray(acceptedTypes) ? acceptedTypes : [acceptedTypes]
  const ext = file.name.split('.').pop()?.toLowerCase()
  return arr.some(t => (t.startsWith('.') ? t.slice(1) : t).toLowerCase() === ext)
}

export const getAcceptAttribute = (acceptedTypes?: string | string[]) => {
  if (!acceptedTypes) return ''
  const arr = Array.isArray(acceptedTypes) ? acceptedTypes : [acceptedTypes]
  return arr.map(t => (t.startsWith('.') ? t : `.${t}`)).join(',')
}
