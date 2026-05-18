import { useState } from 'react'

export default function TagInput({ value = [], onChange, placeholder = 'Agregar...' }) {
  const [input, setInput] = useState('')

  const add = () => {
    const v = input.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setInput('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2 min-h-5">
        {value.map(t => (
          <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
            {t}
            <button
              type="button"
              onClick={() => onChange(value.filter(x => x !== t))}
              className="hover:text-blue-900 font-bold leading-none"
            >×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder={placeholder}
          className="input flex-1"
        />
        <button type="button" onClick={add} className="btn-secondary !px-3">+</button>
      </div>
    </div>
  )
}
