import React from "react";
import {
    Page,
    Layout,
    Card,
    Text,
    ProgressBar,
    Badge,
    IndexTable,
    Box,
    InlineGrid,
    BlockStack,
} from "@shopify/polaris";
import { Icon } from "@shopify/polaris";
import { ChartVerticalIcon } from "@shopify/polaris-icons";
import Quickstart from "./components/QuickStart.jsx";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const progress = 100; // 3 of 3 tasks completed
    const navigate = useNavigate();

    const resourceName = {
        singular: "survey",
        plural: "surveys",
    };

    const rows = [
        {
            id: "1",
            name: "Survey #1",
            status: "Active",
            responses: 0,
            impressions: 2,
        },
    ];

    return (
        <Page title="Hi swaminathan b! 👋" subtitle="Welcome to SEA Customer Survey">
            <Layout>
                <Layout.Section>
                    <Quickstart />
                </Layout.Section>

                <Layout.Section>
                    <InlineGrid columns={{ xs: 1, sm: 3 }} gap="400">
                        <Card>
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm">
                                    Number of responses
                                </Text>
                                <Text as="p" variant="heading2xl">
                                    0
                                </Text>
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm">
                                    Impressions
                                </Text>
                                <Text as="p" variant="heading2xl">
                                    2
                                </Text>
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm">
                                    Response rate
                                </Text>
                                <Text as="p" variant="heading2xl">
                                    0%
                                </Text>
                            </BlockStack>
                        </Card>
                    </InlineGrid>
                </Layout.Section>

                <Layout.Section>
                    <Card>
                        <BlockStack gap="300">
                            <Text as="h3" variant="headingSm">
                                Most answered surveys
                            </Text>

                            <IndexTable
                                resourceName={resourceName}
                                itemCount={rows.length}
                                headings={[
                                    { title: "Survey" },
                                    { title: "Status" },
                                    { title: "Responses" },
                                    { title: "Impressions" },
                                    { title: "Action" },
                                ]}
                                selectable={false}
                            >
                                {rows.map((item, index) => (
                                    <IndexTable.Row id={item.id} key={item.id} position={index} onClick={() => {
                                        navigate(`/survey`);
                                        console.log(item.id);
                                    }}>
                                        <IndexTable.Cell onClick={() => {
                                            navigate(`/survey/${item.id}`);
                                            console.log(item.id);
                                        }}>
                                            <Text as="span" variant="bodyMd" fontWeight="semibold">
                                                {item.name}
                                            </Text>
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>
                                            <Badge tone="success">{item.status}</Badge>
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>{item.responses}</IndexTable.Cell>
                                        <IndexTable.Cell>{item.impressions}</IndexTable.Cell>
                                        <IndexTable.Cell>
                                            <Icon source={ChartVerticalIcon} />
                                        </IndexTable.Cell>
                                    </IndexTable.Row>
                                ))}
                            </IndexTable>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}