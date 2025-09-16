import { useMemo, useState } from 'react'
import { FormModal, type FormField, type DynamicConfig } from 'react-form-modal'

// 👇 Recomendado en tu entrypoint (main.tsx):
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'react-datepicker/dist/react-datepicker.css'

type Values = {
  type: 'person' | 'company' | ''
  firstName: string
  lastName: string
  companyName: string
  email: string
  phone: string
  amount: string | number
  discount: number
  startDate: string
  startTime: string
  schedule: string
  color: string
  agree: boolean
  avatar?: File | null
  tags: Array<string | number>
  preference: string | number
}

export default function ModularUsage() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Campos (puedes venir de un config remoto y usar useMemo para perf)
  const fields: FormField[] = useMemo(
    () => [
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        searchable: true,
        options: [
          { value: 'person', label: 'Person' },
          { value: 'company', label: 'Company' },
        ],
        colMd: 6,
        defaultValue: '',
      },
      { name: 'firstName', label: 'First Name', type: 'text', colMd: 6 },
      { name: 'lastName', label: 'Last Name', type: 'text', colMd: 6 },
      { name: 'companyName', label: 'Company Name', type: 'text', colMd: 12 },

      { name: 'email', label: 'Email', type: 'email', colMd: 6 },
      { name: 'phone', label: 'Phone', type: 'tel', colMd: 6 },

      { name: 'amount', label: 'Amount (USD)', type: 'currency', colMd: 6 },
      {
        name: 'discount',
        label: 'Discount',
        type: 'percent',
        min: 0,
        max: 100,
        step: 1,
        colMd: 6,
        defaultValue: 0,
      },

      { name: 'startDate', label: 'Start Date', type: 'date', colMd: 6 },
      {
        name: 'schedule',
        label: 'Schedule',
        type: 'datetime-local',
        step: 15,
        colMd: 6,
        description: 'Select date and time',
      },
      { name: 'startTime', label: 'Start Time', type: 'time', step: 15, colMd: 6 },

      {
        name: 'preference',
        label: 'Preference',
        type: 'radio',
        options: [
          { value: 1, label: 'Option A' },
          { value: 2, label: 'Option B' },
        ],
        colMd: 6,
      },

      {
        name: 'tags',
        label: 'Tags (Multi)',
        type: 'multiselect',
        searchable: true,
        options: [
          { value: 'frontend', label: 'Frontend' },
          { value: 'backend', label: 'Backend' },
          { value: 'fullstack', label: 'Fullstack' },
          { value: 1, label: 'Numeric-1' },
          { value: 2, label: 'Numeric-2' },
        ],
        colMd: 12,
        defaultValue: [],
      },

      {
        name: 'avatar',
        label: 'Avatar (PNG/JPG)',
        type: 'file',
        acceptedTypes: ['png', 'jpg', 'jpeg'],
        colMd: 12,
        description: 'Max 5MB (validations up to you)',
      },

      { name: 'color', label: 'Brand Color', type: 'color', colMd: 6, defaultValue: '#3b82f6' },
      {
        name: 'agree',
        label: 'I agree with terms',
        type: 'checkbox',
        colMd: 6,
        defaultValue: false,
      },

      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        rows: 4,
        colMd: 12,
        placeholder: 'Type any additional information...',
      },

      {
        name: 'priority',
        label: 'Priority',
        type: 'range',
        min: 0,
        max: 10,
        step: 1,
        colMd: 12,
        defaultValue: 5,
      },
    ],
    []
  )

  // Reglas dinámicas: muestran campos según "type"
  const dynamicConfig: DynamicConfig[] = useMemo(
    () => [
      {
        controlField: 'type',
        options: [
          { value: 'person', fields: ['type', 'firstName', 'lastName', 'email', 'phone', 'amount', 'discount', 'startDate', 'schedule', 'startTime', 'preference', 'tags', 'avatar', 'color', 'agree', 'notes', 'priority'] },
          { value: 'company', fields: ['type', 'companyName', 'email', 'phone', 'amount', 'discount', 'startDate', 'schedule', 'startTime', 'preference', 'tags', 'avatar', 'color', 'agree', 'notes', 'priority'] },
          { value: '', fields: ['type'] }, // default si no hay valor
        ],
      },
    ],
    []
  )

  // Valores iniciales
  const initialValues: Values = {
    type: '',
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    amount: '',
    discount: 0,
    startDate: '',
    startTime: '',
    schedule: '',
    color: '#3b82f6',
    agree: false,
    avatar: null,
    tags: [],
    preference: 1,
  }

  // Validación personalizada
  const validateForm = (values: Record<string, any>) => {
    const errors: Record<string, string> = {}
    if (!values.type) errors.type = 'Type is required'
    if (values.type === 'person') {
      if (!values.firstName?.trim()) errors.firstName = 'First Name is required'
      if (!values.lastName?.trim()) errors.lastName = 'Last Name is required'
    } else if (values.type === 'company') {
      if (!values.companyName?.trim()) errors.companyName = 'Company Name is required'
    }
    if (values.discount != null && (values.discount < 0 || values.discount > 100)) {
      errors.discount = 'Discount must be between 0 and 100'
    }
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = 'Invalid email'
    }
    if (!values.agree) {
      errors.agree = 'You must accept the terms'
    }
    return Object.keys(errors).length ? errors : null
  }

  const handleSubmit = async (values: Record<string, any>) => {
    setLoading(true)
    try {
      // Simula IO
      await new Promise((r) => setTimeout(r, 800))
      console.log('Submitted:', values)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3">
      <h2 className="mb-3">React Form Modal — Modular Usage</h2>

      <div className="d-flex gap-2">
        <button className="btn btn-outline-primary" onClick={() => setOpen(true)}>
          Open Advanced Modal
        </button>
      </div>

      <FormModal
        isOpen={open}
        toggle={() => setOpen(false)}
        title="New Entity"
        fields={fields}
        initialValues={initialValues}
        dynamicConfig={dynamicConfig}
        validateForm={validateForm}
        onSubmit={handleSubmit}
        submitButtonText="Save"
        cancelButtonText="Close"
        loading={loading}
        modalSize="lg"
      />
    </div>
  )
}
