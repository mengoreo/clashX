export enum RequestStatus {
    loading, successful, failed
}

export class ReqInfo {
    constructor(
        readonly domain: string,
        readonly url: string,
        public reqTime: number,
        public status: RequestStatus
    ) { }

    readonly statusNode: Node = (() => {
        let textElem = document.createElement("a")
        switch (this.status) {
            case RequestStatus.failed:
                textElem.text = "⚠️"
                return textElem
            case RequestStatus.successful:
                textElem.text = "✅"
                return textElem
            case RequestStatus.loading:
                let spinner = this.nodeFromHtml(`
                <div class="ispinner gray animating">
                    <div class="ispinner-blade"></div>
                    <div class="ispinner-blade"></div>
                    <div class="ispinner-blade"></div>
                    <div class="ispinner-blade"></div>
                    <div class="ispinner-blade"></div>
                    <div class="ispinner-blade"></div>
                    <div class="ispinner-blade"></div>
                    <div class="ispinner-blade"></div>
                </div>
                `)
                return spinner
        }

    })()

    private nodeFromHtml(html: string): Node {
        let temp = document.createElement('template');
        temp.innerHTML = html;
        return temp.content.cloneNode(true);
    }
}

export class ResourcesManager {
    readonly loadingURLs = new Map<string, Set<string>>()
    readonly failedURLs = new Map<string, Set<string>>()
    readonly successfulURLs = new Map<string, Set<string>>()

    contains(req: ReqInfo) {
        return this.loadingURLs.has(req.domain) || this.failedURLs.has(req.domain) || this.successfulURLs.has(req.domain)
    }
    insertRequest(req: ReqInfo) {
        switch (req.status) {
            case RequestStatus.loading:
                this.updateURLs(this.loadingURLs, req)
                break
            case RequestStatus.failed:
                this.updateURLs(this.failedURLs, req)
                break
            case RequestStatus.successful:
                this.updateURLs(this.successfulURLs, req)
                break
            default: break
        }
    }

    private updateURLs(urls: Map<string, Set<string>>, req: ReqInfo) {
        if (urls.has(req.domain)) {
            let existed = urls.get(req.domain)
            existed.add(req.url)
        } else {
            let newSet = new Set<string>([req.url])
            urls.set(req.domain, newSet)
        }
    }
}

