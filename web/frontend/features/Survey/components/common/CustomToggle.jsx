import React from 'react';

export function CustomStyledToggle({ checked = false, onChange = () => { } }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            style={{
                width: '40px',
                height: '20px',
                background: checked ? 'black' : '#ccc',
                borderRadius: '4px',
                position: 'relative',
                cursor: 'pointer',
            }}
            role="switch"
            aria-checked={checked}
        >
            <div
                style={{
                    width: '18px',
                    height: '18px',
                    background: 'white',
                    borderRadius: '3px',
                    position: 'absolute',
                    top: '1px',
                    left: checked ? '20px' : '2px',
                    transition: 'left 0.2s ease',
                }}
            />
        </div>
    );
}

export default CustomStyledToggle;
