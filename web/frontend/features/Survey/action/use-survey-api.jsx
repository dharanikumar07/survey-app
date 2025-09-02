import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../api";

export function useSurveyApi() {
    const getSurveys = async (params) => {
        const response = await apiClient("GET", "/surveys", params);
        return response;
    }

    const createSurvey = async (survey) => {
        const response = await apiClient("POST", "/surveys", survey);
        return response;
    }

    const saveSurvey = async (survey, uuid) => {
        let response;
        if (uuid) {
            // If uuid is present, update the existing survey
            response = await apiClient("POST", `/surveys/${uuid}`, survey);
        } else {
            // If no uuid, create a new survey
            response = await apiClient("POST", "/surveys", survey);
        }
        return response;
    }

    return {
        getSurveys,
        createSurvey,
        saveSurvey,
    }
}