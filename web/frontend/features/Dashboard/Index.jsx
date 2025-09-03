import React, { useState } from "react";
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
    SkeletonPage,
    SkeletonDisplayText,
    SkeletonBodyText,
} from "@shopify/polaris";
import { Icon } from "@shopify/polaris";
import { ChartVerticalIcon } from "@shopify/polaris-icons";
import Quickstart from "./components/QuickStart.jsx";
import { useNavigate } from "react-router-dom";
import { useShopInfo } from "./action/use-shop-info.jsx";
import { useQueryEvents } from "../../components/helper/use-query-event.jsx";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
    const progress = 100; // 3 of 3 tasks completed
    const navigate = useNavigate();
    const [shopName, setShopName] = useState("");

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

    const { getShopInfo } = useShopInfo();
    const { data: shopInfo, isLoading: shopInfoLoading } = useQueryEvents(
        useQuery({
            queryKey: ["shopInfo"],
            queryFn: getShopInfo,
        }),
        {
            onSuccess: (data) => {
                console.log("shopInfo", data);
                setShopName(data?.data?.data?.shop?.name);
            },
        },
        {
            onError: (error) => {
                console.log(error);
            },
        }
    )

    // Show shimmer effect while loading shop info
    if (shopInfoLoading) {
        return (
            <SkeletonPage>
                <Layout>
                    <Layout.Section>
                        <SkeletonDisplayText size="large" />
                        <SkeletonBodyText lines={3} />
                    </Layout.Section>

                    <Layout.Section>
                        <InlineGrid columns={{ xs: 1, sm: 3 }} gap="400">
                            {[1, 2, 3].map((index) => (
                                <Card key={index}>
                                    <BlockStack gap="200">
                                        <SkeletonDisplayText size="small" />
                                        <SkeletonDisplayText size="large" />
                                    </BlockStack>
                                </Card>
                            ))}
                        </InlineGrid>
                    </Layout.Section>

                    <Layout.Section>
                        <Card>
                            <BlockStack gap="300">
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText lines={4} />
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </SkeletonPage>
        );
    }

    return (
        <Page title={`Hi ${shopName}! 👋`} subtitle="Welcome to SEA Customer Survey">
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
                                        // console.log(item.id);
                                    }}>
                                        <IndexTable.Cell onClick={() => {
                                            navigate(`/survey/${item.id}`);
                                            // console.log(item.id);
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