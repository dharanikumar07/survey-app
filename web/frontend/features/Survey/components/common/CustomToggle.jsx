import React from 'react';

export function CustomStyledToggle({ checked = false, onChange = () => { } }) {
    return (
        <label className="th-sf-custom-toggle">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <span className="th-sf-custom-toggle-slider"></span>
        </label>
    );
}

export default CustomStyledToggle;
