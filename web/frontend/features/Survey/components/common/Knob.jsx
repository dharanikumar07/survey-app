import React from 'react';
import styles from './Knob.module.css';

/**
 * @typedef {Object} KnobProps
 * @property {string} ariaLabel - The aria-label for the knob
 * @property {boolean} selected - Whether the knob is selected or not
 * @property {() => void} onClick - The function to call when the knob is clicked
 */

/**
 * Knob component
 * @param {KnobProps} props - The props for the Knob component
 * @returns {JSX.Element} The rendered Knob component
 */
export const Knob = ({ ariaLabel, selected, onClick }) => {
    console.log('Knob rendering:', { ariaLabel, selected, styles });

    return (
        <button
            id=':rgi:'
            className={`${styles.track} ${selected && styles.track_on}`}
            aria-label={ariaLabel}
            role='switch'
            type='button'
            aria-checked={selected}
            onClick={onClick}
            style={{
                // Fallback styles in case CSS modules don't work
                height: '1.5rem',
                width: '2rem',
                background: selected ? '#1a1a1a' : '#e1e3e5',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0.25rem'
            }}
        >
            <div
                className={`${styles.knob} ${selected && styles.knob_on}`}
                style={{
                    // Fallback styles for knob
                    height: '0.75rem',
                    width: '0.75rem',
                    borderRadius: '0.1875rem',
                    background: '#ffffff',
                    position: 'absolute',
                    left: '0.25rem',
                    transform: selected ? 'translate(100%)' : 'translate(0)',
                    transition: 'transform 0.15s ease'
                }}
            ></div>
        </button>
    );
};

export default Knob;
