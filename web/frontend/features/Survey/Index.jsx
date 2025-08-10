import { useState } from "react";
import { Page, Card, Text, BlockStack, Button } from "@shopify/polaris";
import { Modal, TitleBar } from '@shopify/app-bridge-react';

export default function Survey() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Page title="Survey">
            <Card>
                <BlockStack gap="200">
                    <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                    <Modal id="my-modal" open={modalOpen} variant="max" onHide={() => setModalOpen(false)} onShow={() => setModalOpen(true)}>
                        <p>Message</p>
                        <TitleBar title="My Modal">
                            <button onClick={() => setModalOpen(false)}>Label</button>
                        </TitleBar>
                    </Modal>
                </BlockStack>
            </Card>
        </Page>
    );
}


