(function(){
    const iframeUrl = "https://uniprotkb-unexpected-buy-generated.trycloudflare.com/get-survey";

    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.width = "400";
    iframe.height = "300";
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
