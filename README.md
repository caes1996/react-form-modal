# API Documentation – React Form Modal

## 📋 Table of Contents


- [Components](#components)
- [FormModal](#formmodal)
- [Hooks](#hooks)
- [useForm](#useform)
- [Utilities](#utilities)
- [Date Utilities](#date-utilities)
- [File Utilities](#file-utilities)
- [Equality Utilities](#equality-utilities)
- [Types](#types)
- [FormField](#formfield)
- [DynamicConfig](#dynamicconfig)
- [Examples](#examples)
- [Basic Usage](#basic-usage)
- [Dynamic Fields](#dynamic-fields)
- [Custom Validation](#custom-validation)
- [Styling](#styling)
- [Migration Guide](#migration-guide)
- [Support](#support)

---

## Components

### FormModal

The main modal component for building dynamic, validated forms with Bootstrap/Reactstrap look & feel and `react-datepicker` integration.
  
#### Props

| Prop               | Type                                                              | Default    | Required | Description                                                                        |
| ------------------ | ----------------------------------------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------- |
| `isOpen`           | `boolean`                                                         | -          | ✅       | Whether the modal is open                                                          |
| `toggle`           | `() => void`                                                      | -          | ✅       | Function to open/close the modal                                                   |
| `title`            | `string`                                                          | -          | ✅       | Modal header title                                                                 |
| `fields`           | [`FormField[]`](#formfield)                                       | -          | ✅       | Array of field configurations                                                      |
| `initialValues`    | `Record<string, any>`                                             | -          | ✅       | Initial values for the form                                                        |
| `onSubmit`         | `(values: Record<string, any>) => Promise<void> \| void`          | -          | ✅       | Submit handler. Receives current form values                                       |
| `submitButtonText` | `string`                                                          | `"Submit"` | ❌       | Text for the submit button                                                         |
| `cancelButtonText` | `string`                                                          | `"Cancel"` | ❌       | Text for the cancel button                                                         |
| `modalSize`        | `string`                                                          | `"lg"`     | ❌       | Size for Reactstrap `<Modal size>`                                                 |
| `loading`          | `boolean`                                                         | `false`    | ❌       | Disables inputs and shows spinner on submit                                        |
| `validateForm`     | `(values: Record<string, any>) => Record<string, string> \| null` | `null`     | ❌       | Optional custom validation. Return an object of errors to block submit             |
| `dynamicConfig`    | [`DynamicConfig[]`](#dynamicconfig)                               | `[]`       | ❌       | Rules to dynamically show/hide fields depending on a control field’s current value |

> **Note:** The component also includes PropTypes so JavaScript consumers get runtime checks.

---

## Hooks

### useForm

A tiny controlled-form hook used internally by `FormModal`. You can also use it externally if you want to replicate the same behavior.

#### Signature

  

```ts
const {
  formState,
  setFormState,
  onInputChange,
  onResetForm,
  isFormDirty,
  updateFields
} = useForm(initialValues: Record<string, any>)
```

#### Returns

| Property        | Type                                        | Decription                                                                |
| --------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| `formState`     | `Record<string, any>`                       | Current form state                                                        |
| `setFormState`  | `React.Dispatch<React.SetStateAction<any>>` | Imperatively set the whole state                                          |
| `onInputChange` | `(eOrValue: any, name?: string) => void`    | Change handler. Accepts DOM event or (`value`, `name`) for special inputs |
| `onResetForm`   | `() => void`                                | Resets back to `initialValues`                                            |
| `isFormDirty`   | `boolean`                                   | `true` if `formState` differs from `initialValues`                        |
| `updateFields`  | `(patch: Record<string, any>) => void`      | Merges a partial object into `formState`                                  |

##### Special behavior
- For `<Input type="file">`, stores the first file (or `null`)
- For checkboxes/swithes, stores `boolean`
- For `NumericFormat` (currency), call as `onInputChange(value, name)`

---

## Utilities
### Date Utilities
All date utils are **timezone-safe** (normalize offset) and used by date/datetime/tiem fields.

| Function         | Signature                                                                  | Description                        |
| ---------------- | -------------------------------------------------------------------------- | ---------------------------------- |
| `toISODate`      | `(d?: Date \| null) => string`                                             | Returns `YYYY-MM-DD`               |
| `toISOLocal`     | `(d?: Date \| null, withSeconds?: boolean) => string`                      | Returns `YYYY-MM-DDTHH:mm[:ss]`    |
| `parseDateValue` | `(value: any, type: 'date' \| 'datetime-local' \| 'time') => Date \| null` | Robust parser for date-like inputs |

### File Utilities
| Function             | Signature                                                | Description                                 | 
| -------------------- | -------------------------------------------------------- | ------------------------------------------- |
| `isFileTypeValid`    | `(file: File, accepted?: string \| string[]) => boolean` | Validates a file against allowed extensions |
| `getAcceptAttribute` | `(accepted?: string \| string[]) => string`              | Builds the `<input accept>` attribute       |

### Equality Utilities
| Function         | Signature                     | Description                                             |
| ---------------- | ----------------------------- | ------------------------------------------------------- |
| `areValuesEqual` | `(a: any, b: any) => boolean` | Compares number/string equivalence (e.g., `'1'` vs `1`) |

---

## Types
### FormField
```ts
export type Option = { value: string | number | null; label: string }

export type FormField = {
  name: string
  label: string
  type:
    | 'text' | 'number' | 'date' | 'datetime-local' | 'time'
    | 'email' | 'password' | 'search' | 'tel' | 'url'
    | 'select' | 'multiselect' | 'currency' | 'percent'
    | 'switch' | 'file' | 'textarea' | 'radio' | 'checkbox'
    | 'color' | 'range'
  placeholder?: string
  description?: string
  defaultValue?: any
  options?: Option[]                  // select, multiselect, radio
  required?: boolean                  // default: true
  disabled?: boolean
  searchable?: boolean                // select/multiselect with search dropdown
  min?: string | number
  max?: string | number
  step?: string | number
  rows?: number                       // textarea
  colXs?: number; colSm?: number; colMd?: number; colLg?: number; colXl?: number
  acceptedTypes?: string | string[]   // file extensions (e.g., 'pdf' or ['pdf','png'])
}

```

> **Percent type** is rendered as a number input with a `%` suffix via Reactstrap `InputGroup`.  
> **Currency type** uses `react-number-format` (`NumericFormat`) with `thousandSeparator` and `$` prefix.

### DynamicConfig

Use this to show/hide subsets of fields based on a “control” field’s value.

```ts
export type DynamicConfig = {
  controlField: string
  options: {
    value: string | number | null
    fields: string[]         // field names that should be visible when this value is selected
  }[]
}

```

#### Behavior:
- If the control field value matches an option’s `value`, only fields listed in that option remain visible.
- If no match, and an option with `value: ''` or `null` exists, that is used as default.    
- Otherwise, only the control field stays visible.

---

## Examples

### Basic Usage
```tsx
import { useState } from 'react'
import { FormModal, type FormField } from 'react-form-modal'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'

const fields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', colMd: 6 },
  { name: 'amount', label: 'Amount', type: 'currency', colMd: 6 },
  { name: 'date', label: 'Date', type: 'date', colMd: 6 },
  { name: 'discount', label: 'Discount', type: 'percent', min: 0, max: 100, step: 1, colMd: 6 },
]

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <FormModal
        isOpen={open}
        toggle={() => setOpen(false)}
        title="Create Record"
        fields={fields}
        initialValues={{ name: '', amount: '', date: '', discount: 10 }}
        onSubmit={async (values) => {
          console.log(values)
          setOpen(false)
        }}
      />
    </>
  )
}
```

### Dynamic Fields
```tsx
const fields: FormField[] = [
  { name: 'type', label: 'Type', type: 'select', options: [
      { value: 'person', label: 'Person' },
      { value: 'company', label: 'Company' },
    ], colMd: 6 },
  { name: 'firstName', label: 'First Name', type: 'text', colMd: 6 },
  { name: 'lastName', label: 'Last Name', type: 'text', colMd: 6 },
  { name: 'companyName', label: 'Company Name', type: 'text', colMd: 12 },
]

const dynamicConfig = [
  { controlField: 'type',
    options: [
      { value: 'person',  fields: ['type','firstName','lastName'] },
      { value: 'company', fields: ['type','companyName'] },
      { value: '',        fields: ['type'] } // default
    ]
  }
]

// ...
<FormModal
  isOpen={open}
  toggle={() => setOpen(false)}
  title="New"
  fields={fields}
  initialValues={{ type: '', firstName: '', lastName: '', companyName: '' }}
  dynamicConfig={dynamicConfig}
  onSubmit={save}
/>
```

### Custom Validation
```tsx
const validateForm = (values: Record<string, any>) => {
  const errors: Record<string, string> = {}
  if (!values.name?.trim()) errors.name = 'Name is required'
  if (values.discount != null && (values.discount < 0 || values.discount > 100)) {
    errors.discount = 'Discount must be between 0 and 100'
  }
  return Object.keys(errors).length ? errors : null
}

<FormModal
  // ...
  validateForm={validateForm}
  onSubmit={async (values) => { /* only runs if no errors */ }}
/>
```

---

## Styling
Import the required CSS in your app:
```ts
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'
```
The component ships with datepicker overrides (light/dark support).  
You can also style individual controls using standard Bootstrap classes in your app.

---

## Migration Guide

### v0.x → v1.0

- **Percent type** added. It renders as a numeric input with `%` suffix.
    - If you previously used a custom text input to show `%`, switch to `type: 'percent'`.
- **DynamicConfig** behavior clarified: default option is the one with `value: ''` or `null`.

No other breaking changes.

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/caes1996/react-form-modal/issues) page.
- **License:** MIT © Cristian Escobar