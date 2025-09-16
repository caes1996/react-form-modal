import { useCallback, useMemo, useState } from 'react'

export const useForm = (initialValues: Record<string, any>) => {
  const [formState, setFormState] = useState<Record<string, any>>(initialValues)

  const onInputChange = useCallback((eOrValue: any, name?: string) => {
    if (name) {
      const value = eOrValue
      setFormState(prev => ({ ...prev, [name]: value }))
      return
    }
    const e = eOrValue as React.ChangeEvent<HTMLInputElement>
    const { name: n, type, value, checked, files } = e.target as any
    let final: any = value
    if (type === 'checkbox' || type === 'switch') final = !!checked
    if (type === 'file') final = files?.[0] ?? null
    setFormState(prev => ({ ...prev, [n]: final }))
  }, [])

  const onResetForm = useCallback(() => setFormState(initialValues), [initialValues])

  const isFormDirty = useMemo(
    () => JSON.stringify(formState) !== JSON.stringify(initialValues),
    [formState, initialValues]
  )

  const updateFields = useCallback((patch: Record<string, any>) => {
    setFormState(prev => ({ ...prev, ...patch }))
  }, [])

  return { formState, setFormState, onInputChange, onResetForm, isFormDirty, updateFields }
}
