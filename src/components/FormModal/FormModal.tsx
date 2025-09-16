import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from 'reactstrap'
import { FieldRenderer } from './FieldRenderer'
import type { FormField, DynamicConfig } from './types'
import { useForm } from '../../hooks/useForm'
import '../../styles/datepicker-overrides.css'

export type FormModalProps = {
  isOpen: boolean
  toggle: () => void
  title: string
  fields: FormField[]
  initialValues: Record<string, any>
  onSubmit: (values: Record<string, any>) => Promise<void> | void
  submitButtonText?: string
  cancelButtonText?: string
  modalSize?: string
  loading?: boolean
  validateForm?: ((values: Record<string, any>) => Record<string, string> | null) | null
  dynamicConfig?: DynamicConfig[]
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  toggle,
  title,
  fields: initialFields,
  initialValues,
  onSubmit,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  modalSize = 'lg',
  loading = false,
  validateForm = null,
  dynamicConfig = [],
}) => {
  const [displayFields, setDisplayFields] = useState<FormField[]>(initialFields)
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({})
  const [isSelectOpen, setIsSelectOpen] = useState<Record<string, boolean>>({})
  const [backgroundSearch, setBackgroundSearch] = useState('#fff')

  const { formState, onInputChange, onResetForm, setFormState } = useForm(initialValues)

  const applyDefaultValues = (fields: FormField[], current: Record<string, any>) => {
    const out = { ...current }
    fields.forEach(f => {
      if (f.defaultValue !== undefined && (out[f.name] === undefined || out[f.name] === null || out[f.name] === '')) {
        out[f.name] = f.defaultValue
      }
    })
    return out
  }

  // tema claro/oscuro (para fondo del dropdown buscable)
  useEffect(() => {
    const updateBg = () => {
      const isDark = document.body.getAttribute('data-theme') === 'dark'
      setBackgroundSearch(isDark ? '#1f2937' : '#fff')
    }
    updateBg()
    const obs = new MutationObserver(updateBg)
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  // sincroniza initialValues + defaults
  useEffect(() => {
    const withDefaults = applyDefaultValues(initialFields, initialValues)
    setFormState(withDefaults)
  }, [initialValues, initialFields, setFormState])

  // dinámica de campos
  useEffect(() => {
    if (!dynamicConfig?.length) { setDisplayFields(initialFields); return }
    let filtered = initialFields
    dynamicConfig.forEach(cfg => {
      if (!filtered.some(f => f.name === cfg.controlField)) return
      const controlValue = (formState as any)[cfg.controlField]
      const selected = cfg.options.find(o => String(o.value) === String(controlValue))
      if (selected) {
        filtered = filtered.filter(f => selected.fields.includes(f.name))
      } else {
        const def = cfg.options.find(o => o.value === '' || o.value === null)
        filtered = def ? filtered.filter(f => def.fields.includes(f.name)) : filtered.filter(f => f.name === cfg.controlField)
      }
    })
    setDisplayFields(filtered)
  }, [formState, initialFields, dynamicConfig])

  // cerrar selects al clickear fuera
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      Object.keys(isSelectOpen).forEach(name => {
        if (isSelectOpen[name]) {
          const el = document.getElementById(`select-container-${name}`)
          if (el && !el.contains(ev.target as Node)) {
            setIsSelectOpen(prev => ({ ...prev, [name]: false }))
            setSearchTexts(prev => ({ ...prev, [name]: '' }))
          }
        }
      })
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isSelectOpen])

  const handleControlFieldChange = (e: any) => onInputChange(e)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm) {
      const errs = validateForm(formState)
      if (errs && Object.keys(errs).length > 0) {
        console.error('Errores de validación:', errs)
        return
      }
    }
    await onSubmit(formState)
    onResetForm()
  }

  // re-aplica defaults al abrir
  useEffect(() => {
    if (isOpen) {
      const withDefaults = applyDefaultValues(initialFields, initialValues)
      setFormState(withDefaults)
    }
  }, [isOpen, initialFields, initialValues, setFormState])

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size={modalSize}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <fieldset>
            <div className="row">
              {displayFields.map((field, index) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  index={index}
                  formState={formState}
                  onInputChange={onInputChange}
                  handleControlFieldChange={handleControlFieldChange}
                  dynamicConfig={dynamicConfig}
                  loading={loading}
                  searchTexts={searchTexts}
                  setSearchTexts={setSearchTexts}
                  isSelectOpen={isSelectOpen}
                  setIsSelectOpen={setIsSelectOpen}
                  backgroundSearch={backgroundSearch}
                />
              ))}
            </div>
          </fieldset>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggle} disabled={loading}>{' '}{cancelButtonText}{' '}</Button>
          <Button color="success" type="submit" disabled={loading}>
            {loading ? (<><Spinner size="sm" /> Procesando...</>) : submitButtonText}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

// PropTypes para consumidores JS
;(FormModal as any).propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}
