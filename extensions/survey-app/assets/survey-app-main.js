(function(){
    const iframeUrl = "https://boxes-gnome-optical-slope.trycloudflare.com/api/get-survey/3080bf92-e027-4c03-8f12-1678d7caed72";

    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.width = "600";
    iframe.height = "900";
    iframe.style.border = "none";
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.left = "20px";
    iframe.style.zIndex = "9999";
    iframe.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    iframe.style.borderRadius = "8px";
    iframe.allow = "fullscreen";

    document.body.appendChild(iframe);
})();
