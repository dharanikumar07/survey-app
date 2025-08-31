import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    BlockStack,
    Box,
    InlineStack,
} from "@shopify/polaris";
import SurveyModalContent from "./components/modal/SurveyModalContent";
import ModalHeader from "./components/common/ModalHeader";
import { PolarisProvider } from "../../components/providers";
import { PortalsManager } from "@shopify/polaris";
import { Modal, TitleBar } from '@shopify/app-bridge-react';

export default function SurveyForm() {
    const navigate = useNavigate();
    const { uuid } = useParams();
    const [searchParams] = useSearchParams();
    const templateKey = searchParams.get('template');
    const [title, setTitle] = useState("Create new survey");
    const surveyPreviewRef = useRef(null);

    useEffect(() => {
        // Handle editing existing survey
        if (uuid) {
            setTitle(`Edit survey #${uuid}`);
            // Fetch survey data based on uuid
            // This would be implemented with an API call
        }
        // Handle creating new survey from template
        else if (templateKey) {
            setTitle(`Create ${getTemplateName(templateKey)}`);
        }
    }, [uuid, templateKey]);

    const getTemplateName = (key) => {
        const templateNames = {
            "blank": "Blank survey",
            "marketing_attribution": "Marketing attribution",
            "customer_experience": "Customer experience survey",
            "not_purchasing": "Reason for not purchasing",
            "exit_intent": "Exit intent",
            "ai_creation": "AI-assisted survey"
        };
        return templateNames[key] || "new survey";
    };

    const handleClose = () => {
        console.log("handleClose");
        navigate("/survey");
    };

    return (
        <Modal
            open={true}
            onHide={handleClose}
            variant="max"
        >
            <TitleBar title={title} />
            <PolarisProvider>
                <PortalsManager>
                    <div style={{ overflow: 'auto' }}>
                        {!uuid && <ModalHeader surveyPreviewRef={surveyPreviewRef} />}
                        <SurveyModalContent
                            templateKey={templateKey}
                            uuid={uuid}
                            ref={surveyPreviewRef}
                        />
                    </div>
                </PortalsManager>
            </PolarisProvider>
        </Modal>
    );
}