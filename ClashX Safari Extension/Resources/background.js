//browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//    console.log("Received request: ", request);
//
//    if (request.greeting === "hello")
//        sendResponse({ farewell: "goodbye" });
//});
//
//function handleUpdated(tabId, changeInfo, tabInfo) {
//    if (tabInfo.status === "complete" && tabInfo.active && tabInfo.)
//  console.log("Updated tab: " + tabId);
//  console.log("Changed attributes: ");
//  console.log(changeInfo);
//  console.log("New tab Info: ");
//  console.log(tabInfo);
//}
//
//browser.tabs.onUpdated.addListener(handleUpdated);

//// MARK: - onBeforeRequest
//function beforeRequest(requestDetail) {
//    console.log("Loading: " + requestDetail.url);
//}
//
//browser.webRequest.onBeforeRequest.addListener(
//    beforeRequest,
//    {urls: ["<all_urls>"]}
//);
//
//
//// MARK: - onBeforeSendHeaders
//function onBeforeSendHeaders(requestDetail) {
//    console.log("onBeforeSendHeaders: " + requestDetail.url);
//}
//browser.webRequest.onBeforeSendHeaders.addListener(
//                                                   onBeforeSendHeaders,
//  {urls: ["<all_urls>"]}
//);
//
//// MARK: - onSendHeaders
//
//function onSendHeaders(requestDetail) {
//    console.log("onSendHeaders: " + requestDetail.url);
//}
//
//// Listen for onSendHeaders, and pass
//// "requestHeaders" so we get the headers
//browser.webRequest.onSendHeaders.addListener(
//                                             onSendHeaders,
//                                             {urls: ["<all_urls>"]}
//);
//// MARK: - onHeadersReceived
//function onHeadersReceived(requestDetail) {
//    console.log("onHeadersReceived: " + requestDetail.url);
//}
//browser.webRequest.onHeadersReceived.addListener(
//                                                 onHeadersReceived,
//                                                 {urls: ["<all_urls>"]}
//);
//// MARK: - onAuthRequired
//function onAuthRequired(requestDetail) {
//    console.log("onAuthRequired: " + requestDetail.url);
//}
//browser.webRequest.onAuthRequired.addListener(
//                                              onAuthRequired,
//                                                 {urls: ["<all_urls>"]}
//);
//// MARK: - onResponseStarted
//function onResponseStarted(requestDetail) {
//    console.log("onResponseStarted: " + requestDetail.url);
//}
//browser.webRequest.onResponseStarted.addListener(
//                                                 onResponseStarted,
//                                                 {urls: ["<all_urls>"]}
//);
//// MARK: - onBeforeRedirect
//function onBeforeRedirect(requestDetail) {
//    console.log("onBeforeRedirect: " + requestDetail.url);
//}
//browser.webRequest.onBeforeRedirect.addListener(
//                                                onBeforeRedirect,
//                                                 {urls: ["<all_urls>"]}
//);
//// MARK: - onCompleted
//function onCompleted(requestDetail) {
//    console.log("onCompleted: " + requestDetail.url);
//}
//
//browser.webRequest.onCompleted.addListener(
//                                           onCompleted,
//  {urls: ["<all_urls>"]}
//);
//
//
//// MARK: - onErrorOccurred
//function onErrorOccurred(requestDetail) {
//    console.log("onErrorOccurred: " + requestDetail.url);
//}
//browser.webRequest.onErrorOccurred.addListener(
//                                               onErrorOccurred,
//                                               {urls: ["<all_urls>"]}
//);
