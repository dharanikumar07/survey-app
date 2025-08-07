import { use } from "react";
import { create } from "zustand";

const useStore = create((set) => ({
    ruleName: "",
    status: "draft",
    offerDisplay: { value: "all", type: null },
    offerDisplaySelection: [],
    offerDisplayInputTagValue: "",
    offerDisplayInputTagList: [],
    setOfferDisplayInputTagValue: (value) => set((state) => ({ ...state, offerDisplayInputTagValue: value })),
    setOfferDisplayInputTagList: (list) => set((state) => ({ ...state, offerDisplayInputTagList: list })),
    setOfferDisplaySelection: (selection) =>
        set({ offerDisplaySelection: selection }),
    discountType: "none",
    discountTypeName: "10% Off",
    discountTypeValue: "",
    setRuleName: (name) => set({ ruleName: name }),
    setStatus: (status) => set({ status: status }),
    setOfferDisplay: (display, type = null) =>
        set({ offerDisplay: { value: display, type: type } }),
    setDiscountType: (type) => set({ discountType: type }),
    setDiscountTypeName: (name) => set({ discountTypeName: name }),
    setDiscountTypeValue: (value) => set({ discountTypeValue: value }),
    products: [],
    quantities: {},
    setProducts: (newProducts) =>
        set((state) => {
            if (
                JSON.stringify(state.products) !== JSON.stringify(newProducts)
            ) {
                const updatedQuantities = newProducts.reduce(
                    (acc, product) => ({
                        ...acc,
                        [product.id]: 1,
                    }),
                    {},
                );
                return { products: newProducts, quantities: updatedQuantities };
            }

            return state;
        }),
    updateQuantity: (id, value) =>
        set((state) => ({
            quantities: { ...state.quantities, [id]: value },
        })),
    moveProduct: (id, direction) =>
        set((state) => {
            const products = [...state.products];
            const currentIndex = products.findIndex(
                (product) => product.id === id,
            );
            if (
                (direction === "up" && currentIndex === 0) ||
                (direction === "down" && currentIndex === products.length - 1)
            ) {
                return state;
            }
            const newIndex =
                direction === "up" ? currentIndex - 1 : currentIndex + 1;
            const [movedItem] = products.splice(currentIndex, 1);
            products.splice(newIndex, 0, movedItem);
            return { products };
        }),
    deleteProduct: (id) =>
        set((state) => ({
            products: state.products.filter((product) => product.id !== id),
            quantities: Object.fromEntries(
                Object.entries(state.quantities).filter(([key]) => key !== id),
            ),
        })),
    blockTitle: {
        title: "",
        strikeOutEnabled: false,
    },
    setBlockTitle: (title) =>
        set((state) => ({ blockTitle: { ...state.blockTitle, title } })),
    setBlockTitleStrikeOutEnabled: (strikeOutEnabled) =>
        set((state) => ({
            blockTitle: { ...state.blockTitle, strikeOutEnabled },
        })),
    discountCombinations: {
        orderDiscount: true,
        productDiscount: true,
        shippingDiscount: true,
    },
    setOrderDiscount: (orderDiscount) =>
        set((state) => ({
            discountCombinations: {
                ...state.discountCombinations,
                orderDiscount,
            },
        })),
    setProductDiscount: (productDiscount) =>
        set((state) => ({
            discountCombinations: {
                ...state.discountCombinations,
                productDiscount,
            },
        })),
    setShippingDiscount: (shippingDiscount) =>
        set((state) => ({
            discountCombinations: {
                ...state.discountCombinations,
                shippingDiscount,
            },
        })),
    schedule: {
        scheduleType: "continuous",
        startDate: "",
        startTime: "",
        hasEndDate: false,
        endDate: "",
        endTime: "",
    },
    setScheduleType: (scheduleType) =>
        set((state) => ({ schedule: { ...state.schedule, scheduleType } })),
    setScheduleStartDate: (startDate) =>
        set((state) => ({ schedule: { ...state.schedule, startDate } })),
    setScheduleStartTime: (startTime) =>
        set((state) => ({ schedule: { ...state.schedule, startTime } })),
    setScheduleHasEndDate: (hasEndDate) =>
        set((state) => ({ schedule: { ...state.schedule, hasEndDate } })),
    setScheduleEndDate: (endDate) =>
        set((state) => ({ schedule: { ...state.schedule, endDate } })),
    setScheduleEndTime: (endTime) =>
        set((state) => ({ schedule: { ...state.schedule, endTime } })),
    useCompareAtPrice: false,
    setUseCompareAtPrice: (useCompareAtPrice) =>
        set((state) => ({ useCompareAtPrice })),
    priceRounding: {
        enabled: false,
        roundingValue: ".99",
    },
    setPriceRoundingEnabled: (enabled) =>
        set((state) => ({
            priceRounding: { ...state.priceRounding, enabled },
        })),
    setPriceRoundingValue: (roundingValue) =>
        set((state) => ({
            priceRounding: { ...state.priceRounding, roundingValue },
        })),
    previewOutOfStock: {
        enabled: false,
        message:
            "Quantity exceeds stock. Available quantity may still be added to cart.",
    },
    setPreviewOutOfStockEnabled: (enabled) =>
        set((state) => ({
            previewOutOfStock: { ...state.previewOutOfStock, enabled },
        })),
    setPreviewOutOfStockMessage: (message) =>
        set((state) => ({
            previewOutOfStock: { ...state.previewOutOfStock, message },
        })),
    tiers: [
        {
            id: 1,
            title: "Tier 1",
            heading: "Buy One",
            quantity: "2",
            discount_type: "percent",
            discount: "0",
            subtitle: "Standard price",
            selectedByDefault: true,
            labelType: "Label",
            labelText: "Best Seller!",
            badgeText: "Free Shipping",
            freeShipping: true,
            isAddGiftEnabled: false,
            addImage: false,
            isLabelTextDisabled: false,
            isBadgeTextDisabled: false,
            colorPickerOpen: false,
            variantNumberBackgroundColor: "#f45714",
            variantNumberColor: "#ffffff",
            labelBackgroundColor: "#000000",
            selectedLabelBackgroundColor: "#000000",
            labelTextColor: "#ffffff",
            selectedLabelTextColor: "#ffffff",
            badgeBackgroundColor: "#000000",
            selectedBadgeBackgroundColor: "#000000",
            badgeTextColor: "#000000",
            selectedBadgeTextColor: "#000000",
            giftTextColor: "#000000",
            selectedGiftTextColor: "#ffffff",
            giftBackgroundColor: "#000000",
            selectedGiftBackgroundColor: "#000000",
            tierImage: {
                imageType: "none",
                imageUrl: "",
                imageSize: "54",
                imageCornerRadius: "7"
            },
            giftText: "",
            selectedGiftProduct: []
        },
        {
            id: 2,
            title: "Tier 2",
            heading: "Buy Two",
            quantity: "0",
            discount_type: "percent",
            discount: "0",
            subtitle: "You save 10%",
            selectedByDefault: false,
            labelType: "Label",
            labelText: "Best Seller!",
            badgeText: "Free Shipping",
            freeShipping: false,
            isAddGiftEnabled: false,
            addImage: true,
            isLabelTextDisabled: false,
            isBadgeTextDisabled: false,
            colorPickerOpen: false,
            variantNumberBackgroundColor: "#f45714",
            variantNumberColor: "#ffffff",
            labelBackgroundColor: "#000000",
            selectedLabelBackgroundColor: "#000000",
            labelTextColor: "#ffffff",
            selectedLabelTextColor: "#ffffff",
            badgeBackgroundColor: "#000000",
            selectedBadgeBackgroundColor: "#000000",
            badgeTextColor: "#000000",
            selectedBadgeTextColor: "#000000",
            giftTextColor: "#000000",
            selectedGiftTextColor: "#ffffff",
            giftBackgroundColor: "#000000",
            selectedGiftBackgroundColor: "#000000",
            tierImage: {
                imageType: "none",
                imageUrl: "",
                imageSize: "54",
                imageCornerRadius: "7"
            },
            giftText: "",
            selectedGiftProduct: []
        },
    ],
    selectedTierIndex: 0,

    setTiers: (newTiers) => set({ tiers: newTiers }),
    setSelectedTierIndex: (index) => set({ selectedTierIndex: index }),
    updateTierField: (index, field, value) =>
        set((state) => {
            const updatedTiers = [...state.tiers];
            updatedTiers[index][field] = value;
            return { tiers: updatedTiers };
        }),
    setSelectedByDefault: (index) =>
        set((state) => {
            const updatedTiers = state.tiers.map((tier, i) => ({
                ...tier,
                selectedByDefault: i === index,
            }));
            return { tiers: updatedTiers };
        }),
    conditionforAllCustomers: true,
    setConditionforAllCustomers: (conditionforAllCustomers) =>
        set({ conditionforAllCustomers }),
    conditionOrderCompleted: {
        min: 0,
        max: 0,
    },
    setConditionOrderCompletedMin: (conditionOrderCompletedMin) =>
        set((state) => ({ conditionOrderCompleted: { ...state.conditionOrderCompleted, min: conditionOrderCompletedMin } })),
    setConditionOrderCompletedMax: (conditionOrderCompletedMax) =>
        set((state) => ({ conditionOrderCompleted: { ...state.conditionOrderCompleted, max: conditionOrderCompletedMax } })),
    conditionAmountSpend: {
        min: 0,
        max: 0,
    },
    setConditionAmountSpendMin: (conditionAmountSpendMin) =>
        set((state) => ({ conditionAmountSpend: { ...state.conditionAmountSpend, min: conditionAmountSpendMin } })),
    setConditionAmountSpendMax: (conditionAmountSpendMax) =>
        set((state) => ({ conditionAmountSpend: { ...state.conditionAmountSpend, max: conditionAmountSpendMax } })),
    conditionStatus: "logged_in",
    setConditionStatus: (conditionStatus) => set({ conditionStatus }),
    conditionCountry: {
        included: "include",
        value: "India",
    },
    setConditionCountryIncluded: (conditionCountryIncluded) =>
        set((state => ({ conditionCountry: { ...state.conditionCountry, included: conditionCountryIncluded } }))),
    setConditionCountryValue: (conditionCountryValue) =>
        set((state => ({ conditionCountry: { ...state.conditionCountry, value: conditionCountryValue } }))),
    conditionInputTagValue: "",
    conditionInputTagList: [],
    setConditionInputTagValue: (value) => set((state) => ({ ...state, conditionInputTagValue: value })),
    setConditionInputTagList: (list) => set((state) => ({ ...state, conditionInputTagList: list })),
    conditions: [],
    addCondition: (condition) =>
        set((state) => ({
            conditions: [...state.conditions, condition],
        })),

    deleteCondition: (type) =>
        set((state) => ({
            conditions: state.conditions.filter((condition) => condition.type !== type),
        })),

    updateCondition: (type, key, value) =>
        set((state) => ({
            conditions: state.conditions.map((condition) =>
                condition.type === type ? { ...condition, [key]: value } : condition
            ),
        })),
    minMaxQuantityTiers: [
        {
            id: 1,
            title: "Tier 1",
            heading: "Buy any 2 items",
            minimumQuantity: 2,
            maximumQuantity: 2,
            discount_type: "percent",
            discount: "10",
            subtitle: "Standard price",
            badgeText: "⭐ 10% Off",
            isBadgeTextDisabled: false,
            colorPickerOpen: false,
            badgeBackgroundColor: "#f45714",
            selectedBadgeBackgroundColor: "#f45714",
            badgeTextColor: "#ffffff",
            selectedBadgeTextColor: "#ffffff",
        },
        {
            id: 2,
            title: "Tier 2",
            heading: "Buy any 3 items",
            minimumQuantity: 3,
            maximumQuantity: 3,
            discount_type: "percent",
            discount: "20",
            subtitle: "You save 10%",
            badgeText: "⭐ 20% Off",
            isBadgeTextDisabled: false,
            colorPickerOpen: false,
            badgeBackgroundColor: "#f45714",
            selectedBadgeBackgroundColor: "#f45714",
            badgeTextColor: "#ffffff",
            selectedBadgeTextColor: "#ffffff",
        },
    ],
    selectedMinMaxQuantityTierIndex: 0,

    setMinMaxQuantityTiers: (newTiers) =>
        set({ minMaxQuantityTiers: newTiers }),
    setSelectedMinMaxQuantityTierIndex: (index) =>
        set({ selectedMinMaxQuantityTierIndex: index }),
    updateMinMaxQuantityTierField: (index, field, value) =>
        set((state) => {
            const updatedTiers = [...state.minMaxQuantityTiers];
            updatedTiers[index][field] = value;
            return { minMaxQuantityTiers: updatedTiers };
        }),

    showEachUnitPriceOnProduct: false,
    setShowEachUnitPriceOnProduct: (value) =>
        set({ showEachUnitPriceOnProduct: value }),

    ruleInfoPricingType: "total_price",
    setRuleInfoPricingType: (value) =>
        set({ ruleInfoPricingType: value }),
    ruleInfoAllowVariants: true,
    setRuleInfoAllowVariants: (value) =>
        set({ ruleInfoAllowVariants: value }),
    ruleInfoShowQuantitySelector: false,
    ruleInfoQuantitySelectorMessage: "Select quantity",
    setRuleInfoShowQuantitySelector: (value) =>
        set({ ruleInfoShowQuantitySelector: value }),
    setRuleInfoShowQuantitySelectorMessage: (value) =>
        set({ ruleInfoQuantitySelectorMessage: value }),
    ruleInfoApplyTierFallback: false,
    setRuleInfoApplyTierFallback: (value) =>
        set({ ruleInfoApplyTierFallback: value }),
    bundleAction: "themeAddToCart",
    bundleFooterText: "Total:",
    bundleCallToActionText: "Get this bundle",
    bundleShowEachUnitPriceOnProduct: false,
    setBundleAction: (value) => set({ bundleAction: value }),
    setBundleFooterText: (value) => set({ bundleFooterText: value }),
    setBundleCallToActionText: (value) => set({ bundleCallToActionText: value }),
    setBundleShowEachUnitPriceOnProduct: (value) =>
        set({ bundleShowEachUnitPriceOnProduct: value }),
    // What to display component
    whatToDisplaySelection: ["recommemended_products"],
    setWhatToDisplaySelection: (value) => set({ whatToDisplaySelection: value }),
    whatToDisplaySelectedType: "",
    setWhatToDisplaySelectedType: (value) => set({ whatToDisplaySelectedType: value }),
    whatToDisplaySelectedItems: [],
    setWhatToDisplaySelectedItems: (selection) =>
        set({ whatToDisplaySelectedItems: selection }),
    design: {
        colorTheme: "#000000",
        customColorTheme: "#FF00FF",
        quantityBreakLayoutSectionData: {
            layoutAxis: "vertical",
            radioVisibility: "hidden",
            blockPadding: 0,
            blockBorderRadius: 0,
            borderRadius: 12,
            blockTitlteStrikeThrough: 14,
            quantityButtonBorderRadius: 12,
        },
        quantityBreakColorSectionData: {
            background: "#ffffff",
            selectedBackground: "#000000",
            title: "#303030",
            selectedTitle: "#303030",
            subtitle: "#868686",
            selectedSubtitle: "#868686",
            price: "#303030",
            selectedPrice: "#303030",
            regularPrice: "#868686",
            selectedRegularPrice: "#868686",
            radio: "#000000",
            selectedRadio: "#000000",
            border: "#000000",
            selectedBorder: "#000000",
            blockBorder: "#ffffff",
            blockBackground: "#ffffff",
            blockTitle: "#303030",
            blockTitleStrikeThrough: "#000000",
            quantitySelectorButton: "#e3e3e3",
            quantitySelectorButtonText: "#303030",
            quantitySelectorLabel: "#000000"
        },
        quantityBreakTypographySectionData: {
            blockTitleFontSize: "18",
            blockTitleFontWeight: "700",
            titleFontSize: "16",
            titleFontWeight: "700",
            subtitleFontSize: "14",
            subtitleFontWeight: "500",
            priceFontSize: "16",
            priceFontWeight: "700",
            regularPriceFontSize: "14",
            regularPriceFontWeight: "400",
            labelFontSize: "12",
            labelFontWeight: "700",
            badgeFontSize: "10",
            badgeFontWeight: "500",
            giftTextFontSize: "16",
            giftTextFontWeight: "600",
            quantitySelectorFontSize: "14",
            quantitySelectorFontWeight: "700",
        },
        bundleLayoutSectionData: {
            layoutAxis: "horizontal",
            blockPadding: 0,
            blockBorderRadius: 16,
            productBorderRadius: 6,
            productImageBorderRadius: 4,
            callToActionButtonBorderRadius: 6,
            blockTitlteStrikeThrough: 14,
        },
        background: "#ffffff",
        bundleColorSectionData: {
            blockBackground: "#f7f7f7",
            productBackground: "#ffffff",
            blockTitle: "#131744",
            productTitle: "#131744",
            blockBorder: "#ebebeb",
            productBorder: "#e3e3e3",
            productPrice: "#131744",
            productRegularPrice: "#676a85",
            productImageBorder: "#e3e3e3",
            productImageBackground: "#ffffff",
            separator: "#000000",
            separatorBackground: "#ffffff",
            separatorBorder: "#676a85",
            footerText: "#131744",
            footerRegularPrice: "#e3512f",
            footerPrice: "#303030",
            callToActionButtonBorder: "#000000",
            callToActionButtonBackground: "#000000",
            callToActionButtonText: "#ffffff",
            blockTitleStrikeThrough: "#000000",
        },
        bundleTypographySectionData: {
            blockTitleFontSize: "16",
            blockTitleFontWeight: "700",
            productTitleFontSize: "12",
            productTitleFontWeight: "600",
            productPriceFontSize: "14",
            productPriceFontWeight: "700",
            productRegularPriceFontSize: "12",
            productRegularPriceFontWeight: "400",
            separatorFontSize: "25",
            separatorFontWeight: "300",
            footerTextFontSize: "15",
            footerTextFontWeight: "700",
            footerRegularPriceFontSize: "12",
            footerRegularPriceFontWeight: "300",
            footerPriceFontSize: "15",
            footerPriceFontWeight: "700",
            calltoActionButtonFontSize: "14",
            calltoActionButtonFontWeight: "700",
        },
        volumeDiscountBundlesLayoutSectionData: {
            blockPadding: 0,
            blockBorderRadius: 0,
            borderRadius: 12,
            blockTitlteStrikeThrough: 14,
            quantityButtonBorderRadius: 12,
        },
        volumeDiscountBundlesColorSectionData: {
            background: "#ffffff",
            selectedBackground: "#000000",
            title: "#303030",
            selectedTitle: "#303030",
            subtitle: "#676a85",
            selectedSubtitle: "#676a85",
            blockBorder: "#ebebeb",
            blockBackground: "#131744",
            blockTitle: "#f7f7f7",
            blockTitleStrikeThrough: "#c8c8c8",
            quantitySelectorButton: "#e3e3e3",
            quantitySelectorButtonText: "#303030",
            quantitySelectorLabel: "#000000"
        },
        volumeDiscountBundlesTypographySectionData: {
            blockTitleFontSize: "14",
            blockTitleFontWeight: "800",
            titleFontSize: "14",
            titleFontWeight: "800",
            subtitleFontSize: "12",
            subtitleFontWeight: "300",
            badgeFontSize: "10",
            badgeFontWeight: "400",
            quantitySelectorFontSize: "14",
            quantitySelectorFontWeight: "700",
        },
        relatedProductsLayoutSectionData: {
            blockBorderRadius: 16,
            productImageBorderRadius: 4,
            callToActionButtonBorderRadius: 6,
            blockBorderSize: 2,
            productImageBorderSize: 20,
            ctaButtonBorderSize: 1,
            insideTop: 8,
            insideBottom: 8,
            outsideTop: 8,
            outsideBottom: 8,
        },
        relatedProductsColorSectionData: {
            blockBackground: "#f7f7f7",
            blockBorder: "#ebebeb",
            blockTitle: "#131744",
            productTitle: "#131744",
            productVariantTitle: "#131744",
            productPrice: "#131744",
            regularPrice: "#676a85",
            productImageBorder: "#ebebeb",
            callToActionButtonBackground: "#f45714",
            callToActionButtonText: "#ffffff",
            callToActionButtonBorder: "#131744",
            nextProductButton: "#676a85",
        },
        relatedProductsTypographySectionData: {
            blockTitleFontSize: "14",
            blockTitleFontWeight: "800",
            calltoActionButtonFontSize: "14",
            calltoActionButtonFontWeight: "700",
            productTitleFontSize: "14",
            productTitleFontWeight: "800",
            productVariantTitleFontSize: "12",
            productVariantTitleFontWeight: "800",
            priceFontSize: "14",
            priceFontWeight: "700",
            regularPriceFontSize: "12",
            regularPriceFontWeight: "300",
        },
        quantityDiscountsLayoutSectionData: {
            blockPadding: 0,
            blockBorderRadius: 0,
            borderRadius: 12,
            blockTitlteStrikeThrough: 14,
            quantityButtonBorderRadius: 12,
        },
        quantityDiscountsColorSectionData: {
            background: "#ffffff",
            selectedBackground: "#ffffff",
            title: "#131744",
            selectedTitle: "#131744",
            subtitle: "#676a85",
            selectedSubtitle: "#676a85",
            blockBorder: "#ebebeb",
            blockTitle: "#131744",
            blockBackground: "#f7f7f7",
            blockTitleStrikeThrough: "#c8c8c8",
            quantitySelectorButton: "#e3e3e3",
            quantitySelectorButtonText: "#441713",
            quantitySelectorLabel: "#131744"
        },
        quantityDiscountsTypographySectionData: {
            blockTitleFontSize: "14",
            blockTitleFontWeight: "800",
            titleFontSize: "14",
            titleFontWeight: "800",
            subtitleFontSize: "12",
            subtitleFontWeight: "300",
            badgeFontSize: "10",
            badgeFontWeight: "400",
            quantitySelectorFontSize: "14",
            quantitySelectorFontWeight: "700",
        }
    },
    setDesign: (key, value) =>
        set((state) => ({
            design: { ...state.design, [key]: value },
        })),
    //To update layout data in the design object
    setDesignValue: (designKey, key, value) =>
        set((state) => ({
            design: {
                ...state.design,
                [designKey]: {
                    ...state.design[designKey],
                    [key]: value,
                },
            },
        })),
    countdown: {
        countdown_enabled: false,
        position: "at_the_bottom_of_the_block",
        timerType: "fixed_time",
        fixedTime: 15,
        specificDate: {
            selectedDate: new Date().toISOString().slice(0, 10), // Store as ISO string
            selectedMonth: new Date().getMonth(),
            selectedYear: new Date().getFullYear(),
            selectedTime: "01:00 AM",
        },
        atTimerEnd: "do_nothing",
        timerEndCustomTitle: "",
        timerFormat: "DHMS",
        timerTitle: "Hurry up!",
        timerSubTitle: "Sale ends in:",
        timerDayLabel: "Days",
        timerHourLabel: "Hrs",
        timerMinuteLabel: "Mins",
        timerSecondLabel: "Secs",
        stockInvMessage: "Only 16 left in stock",
        timerPadding: 10,
        timerBorderWidth: 2,
        timerCornerRadius: 8,
        backgroundColorType: "gradient",
        gradientAngle: 90,
        timerTitleColorFontSize: "16",
        timerTitleColorFontWeight: "700",
        timerSubtitleFontSize: "140",
        timerSubtitleFontWeight: "500",
        timerLabelFontSize: "14",
        timerLabelFontWeight: "500",
        timerNumberFontSize: "24",
        timerNumberFontWeight: "700",
        timerStockInvMessageFontSize: "14",
        timerStockInvMessageFontWeight: "500",
        timerTitleColor: "#303030",
        timerSubtitleColor: "#303030",
        timerLabelColor: "#303030",
        timerNumberColor: "#303030",
        timerStockInvMessageColor: "#303030",
        timerBorderColor: "#ebebeb",
        timerSingleBackGroundColor: "#ffffff",
        timerGradientPrimaryColor: "#ebebeb",
        timerGradientSecondaryColor: "#ffffff",
    },
    setCountdown: (key, value) =>
        set((state) => ({
            countdown: { ...state.countdown, [key]: value },
        })),
    setCountdownValue: (parentKey, key, value) =>
        set((state) => ({
            countdown: {
                ...state.countdown,
                [parentKey]: {
                    ...state.countdown[parentKey],
                    [key]: value,
                },
            },
        })),
    // State reset functions
    resetCountdown: () =>
        set((state) => ({
            countdown: {
                ...state.countdown,
                countdown_enabled: false,
                position: "at_the_bottom_of_the_block",
                timerType: "fixed_time",
                fixedTime: 15,
                specificDate: {
                    selectedDate: new Date().toISOString().slice(0, 10),
                    selectedMonth: new Date().getMonth(),
                    selectedYear: new Date().getFullYear(),
                    selectedTime: "01:00 AM",
                },
                atTimerEnd: "do_nothing",
                timerEndCustomTitle: "",
                timerFormat: "DHMS",
                timerTitle: "Hurry up!",
                timerSubTitle: "Sale ends in:",
                timerDayLabel: "Days",
                timerHourLabel: "Hrs",
                timerMinuteLabel: "Mins",
                timerSecondLabel: "Secs",
                stockInvMessage: "Only 16 left in stock",
                timerPadding: 10,
                timerBorderWidth: 2,
                timerCornerRadius: 8,
                backgroundColorType: "gradient",
                gradientAngle: 90,
                timerTitleColorFontSize: "16",
                timerTitleColorFontWeight: "700",
                timerSubtitleFontSize: "140",
                timerSubtitleFontWeight: "500",
                timerLabelFontSize: "14",
                timerLabelFontWeight: "500",
                timerNumberFontSize: "24",
                timerNumberFontWeight: "700",
                timerStockInvMessageFontSize: "14",
                timerStockInvMessageFontWeight: "500",
                timerTitleColor: "#303030",
                timerSubtitleColor: "#303030",
                timerLabelColor: "#303030",
                timerNumberColor: "#303030",
                timerStockInvMessageColor: "#303030",
                timerBorderColor: "#ebebeb",
                timerSingleBackGroundColor: "#ffffff",
                timerGradientPrimaryColor: "#ebebeb",
                timerGradientSecondaryColor: "#ffffff",
            },
        })),
    resetOfferDisplay: () =>
        set((state) => ({
            ...state.offerDisplay,
            offerDisplay: { value: "all", type: null },
            offerDisplaySelection: [],
            offerDisplayInputTagValue: "",
            offerDisplayInputTagList: [],
        })),
    resetRuleInfoBlock: () =>
        set((state) => ({
            ruleName: "",
            status: "draft",
            ruleInfoPricingType: "total_price",
            ruleInfoAllowVariants: true,
            ruleInfoShowQuantitySelector: false,
            ruleInfoQuantitySelectorMessage: "Select quantity",
            ruleInfoApplyTierFallback: false,
        })),
    resetBlockTitle: () =>
        set((state) => ({
            ...state.blockTitle,
            blockTitle: {
                title: "",
                strikeOutEnabled: false,
            },
        })),
    resetTiers: () =>
        set((state) => ({
            tiers: [
                {
                    id: 1,
                    title: "Tier 1",
                    heading: "Buy One",
                    quantity: "2",
                    discount_type: "percent",
                    discount: "0",
                    subtitle: "Standard price",
                    selectedByDefault: true,
                    labelType: "Label",
                    labelText: "Best Seller!",
                    badgeText: "Free Shipping",
                    freeShipping: true,
                    isAddGiftEnabled: false,
                    addImage: false,
                    isLabelTextDisabled: false,
                    isBadgeTextDisabled: false,
                    colorPickerOpen: false,
                    variantNumberBackgroundColor: "#f45714",
                    variantNumberColor: "#ffffff",
                    labelBackgroundColor: "#000000",
                    selectedLabelBackgroundColor: "#000000",
                    labelTextColor: "#ffffff",
                    selectedLabelTextColor: "#ffffff",
                    badgeBackgroundColor: "#000000",
                    selectedBadgeBackgroundColor: "#000000",
                    badgeTextColor: "#000000",
                    selectedBadgeTextColor: "#000000",
                    giftTextColor: "#000000",
                    selectedGiftTextColor: "#ffffff",
                    giftBackgroundColor: "#000000",
                    selectedGiftBackgroundColor: "#000000",
                    tierImage: {
                        imageType: "none",
                        imageUrl: "",
                        imageSize: "54",
                        imageCornerRadius: "7"
                    },
                    giftText: "",
                    selectedGiftProduct: []
                },
                {
                    id: 2,
                    title: "Tier 2",
                    heading: "Buy Two",
                    quantity: "0",
                    discount_type: "percent",
                    discount: "0",
                    subtitle: "You save 10%",
                    selectedByDefault: false,
                    labelType: "Label",
                    labelText: "Best Seller!",
                    badgeText: "Free Shipping",
                    freeShipping: false,
                    isAddGiftEnabled: false,
                    addImage: true,
                    isLabelTextDisabled: false,
                    isBadgeTextDisabled: false,
                    colorPickerOpen: false,
                    variantNumberBackgroundColor: "#f45714",
                    variantNumberColor: "#ffffff",
                    labelBackgroundColor: "#000000",
                    selectedLabelBackgroundColor: "#000000",
                    labelTextColor: "#ffffff",
                    selectedLabelTextColor: "#ffffff",
                    badgeBackgroundColor: "#000000",
                    selectedBadgeBackgroundColor: "#000000",
                    badgeTextColor: "#000000",
                    selectedBadgeTextColor: "#000000",
                    giftTextColor: "#000000",
                    selectedGiftTextColor: "#ffffff",
                    giftBackgroundColor: "#000000",
                    selectedGiftBackgroundColor: "#000000",
                    tierImage: {
                        imageType: "none",
                        imageUrl: "",
                        imageSize: "54",
                        imageCornerRadius: "7"
                    },
                    giftText: "",
                    selectedGiftProduct: []
                }
            ],
            selectedTierIndex: 0,
        })),
    resetQuantityBreakDesign: () =>
        set((state) => ({
            design: {
                ...state.design,
                colorTheme: "#000000",
                customColorTheme: "#FF00FF",
                quantityBreakLayoutSectionData: {
                    layoutAxis: "vertical",
                    radioVisibility: "hidden",
                    blockPadding: 0,
                    blockBorderRadius: 0,
                    borderRadius: 12,
                    blockTitlteStrikeThrough: 14,
                    quantityButtonBorderRadius: 12,
                },
                quantityBreakColorSectionData: {
                    background: "#ffffff",
                    selectedBackground: "#000000",
                    title: "#303030",
                    selectedTitle: "#303030",
                    subtitle: "#868686",
                    selectedSubtitle: "#868686",
                    price: "#303030",
                    selectedPrice: "#303030",
                    regularPrice: "#868686",
                    selectedRegularPrice: "#868686",
                    radio: "#000000",
                    selectedRadio: "#000000",
                    border: "#000000",
                    selectedBorder: "#000000",
                    blockBorder: "#ffffff",
                    blockBackground: "#ffffff",
                    blockTitle: "#303030",
                    blockTitleStrikeThrough: "#000000",
                    quantitySelectorButton: "#e3e3e3",
                    quantitySelectorButtonText: "#303030",
                    quantitySelectorLabel: "#000000"
                },
                quantityBreakTypographySectionData: {
                    blockTitleFontSize: "18",
                    blockTitleFontWeight: "700",
                    titleFontSize: "16",
                    titleFontWeight: "700",
                    subtitleFontSize: "14",
                    subtitleFontWeight: "500",
                    priceFontSize: "16",
                    priceFontWeight: "700",
                    regularPriceFontSize: "14",
                    regularPriceFontWeight: "400",
                    labelFontSize: "12",
                    labelFontWeight: "700",
                    badgeFontSize: "10",
                    badgeFontWeight: "500",
                    giftTextFontSize: "16",
                    giftTextFontWeight: "600",
                    quantitySelectorFontSize: "14",
                    quantitySelectorFontWeight: "700",
                }
            }
        })),
    resetStockAndPricingSettings: () =>
        set((state) => ({
            useCompareAtPrice: false,
            priceRounding: {
                enabled: false,
                roundingValue: ".99",
            },
            previewOutOfStock: {
                enabled: false,
                message:
                    "Quantity exceeds stock. Available quantity may still be added to cart.",
            },

        })),
    resetDiscountCombinations: () =>
        set((state) => ({
            ...state.discountCombinations,
            discountCombinations: {
                orderDiscount: true,
                productDiscount: true,
                shippingDiscount: true,
            }
        })),
    resetConditions: () =>
        set((state) => ({
            conditions: [],
            conditionforAllCustomers: true,
            conditionOrderCompleted: {
                min: 0,
                max: 0,
            },
            conditionAmountSpend: {
                min: 0,
                max: 0,
            },
            conditionStatus: "logged_in",
            conditionCountry: {
                included: "include",
                value: "India",
            },
            conditionInputTagValue: "",
            conditionInputTagList: [],
        })),
    resetSchedule: () =>
        set((state) => ({
            schedule: {
                scheduleType: "continuous",
                startDate: "",
                startTime: "",
                hasEndDate: false,
                endDate: "",
                endTime: "",
            },
        })),
    resetIncludedProducts: () =>
        set((state) => ({
            products: [],
            quantities: {}
        })),
    resetDiscountType: () =>
        set((state) => ({
            discountType: "none",
            discountTypeName: "10% Off",
            discountTypeValue: "",
        })),
    resetBundleAdditionalDealSettings: () =>
        set((state) => ({
            bundleAction: "themeAddToCart",
            bundleFooterText: "Total:",
            bundleCallToActionText: "Get this bundle",
            bundleShowEachUnitPriceOnProduct: false,
        })),
    resetBundleDesign: () =>
        set((state) => ({
            design: {
                ...state.design,
                bundleLayoutSectionData: {
                    layoutAxis: "horizontal",
                    blockPadding: 0,
                    blockBorderRadius: 16,
                    productBorderRadius: 6,
                    productImageBorderRadius: 4,
                    callToActionButtonBorderRadius: 6,
                    blockTitlteStrikeThrough: 14,
                },
                bundleColorSectionData: {
                    blockBackground: "#f7f7f7",
                    productBackground: "#ffffff",
                    blockTitle: "#131744",
                    productTitle: "#131744",
                    blockBorder: "#ebebeb",
                    productBorder: "#e3e3e3",
                    productPrice: "#131744",
                    productRegularPrice: "#676a85",
                    productImageBorder: "#e3e3e3",
                    productImageBackground: "#ffffff",
                    separator: "#000000",
                    separatorBackground: "#ffffff",
                    separatorBorder: "#676a85",
                    footerText: "#131744",
                    footerRegularPrice: "#e3512f",
                    footerPrice: "#303030",
                    callToActionButtonBorder: "#000000",
                    callToActionButtonBackground: "#000000",
                    callToActionButtonText: "#ffffff",
                    blockTitleStrikeThrough: "#000000",
                },
                bundleTypographySectionData: {
                    blockTitleFontSize: "16",
                    blockTitleFontWeight: "700",
                    productTitleFontSize: "12",
                    productTitleFontWeight: "600",
                    productPriceFontSize: "14",
                    productPriceFontWeight: "700",
                    productRegularPriceFontSize: "12",
                    productRegularPriceFontWeight: "400",
                    separatorFontSize: "25",
                    separatorFontWeight: "300",
                    footerTextFontSize: "15",
                    footerTextFontWeight: "700",
                    footerRegularPriceFontSize: "12",
                    footerRegularPriceFontWeight: "300",
                    footerPriceFontSize: "15",
                    footerPriceFontWeight: "700",
                    calltoActionButtonFontSize: "14",
                    calltoActionButtonFontWeight: "700",
                },
            }
        })),
    resetMinMaxQuantityTiers: () =>
        set((state) => ({
            minMaxQuantityTiers: [
                {
                    id: 1,
                    title: "Tier 1",
                    heading: "Buy any 2 items",
                    minimumQuantity: 2,
                    maximumQuantity: 2,
                    discount_type: "percent",
                    discount: "10",
                    subtitle: "Standard price",
                    badgeText: "⭐ 10% Off",
                    isBadgeTextDisabled: false,
                    colorPickerOpen: false,
                    badgeBackgroundColor: "#f45714",
                    selectedBadgeBackgroundColor: "#f45714",
                    badgeTextColor: "#ffffff",
                    selectedBadgeTextColor: "#ffffff",
                },
                {
                    id: 2,
                    title: "Tier 2",
                    heading: "Buy any 3 items",
                    minimumQuantity: 3,
                    maximumQuantity: 3,
                    discount_type: "percent",
                    discount: "20",
                    subtitle: "You save 10%",
                    badgeText: "⭐ 20% Off",
                    isBadgeTextDisabled: false,
                    colorPickerOpen: false,
                    badgeBackgroundColor: "#f45714",
                    selectedBadgeBackgroundColor: "#f45714",
                    badgeTextColor: "#ffffff",
                    selectedBadgeTextColor: "#ffffff",
                },
            ],
            selectedMinMaxQuantityTierIndex: 0,
        })),

    resetVolumeDiscountBundlesDesign: () =>
        set((state) => ({
            design: {
                ...state.design,
                volumeDiscountBundlesLayoutSectionData: {
                    blockPadding: 0,
                    blockBorderRadius: 0,
                    borderRadius: 12,
                    blockTitlteStrikeThrough: 14,
                    quantityButtonBorderRadius: 12,
                },
                volumeDiscountBundlesColorSectionData: {
                    background: "#ffffff",
                    selectedBackground: "#000000",
                    title: "#303030",
                    selectedTitle: "#303030",
                    subtitle: "#676a85",
                    selectedSubtitle: "#676a85",
                    blockBorder: "#ebebeb",
                    blockBackground: "#131744",
                    blockTitle: "#f7f7f7",
                    blockTitleStrikeThrough: "#c8c8c8",
                    quantitySelectorButton: "#e3e3e3",
                    quantitySelectorButtonText: "#303030",
                    quantitySelectorLabel: "#000000"
                },
                volumeDiscountBundlesTypographySectionData: {
                    blockTitleFontSize: "14",
                    blockTitleFontWeight: "800",
                    titleFontSize: "14",
                    titleFontWeight: "800",
                    subtitleFontSize: "12",
                    subtitleFontWeight: "300",
                    badgeFontSize: "10",
                    badgeFontWeight: "400",
                    quantitySelectorFontSize: "14",
                    quantitySelectorFontWeight: "700",
                },
            }
        })),
    resetWhatToDisplay: () =>
        set((state) => ({
            whatToDisplaySelection: ["recommemended_products"],
            whatToDisplaySelectedType: "",
            whatToDisplaySelectedItems: [],
        })),
    resetRelatedProductsDesign: () =>
        set((state) => ({
            design: {
                ...state.design,
                relatedProductsLayoutSectionData: {
                    blockBorderRadius: 16,
                    productImageBorderRadius: 4,
                    callToActionButtonBorderRadius: 6,
                    blockBorderSize: 2,
                    productImageBorderSize: 20,
                    ctaButtonBorderSize: 1,
                    insideTop: 8,
                    insideBottom: 8,
                    outsideTop: 8,
                    outsideBottom: 8,
                },
                relatedProductsColorSectionData: {
                    blockBackground: "#f7f7f7",
                    blockBorder: "#ebebeb",
                    blockTitle: "#131744",
                    productTitle: "#131744",
                    productVariantTitle: "#131744",
                    productPrice: "#131744",
                    regularPrice: "#676a85",
                    productImageBorder: "#ebebeb",
                    callToActionButtonBackground: "#f45714",
                    callToActionButtonText: "#ffffff",
                    callToActionButtonBorder: "#131744",
                    nextProductButton: "#676a85",
                },
                relatedProductsTypographySectionData: {
                    blockTitleFontSize: "14",
                    blockTitleFontWeight: "800",
                    calltoActionButtonFontSize: "14",
                    calltoActionButtonFontWeight: "700",
                    productTitleFontSize: "14",
                    productTitleFontWeight: "800",
                    productVariantTitleFontSize: "12",
                    productVariantTitleFontWeight: "800",
                    priceFontSize: "14",
                    priceFontWeight: "700",
                    regularPriceFontSize: "12",
                    regularPriceFontWeight: "300",
                },
            }
        })),
    resetQuantityDiscountsDesign: () =>
        set((state) => ({
            design: {
                ...state.design,
                quantityDiscountsLayoutSectionData: {
                    blockPadding: 0,
                    blockBorderRadius: 0,
                    borderRadius: 12,
                    blockTitlteStrikeThrough: 14,
                    quantityButtonBorderRadius: 12,
                },
                quantityDiscountsColorSectionData: {
                    background: "#ffffff",
                    selectedBackground: "#ffffff",
                    title: "#131744",
                    selectedTitle: "#131744",
                    subtitle: "#676a85",
                    selectedSubtitle: "#676a85",
                    blockBorder: "#ebebeb",
                    blockTitle: "#131744",
                    blockBackground: "#f7f7f7",
                    blockTitleStrikeThrough: "#c8c8c8",
                    quantitySelectorButton: "#e3e3e3",
                    quantitySelectorButtonText: "#441713",
                    quantitySelectorLabel: "#131744"
                },
                quantityDiscountsTypographySectionData: {
                    blockTitleFontSize: "14",
                    blockTitleFontWeight: "800",
                    titleFontSize: "14",
                    titleFontWeight: "800",
                    subtitleFontSize: "12",
                    subtitleFontWeight: "300",
                    badgeFontSize: "10",
                    badgeFontWeight: "400",
                    quantitySelectorFontSize: "14",
                    quantitySelectorFontWeight: "700",
                }
            }
        })),
    resetQuantityBreak: () => {
        const state = useStore.getState();
        state.resetOfferDisplay();
        state.resetCountdown();
        state.resetRuleInfoBlock();
        state.resetBlockTitle();
        state.resetTiers();
        state.resetQuantityBreakDesign();
        state.resetStockAndPricingSettings();
        state.resetDiscountCombinations();
        state.resetConditions();
        state.resetSchedule();
    },
    resetBundles: () => {
        const state = useStore.getState();
        state.resetRuleInfoBlock();
        state.resetOfferDisplay();
        state.resetIncludedProducts();
        state.resetDiscountType();
        state.resetStockAndPricingSettings();
        state.resetBlockTitle();
        state.resetBundleAdditionalDealSettings();
        state.resetCountdown();
        state.resetBundleDesign();
        state.resetDiscountCombinations();
        state.resetSchedule();
    },
    resetVolumeDiscountBundles: () => {
        const state = useStore.getState();
        state.resetOfferDisplay();
        state.resetBlockTitle();
        state.resetMinMaxQuantityTiers();
        state.resetRuleInfoBlock();
        state.resetVolumeDiscountBundlesDesign();
        state.resetDiscountCombinations();
        state.resetConditions();
        state.resetSchedule();
        state.resetCountdown();
    },
    resetRelatedProducts: () => {
        const state = useStore.getState();
        state.resetRuleInfoBlock();
        state.resetOfferDisplay();
        state.resetWhatToDisplay();
        state.resetStockAndPricingSettings();
        state.resetDiscountType();
        state.resetRelatedProductsDesign();
        state.resetDiscountCombinations();
        state.resetSchedule();
    },
    resetQuantityDiscounts: () => {
        const state = useStore.getState();
        state.resetOfferDisplay();
        state.resetBlockTitle();
        state.resetMinMaxQuantityTiers();
        state.resetRuleInfoBlock();
        state.resetQuantityDiscountsDesign();
        state.resetDiscountCombinations();
        state.resetSchedule();
        state.resetConditions();
        state.resetCountdown();
    },
    setQuantityBreak: (data) =>
        set((state) => {
            const conditions = data.preparedConditions || [];
            const conditionforAllCustomers = data.conditionForAllCustomers || false;

            const conditionInputTagList = conditions.find((c) => c.type === "tags")?.value || [];
            const conditionAmountSpend = conditions.find((c) => c.type === "amount_spent") || { min: 0, max: 0 };
            const conditionOrderCompleted = conditions.find((c) => c.type === "orders_completed") || { min: 0, max: 0 };
            const conditionStatus = conditions.find((c) => c.type === "status")?.value || "logged_in";
            const conditionCountry = conditions.find((c) => c.type === "country") || { included: "include", value: "" };
            return {
                ruleName: data.title,
                status: data.status,
                ruleInfoPricingType: data.rule_data.rule_pricing_type,
                ruleInfoAllowVariants: data.rule_data.rule_allow_variants,
                ruleInfoShowQuantitySelector: data.rule_data.rule_show_quantity_selector,
                ruleInfoQuantitySelectorMessage: data.rule_data.rule_quantity_selector_message,
                ruleInfoApplyTierFallback: data.rule_data.rule_apply_tier_fallback,
                blockTitle: {
                    title: data.rule_data.block_title,
                    strikeOutEnabled: data.rule_data.block_title_strike_out_enabled,
                },
                tiers: data.rule_data.tiers,
                offerDisplay: data.offerDisplay,
                offerDisplaySelection: data.offerDisplaySelection,
                offerDisplayInputTagList: data.offerDisplayInputTagList,
                design: {
                    colorTheme: data.rule_data.design.color_theme,
                    customColorTheme: data.rule_data.design.custom_color_theme,
                    quantityBreakLayoutSectionData: {
                        layoutAxis: data.rule_data.design.design_layout.layoutAxis,
                        radioVisibility: data.rule_data.design.design_layout.radioVisibility,
                        blockPadding: data.rule_data.design.design_layout.blockPadding,
                        blockBorderRadius: data.rule_data.design.design_layout.blockBorderRadius,
                        borderRadius: data.rule_data.design.design_layout.borderRadius,
                        blockTitlteStrikeThrough: data.rule_data.design.design_layout.blockTitlteStrikeThrough,
                        quantityButtonBorderRadius: data.rule_data.design.design_layout.quantityButtonBorderRadius,
                    },
                    quantityBreakColorSectionData: {
                        background: data.rule_data.design.design_colors.background,
                        selectedBackground: data.rule_data.design.design_colors.selectedBackground,
                        title: data.rule_data.design.design_colors.title,
                        selectedTitle: data.rule_data.design.design_colors.selectedTitle,
                        subtitle: data.rule_data.design.design_colors.subtitle,
                        selectedSubtitle: data.rule_data.design.design_colors.selectedSubtitle,
                        price: data.rule_data.design.design_colors.price,
                        selectedPrice: data.rule_data.design.design_colors.selectedPrice,
                        regularPrice: data.rule_data.design.design_colors.regularPrice,
                        selectedRegularPrice: data.rule_data.design.design_colors.selectedRegularPrice,
                        radio: data.rule_data.design.design_colors.radio,
                        selectedRadio: data.rule_data.design.design_colors.selectedRadio,
                        border: data.rule_data.design.design_colors.border,
                        selectedBorder: data.rule_data.design.design_colors.selectedBorder,
                        blockBorder: data.rule_data.design.design_colors.blockBorder,
                        blockBackground: data.rule_data.design.design_colors.blockBackground,
                        blockTitle: data.rule_data.design.design_colors.blockTitle,
                        blockTitleStrikeThrough: data.rule_data.design.design_colors.blockTitleStrikeThrough,
                        quantitySelectorButton: data.rule_data.design.design_colors.quantitySelectorButton,
                        quantitySelectorButtonText: data.rule_data.design.design_colors.quantitySelectorButtonText,
                        quantitySelectorLabel: data.rule_data.design.design_colors.quantitySelectorLabel,
                    },
                    quantityBreakTypographySectionData: {
                        blockTitleFontSize: data.rule_data.design.design_typography.blockTitleFontSize,
                        blockTitleFontWeight: data.rule_data.design.design_typography.blockTitleFontWeight,
                        titleFontSize: data.rule_data.design.design_typography.titleFontSize,
                        titleFontWeight: data.rule_data.design.design_typography.titleFontWeight,
                        subtitleFontSize: data.rule_data.design.design_typography.subtitleFontSize,
                        subtitleFontWeight: data.rule_data.design.design_typography.subtitleFontWeight,
                        priceFontSize: data.rule_data.design.design_typography.priceFontSize,
                        priceFontWeight: data.rule_data.design.design_typography.priceFontWeight,
                        regularPriceFontSize: data.rule_data.design.design_typography.regularPriceFontSize,
                        regularPriceFontWeight: data.rule_data.design.design_typography.regularPriceFontWeight,
                        labelFontSize: data.rule_data.design.design_typography.labelFontSize,
                        labelFontWeight: data.rule_data.design.design_typography.labelFontWeight,
                        badgeFontSize: data.rule_data.design.design_typography.badgeFontSize,
                        badgeFontWeight: data.rule_data.design.design_typography.badgeFontWeight,
                        giftTextFontSize: data.rule_data.design.design_typography.giftTextFontSize,
                        giftTextFontWeight: data.rule_data.design.design_typography.giftTextFontWeight,
                        quantitySelectorFontSize: data.rule_data.design.design_typography.quantitySelectorFontSize,
                        quantitySelectorFontWeight: data.rule_data.design.design_typography.quantitySelectorFontWeight,
                    },

                },
                useCompareAtPrice: data.rule_data.compare_at_price_enabled,
                priceRounding: {
                    enabled: data.rule_data.price_rounding_enabled,
                    roundingValue: data.rule_data.price_rounding_value,
                },
                previewOutOfStock: {
                    enabled: data.rule_data.preview_out_of_stock_enabled,
                    message: data.rule_data.preview_out_of_stock_message,
                },
                discountCombinations: {
                    orderDiscount: data.rule_data.combine_with_order_discount,
                    productDiscount: data.rule_data.combine_with_product_discount,
                    shippingDiscount: data.rule_data.combine_with_shipping_discount,
                },
                schedule: {
                    scheduleType: data.rule_data.schedule_type,
                    startDate: data.rule_data.schedule_start_date,
                    startTime: data.rule_data.schedule_start_time,
                    hasEndDate: data.rule_data.schedule_has_end_date,
                    endDate: data.rule_data.schedule_end_date,
                    endTime: data.rule_data.schedule_end_time,
                },
                conditions,
                conditionforAllCustomers,
                conditionInputTagList,
                conditionAmountSpend,
                conditionOrderCompleted,
                conditionStatus,
                conditionCountry,
                countdown: {
                    countdown_enabled: data.rule_data.countdown.countdown_enabled,
                    position: data.rule_data.countdown.position,
                    timerType: data.rule_data.countdown.timerType,
                    fixedTime: data.rule_data.countdown.fixedTime,
                    specificDate: {
                        selectedDate: data.rule_data.countdown.specificDate.selectedDate,
                        selectedMonth: data.rule_data.countdown.specificDate.selectedMonth,
                        selectedYear: data.rule_data.countdown.specificDate.selectedYear,
                        selectedTime: data.rule_data.countdown.specificDate.selectedTime,
                    },
                    atTimerEnd: data.rule_data.countdown.atTimerEnd,
                    timerEndCustomTitle: data.rule_data.countdown.timerEndCustomTitle,
                    timerFormat: data.rule_data.countdown.timerFormat,
                    timerTitle: data.rule_data.countdown.timerTitle,
                    timerSubTitle: data.rule_data.countdown.timerSubTitle,
                    timerDayLabel: data.rule_data.countdown.timerDayLabel,
                    timerHourLabel: data.rule_data.countdown.timerHourLabel,
                    timerMinuteLabel: data.rule_data.countdown.timerMinuteLabel,
                    timerSecondLabel: data.rule_data.countdown.timerSecondLabel,
                    stockInvMessage: data.rule_data.countdown.stockInvMessage,
                    timerPadding: data.rule_data.countdown.timerPadding,
                    timerBorderWidth: data.rule_data.countdown.timerBorderWidth,
                    timerCornerRadius: data.rule_data.countdown.timerCornerRadius,
                    backgroundColorType: data.rule_data.countdown.backgroundColorType,
                    gradientAngle: data.rule_data.countdown.gradientAngle,
                    timerTitleColorFontSize: data.rule_data.countdown.timerTitleColorFontSize,
                    timerTitleColorFontWeight: data.rule_data.countdown.timerTitleColorFontWeight,
                    timerSubtitleFontSize: data.rule_data.countdown.timerSubtitleFontSize,
                    timerSubtitleFontWeight: data.rule_data.countdown.timerSubtitleFontWeight,
                    timerLabelFontSize: data.rule_data.countdown.timerLabelFontSize,
                    timerLabelFontWeight: data.rule_data.countdown.timerLabelFontWeight,
                    timerNumberFontSize: data.rule_data.countdown.timerNumberFontSize,
                    timerNumberFontWeight: data.rule_data.countdown.timerNumberFontWeight,
                    timerStockInvMessageFontSize: data.rule_data.countdown.timerStockInvMessageFontSize,
                    timerStockInvMessageFontWeight: data.rule_data.countdown.timerStockInvMessageFontWeight,
                    timerTitleColor: data.rule_data.countdown.timerTitleColor,
                    timerSubtitleColor: data.rule_data.countdown.timerSubtitleColor,
                    timerLabelColor: data.rule_data.countdown.timerLabelColor,
                    timerNumberColor: data.rule_data.countdown.timerNumberColor,
                    timerStockInvMessageColor: data.rule_data.countdown.timerStockInvMessageColor,
                    timerBorderColor: data.rule_data.countdown.timerBorderColor,
                    timerSingleBackGroundColor: data.rule_data.countdown.timerSingleBackGroundColor,
                    timerGradientPrimaryColor: data.rule_data.countdown.timerGradientPrimaryColor,
                    timerGradientSecondaryColor: data.rule_data.countdown.timerGradientSecondaryColor,
                }
            }
        }),
    setVolumeDiscountBundles: (data) =>
        set((state) => {
            const conditions = data.preparedConditions || [];
            const conditionforAllCustomers = data.conditionForAllCustomers || false;

            const conditionInputTagList = conditions.find((c) => c.type === "tags")?.value || [];
            const conditionAmountSpend = conditions.find((c) => c.type === "amount_spent") || { min: 0, max: 0 };
            const conditionOrderCompleted = conditions.find((c) => c.type === "orders_completed") || { min: 0, max: 0 };
            const conditionStatus = conditions.find((c) => c.type === "status")?.value || "logged_in";
            const conditionCountry = conditions.find((c) => c.type === "country") || { included: "include", value: "" };
            return {
                ruleName: data.title,
                status: data.status,
                ruleInfoShowQuantitySelector: data.rule_data.rule_show_quantity_selector,
                ruleInfoQuantitySelectorMessage: data.rule_data.rule_quantity_selector_message,
                offerDisplay: data.offerDisplay,
                offerDisplaySelection: data.offerDisplaySelection,
                offerDisplayInputTagList: data.offerDisplayInputTagList,
                blockTitle: {
                    title: data.rule_data.block_title,
                    strikeOutEnabled: data.rule_data.block_title_strike_out_enabled,
                },
                minMaxQuantityTiers: data.rule_data.tiers,
                design: {
                    volumeDiscountBundlesLayoutSectionData: {
                        blockPadding: data.rule_data.design.design_layout.blockPadding,
                        blockBorderRadius: data.rule_data.design.design_layout.blockBorderRadius,
                        borderRadius: data.rule_data.design.design_layout.borderRadius,
                        blockTitlteStrikeThrough: data.rule_data.design.design_layout.blockTitlteStrikeThrough,
                        quantityButtonBorderRadius: data.rule_data.design.design_layout.quantityButtonBorderRadius,
                    },
                    volumeDiscountBundlesColorSectionData: {
                        background: data.rule_data.design.design_colors.background,
                        selectedBackground: data.rule_data.design.design_colors.selectedBackground,
                        title: data.rule_data.design.design_colors.title,
                        selectedTitle: data.rule_data.design.design_colors.selectedTitle,
                        subtitle: data.rule_data.design.design_colors.subtitle,
                        selectedSubtitle: data.rule_data.design.design_colors.selectedSubtitle,
                        blockBorder: data.rule_data.design.design_colors.blockBorder,
                        blockBackground: data.rule_data.design.design_colors.blockBackground,
                        blockTitle: data.rule_data.design.design_colors.blockTitle,
                        blockTitleStrikeThrough: data.rule_data.design.design_colors.blockTitleStrikeThrough,
                        quantitySelectorButton: data.rule_data.design.design_colors.quantitySelectorButton,
                        quantitySelectorButtonText: data.rule_data.design.design_colors.quantitySelectorButtonText,
                        quantitySelectorLabel: data.rule_data.design.design_colors.quantitySelectorLabel,
                    },
                    volumeDiscountBundlesTypographySectionData: {
                        blockTitleFontSize: data.rule_data.design.design_typography.blockTitleFontSize,
                        blockTitleFontWeight: data.rule_data.design.design_typography.blockTitleFontWeight,
                        titleFontSize: data.rule_data.design.design_typography.titleFontSize,
                        titleFontWeight: data.rule_data.design.design_typography.titleFontWeight,
                        subtitleFontSize: data.rule_data.design.design_typography.subtitleFontSize,
                        subtitleFontWeight: data.rule_data.design.design_typography.subtitleFontWeight,
                        badgeFontSize: data.rule_data.design.design_typography.badgeFontSize,
                        badgeFontWeight: data.rule_data.design.design_typography.badgeFontWeight,
                        quantitySelectorFontSize: data.rule_data.design.design_typography.quantitySelectorFontSize,
                        quantitySelectorFontWeight: data.rule_data.design.design_typography.quantitySelectorFontWeight,
                    }
                },
                discountCombinations: {
                    orderDiscount: data.rule_data.combine_with_order_discount,
                    productDiscount: data.rule_data.combine_with_product_discount,
                    shippingDiscount: data.rule_data.combine_with_shipping_discount,
                },
                conditions,
                conditionforAllCustomers,
                conditionInputTagList,
                conditionAmountSpend,
                conditionOrderCompleted,
                conditionStatus,
                conditionCountry,
                schedule: {
                    scheduleType: data.rule_data.schedule_type,
                    startDate: data.rule_data.schedule_start_date,
                    startTime: data.rule_data.schedule_start_time,
                    hasEndDate: data.rule_data.schedule_has_end_date,
                    endDate: data.rule_data.schedule_end_date,
                    endTime: data.rule_data.schedule_end_time,
                },
                countdown: {
                    countdown_enabled: data.rule_data.countdown.countdown_enabled,
                    position: data.rule_data.countdown.position,
                    timerType: data.rule_data.countdown.timerType,
                    fixedTime: data.rule_data.countdown.fixedTime,
                    specificDate: {
                        selectedDate: data.rule_data.countdown.specificDate.selectedDate,
                        selectedMonth: data.rule_data.countdown.specificDate.selectedMonth,
                        selectedYear: data.rule_data.countdown.specificDate.selectedYear,
                        selectedTime: data.rule_data.countdown.specificDate.selectedTime,
                    },
                    atTimerEnd: data.rule_data.countdown.atTimerEnd,
                    timerEndCustomTitle: data.rule_data.countdown.timerEndCustomTitle,
                    timerFormat: data.rule_data.countdown.timerFormat,
                    timerTitle: data.rule_data.countdown.timerTitle,
                    timerSubTitle: data.rule_data.countdown.timerSubTitle,
                    timerDayLabel: data.rule_data.countdown.timerDayLabel,
                    timerHourLabel: data.rule_data.countdown.timerHourLabel,
                    timerMinuteLabel: data.rule_data.countdown.timerMinuteLabel,
                    timerSecondLabel: data.rule_data.countdown.timerSecondLabel,
                    stockInvMessage: data.rule_data.countdown.stockInvMessage,
                    timerPadding: data.rule_data.countdown.timerPadding,
                    timerBorderWidth: data.rule_data.countdown.timerBorderWidth,
                    timerCornerRadius: data.rule_data.countdown.timerCornerRadius,
                    backgroundColorType: data.rule_data.countdown.backgroundColorType,
                    gradientAngle: data.rule_data.countdown.gradientAngle,
                    timerTitleColorFontSize: data.rule_data.countdown.timerTitleColorFontSize,
                    timerTitleColorFontWeight: data.rule_data.countdown.timerTitleColorFontWeight,
                    timerSubtitleFontSize: data.rule_data.countdown.timerSubtitleFontSize,
                    timerSubtitleFontWeight: data.rule_data.countdown.timerSubtitleFontWeight,
                    timerLabelFontSize: data.rule_data.countdown.timerLabelFontSize,
                    timerLabelFontWeight: data.rule_data.countdown.timerLabelFontWeight,
                    timerNumberFontSize: data.rule_data.countdown.timerNumberFontSize,
                    timerNumberFontWeight: data.rule_data.countdown.timerNumberFontWeight,
                    timerStockInvMessageFontSize: data.rule_data.countdown.timerStockInvMessageFontSize,
                    timerStockInvMessageFontWeight: data.rule_data.countdown.timerStockInvMessageFontWeight,
                    timerTitleColor: data.rule_data.countdown.timerTitleColor,
                    timerSubtitleColor: data.rule_data.countdown.timerSubtitleColor,
                    timerLabelColor: data.rule_data.countdown.timerLabelColor,
                    timerNumberColor: data.rule_data.countdown.timerNumberColor,
                    timerStockInvMessageColor: data.rule_data.countdown.timerStockInvMessageColor,
                    timerBorderColor: data.rule_data.countdown.timerBorderColor,
                    timerSingleBackGroundColor: data.rule_data.countdown.timerSingleBackGroundColor,
                    timerGradientPrimaryColor: data.rule_data.countdown.timerGradientPrimaryColor,
                    timerGradientSecondaryColor: data.rule_data.countdown.timerGradientSecondaryColor,
                }
            }
        }),
    setQuantityDiscounts: (data) =>
        set((state) => {
            const conditions = data.preparedConditions || [];
            const conditionforAllCustomers = data.conditionForAllCustomers || false;

            const conditionInputTagList = conditions.find((c) => c.type === "tags")?.value || [];
            const conditionAmountSpend = conditions.find((c) => c.type === "amount_spent") || { min: 0, max: 0 };
            const conditionOrderCompleted = conditions.find((c) => c.type === "orders_completed") || { min: 0, max: 0 };
            const conditionStatus = conditions.find((c) => c.type === "status")?.value || "logged_in";
            const conditionCountry = conditions.find((c) => c.type === "country") || { included: "include", value: "" };
            return {
                ruleName: data.title,
                status: data.status,
                ruleInfoShowQuantitySelector: data.rule_data.rule_show_quantity_selector,
                ruleInfoQuantitySelectorMessage: data.rule_data.rule_quantity_selector_message,
                offerDisplay: data.offerDisplay,
                offerDisplaySelection: data.offerDisplaySelection,
                offerDisplayInputTagList: data.offerDisplayInputTagList,
                blockTitle: {
                    title: data.rule_data.block_title,
                    strikeOutEnabled: data.rule_data.block_title_strike_out_enabled,
                },
                minMaxQuantityTiers: data.rule_data.tiers,
                design: {
                    quantityDiscountsLayoutSectionData: {
                        blockPadding: data.rule_data.design.design_layout.blockPadding,
                        blockBorderRadius: data.rule_data.design.design_layout.blockBorderRadius,
                        borderRadius: data.rule_data.design.design_layout.borderRadius,
                        blockTitlteStrikeThrough: data.rule_data.design.design_layout.blockTitlteStrikeThrough,
                        quantityButtonBorderRadius: data.rule_data.design.design_layout.quantityButtonBorderRadius,
                    },
                    quantityDiscountsColorSectionData: {
                        background: data.rule_data.design.design_colors.background,
                        selectedBackground: data.rule_data.design.design_colors.selectedBackground,
                        title: data.rule_data.design.design_colors.title,
                        selectedTitle: data.rule_data.design.design_colors.selectedTitle,
                        subtitle: data.rule_data.design.design_colors.subtitle,
                        selectedSubtitle: data.rule_data.design.design_colors.selectedSubtitle,
                        blockBorder: data.rule_data.design.design_colors.blockBorder,
                        blockTitle: data.rule_data.design.design_colors.blockTitle,
                        blockBackground: data.rule_data.design.design_colors.blockBackground,
                        blockTitleStrikeThrough: data.rule_data.design.design_colors.blockTitleStrikeThrough,
                        quantitySelectorButton: data.rule_data.design.design_colors.quantitySelectorButton,
                        quantitySelectorButtonText: data.rule_data.design.design_colors.quantitySelectorButtonText,
                        quantitySelectorLabel: data.rule_data.design.design_colors.quantitySelectorLabel,
                    },
                    quantityDiscountsTypographySectionData: {
                        blockTitleFontSize: data.rule_data.design.design_typography.blockTitleFontSize,
                        blockTitleFontWeight: data.rule_data.design.design_typography.blockTitleFontWeight,
                        titleFontSize: data.rule_data.design.design_typography.titleFontSize,
                        titleFontWeight: data.rule_data.design.design_typography.titleFontWeight,
                        subtitleFontSize: data.rule_data.design.design_typography.subtitleFontSize,
                        subtitleFontWeight: data.rule_data.design.design_typography.subtitleFontWeight,
                        badgeFontSize: data.rule_data.design.design_typography.badgeFontSize,
                        badgeFontWeight: data.rule_data.design.design_typography.badgeFontWeight,
                        quantitySelectorFontSize: data.rule_data.design.design_typography.quantitySelectorFontSize,
                        quantitySelectorFontWeight: data.rule_data.design.design_typography.quantitySelectorFontWeight,
                    }
                },
                discountCombinations: {
                    orderDiscount: data.rule_data.combine_with_order_discount,
                    productDiscount: data.rule_data.combine_with_product_discount,
                    shippingDiscount: data.rule_data.combine_with_shipping_discount,
                },
                conditions,
                conditionforAllCustomers,
                conditionInputTagList,
                conditionAmountSpend,
                conditionOrderCompleted,
                conditionStatus,
                conditionCountry,
                schedule: {
                    scheduleType: data.rule_data.schedule_type,
                    startDate: data.rule_data.schedule_start_date,
                    startTime: data.rule_data.schedule_start_time,
                    hasEndDate: data.rule_data.schedule_has_end_date,
                    endDate: data.rule_data.schedule_end_date,
                    endTime: data.rule_data.schedule_end_time,
                },
                countdown: {
                    countdown_enabled: data.rule_data.countdown.countdown_enabled,
                    position: data.rule_data.countdown.position,
                    timerType: data.rule_data.countdown.timerType,
                    fixedTime: data.rule_data.countdown.fixedTime,
                    specificDate: {
                        selectedDate: data.rule_data.countdown.specificDate.selectedDate,
                        selectedMonth: data.rule_data.countdown.specificDate.selectedMonth,
                        selectedYear: data.rule_data.countdown.specificDate.selectedYear,
                        selectedTime: data.rule_data.countdown.specificDate.selectedTime,
                    },
                    atTimerEnd: data.rule_data.countdown.atTimerEnd,
                    timerEndCustomTitle: data.rule_data.countdown.timerEndCustomTitle,
                    timerFormat: data.rule_data.countdown.timerFormat,
                    timerTitle: data.rule_data.countdown.timerTitle,
                    timerSubTitle: data.rule_data.countdown.timerSubTitle,
                    timerDayLabel: data.rule_data.countdown.timerDayLabel,
                    timerHourLabel: data.rule_data.countdown.timerHourLabel,
                    timerMinuteLabel: data.rule_data.countdown.timerMinuteLabel,
                    timerSecondLabel: data.rule_data.countdown.timerSecondLabel,
                    stockInvMessage: data.rule_data.countdown.stockInvMessage,
                    timerPadding: data.rule_data.countdown.timerPadding,
                    timerBorderWidth: data.rule_data.countdown.timerBorderWidth,
                    timerCornerRadius: data.rule_data.countdown.timerCornerRadius,
                    backgroundColorType: data.rule_data.countdown.backgroundColorType,
                    gradientAngle: data.rule_data.countdown.gradientAngle,
                    timerTitleColorFontSize: data.rule_data.countdown.timerTitleColorFontSize,
                    timerTitleColorFontWeight: data.rule_data.countdown.timerTitleColorFontWeight,
                    timerSubtitleFontSize: data.rule_data.countdown.timerSubtitleFontSize,
                    timerSubtitleFontWeight: data.rule_data.countdown.timerSubtitleFontWeight,
                    timerLabelFontSize: data.rule_data.countdown.timerLabelFontSize,
                    timerLabelFontWeight: data.rule_data.countdown.timerLabelFontWeight,
                    timerNumberFontSize: data.rule_data.countdown.timerNumberFontSize,
                    timerNumberFontWeight: data.rule_data.countdown.timerNumberFontWeight,
                    timerStockInvMessageFontSize: data.rule_data.countdown.timerStockInvMessageFontSize,
                    timerStockInvMessageFontWeight: data.rule_data.countdown.timerStockInvMessageFontWeight,
                    timerTitleColor: data.rule_data.countdown.timerTitleColor,
                    timerSubtitleColor: data.rule_data.countdown.timerSubtitleColor,
                    timerLabelColor: data.rule_data.countdown.timerLabelColor,
                    timerNumberColor: data.rule_data.countdown.timerNumberColor,
                    timerStockInvMessageColor: data.rule_data.countdown.timerStockInvMessageColor,
                    timerBorderColor: data.rule_data.countdown.timerBorderColor,
                    timerSingleBackGroundColor: data.rule_data.countdown.timerSingleBackGroundColor,
                    timerGradientPrimaryColor: data.rule_data.countdown.timerGradientPrimaryColor,
                    timerGradientSecondaryColor: data.rule_data.countdown.timerGradientSecondaryColor,
                }
            }
        }),
    setBundles: (data) =>
        set((state) => {
            const conditions = data.preparedConditions || [];
            const conditionforAllCustomers = data.conditionForAllCustomers || false;

            const conditionInputTagList = conditions.find((c) => c.type === "tags")?.value || [];
            const conditionAmountSpend = conditions.find((c) => c.type === "amount_spent") || { min: 0, max: 0 };
            const conditionOrderCompleted = conditions.find((c) => c.type === "orders_completed") || { min: 0, max: 0 };
            const conditionStatus = conditions.find((c) => c.type === "status")?.value || "logged_in";
            const conditionCountry = conditions.find((c) => c.type === "country") || { included: "include", value: "" };
            return {
                ruleName: data.title,
                status: data.status,
                ruleInfoAllowVariants: data.rule_data.rule_allow_variants,
                offerDisplay: data.offerDisplay,
                offerDisplaySelection: data.offerDisplaySelection,
                offerDisplayInputTagList: data.offerDisplayInputTagList,
                blockTitle: {
                    title: data.rule_data.block_title,
                    strikeOutEnabled: data.rule_data.block_title_strike_out_enabled,
                },
                products: data.rule_data.renderedProducts,
                quantities: data.rule_data.quantities,
                useCompareAtPrice: data.rule_data.compare_at_price_enabled,
                priceRounding: {
                    enabled: data.rule_data.price_rounding_enabled,
                    roundingValue: data.rule_data.price_rounding_value,
                },
                previewOutOfStock: {
                    enabled: data.rule_data.preview_out_of_stock_enabled,
                    message: data.rule_data.preview_out_of_stock_message,
                },
                discountType: data.rule_data.discount_type,
                discountTypeValue: data.rule_data.discount_type_value,
                bundleAction: data.rule_data.bundle_action,
                bundleFooterText: data.rule_data.bundle_footer_text,
                bundleCallToActionText: data.rule_data.bundle_call_to_action_text,
                bundleShowEachUnitPriceOnProduct: data.rule_data.bundle_show_each_unit_price_on_product,
                design: {
                    bundleLayoutSectionData: {
                        layoutAxis: data.rule_data.design.design_layout.layoutAxis,
                        blockPadding: data.rule_data.design.design_layout.blockPadding,
                        blockBorderRadius: data.rule_data.design.design_layout.blockBorderRadius,
                        productBorderRadius: data.rule_data.design.design_layout.productBorderRadius,
                        productImageBorderRadius: data.rule_data.design.design_layout.productImageBorderRadius,
                        callToActionButtonBorderRadius: data.rule_data.design.design_layout.callToActionButtonBorderRadius,
                        blockTitlteStrikeThrough: data.rule_data.design.design_layout.blockTitlteStrikeThrough,
                    },
                    bundleColorSectionData: {
                        blockBackground: data.rule_data.design.design_colors.blockBackground,
                        productBackground: data.rule_data.design.design_colors.productBackground,
                        blockTitle: data.rule_data.design.design_colors.blockTitle,
                        productTitle: data.rule_data.design.design_colors.productTitle,
                        blockBorder: data.rule_data.design.design_colors.blockBorder,
                        productBorder: data.rule_data.design.design_colors.productBorder,
                        productPrice: data.rule_data.design.design_colors.productPrice,
                        productRegularPrice: data.rule_data.design.design_colors.productRegularPrice,
                        productImageBorder: data.rule_data.design.design_colors.productImageBorder,
                        productImageBackground: data.rule_data.design.design_colors.productImageBackground,
                        separator: data.rule_data.design.design_colors.separator,
                        separatorBackground: data.rule_data.design.design_colors.separatorBackground,
                        separatorBorder: data.rule_data.design.design_colors.separatorBorder,
                        footerText: data.rule_data.design.design_colors.footerText,
                        footerRegularPrice: data.rule_data.design.design_colors.footerRegularPrice,
                        footerPrice: data.rule_data.design.design_colors.footerPrice,
                        callToActionButtonBorder: data.rule_data.design.design_colors.callToActionButtonBorder,
                        callToActionButtonBackground: data.rule_data.design.design_colors.callToActionButtonBackground,
                        callToActionButtonText: data.rule_data.design.design_colors.callToActionButtonText,
                        blockTitleStrikeThrough: data.rule_data.design.design_colors.blockTitleStrikeThrough,
                    },
                    bundleTypographySectionData: {
                        blockTitleFontSize: data.rule_data.design.design_typography.blockTitleFontSize,
                        blockTitleFontWeight: data.rule_data.design.design_typography.blockTitleFontWeight,
                        productTitleFontSize: data.rule_data.design.design_typography.productTitleFontSize,
                        productTitleFontWeight: data.rule_data.design.design_typography.productTitleFontWeight,
                        productPriceFontSize: data.rule_data.design.design_typography.productPriceFontSize,
                        productPriceFontWeight: data.rule_data.design.design_typography.productPriceFontWeight,
                        productRegularPriceFontSize: data.rule_data.design.design_typography.productRegularPriceFontSize,
                        productRegularPriceFontWeight: data.rule_data.design.design_typography.productRegularPriceFontWeight,
                        separatorFontSize: data.rule_data.design.design_typography.separatorFontSize,
                        separatorFontWeight: data.rule_data.design.design_typography.separatorFontWeight,
                        footerTextFontSize: data.rule_data.design.design_typography.footerTextFontSize,
                        footerTextFontWeight: data.rule_data.design.design_typography.footerTextFontWeight,
                        footerRegularPriceFontSize: data.rule_data.design.design_typography.footerRegularPriceFontSize,
                        footerRegularPriceFontWeight: data.rule_data.design.design_typography.footerRegularPriceFontWeight,
                        footerPriceFontSize: data.rule_data.design.design_typography.footerPriceFontSize,
                        footerPriceFontWeight: data.rule_data.design.design_typography.footerPriceFontWeight,
                        calltoActionButtonFontSize: data.rule_data.design.design_typography.calltoActionButtonFontSize,
                        calltoActionButtonFontWeight: data.rule_data.design.design_typography.calltoActionButtonFontWeight,
                    }
                },
                discountCombinations: {
                    orderDiscount: data.rule_data.combine_with_order_discount,
                    productDiscount: data.rule_data.combine_with_product_discount,
                    shippingDiscount: data.rule_data.combine_with_shipping_discount,
                },
                conditions,
                conditionforAllCustomers,
                conditionInputTagList,
                conditionAmountSpend,
                conditionOrderCompleted,
                conditionStatus,
                conditionCountry,
                schedule: {
                    scheduleType: data.rule_data.schedule_type,
                    startDate: data.rule_data.schedule_start_date,
                    startTime: data.rule_data.schedule_start_time,
                    hasEndDate: data.rule_data.schedule_has_end_date,
                    endDate: data.rule_data.schedule_end_date,
                    endTime: data.rule_data.schedule_end_time,
                },
                countdown: {
                    countdown_enabled: data.rule_data.countdown.countdown_enabled,
                    position: data.rule_data.countdown.position,
                    timerType: data.rule_data.countdown.timerType,
                    fixedTime: data.rule_data.countdown.fixedTime,
                    specificDate: {
                        selectedDate: data.rule_data.countdown.specificDate.selectedDate,
                        selectedMonth: data.rule_data.countdown.specificDate.selectedMonth,
                        selectedYear: data.rule_data.countdown.specificDate.selectedYear,
                        selectedTime: data.rule_data.countdown.specificDate.selectedTime,
                    },
                    atTimerEnd: data.rule_data.countdown.atTimerEnd,
                    timerEndCustomTitle: data.rule_data.countdown.timerEndCustomTitle,
                    timerFormat: data.rule_data.countdown.timerFormat,
                    timerTitle: data.rule_data.countdown.timerTitle,
                    timerSubTitle: data.rule_data.countdown.timerSubTitle,
                    timerDayLabel: data.rule_data.countdown.timerDayLabel,
                    timerHourLabel: data.rule_data.countdown.timerHourLabel,
                    timerMinuteLabel: data.rule_data.countdown.timerMinuteLabel,
                    timerSecondLabel: data.rule_data.countdown.timerSecondLabel,
                    stockInvMessage: data.rule_data.countdown.stockInvMessage,
                    timerPadding: data.rule_data.countdown.timerPadding,
                    timerBorderWidth: data.rule_data.countdown.timerBorderWidth,
                    timerCornerRadius: data.rule_data.countdown.timerCornerRadius,
                    backgroundColorType: data.rule_data.countdown.backgroundColorType,
                    gradientAngle: data.rule_data.countdown.gradientAngle,
                    timerTitleColorFontSize: data.rule_data.countdown.timerTitleColorFontSize,
                    timerTitleColorFontWeight: data.rule_data.countdown.timerTitleColorFontWeight,
                    timerSubtitleFontSize: data.rule_data.countdown.timerSubtitleFontSize,
                    timerSubtitleFontWeight: data.rule_data.countdown.timerSubtitleFontWeight,
                    timerLabelFontSize: data.rule_data.countdown.timerLabelFontSize,
                    timerLabelFontWeight: data.rule_data.countdown.timerLabelFontWeight,
                    timerNumberFontSize: data.rule_data.countdown.timerNumberFontSize,
                    timerNumberFontWeight: data.rule_data.countdown.timerNumberFontWeight,
                    timerStockInvMessageFontSize: data.rule_data.countdown.timerStockInvMessageFontSize,
                    timerStockInvMessageFontWeight: data.rule_data.countdown.timerStockInvMessageFontWeight,
                    timerTitleColor: data.rule_data.countdown.timerTitleColor,
                    timerSubtitleColor: data.rule_data.countdown.timerSubtitleColor,
                    timerLabelColor: data.rule_data.countdown.timerLabelColor,
                    timerNumberColor: data.rule_data.countdown.timerNumberColor,
                    timerStockInvMessageColor: data.rule_data.countdown.timerStockInvMessageColor,
                    timerBorderColor: data.rule_data.countdown.timerBorderColor,
                    timerSingleBackGroundColor: data.rule_data.countdown.timerSingleBackGroundColor,
                    timerGradientPrimaryColor: data.rule_data.countdown.timerGradientPrimaryColor,
                    timerGradientSecondaryColor: data.rule_data.countdown.timerGradientSecondaryColor,
                }
            }
        }),
    setRelatedProducts: (data) =>
        set((state) => {
            const conditions = data.preparedConditions || [];
            const conditionforAllCustomers = data.conditionForAllCustomers || false;

            const conditionInputTagList = conditions.find((c) => c.type === "tags")?.value || [];
            const conditionAmountSpend = conditions.find((c) => c.type === "amount_spent") || { min: 0, max: 0 };
            const conditionOrderCompleted = conditions.find((c) => c.type === "orders_completed") || { min: 0, max: 0 };
            const conditionStatus = conditions.find((c) => c.type === "status")?.value || "logged_in";
            const conditionCountry = conditions.find((c) => c.type === "country") || { included: "include", value: "" };
            return {
                ruleName: data.title,
                status: data.status,
                conditions,
                conditionforAllCustomers,
                conditionInputTagList,
                conditionAmountSpend,
                conditionOrderCompleted,
                conditionStatus,
                conditionCountry,
                offerDisplay: data.offerDisplay,
                offerDisplaySelection: data.offerDisplaySelection,
                useCompareAtPrice: data.rule_data.compare_at_price_enabled,
                priceRounding: {
                    enabled: data.rule_data.price_rounding_enabled,
                    roundingValue: data.rule_data.price_rounding_value,
                },
                discountType: data.rule_data.discount_type,
                discountTypeName: data.rule_data.discount_type_name,
                discountTypeValue: data.rule_data.discount_type_value,
                discountCombinations: {
                    orderDiscount: data.rule_data.combine_with_order_discount,
                    productDiscount: data.rule_data.combine_with_product_discount,
                    shippingDiscount: data.rule_data.combine_with_shipping_discount,
                },
                schedule: {
                    scheduleType: data.rule_data.schedule_type,
                    startDate: data.rule_data.schedule_start_date,
                    startTime: data.rule_data.schedule_start_time,
                    hasEndDate: data.rule_data.schedule_has_end_date,
                    endDate: data.rule_data.schedule_end_date,
                    endTime: data.rule_data.schedule_end_time,
                },
                design: {
                    relatedProductsLayoutSectionData: {
                        blockBorderRadius: data.rule_data.design.design_layout.blockBorderRadius,
                        productImageBorderRadius: data.rule_data.design.design_layout.productImageBorderRadius,
                        callToActionButtonBorderRadius: data.rule_data.design.design_layout.callToActionButtonBorderRadius,
                        blockBorderSize: data.rule_data.design.design_layout.blockBorderSize,
                        productImageBorderSize: data.rule_data.design.design_layout.productImageBorderSize,
                        ctaButtonBorderSize: data.rule_data.design.design_layout.ctaButtonBorderSize,
                        insideTop: data.rule_data.design.design_layout.insideTop,
                        insideBottom: data.rule_data.design.design_layout.insideBottom,
                        outsideTop: data.rule_data.design.design_layout.outsideTop,
                        outsideBottom: data.rule_data.design.design_layout.outsideBottom,
                    },
                    relatedProductsColorSectionData: {
                        blockBackground: data.rule_data.design.design_colors.blockBackground,
                        blockBorder: data.rule_data.design.design_colors.blockBorder,
                        blockTitle: data.rule_data.design.design_colors.blockTitle,
                        productTitle: data.rule_data.design.design_colors.productTitle,
                        productVariantTitle: data.rule_data.design.design_colors.productVariantTitle,
                        productPrice: data.rule_data.design.design_colors.productPrice,
                        regularPrice: data.rule_data.design.design_colors.regularPrice,
                        productImageBorder: data.rule_data.design.design_colors.productImageBorder,
                        callToActionButtonBackground: data.rule_data.design.design_colors.callToActionButtonBackground,
                        callToActionButtonText: data.rule_data.design.design_colors.callToActionButtonText,
                        callToActionButtonBorder: data.rule_data.design.design_colors.callToActionButtonBorder,
                        nextProductButton: data.rule_data.design.design_colors.nextProductButton,
                    },
                    relatedProductsTypographySectionData: {
                        blockTitleFontSize: data.rule_data.design.design_typography.blockTitleFontSize,
                        blockTitleFontWeight: data.rule_data.design.design_typography.blockTitleFontWeight,
                        calltoActionButtonFontSize: data.rule_data.design.design_typography.calltoActionButtonFontSize,
                        calltoActionButtonFontWeight: data.rule_data.design.design_typography.calltoActionButtonFontWeight,
                        productTitleFontSize: data.rule_data.design.design_typography.productTitleFontSize,
                        productTitleFontWeight: data.rule_data.design.design_typography.productTitleFontWeight,
                        productVariantTitleFontSize: data.rule_data.design.design_typography.productVariantTitleFontSize,
                        productVariantTitleFontWeight: data.rule_data.design.design_typography.productVariantTitleFontWeight,
                        priceFontSize: data.rule_data.design.design_typography.priceFontSize,
                        priceFontWeight: data.rule_data.design.design_typography.priceFontWeight,
                        regularPriceFontSize: data.rule_data.design.design_typography.regularPriceFontSize,
                        regularPriceFontWeight: data.rule_data.design.design_typography.regularPriceFontWeight,
                    },
                },
                whatToDisplaySelection: data.rule_data.what_to_display,
                whatToDisplaySelectedType: data.rule_data.what_to_display_selected_type,
                whatToDisplaySelectedItems: data.rule_data.renderedWhatToDisplay || [],
            }
        })
}));

export default useStore;
