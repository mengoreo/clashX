import * as ap from "./appearance";
import * as bridge from "./bridge"
import { ReqInfo, RequestStatus } from "./resourcesManager";

document.addEventListener("DOMContentLoaded", () => {
    bridge.setup()
    ap.prepareWithActions([
        { group: "Group1", proxies: ["proxy1", "proxy2", "direct"] },
        { group: "Group2", proxies: ["proxy1", "proxy2", "direct"] }
    ]);

    ap.insertRequest(new ReqInfo("github.com", "https://github.com/oncletom/tld.js/", 0, RequestStatus.failed))
    ap.insertRequest(new ReqInfo("wweb.dev", "https://wweb.dev/blog/how-to-create-static-website-npm-scripts/wweb.dev/blog/how-to-create-static-website-npm-scripts/wweb.dev/blog/how-to-create-static-website-npm-scripts/wweb.dev/blog/how-to-create-static-website-npm-scripts", 0, RequestStatus.loading))
    ap.insertRequest(new ReqInfo("mozilla.org", "https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix", 0, RequestStatus.loading))
    ap.insertRequest(new ReqInfo("192.168.50.1", "http://192.168.50.1/Main_Login.asp", 0, RequestStatus.loading))
})