import React, { useState, useCallback } from 'react';
import {
    Box,
    BlockStack,
    Text,
    ButtonGroup,
    Button,
    TextField,
    Checkbox,
    Select,
    Divider,
    ColorPicker,
    Popover,
    Icon
} from '@shopify/polaris';
import { ColorIcon } from '@shopify/polaris-icons';
import { useSurveyState } from '../hooks/useSurveyState';

// Utility functions for color conversion
const hexToRgb = (hex) => {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
};

const rgbToHsb = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const brightness = max;

    const delta = max - min;
    s = max === 0 ? 0 : delta / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        if (max === r) {
            h = (g - b) / delta + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h /= 6;
    }

    return {
        hue: Math.round(h * 360),
        saturation: Math.round(s * 100) / 100,
        brightness: Math.round(brightness * 100) / 100
    };
};

const hexToHsb = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsb(r, g, b);
};

const hsbToRgb = (h, s, b) => {
    h = h / 360;
    let r, g, bl;

    if (s === 0) {
        r = g = bl = b;
    } else {
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = b * (1 - s);
        const q = b * (1 - f * s);
        const t = b * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = b; g = t; bl = p; break;
            case 1: r = q; g = b; bl = p; break;
            case 2: r = p; g = b; bl = t; break;
            case 3: r = p; g = q; bl = b; break;
            case 4: r = t; g = p; bl = b; break;
            case 5: r = b; g = p; bl = q; break;
            default: r = 0; g = 0; bl = 0;
        }
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(bl * 255)
    };
};

const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const hsbToHex = (h, s, b) => {
    const { r, g, b: blue } = hsbToRgb(h, s, b);
    return rgbToHex(r, g, blue);
};

export function BrandedSurveyConfig() {
    const {
        brandedConfig,
        updateBrandedConfig
    } = useSurveyState();

    // State for color picker popovers
    const [activeColorPopover, setActiveColorPopover] = useState(null);

    const handleBrandingChange = (key, value) => {
        updateBrandedConfig(key, value);
    };

    const handleColorChange = (colorType, color) => {
        // Convert HSB to hex
        const hexColor = hsbToHex(color.hue, color.saturation, color.brightness);

        updateBrandedConfig('colors', {
            ...brandedConfig.colors,
            [colorType]: hexColor
        });
    };

    const handleFontChange = (fontType, value) => {
        updateBrandedConfig('fonts', {
            ...brandedConfig.fonts,
            [fontType]: value
        });
    };

    const handleLogoChange = (value) => {
        updateBrandedConfig('logo', value);
    };

    const handleCustomCssChange = (value) => {
        updateBrandedConfig('customCss', value);
    };

    const handleDisplaySettingsChange = (key, value) => {
        updateBrandedConfig('displaySettings', {
            ...brandedConfig.displaySettings,
            [key]: value
        });
    };

    const toggleColorPopover = useCallback((colorType) => {
        setActiveColorPopover(activeColorPopover === colorType ? null : colorType);
    }, [activeColorPopover]);

    const colorOptions = [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent', value: 'accent' },
        { label: 'Background', value: 'background' },
        { label: 'Text', value: 'text' }
    ];

    const fontOptions = [
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Helvetica', value: 'Helvetica, sans-serif' },
        { label: 'Georgia', value: 'Georgia, serif' },
        { label: 'Times New Roman', value: 'Times New Roman, serif' },
        { label: 'Verdana', value: 'Verdana, sans-serif' },
        { label: 'Custom', value: 'custom' }
    ];

    const positionOptions = [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Top Left', value: 'top-left' },
        { label: 'Center', value: 'center' }
    ];

    return (
        <div
            className="th-sf-branded-config-container"
            style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '16px',
                border: '1px solid #e1e3e5',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
            }}
        >
            <BlockStack gap="400">
                {/* Brand Identity Section */}
                <Box>
                    <Text variant="headingMd" as="h4">
                        Brand Identity
                    </Text>
                    <Box paddingBlockStart="200">
                        <TextField
                            label="Logo URL"
                            value={brandedConfig?.logo || ''}
                            onChange={handleLogoChange}
                            placeholder="https://example.com/logo.png"
                            helpText="Enter the URL of your brand logo"
                        />
                    </Box>
                </Box>

                <Divider />

                {/* Color Scheme Section */}
                <Box>
                    <Text variant="headingMd" as="h4">
                        Color Scheme
                    </Text>
                    <Box paddingBlockStart="200">
                        <BlockStack gap="300">
                            {colorOptions.map((color) => {
                                const hexColor = brandedConfig?.colors?.[color.value] || '#000000';
                                const hsbColor = hexToHsb(hexColor);

                                return (
                                    <Box key={color.value}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'start' }}>
                                            <div style={{ marginTop: '20px' }}>
                                                <Popover
                                                    active={activeColorPopover === color.value}
                                                    activator={
                                                        <Button
                                                            onClick={() => toggleColorPopover(color.value)}
                                                        // icon={<Icon source={ColorIcon} color="base" />}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    backgroundColor: hexColor,
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #ddd'
                                                                }}
                                                            />
                                                        </Button>
                                                    }
                                                    onClose={() => setActiveColorPopover(null)}
                                                >
                                                    <div style={{ padding: '12px' }}>
                                                        <ColorPicker
                                                            onChange={(hsb) => handleColorChange(color.value, hsb)}
                                                            color={{
                                                                hue: hsbColor.hue,
                                                                brightness: hsbColor.brightness,
                                                                saturation: hsbColor.saturation
                                                            }}
                                                        />
                                                    </div>
                                                </Popover>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <TextField
                                                    label={color.label}
                                                    value={hexColor}
                                                    onChange={(value) => handleColorChange(color.value, hexToHsb(value))}
                                                    placeholder="#000000"
                                                    helpText={`${color.label} color for your survey`}
                                                    autoComplete="off"
                                                />
                                            </div>

                                        </div>
                                    </Box>
                                );
                            })}
                        </BlockStack>
                    </Box>
                </Box>

                <Divider />

                {/* Typography Section */}
                <Box>
                    <Text variant="headingMd" as="h4">
                        Typography
                    </Text>
                    <Box paddingBlockStart="200">
                        <BlockStack gap="300">
                            <Select
                                label="Primary Font"
                                options={fontOptions}
                                value={brandedConfig?.fonts?.primary || 'Arial, sans-serif'}
                                onChange={(value) => handleFontChange('primary', value)}
                            />
                            <Select
                                label="Heading Font"
                                options={fontOptions}
                                value={brandedConfig?.fonts?.heading || 'Arial, sans-serif'}
                                onChange={(value) => handleFontChange('heading', value)}
                            />
                            {brandedConfig?.fonts?.primary === 'custom' && (
                                <TextField
                                    label="Custom Font Family"
                                    value={brandedConfig?.fonts?.customFamily || ''}
                                    onChange={(value) => handleFontChange('customFamily', value)}
                                    placeholder="'Custom Font', sans-serif"
                                />
                            )}
                        </BlockStack>
                    </Box>
                </Box>

                <Divider />

                {/* Display Settings Section */}
                <Box>
                    <Text variant="headingMd" as="h4">
                        Display Settings
                    </Text>
                    <Box paddingBlockStart="200">
                        <BlockStack gap="300">
                            <Select
                                label="Survey Position"
                                options={positionOptions}
                                value={brandedConfig?.displaySettings?.position || 'bottom-right'}
                                onChange={(value) => handleDisplaySettingsChange('position', value)}
                            />
                            <Box>
                                <Checkbox
                                    label="Show brand logo in survey"
                                    checked={brandedConfig?.displaySettings?.showLogo || false}
                                    onChange={(checked) => handleDisplaySettingsChange('showLogo', checked)}
                                />
                            </Box>
                            <Box>
                                <Checkbox
                                    label="Use custom border radius"
                                    checked={brandedConfig?.displaySettings?.customBorderRadius || false}
                                    onChange={(checked) => handleDisplaySettingsChange('customBorderRadius', checked)}
                                />
                            </Box>
                            {brandedConfig?.displaySettings?.customBorderRadius && (
                                <TextField
                                    label="Border Radius (px)"
                                    value={brandedConfig?.displaySettings?.borderRadius || ''}
                                    onChange={(value) => handleDisplaySettingsChange('borderRadius', value)}
                                    placeholder="8"
                                    type="number"
                                />
                            )}
                        </BlockStack>
                    </Box>
                </Box>

                <Divider />

                {/* Advanced Customization Section */}
                <Box>
                    <Text variant="headingMd" as="h4">
                        Advanced Customization
                    </Text>
                    <Box paddingBlockStart="200">
                        <TextField
                            label="Custom CSS"
                            value={brandedConfig?.customCss || ''}
                            onChange={handleCustomCssChange}
                            placeholder="/* Add your custom CSS here */"
                            multiline={4}
                            helpText="Add custom CSS to further customize the survey appearance"
                        />
                    </Box>
                </Box>
            </BlockStack>
        </div>
    );
}
