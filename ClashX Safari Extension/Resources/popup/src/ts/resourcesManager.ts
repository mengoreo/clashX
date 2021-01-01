enum RequestStatus {
    loading, successful, failed
}

export class ReqInfo {
    constructor(
        readonly domain: string,
        readonly url: string,
        public reqTime: number,
        public status: RequestStatus
    ) { }
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

