import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from 'reactstrap'
import { FieldRenderer } from './FieldRenderer'
import type { FormField, DynamicConfig } from './types'
import { useForm } from '../../hooks/useForm'
import 'react-datepicker/dist/react-datepicker.css'

// Estilos mínimos de Bootstrap solo para el componente
const componentStyles = `
  .form-modal-unique {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.5;
    color: #212529;
  }
  
  .form-modal-unique .modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1055;
    display: none;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
  }
  
  .form-modal-unique .modal.show {
    display: block;
  }
  
  .form-modal-unique .modal-dialog {
    position: relative;
    width: auto;
    margin: 0.5rem;
    pointer-events: none;
  }
  
  .form-modal-unique .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.375rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    outline: 0;
  }
  
  .form-modal-unique .modal-header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(0.375rem - 1px);
    border-top-right-radius: calc(0.375rem - 1px);
  }
  
  .form-modal-unique .modal-title {
    margin-bottom: 0;
    line-height: 1.5;
  }
  
  .form-modal-unique .modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem;
  }
  
  .form-modal-unique .modal-footer {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-end;
    padding: 0.75rem;
    border-top: 1px solid #dee2e6;
    border-bottom-right-radius: calc(0.375rem - 1px);
    border-bottom-left-radius: calc(0.375rem - 1px);
  }
  
  .form-modal-unique .btn {
    display: inline-block;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    border-radius: 0.375rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    margin-left: 0.5rem;
  }
  
  .form-modal-unique .btn-light {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa;
  }
  
  .form-modal-unique .btn-success {
    color: #fff;
    background-color: #198754;
    border-color: #198754;
  }
  
  .form-modal-unique .btn:hover {
    opacity: 0.85;
  }
  
  .form-modal-unique .btn:disabled {
    pointer-events: none;
    opacity: 0.65;
  }
  
  .form-modal-unique .spinner-border-sm {
    width: 0.875rem;
    height: 0.875rem;
    border-width: 0.1em;
  }
  
  .form-modal-unique .form-group {
    margin-bottom: 1rem;
  }
  
  .form-modal-unique .form-label {
    display: block !important;
    margin-bottom: 0.5rem !important;
    font-weight: 500;
  }
  
  .form-modal-unique .form-control {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  
  .form-modal-unique .form-control:focus {
    color: #212529;
    background-color: #fff;
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  }
  
  .form-modal-unique .form-control:disabled {
    background-color: #e9ecef;
    opacity: 1;
  }
  
  .form-modal-unique .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -0.75rem;
    margin-left: -0.75rem;
  }
  
  .form-modal-unique [class*="col-"] {
    position: relative;
    width: 100%;
    padding-right: 0.75rem;
    padding-left: 0.75rem;
  }
  
  .form-modal-unique .col-12 { flex: 0 0 auto; width: 100%; }
  .form-modal-unique .col-6 { flex: 0 0 auto; width: 50%; }
  .form-modal-unique .col-4 { flex: 0 0 auto; width: 33.333333%; }
  .form-modal-unique .col-3 { flex: 0 0 auto; width: 25%; }
  
  .form-modal-unique .react-datepicker-wrapper {
    display: block !important;
    width: 100% !important;
  }
  
  .form-modal-unique .react-datepicker__input-container {
    display: block !important;
    width: 100% !important;
  }
  
  .form-modal-unique .date-picker-wrapper {
    display: block !important;
    width: 100% !important;
    clear: both !important;
  }
  
  .form-modal-unique .input-group {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    width: 100%;
  }
  
  .form-modal-unique .input-group-text {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    text-align: center;
    white-space: nowrap;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
  }
  
  .form-modal-unique .input-group .form-control {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  
  .form-modal-unique .input-group-text {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  
  .form-modal-unique .text-danger {
    color: #dc3545;
  }
  
  .form-modal-unique .text-muted {
    color: #6c757d;
  }
  
  .form-modal-unique .d-flex {
    display: flex;
  }
  
  .form-modal-unique .d-block {
    display: block;
  }
  
  .form-modal-unique .justify-content-between {
    justify-content: space-between;
  }
  
  .form-modal-unique .align-items-center {
    align-items: center;
  }
  
  .form-modal-unique .mb-0 {
    margin-bottom: 0;
  }
  
  .form-modal-unique .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .form-modal-unique .ms-1 {
    margin-left: 0.25rem;
  }
  
  .form-modal-unique .ms-2 {
    margin-left: 0.5rem;
  }
  
  .form-modal-unique .mt-1 {
    margin-top: 0.25rem;
  }
  
  .form-modal-unique .mt-2 {
    margin-top: 0.5rem;
  }
  
  .form-modal-unique .w-100 {
    width: 100%;
  }
`

// Inyectar estilos específicos del componente
if (!document.getElementById('form-modal-styles')) {
  const styleSheet = document.createElement('style')
  styleSheet.id = 'form-modal-styles'
  styleSheet.textContent = componentStyles
  document.head.appendChild(styleSheet)
}

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
    <div className="form-modal-unique">
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
    </div>
  )
}

// PropTypes para consumidores JS
;(FormModal as any).propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}