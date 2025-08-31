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

    const saveSurvey = async (survey) => {
        const response = await apiClient("POST", "/surveys", survey);
        return response;
    }

    return {
        getSurveys,
        createSurvey,
        saveSurvey,
    }
}