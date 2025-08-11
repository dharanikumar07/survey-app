import { Card, Page, Layout, Text, Button } from "@shopify/polaris";
import { useState } from "react";
import { apiClient } from "../api";
import { Modal, TitleBar } from "@shopify/app-bridge-react";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [shopInfo, setShopInfo] = useState(null);
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    console.log("Dashboard component is rendering!"); // Debug log

    const handleGetShopInfo = async () => {
        console.log("Get Shop Info clicked"); // Debug log
        
        // Open the modal instead of making API call
        console.log("Modal state before:", modalOpen); // Debug log
        setModalOpen(true);
        console.log("Modal state set to true"); // Debug log
        
        // Original API call code commented out for testing
        /*
        setIsLoading(true);
        setError(null);
        
        try {
            // Use the same apiClient pattern as the working rule creation
            const { status, data } = await apiClient("GET", "/shop/info", []);
            console.log("API response:", data); // Debug log
            
            if (status === 200 && data.success) {
                setShopInfo(data.data);
            } else {
                setError(data.error || 'Failed to fetch shop information');
            }
        } catch (err) {
            console.error("API error:", err); // Debug log
            if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
                setError('Authentication required. Please access this app through the Shopify admin.');
            } else {
                setError('Failed to get shop info. Please ensure you are accessing through Shopify admin.');
            }
        } finally {
            setIsLoading(false);
        }
        */
    };

    const handleGetProducts = async () => {
        console.log("Get Products clicked"); // Debug log
        setIsLoading(true);
        setError(null);
        
        try {
            const { status, data } = await apiClient("GET", "/products?first=10", []);
            console.log("Products API response:", data); // Debug log
            
            if (status === 200 && data.success) {
                setProducts(data.data);
            } else {
                setError(data.error || 'Failed to fetch products');
            }
        } catch (err) {
            console.error("Products API error:", err); // Debug log
            if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
                setError('Authentication required. Please access this app through the Shopify admin.');
            } else {
                setError('Failed to get products. Please ensure you are accessing through Shopify admin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Page title="Dashboard">
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <Text variant="headingMd" as="h2">
                            🚀 Shopify App Boilerplate
                        </Text>

                        <Text as="p">
                            Welcome! This boilerplate demonstrates:
                        </Text>

                        <div style={{ margin: "20px 0" }}>
                            <ul>
                                <li>✅ GraphQL API integration with Laravel</li>
                                <li>✅ Shopify authentication middleware</li>
                                <li>✅ React frontend with Polaris 13.9.5</li>
                                <li>✅ Error handling and loading states</li>
                                <li>✅ Data display and user interactions</li>
                            </ul>
                        </div>

                        <div
                            style={{
                                margin: "20px 0",
                                padding: "15px",
                                backgroundColor: "#f0f8ff",
                                border: "1px solid #0066cc",
                                borderRadius: "4px",
                            }}
                        >
                            <Text as="p" variant="bodySm">
                                <strong>Important:</strong> To test the
                                authenticated API calls, you must access this
                                app through the Shopify admin interface, not
                                directly via localhost. The authentication
                                middleware requires a valid Shopify session
                                context.
                            </Text>
                        </div>

                        <div style={{ textAlign: "center", margin: "20px 0" }}>
                            <Button
                                primary
                                onClick={handleGetShopInfo}
                                loading={isLoading}
                                style={{ marginRight: "10px" }}
                            >
                                Get Shop Info
                            </Button>

                            <Button
                                onClick={handleGetProducts}
                                loading={isLoading}
                            >
                                Get Products
                            </Button>
                        </div>

                        {error && (
                            <div
                                style={{
                                    color: "red",
                                    padding: "10px",
                                    border: "1px solid red",
                                    borderRadius: "4px",
                                    margin: "10px 0",
                                }}
                            >
                                {error}
                            </div>
                        )}
                    </Card>

                    {shopInfo && (
                        <Card sectioned>
                            <Text variant="headingSm" as="h3">
                                Shop Information
                            </Text>
                            <div style={{ marginTop: "10px" }}>
                                <Text as="p">
                                    <strong>Shop Name:</strong>{" "}
                                    {shopInfo.shop.name}
                                </Text>
                                <Text as="p">
                                    <strong>Domain:</strong>{" "}
                                    {shopInfo.shop.myshopifyDomain}
                                </Text>
                                <Text as="p">
                                    <strong>Email:</strong>{" "}
                                    {shopInfo.shop.email}
                                </Text>
                                <Text as="p">
                                    <strong>Plan:</strong>{" "}
                                    {shopInfo.shop.plan?.displayName}
                                </Text>
                                <Text as="p">
                                    <strong>Products Count:</strong>{" "}
                                    {shopInfo.products_count}
                                </Text>
                                <Text as="p">
                                    <strong>Last Updated:</strong>{" "}
                                    {new Date(
                                        shopInfo.timestamp,
                                    ).toLocaleString()}
                                </Text>
                            </div>
                        </Card>
                    )}

                    {products && (
                        <Card sectioned>
                            <Text variant="headingSm" as="h3">
                                Products ({products.totalCount} total)
                            </Text>

                            <div style={{ marginTop: "10px" }}>
                                {products.edges && products.edges.length > 0 ? (
                                    products.edges.map(({ node }, index) => (
                                        <Card
                                            key={index}
                                            sectioned
                                            style={{ marginBottom: "10px" }}
                                        >
                                            <Text variant="headingSm" as="h4">
                                                {node.title}
                                            </Text>
                                            <Text as="p">
                                                <strong>Status:</strong>{" "}
                                                {node.status}
                                            </Text>
                                            <Text as="p">
                                                <strong>Price:</strong>{" "}
                                                {node.variants.nodes[0]
                                                    ?.price || "N/A"}
                                            </Text>
                                            <Text as="p">
                                                <strong>Has Image:</strong>{" "}
                                                {node.images.nodes[0]?.url
                                                    ? "Yes"
                                                    : "No"}
                                            </Text>
                                            <Text as="p">
                                                <strong>Created:</strong>{" "}
                                                {new Date(
                                                    node.createdAt,
                                                ).toLocaleDateString()}
                                            </Text>
                                        </Card>
                                    ))
                                ) : (
                                    <Text as="p">No products found.</Text>
                                )}
                            </div>
                        </Card>
                    )}
                </Layout.Section>
            </Layout>

            {/* App Bridge Modal */}
            <Modal
                id="my-modal" 
                variant="max" 
                open={modalOpen} 
                // onClose={() => setModalOpen(false)}
                onHide={() => setModalOpen(false)}
            >
                <TitleBar title="Hello from App Bridge Modal!">
                    <button 
                        variant="primary" 
                        onClick={() => setModalOpen(false)}
                    >
                        Close Modal
                    </button>
                    <button onClick={() => alert('Hello World from App Bridge!')}>
                        Say Hello
                    </button>
                </TitleBar>
                
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2 style={{ color: '#008060', marginBottom: '20px' }}>
                        🎉 Hello World! 🎉
                    </h2>
                    
                    <p style={{ marginBottom: '20px', fontSize: '16px' }}>
                        This is a test App Bridge modal to verify that modals can be implemented correctly in this Shopify app!
                    </p>

                    <div style={{ 
                        margin: '20px 0', 
                        padding: '15px', 
                        backgroundColor: '#f0f8ff', 
                        border: '1px solid #0066cc', 
                        borderRadius: '4px' 
                    }}>
                        <p style={{ margin: 0, fontSize: '14px' }}>
                            ✅ App Bridge Modal is working correctly!<br/>
                            ✅ Modal variant is set to "max" (maximum size)<br/>
                            ✅ Proper close functionality implemented<br/>
                            ✅ TitleBar with actions working<br/>
                            ✅ Modal state: {modalOpen ? 'OPEN' : 'CLOSED'}
                        </p>
                    </div>

                    <p style={{ marginTop: '20px', fontSize: '16px' }}>
                        You can now close this modal and know that App Bridge modals are working perfectly in your Shopify app! 🚀
                    </p>
                </div>
            </Modal>
        </Page>
    );
} 