export type Option = { value: string | number | null; label: string }

export type FormField = {
  name: string
  label: string
  type:
    | 'text' | 'number' | 'date' | 'datetime-local' | 'time'
    | 'email' | 'password' | 'search' | 'tel' | 'url'
    | 'select' | 'multiselect' | 'currency' | 'switch'
    | 'file' | 'textarea' | 'radio' | 'checkbox' | 'color' | 'range' | 'percent'
  placeholder?: string
  description?: string
  defaultValue?: any
  options?: Option[]
  required?: boolean
  disabled?: boolean
  searchable?: boolean
  min?: string | number
  max?: string | number
  step?: string | number
  rows?: number
  colXs?: number
  colSm?: number
  colMd?: number
  colLg?: number
  colXl?: number
  acceptedTypes?: string | string[]
}

export type DynamicConfig = {
  controlField: string
  options: { value: string | number | null; fields: string[] }[]
}
