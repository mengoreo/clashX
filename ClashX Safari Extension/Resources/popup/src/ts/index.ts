import * as ap from "./appearance";
import * as bridge from "./bridge"

document.addEventListener("DOMContentLoaded", () => {
    bridge.setup()
    ap.prepareWithActions([
        { group: "Group1", proxies: ["proxy1", "proxy2", "direct"] },
        { group: "Group2", proxies: ["proxy1", "proxy2", "direct"] }
    ]);

    ap.insertRequest({ domain: "github.com", url: "https://github.com/oncletom/tld.js/", reqTime: 0, status: 0 })
    ap.insertRequest({ domain: "wweb.dev", url: "https://wweb.dev/blog/how-to-create-static-website-npm-scripts/wweb.dev/blog/how-to-create-static-website-npm-scripts/wweb.dev/blog/how-to-create-static-website-npm-scripts/wweb.dev/blog/how-to-create-static-website-npm-scripts", reqTime: 0, status: 0 })
    ap.insertRequest({ domain: "mozilla.org", url: "https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix", reqTime: 0, status: 0 })
    ap.insertRequest({ domain: "192.168.50.1", url: "http://192.168.50.1/Main_Login.asp", reqTime: 0, status: 0 })
})