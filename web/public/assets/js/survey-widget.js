(function(){
    console.log("hiiiiii");
    const target = document.querySelector('.th-sf-survey-card');
    console.log(target);
    if (!target) return;

    if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(() => {
            updateHeight();
        });

        resizeObserver.observe(target);
        updateHeight();
    } else {
        console.warn("ResizeObserver is not supported in this browser.");
        // Optional: fallback logic here
    }

    function updateHeight() {
        const height = target.scrollHeight;
        console.log(height);

        const messageData = {
            type: "yuko-survey-widget-height",
            message: "Sending survey widget height",
            value: height + 50
        };

        window.parent.postMessage(messageData, "*");
    }
})();
