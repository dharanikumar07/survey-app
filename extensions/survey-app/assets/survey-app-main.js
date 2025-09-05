(function(){
    function runSurvey() {
        const surveyUuids = JSON.parse(localStorage.getItem('onsite_survey_uuids') || '[]');

        if (surveyUuids.length === 0) {
            console.log("✅ No surveys left to run.");
            return;
        }

        const firstSurveyUuid = surveyUuids[0];
        const store_uuid = window.PostPurchaseSurveyData.value.data.store_uuid;
        const url = window.PostPurchaseSurveyData.value.data.url;

        const iframeUrl = `${url}/api/get-survey/${store_uuid}/${firstSurveyUuid}`;
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

                const updatedUuids = surveyUuids.filter(uuid => uuid !== completedSurveyUuid);
                localStorage.setItem('onsite_survey_uuids', JSON.stringify(updatedUuids));

                iframe.remove();
                window.removeEventListener("message", handleMessage);

                setTimeout(runSurvey, 500);
            }
        }

        window.addEventListener("message", handleMessage);
    }

    runSurvey();
})();
