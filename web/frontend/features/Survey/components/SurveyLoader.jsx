import React, { useEffect, useState } from 'react';
import { Banner, Card, Spinner } from '@shopify/polaris';
import useStore from '../../../State/store';
import { useSurveyState } from '../hooks/useSurveyState';

/**
 * SurveyLoader component
 * 
 * This component handles loading survey data from the API only.
 * API is the single source of truth.
 * 
 * Props:
 * - surveyId: Optional ID of the survey to load
 * - children: Components to render once survey is loaded
 */
const SurveyLoader = ({ surveyId, children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { loadSurveyFromApi } = useStore();
    const { discountEnabled } = useSurveyState();

    // Load survey data when component mounts
    useEffect(() => {
        const loadSurvey = async () => {
            setLoading(true);
            setError(null);

            try {
                // If surveyId is provided, load from API
                if (surveyId) {
                    const success = await loadSurveyFromApi(surveyId);
                    if (!success) {
                        setError('Failed to load survey data from API. Please try again.');
                        setLoading(false);
                        return;
                    }
                }

                // If no surveyId, start with empty state
                setLoading(false);
            } catch (err) {
                console.error('Error loading survey:', err);
                setError('Failed to load survey data. Please try again.');
                setLoading(false);
            }
        };

        loadSurvey();
    }, [surveyId, loadSurveyFromApi]);

    if (loading) {
        return (
            <div className="th-sf-survey-loading" style={{ display: 'flex', justifyContent: 'center', padding: '2rem', alignItems: 'center', height: '100%' }}>
                <Spinner size="small" />
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <Banner status="critical">
                    <p>{error}</p>
                </Banner>
            </Card>
        );
    }

    // Clone the children and pass the isDiscountEnabled prop
    return (
        <>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // Pass the discount enabled state to the child component
                    return React.cloneElement(child, { isDiscountEnabled: discountEnabled });
                }
                return child;
            })}
        </>
    );
};

export default SurveyLoader;
