(function(){
    function runSurvey() {
        let brandedSurveyData = getBrandedSurveyData();
        const url = window.PostPurchaseSurveyData.value.data.url;

        if(brandedSurveyData?.is_branded) {
            openBrandedSurveyPage(brandedSurveyData, url)
            return;
        }

        const storedSurveys = JSON.parse(localStorage.getItem('onsite_survey_uuids') || '[]');

        const pendingSurveys = storedSurveys.filter(s => !s.is_finished);

        if (pendingSurveys.length === 0) {
            console.log("no survey to view");
            return;
        }

        const firstSurvey = pendingSurveys[0];
        const store_uuid = window.PostPurchaseSurveyData.value.data.store_uuid;

        const iframeUrl = `${url}/api/get-survey/${store_uuid}/${firstSurvey.uuid}`;
        const iframe = document.createElement("iframe");

        iframe.src = iframeUrl;
        iframe.width = "600";
        iframe.height = "600";
        iframe.style.border = "none";
        iframe.style.position = "fixed";
        iframe.style.bottom = "0px";
        iframe.style.zIndex = "9999";
        iframe.style.borderRadius = "8px";
        iframe.allow = "fullscreen";
        iframe.style.opacity = "0";
        iframe.style.transform = "translateY(50px)";
        iframe.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        document.body.appendChild(iframe);

        iframe.addEventListener("load", function () {
            iframe.contentWindow.postMessage({
                type: "survey-customer-data",
                customerId: window.PostPurchaseSurveyData?.customerId,
                orderId: window.PostPurchaseSurveyData?.orderId,
                pageType: window.PostPurchaseSurveyData?.pageType
            }, "*");
        });

        function handleMessage(event) {
            if (event.data.type === "survey-widget-height") {
                iframe.style.height = event.data.height + "px";
                iframe.style.width = event.data.width + "px";
                requestAnimationFrame(() => {
                    iframe.style.opacity = "1";
                    iframe.style.transform = "translateY(0)";
                });
            }

            if (event.data.type === 'survey-completed') {
                const completedSurveyUuid = event.data.survey_uuid;
                console.log("✅ Survey completed:", completedSurveyUuid);

                const updatedSurveys = storedSurveys.map(s =>
                    s.uuid === completedSurveyUuid ? { ...s, is_finished: true } : s
                );

                localStorage.setItem('onsite_survey_uuids', JSON.stringify(updatedSurveys));

                iframe.remove();
                window.removeEventListener("message", handleMessage);

                setTimeout(runSurvey, 500);
            }

            if (event.data.type === "survey-widget-close") {
                let closeSurveyUuid = event.data.value;
                const updatedSurveys = storedSurveys.map(s =>
                    s.uuid === closeSurveyUuid ? { ...s, is_finished: true } : s
                );

                localStorage.setItem('onsite_survey_uuids', JSON.stringify(updatedSurveys));

                iframe.remove();
            }
        }

        window.addEventListener("message", handleMessage);
    }

    function openBrandedSurveyPage(widgetData, url) {
        const overlay = document.createElement("div");
        overlay.id = "branded-survey-overlay";
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,0.6)";
        overlay.style.zIndex = "2147483646";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";

        const wrapper = document.createElement("div");
        wrapper.id = "branded-survey-wrapper";
        wrapper.style.position = "relative";
        wrapper.style.width = "600px";
        wrapper.style.maxWidth = "100%";
        wrapper.style.height = "600px";
        wrapper.style.maxHeight = "100%";
        wrapper.style.borderRadius = "8px";
        wrapper.style.overflow = "hidden";
        wrapper.style.opacity = "0";
        wrapper.style.transform = "translateY(50px)";
        wrapper.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        const iframe = document.createElement("iframe");
        const store_uuid = widgetData?.store_uuid;
        const survey_uuid = widgetData?.survey_uuid;

        iframe.src = `${url}/api/get-survey/${store_uuid}/${survey_uuid}?is_branded=1`;
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.style.border = "none";
        iframe.allow = "fullscreen";

        wrapper.appendChild(iframe);
        overlay.appendChild(wrapper);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            wrapper.style.opacity = "1";
            wrapper.style.transform = "translateY(0)";
        });

        function handleMessage(event) {
            if (event.data.type === "survey-widget-height") {
                wrapper.style.width = event.data.width + "px";
                wrapper.style.height = event.data.height + "px";
            }

            if (event.data.type === "branded-survey-close") {
                const closeSurveyUuid = event.data.value;

                closeBrandedSurveyPage(closeSurveyUuid);
            }

            if (event.data.type === "survey-completed") {
                const completedSurveyUuid = event.data.survey_uuid;

                closeBrandedSurveyPage(completedSurveyUuid);
            }
        }

        window.addEventListener("message", handleMessage);
    }

    function closeBrandedSurveyPage(closeSurveyUuid)
    {
        const overlay = document.getElementById("branded-survey-overlay");
        if (overlay) overlay.remove();

        const updatedSurveys = storedSurveys.map(s =>
            s.uuid === closeSurveyUuid ? { ...s, is_finished: true } : s
        );

        localStorage.setItem('onsite_survey_uuids', JSON.stringify(updatedSurveys));

        window.location.href = window.location.origin;
    }

    function getBrandedSurveyData()
    {
        const params = new URLSearchParams(window.location.search);

        return {
            survey_uuid: params.get("45673") ?? null,
            store_uuid: params.get("6789") ?? null,
            is_branded: params.get("is_branded") === "1"
        };
    }

    runSurvey();
})();
