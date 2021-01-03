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
        switch (this.status) {
            case RequestStatus.failed:
                return this.nodeFromHtml(`
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="warningGradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                            <stop offset="0" stop-color="#ffe265"/>
                            <stop offset="1" stop-color="#d9b200"/>
                        </linearGradient>
                    </defs>
                    <path id="warningCircle" data-name="exclamationmark.circle.fill" d="M11.143,21.822a9.111,9.111,0,0,0,3.672-.747A9.726,9.726,0,0,0,19.893,16a9.43,9.43,0,0,0,0-7.334A9.731,9.731,0,0,0,14.8,3.58a9.406,9.406,0,0,0-7.324,0A9.731,9.731,0,0,0,2.393,8.663,9.4,9.4,0,0,0,2.4,16,9.758,9.758,0,0,0,7.48,21.075,9.087,9.087,0,0,0,11.143,21.822Zm0-7.852a.731.731,0,0,1-.82-.811l-.127-4.8a.811.811,0,0,1,.244-.649.947.947,0,0,1,.693-.259.934.934,0,0,1,.684.259.884.884,0,0,1,.264.659l-.137,4.795A.723.723,0,0,1,11.143,13.971Zm0,3.154a1.1,1.1,0,0,1-.771-.3.953.953,0,0,1-.322-.728.964.964,0,0,1,.322-.737,1.148,1.148,0,0,1,1.543,0,.964.964,0,0,1,.322.737.942.942,0,0,1-.327.732A1.113,1.113,0,0,1,11.143,17.125Z" transform="translate(-1.65 -2.838)"/>
                </svg>
                `)
            case RequestStatus.successful:
                return this.nodeFromHtml(`
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="checkGradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                            <stop offset="0" stop-color="#03fa03"/>
                            <stop offset="1" stop-color="#00a800"/>
                        </linearGradient>
                    </defs>
                    <path id="checkCircle" data-name="checkmark.circle.fill" d="M11.143,21.822a9.111,9.111,0,0,0,3.672-.747A9.726,9.726,0,0,0,19.893,16a9.43,9.43,0,0,0,0-7.334A9.731,9.731,0,0,0,14.8,3.58a9.406,9.406,0,0,0-7.324,0A9.731,9.731,0,0,0,2.393,8.663,9.4,9.4,0,0,0,2.4,16,9.758,9.758,0,0,0,7.48,21.075,9.087,9.087,0,0,0,11.143,21.822Zm-1.035-4.951a.968.968,0,0,1-.464-.112,1.249,1.249,0,0,1-.4-.356L6.963,13.609a.983.983,0,0,1-.186-.308.951.951,0,0,1-.059-.327.788.788,0,0,1,.234-.571.764.764,0,0,1,.566-.239.881.881,0,0,1,.381.083.951.951,0,0,1,.342.308l1.826,2.334,3.877-6.211a.829.829,0,0,1,.713-.449.912.912,0,0,1,.581.205.662.662,0,0,1,.259.547.784.784,0,0,1-.073.327,2.179,2.179,0,0,1-.171.308L10.928,16.4a1.089,1.089,0,0,1-.361.352A.909.909,0,0,1,10.107,16.871Z" transform="translate(-1.65 -2.838)"/>
                </svg>
                `)
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

