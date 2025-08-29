import React, { useState } from 'react';
import { Button, Toast, Frame } from '@shopify/polaris';
import useStore from '../../../State/store';

/**
 * SurveySaver component
 * 
 * This component provides a button to save survey data to the API
 * with appropriate loading and error states.
 */
const SurveySaver = () => {
    const [saving, setSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);

    const { saveSurveyToApi } = useStore();

    const handleSave = async () => {
        setSaving(true);

        try {
            const success = await saveSurveyToApi();

            if (success) {
                setToastMessage('Survey saved successfully!');
                setToastError(false);
            } else {
                setToastMessage('Failed to save survey. Please try again.');
                setToastError(true);
            }

            setShowToast(true);
        } catch (error) {
            console.error('Error saving survey:', error);
            setToastMessage('An error occurred while saving. Please try again.');
            setToastError(true);
            setShowToast(true);
        } finally {
            setSaving(false);
        }
    };

    const toggleToast = () => setShowToast((show) => !show);

    return (
        <Frame>
            <Button
                primary
                loading={saving}
                disabled={saving}
                onClick={handleSave}
            >
                Save Survey
            </Button>

            {showToast && (
                <Toast
                    content={toastMessage}
                    error={toastError}
                    onDismiss={toggleToast}
                    duration={3000}
                />
            )}
        </Frame>
    );
};

export default SurveySaver;
