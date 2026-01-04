/**
 * FORM INPUT COMPONENT
 * ====================
 * Reusable input field component for forms
 * 
 * Props:
 * - label: Input label text
 * - id: HTML id attribute
 * - type: Input type (text, email, password, etc.)
 * - name: Input name attribute
 * - placeholder: Placeholder text
 * - value: Current input value
 * - onChange: Change event handler
 * - onFocus: Focus event handler
 * - disabled: Whether input is disabled
 * - required: Whether field is required
 */

export default function FormInput({
  label,
  id,
  type = 'text',
  name,
  placeholder = '',
  value,
  onChange,
  onFocus,
  disabled = false,
  required = false
}) {
  return (
    <div className="form-input-wrapper">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        className="form-input-field"
      />
    </div>
  );
}
