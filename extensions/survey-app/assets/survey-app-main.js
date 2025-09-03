(function(){
    const store_uuid = window.PostPurchaseSurveyData.value.data.store_uuid;
    const url = window.PostPurchaseSurveyData.value.data.url;
    const iframeUrl = `${url}/api/get-survey/${store_uuid}`;

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
    iframe.style.transition = "opacity 0.3s ease";

    document.body.appendChild(iframe);

    iframe.addEventListener("load", function () {
        const postData = {
            type: "survey-customer-data",
            customerId: window.PostPurchaseSurveyData?.customerId,
            orderId: window.PostPurchaseSurveyData?.orderId,
            pageType: window.PostPurchaseSurveyData?.pageType
        };

        iframe.contentWindow.postMessage(postData, "*");
    });

    window.addEventListener("message", function(event) {
        if (event.data.type === "survey-widget-height") {
            iframe.style.height = event.data.height + "px";
            iframe.style.width = event.data.width + "px";
            iframe.style.opacity = "1";
        }
    });
})();
