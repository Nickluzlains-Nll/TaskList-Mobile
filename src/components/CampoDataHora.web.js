import React from 'react';

// Na web usa o mesmo <input type="datetime-local"> do site
export default function CampoDataHora({ valor, onChange }) {
  return React.createElement('input', {
    type: 'datetime-local',
    value: valor || '',
    onChange: (e) => onChange(e.target.value),
    style: {
      width: '100%', boxSizing: 'border-box', minHeight: 40, padding: '9px 11px',
      border: '1px solid #353b47', borderRadius: 7, background: '#12151c', color: '#ffffff',
      fontSize: 13, outline: 'none', colorScheme: 'dark', fontFamily: 'inherit',
    },
  });
}
