import React, { useEffect, useState } from 'react';
import { Banner, Card, Spinner } from '@shopify/polaris';
import useStore from '../../../State/store';

/**
 * SurveyLoader component
 * 
 * This component handles loading survey data from the API when available,
 * with fallback to the default JSON data.
 * 
 * Props:
 * - surveyId: Optional ID of the survey to load
 * - children: Components to render once survey is loaded
 */
const SurveyLoader = ({ surveyId, children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { loadSurveyFromApi } = useStore();

    // Load survey data when component mounts
    useEffect(() => {
        const loadSurvey = async () => {
            setLoading(true);
            setError(null);

            try {
                // If surveyId is provided, attempt to load from API
                if (surveyId) {
                    const success = await loadSurveyFromApi(surveyId);
                    if (!success) {
                        // If API fails, we fall back to the default data from JSON
                        // which happens automatically in loadSurveyFromApi
                        console.log('Using fallback data for survey');
                    }
                }

                // If no surveyId, the store is already initialized with the default data
                setLoading(false);
            } catch (err) {
                console.log('Error loading survey:', err);
                setError('Failed to load survey data. Please try again.');
                setLoading(false);
            }
        };

        loadSurvey();
    }, [surveyId, loadSurveyFromApi]);

    if (loading) {
        return (
            <div className="th-sf-survey-loading" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Spinner size="large" />
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

    return <>{children}</>;
};

export default SurveyLoader;
