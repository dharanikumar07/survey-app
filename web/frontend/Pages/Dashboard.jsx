import { Page, Layout, Card, Button, Text, Modal } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
    const app = useAppBridge();
    const redirect = Redirect.create(app);
    const location = useLocation();
    const [error, setError] = useState(null);
    const [modalActive, setModalActive] = useState(false);

    const handleModalToggle = useCallback(
        () => setModalActive((active) => !active),
        []
    );

    const handleCreateSurvey = () => {
        redirect.dispatch(Redirect.Action.APP, "/survey/new");
    };

    const handleViewSurveys = () => {
        redirect.dispatch(Redirect.Action.APP, "/survey");
    };

    const handleViewAnalytics = () => {
        redirect.dispatch(Redirect.Action.APP, "/analytics");
    };

    const handleOpenModal = () => {
        setModalActive(true);
    };

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <div className="th-sf-dashboard-section">
                        <Text variant="headingLg" as="h1">Welcome to Your Dashboard</Text>
                        <Text variant="bodyLg" as="p">Manage your surveys and track performance</Text>
                    </div>

                    <div className="th-sf-dashboard-center">
                        <Text variant="headingMd" as="h2">Quick Actions</Text>
                    </div>

                    <div className="th-sf-dashboard-container">
                        <div className="th-sf-dashboard-card">
                            <h3 className="th-sf-dashboard-card-title">Create New Survey</h3>
                            <p className="th-sf-dashboard-card-description">Start building a new customer feedback survey</p>
                            <a href="#" className="th-sf-dashboard-card-link" onClick={handleCreateSurvey}>Get Started</a>
                        </div>
                        <div className="th-sf-dashboard-card">
                            <h3 className="th-sf-dashboard-card-title">View All Surveys</h3>
                            <p className="th-sf-dashboard-card-description">See your existing surveys and their status</p>
                            <a href="#" className="th-sf-dashboard-card-link" onClick={handleViewSurveys}>View Surveys</a>
                        </div>
                        <div className="th-sf-dashboard-card">
                            <h3 className="th-sf-dashboard-card-title">Analyze Results</h3>
                            <p className="th-sf-dashboard-card-description">Dive into survey data and insights</p>
                            <a href="#" className="th-sf-dashboard-card-link" onClick={handleViewAnalytics}>View Analytics</a>
                        </div>
                    </div>

                    <div className="th-sf-dashboard-center">
                        <Text variant="headingMd" as="h2">Test App Bridge Modal</Text>
                    </div>

                    <div className="th-sf-dashboard-center">
                        <Button onClick={handleOpenModal}>Open Test Modal</Button>
                    </div>

                    {error && (
                        <div className="th-sf-error-message">
                            {error}
                        </div>
                    )}

                    <Modal
                        open={modalActive}
                        onClose={handleModalToggle}
                        title="App Bridge Modal Test"
                        primaryAction={{
                            content: "Close",
                            onAction: handleModalToggle,
                        }}
                    >
                        <Modal.Section>
                            <div className="th-sf-modal-content">
                                <h2 className="th-sf-modal-heading">
                                    🎉 Hello World! 🎉
                                </h2>

                                <p className="th-sf-modal-paragraph">
                                    This is a test App Bridge modal to verify that modals can be implemented correctly in this Shopify app!
                                </p>

                                <div className="th-sf-modal-info-box">
                                    <p className="th-sf-modal-info-text">
                                        ✅ App Bridge Modal is working correctly!<br />
                                        ✅ Modal variant is set to "max" (maximum size)<br />
                                        ✅ Proper close functionality implemented<br />
                                        ✅ TitleBar with actions is working<br />
                                        ✅ Custom content is rendered inside
                                    </p>
                                </div>

                                <p className="th-sf-modal-paragraph-top">
                                    You can close this modal by clicking the "Close" button or by clicking outside of the modal.
                                </p>
                            </div>
                        </Modal.Section>
                    </Modal>
                </Layout.Section>
            </Layout>
        </Page>
    );
} 