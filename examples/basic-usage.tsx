import { useState } from 'react'
import { FormModal, type FormField } from 'react-form-modal'

// 👇 Recomendado en tu entrypoint (main.tsx):
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'react-datepicker/dist/react-datepicker.css'

export default function BasicUsage() {
  const [open, setOpen] = useState(false)

  const fields: FormField[] = [
    { name: 'name', label: 'Name', type: 'text', colMd: 6 },
    { name: 'amount', label: 'Amount', type: 'currency', colMd: 6 },
    { name: 'date', label: 'Date', type: 'date', colMd: 6 },
    { name: 'discount', label: 'Discount', type: 'percent', min: 0, max: 100, step: 1, colMd: 6 },
  ]

  return (
    <div className="p-3">
      <h2 className="mb-3">React Form Modal — Basic Usage</h2>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Open Modal
      </button>

      <FormModal
        isOpen={open}
        toggle={() => setOpen(false)}
        title="Create Record"
        fields={fields}
        initialValues={{ name: '', amount: '', date: '', discount: 10 }}
        onSubmit={async (values) => {
          console.log('Submitted values:', values)
          setOpen(false)
        }}
      />
    </div>
  )
}
