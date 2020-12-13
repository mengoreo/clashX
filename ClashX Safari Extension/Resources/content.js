browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
    
    if (request.greeting == "hello") {
        browser.runtime.sendNativeMessage({ message: "hello" });
    }
});
