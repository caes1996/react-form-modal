import React from 'react'
import { FormGroup, Label, Input, Button, InputGroup, InputGroupText } from 'reactstrap'
import DatePicker from 'react-datepicker'
import { NumericFormat } from 'react-number-format'
import { areValuesEqual } from '../../utils/equals'
import { parseDateValue, toISODate, toISOLocal } from '../../utils/date'
import { getAcceptAttribute, isFileTypeValid } from '../../utils/files'
import type { FormField, DynamicConfig } from './types'

export type FieldRendererProps = {
  field: FormField
  index: number
  formState: Record<string, any>
  onInputChange: (e: any, name?: string) => void
  handleControlFieldChange: (e: any) => void
  dynamicConfig: DynamicConfig[]
  loading: boolean
  searchTexts: Record<string, string>
  setSearchTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>
  isSelectOpen: Record<string, boolean>
  setIsSelectOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  backgroundSearch: string
}

export const FieldRenderer: React.FC<FieldRendererProps> = (props) => {
  const {
    field, index, formState, onInputChange, handleControlFieldChange,
    dynamicConfig, loading, searchTexts, setSearchTexts,
    isSelectOpen, setIsSelectOpen, backgroundSearch,
  } = props

  const {
    name, label, type: fieldType, placeholder, options, description,
    colXs = 12, colSm, colMd, colLg, colXl,
    required = true, min, max, step, acceptedTypes, disabled = false, defaultValue,
  } = field

  const isDisabled = disabled || loading
  let colClasses = `col-${colXs}`
  if (colSm) colClasses += ` col-sm-${colSm}`
  if (colMd) colClasses += ` col-md-${colMd}`
  if (colLg) colClasses += ` col-lg-${colLg}`
  if (colXl) colClasses += ` col-xl-${colXl}`

  const isControlField = dynamicConfig.some(cfg => cfg.controlField === name)
  const hasValue = formState[name] !== undefined && formState[name] !== null && formState[name] !== ''
  const currentValue = hasValue ? formState[name] : (defaultValue ?? '')

  const toggleSelectOpen = (n: string) => {
    setIsSelectOpen(prev => ({ ...prev, [n]: !prev[n] }))
    if (isSelectOpen[n]) setSearchTexts(prev => ({ ...prev, [n]: '' }))
  }

  const handleSearchChange = (e: any, n: string) => {
    const { value } = e.target
    setSearchTexts(prev => ({ ...prev, [n]: value }))
  }

  // ---- tipos específicos ----
  if (fieldType === 'currency') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          <NumericFormat
            thousandSeparator prefix="$" className="form-control" name={name} id={name}
            placeholder={placeholder} value={currentValue}
            onValueChange={({ floatValue }) => onInputChange(floatValue || 0, name)} // Cambio aquí
            required={required} disabled={isDisabled}
          />
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'switch') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <div className="d-flex justify-content-between align-items-center h-100" style={{ marginTop: '2rem' }}>
            <Label htmlFor={name} className="mb-0 form-label">{label}</Label>
            <div className="form-switch">
              <Input type="switch" role="switch" id={name} name={name}
                checked={currentValue === true} onChange={onInputChange} disabled={isDisabled}
              />
            </div>
          </div>
          {description && <small className="form-text text-muted w-100">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'file') {
    const accept = getAcceptAttribute(acceptedTypes || 'pdf')
    const acceptedTypesText = Array.isArray(acceptedTypes) ? acceptedTypes.join(', ') : acceptedTypes || 'pdf'
    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          <Input type="file" name={name} id={name} onChange={onInputChange} required={required} disabled={isDisabled} accept={accept} />
          {currentValue && (
            <div className="mt-2">
              <small>Archivo seleccionado: {currentValue.name || currentValue}</small>
              {currentValue.name && !isFileTypeValid(currentValue, acceptedTypes || 'pdf') && (
                <p className="text-danger mt-1 mb-0"><small>Solo se permiten archivos de tipo: {acceptedTypesText}</small></p>
              )}
            </div>
          )}
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'textarea') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          <Input
            type="textarea" name={name} id={name} placeholder={placeholder}
            value={currentValue} onChange={onInputChange}
            required={required} disabled={isDisabled} rows={field.rows || 3}
          />
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'radio') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup tag="fieldset">
          <Label className="form-label">{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          <div className="mt-2">
            {field.options?.map((opt, idx) => (
              <FormGroup check inline key={idx} className="mb-2 me-3">
                <Input type="radio" name={name} value={opt.value as any} id={`${name}-${idx}`}
                  checked={areValuesEqual(currentValue, opt.value)} onChange={onInputChange} disabled={isDisabled} className="me-1"
                />
                <Label check htmlFor={`${name}-${idx}`} className="form-check-label">{opt.label}</Label>
              </FormGroup>
            ))}
          </div>
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'checkbox') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup className="checkbox-group" style={{ marginTop: '2rem' }}>
          <div className="form-check">
            <Input type="checkbox" className="form-check-input" name={name} id={name}
              checked={currentValue === true} onChange={onInputChange} disabled={isDisabled}
            />
            <Label className="form-check-label" htmlFor={name}>{label}</Label>
          </div>
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'color') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          <Input type="color" name={name} id={name}
            value={currentValue || '#000000'} onChange={onInputChange}
            className="form-control-color" required={required} disabled={isDisabled}
          />
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'range') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          <div className="d-flex align-items-center">
            <Input type="range" name={name} id={name}
              min={field.min ?? 0} max={field.max ?? 100} step={field.step ?? 1}
              value={currentValue !== undefined && currentValue !== '' ? currentValue : field.min ?? 0}
              onChange={onInputChange} className="form-range" required={required} disabled={isDisabled}
            />
            <span className="ms-2">{currentValue !== undefined ? currentValue : field.min ?? 0}</span>
          </div>
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'date' || fieldType === 'datetime-local' || fieldType === 'time') {
    const selectedDate = parseDateValue(currentValue, fieldType)
    const commonProps: any = {
      id: name,
      selected: selectedDate,
      onChange: (date: Date | null) => {
        let value = ''
        if (date) {
          if (fieldType === 'date') value = toISODate(date)
          else if (fieldType === 'datetime-local') value = toISOLocal(date)
          else if (fieldType === 'time') {
            const hh = String(date.getHours()).padStart(2, '0')
            const mm = String(date.getMinutes()).padStart(2, '0')
            value = `${hh}:${mm}`
          }
        }
        onInputChange({ target: { name, value } })
      },
      className: 'form-control',
      placeholderText: placeholder,
      required,
      disabled: isDisabled,
    }

    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <Label htmlFor={name} className="form-label d-block mb-2">
            {label}{required && <span className="text-danger ms-1">*</span>}
          </Label>
          <div className="date-picker-wrapper" style={{ display: 'block', width: '100%' }}>
            {fieldType === 'date' && (<DatePicker {...commonProps} dateFormat="yyyy-MM-dd" />)}
            {fieldType === 'datetime-local' && (<DatePicker {...commonProps} showTimeSelect timeIntervals={field.step ? Number(field.step) : 15} dateFormat="yyyy-MM-dd HH:mm" />)}
            {fieldType === 'time' && (<DatePicker {...commonProps} showTimeSelect showTimeSelectOnly timeIntervals={field.step ? Number(field.step) : 15} timeCaption="Hora" dateFormat="HH:mm" />)}
          </div>
          {description && <small className="form-text text-muted d-block mt-1">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'select') {
    const isSearchable = field.searchable === true
    if (!isSearchable) {
      return (
        <div className={colClasses} key={index}>
          <FormGroup>
            <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
            <Input type="select" name={name} id={name} value={currentValue}
              onChange={isControlField ? handleControlFieldChange : onInputChange}
              required={required} disabled={isDisabled}
            >
              <option value="">Seleccione {label}</option>
              {field.options?.map((opt, idx) => (
                <option key={idx} value={opt.value as any}>{opt.label}</option>
              ))}
            </Input>
            {description && <small className="form-text text-muted">{description}</small>}
          </FormGroup>
        </div>
      )
    }

    // searchable
    return (
      <div className={colClasses} key={index} id={`select-container-${name}`}>
        <FormGroup>
          <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          <div style={{ position: 'relative' }}>
            <Input
              type="text"
              value={currentValue ? field.options?.find(o => String(o.value) === String(currentValue))?.label || '' : ''}
              readOnly
              onClick={() => toggleSelectOpen(name)}
              placeholder={`Seleccione ${label}`}
              required={required}
              disabled={isDisabled}
            />
            {isSelectOpen[name] && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, backgroundColor: backgroundSearch, borderRadius: '0 0 0.25rem 0.25rem', boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)' }}>
                <div style={{ padding: '0.5rem' }}>
                  <Input type="text" placeholder="Buscar..." value={searchTexts[name] || ''} onChange={e => handleSearchChange(e, name)} autoFocus onClick={e => e.stopPropagation()} />
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <Button color="link" className="text-decoration-none w-100 text-start" onClick={() => { onInputChange({ target: { name, value: '' } }); toggleSelectOpen(name) }}>Seleccione {label}</Button>
                  {field.options?.filter(opt => !searchTexts[name] || opt.label.toLowerCase().includes((searchTexts[name] || '').toLowerCase())).map((opt, idx) => (
                    <Button key={idx} color={String(currentValue) === String(opt.value) ? 'light' : 'link'} className="text-decoration-none w-100 text-start"
                      onClick={() => {
                        onInputChange({ target: { name, value: opt.value } })
                        toggleSelectOpen(name)
                        if (isControlField) handleControlFieldChange({ target: { name, value: opt.value } })
                      }}
                    >{opt.label}</Button>
                  ))}
                  {field.options && searchTexts[name] && !field.options.filter(opt => opt.label.toLowerCase().includes((searchTexts[name] || '').toLowerCase())).length && (
                    <div className="p-2 text-muted">No se encontraron resultados</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'multiselect') {
    const selectedValues: any[] = Array.isArray(currentValue) ? currentValue : []
    const selectedOptions = field.options?.filter(opt => selectedValues.some(v => areValuesEqual(v, opt.value))) || []
    const isValueSelected = (v: any) => selectedValues.some(val => areValuesEqual(val, v))
    const processNewValue = (nv: any) => {
      if (typeof nv === 'string' && /^-?\d+(\.\d+)?$/.test(nv)) {
        return nv.indexOf('.') === -1 ? parseInt(nv, 10) : parseFloat(nv)
      }
      return nv
    }
    const isSearchable = field.searchable === true

    if (!isSearchable) {
      return (
        <div className={colClasses} key={index}>
          <FormGroup>
            <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
            {selectedOptions.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-2">
                {selectedOptions.map((opt, idx) => (
                  <Button color="light" size="sm" className="d-flex align-items-center rounded-pill mb-1 me-1" key={idx} type="button" style={{ fontSize: '0.75rem', paddingInline: '1rem' }}>
                    <span>{opt.label}</span>
                    <Button
                      close size="sm" className="p-0 ms-1"
                      style={{ fontSize: '0.6rem', lineHeight: 1, marginLeft: '0.2rem' }} type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={e => { e.preventDefault(); const nv = selectedValues.filter(v => !areValuesEqual(v, opt.value)); onInputChange({ target: { name, value: nv } }) }}
                      disabled={isDisabled}
                    />
                  </Button>
                ))}
              </div>
            )}
            <div className="dropdown-wrapper">
              <Input type="select" name={name} id={name} className="form-control" value=""
                onChange={e => {
                  if (e.target.value) {
                    const nv = processNewValue(e.target.value)
                    if (!isValueSelected(nv)) onInputChange({ target: { name, value: [...selectedValues, nv] } })
                    e.target.value = ''
                  }
                }}
                required={required && selectedValues.length === 0} disabled={isDisabled}
              >
                <option value="">Seleccione {label}</option>
                {field.options?.filter(opt => !isValueSelected(opt.value)).map((opt, idx) => (
                  <option key={idx} value={opt.value as any}>{opt.label}</option>
                ))}
              </Input>
            </div>
            {description && <small className="form-text text-muted d-block mt-2">{description}</small>}
          </FormGroup>
        </div>
      )
    }

    // searchable
    return (
      <div className={colClasses} key={index} id={`select-container-${name}`}>
        <FormGroup>
          <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          {selectedOptions.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-2">
              {selectedOptions.map((opt, idx) => (
                <Button color="light" size="sm" className="d-flex align-items-center rounded-pill mb-1 me-1" key={idx} type="button" style={{ fontSize: '0.9rem' }}>
                  <span>{opt.label}</span>
                  <Button
                    close size="sm" className="p-0 ms-1 text-danger" style={{ fontSize: '0.75rem', lineHeight: 1 }} type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={e => { e.preventDefault(); const nv = selectedValues.filter(v => !areValuesEqual(v, opt.value)); onInputChange({ target: { name, value: nv } }) }}
                    disabled={isDisabled}
                  />
                </Button>
              ))}
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <Input type="text" placeholder={`Seleccione ${label}`} onClick={() => toggleSelectOpen(name)} readOnly required={required && selectedValues.length === 0} disabled={isDisabled} />
            {isSelectOpen[name] && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, backgroundColor: backgroundSearch, borderRadius: '0 0 0.25rem 0.25rem', boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)' }}>
                <div style={{ padding: '0.5rem' }}>
                  <Input type="text" placeholder="Buscar..." value={searchTexts[name] || ''} onChange={e => handleSearchChange(e, name)} autoFocus onClick={e => e.stopPropagation()} />
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {field.options?.filter(opt => !isValueSelected(opt.value))
                    .filter(opt => !searchTexts[name] || opt.label.toLowerCase().includes((searchTexts[name] || '').toLowerCase()))
                    .map((opt, idx) => (
                      <Button key={idx} color="link" className="text-decoration-none w-100 text-start"
                        onClick={() => {
                          const nv = processNewValue(opt.value as any)
                          if (!isValueSelected(nv)) onInputChange({ target: { name, value: [...selectedValues, nv] } })
                        }}
                      >{opt.label}</Button>
                  ))}
                  {field.options && field.options
                    .filter(opt => !isValueSelected(opt.value))
                    .filter(opt => !searchTexts[name] || opt.label.toLowerCase().includes((searchTexts[name] || '').toLowerCase())).length === 0 && (
                    <div className="p-2 text-muted">{searchTexts[name] ? 'No se encontraron resultados' : 'Todos los elementos han sido seleccionados'}</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {description && <small className="form-text text-muted d-block mt-2">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'percent') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </Label>
          <InputGroup>
            <Input
              id={name}
              name={name}
              type="number"
              placeholder={placeholder}
              value={currentValue === '' || currentValue == null ? '' : currentValue}
              onChange={(e) => {
                const val = e.target.value
                const numVal = val === '' ? '' : parseFloat(val)
                onInputChange(isNaN(numVal as number) ? '' : numVal, name)
              }}
              onKeyDown={(e) => {
                // Permitir teclas de control y navegación
                if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(e.key) ||
                    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))) {
                  return
                }
                // Bloquear si no es número, punto decimal o signo menos
                if (!/[0-9\.\-]/.test(e.key)) {
                  e.preventDefault()
                }
              }}
              required={required}
              disabled={isDisabled}
              min={min ?? 0}
              max={max ?? 100}
              step={step ?? 0.01}
            />
            <InputGroupText>%</InputGroupText>
          </InputGroup>
          {description && (
            <small className="form-text text-muted">{description}</small>
          )}
        </FormGroup>
      </div>
    )
  }

  if (fieldType === 'number') {
    return (
      <div className={colClasses} key={index}>
        <FormGroup>
          <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
          <Input
            type="number" 
            name={name} 
            id={name} 
            placeholder={placeholder}
            value={currentValue === '' || currentValue == null ? '' : currentValue}
            onChange={(e) => {
              const val = e.target.value
              const numVal = val === '' ? '' : parseFloat(val)
              onInputChange(isNaN(numVal as number) ? '' : numVal, name)
            }}
            onKeyDown={(e) => {
              // Permitir teclas de control y navegación
              if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(e.key) ||
                  // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                  (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))) {
                return
              }
              // Bloquear si no es número, punto decimal o signo menos
              if (!/[0-9\.\-]/.test(e.key)) {
                e.preventDefault()
              }
            }}
            required={required} 
            disabled={isDisabled}
            min={min} 
            max={max} 
            step={step ?? "any"}
          />
          {description && <small className="form-text text-muted">{description}</small>}
        </FormGroup>
      </div>
    )
  }

  // Campo genérico para otros tipos
  return (
    <div className={colClasses} key={index}>
      <FormGroup>
        <Label htmlFor={name}>{label}{required && <span className="text-danger ms-1">*</span>}</Label>
        <Input
          type={fieldType} name={name} id={name} placeholder={placeholder}
          value={currentValue} onChange={onInputChange}
          required={required} disabled={isDisabled}
          min={min} max={max} step={step}
        />
        {description && <small className="form-text text-muted">{description}</small>}
      </FormGroup>
    </div>
  )
}