// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getText") {
        const text = document.body.innerText;
        sendResponse({ text });
    }
});
