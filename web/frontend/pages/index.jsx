import React, { useState, useCallback } from 'react';
import { Page, Form, FormLayout, TextField, Button, Select } from '@shopify/polaris';
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function ProductForm() {
    const [searchParams] = useSearchParams();

    const [minimum, setMinimum] = useState('');
    const [maximum, setMaximum] = useState('');
    const [discountValue, setDiscountValue] = useState('');
    const [selected, setSelected] = useState('percentage');

    const handleSelectChange = useCallback((value) => setSelected(value), []);

    const options = [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed', value: 'fixed' },
    ];

    const handleSubmit = useCallback(async () => {
        try {
            const response = await axios.post('/api/rule', {
                shop: searchParams.get('shop') || 'example.shop',
                store_id: '', 
                enabled: 1,
                type: "bundle",
                title: "Sample Rule",
                filters: null,
                conditions: null,
                usage_limit: 100,
                usage_limit_per_user: 5,
                platform_created_customer_id: 98765,
                platform_updated_customer_id: 98765,
                priority: 10,
                rule_data: {
                    min: minimum,
                    max: maximum,
                    discountValue: discountValue,
                    discountType: selected
                }
            });

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message);
        }
    }, [minimum, maximum, discountValue, selected, searchParams]);

    return (
        <Page title="Add Product">
            <Form onSubmit={handleSubmit}>
                <FormLayout>
                    <TextField
                        label="Minimum"
                        type="number"
                        value={minimum}
                        onChange={setMinimum}
                        autoComplete="off"
                    />
                    <TextField
                        label="Maximum"
                        type="number"
                        value={maximum}
                        onChange={setMaximum}
                        autoComplete="off"
                    />
                    <Select
                        label="Discount Type"
                        value={selected}
                        options={options}
                        onChange={handleSelectChange}
                    />
                    <TextField
                        label="Discount Value"
                        type="number"
                        value={discountValue}
                        onChange={setDiscountValue}
                        autoComplete="off"
                    />
                    <Button submit primary>
                        Submit
                    </Button>
                </FormLayout>
            </Form>
        </Page>
    );
}

export default ProductForm;
