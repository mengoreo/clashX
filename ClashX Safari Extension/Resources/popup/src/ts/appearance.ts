import { ResourcesManager, ReqInfo, RequestStatus } from "./resourcesManager"
import "./utils"

const resourceInfoTemplate = document.querySelector("#resourceStatusTemplate") as HTMLTemplateElement
const titleBarTemplate = document.querySelector("#titleBarTemplate") as HTMLTemplateElement
const failedReqsContainer = document.querySelector("#failedRequests") as HTMLElement
const loadingReqsContainer = document.querySelector("#loadingRequests") as HTMLElement
const succeededReqsContainer = document.querySelector("#succeededRequests") as HTMLElement

const rsrcMngr = new ResourcesManager()
var faildReqsCollapsed = false

export interface ProxyGroup {
    readonly group: string | null,
    readonly proxies: Array<string>
}
export function prepareWithActions(proxyGroups: Iterable<ProxyGroup>) {
    buildActions(new Set(proxyGroups))
}

export function insertRequest(reqInfo: ReqInfo) {
    if (rsrcMngr.contains(reqInfo)) {
        return
    }

    switch (reqInfo.status) {
        case RequestStatus.loading:
            insert(reqInfo, loadingReqsContainer, "Loading Requests")
            break;
        case RequestStatus.failed:
            insert(reqInfo, failedReqsContainer, "Failed Requests")
            break
        case RequestStatus.succeeded:
            insert(reqInfo, succeededReqsContainer, "Succeeded Requests")
            break
        default: break
    }

    toggleHiddenOnHover(reqInfo.domain, ".actions select")
    rsrcMngr.insertRequest(reqInfo)
}

function insert(reqInfo: ReqInfo, parentContainer: HTMLElement, titleBarText: string) {
    parentContainer.hidden = false

    if (rsrcMngr.failedURLs.size > 0 && parentContainer.querySelector(".titleBar") == null) {
        let titleBarClone = titleBarTemplate.content.cloneNode(true) as DocumentFragment
        titleBarClone.querySelector("a").text = titleBarText
        let showLessButton = titleBarClone.querySelector("#collapseButton") as HTMLElement
        let changeAllButton = titleBarClone.querySelector("#changeAllButton") as HTMLElement

        showLessButton.onmousedown = () => {
            if (parentContainer.querySelector(".titleBar").classList.contains("collapsed")) {
                return
            }
            collapseFailedResourcesIfNeeded()
        }

        changeAllButton.onmouseout = () => {
            if (parentContainer.querySelector(".titleBar").classList.contains("collapsed")) {
                return
            }
            changeAllButton.classList.add("squeezed")
            showLessButton.classList.remove("squeezed")
        }

        changeAllButton.onmouseenter = () => {
            if (parentContainer.querySelector(".titleBar").classList.contains("collapsed")) {
                return
            }
            showLessButton.classList.add("squeezed")
            changeAllButton.classList.remove("squeezed")
        }

        changeAllButton.onmousedown = (e) => {
            if (parentContainer.querySelector(".titleBar").classList.contains("collapsed")) {
                e.preventDefault()
            }
        }
        parentContainer.insertAdjacentElement("afterbegin", titleBarClone.firstElementChild)
    }
    // pending info
    let pendingInfo = resourceInfoTemplate.content.cloneNode(true) as DocumentFragment
    let statusContainer = pendingInfo.querySelector("#resourceName").querySelector(".statusContainer") as HTMLDivElement
    statusContainer.appendChild(reqInfo.statusNode)

    let name = pendingInfo.querySelector("#resourceName").querySelector(".domain") as HTMLAnchorElement
    name.text = reqInfo.domain.toUpperCase()

    let time = pendingInfo.querySelector("#resourceTime").querySelector("a") as HTMLAnchorElement
    time.text = "Now"

    let resourceURL = pendingInfo.querySelector("#resourceURL").querySelector("a") as HTMLAnchorElement
    resourceURL.text = reqInfo.url

    pendingInfo.firstElementChild.classList.add(reqInfo.domain);

    (pendingInfo.firstElementChild as HTMLElement).style.marginBottom = "0px";
    (pendingInfo.firstElementChild as HTMLElement).style.zIndex = rsrcMngr.failedURLs.size.toString()

    if (rsrcMngr.failedURLs.size > 0) {
        parentContainer.querySelector(".titleBar")?.insertAdjacentElement("afterend", pendingInfo.firstElementChild)
    } else {
        parentContainer.insertAdjacentElement("afterbegin", pendingInfo.firstElementChild)
    }
    collapseFailedResourcesIfNeeded()

}

function buildActions(proxyGroups: Set<ProxyGroup>) {
    if (proxyGroups.size < 1) {
        return
    }

    let optionsContainer = resourceInfoTemplate.content.querySelector("#optionsContainer") as HTMLSelectElement
    optionsContainer.disabled = faildReqsCollapsed

    let titleBarOptionsContainer = titleBarTemplate.content.querySelector("#changeAllButton") as HTMLSelectElement

    proxyGroups.forEach((pgroup) => {
        if (proxyGroups.size == 1) {
            pgroup.proxies.forEach((proxy) => {
                let option = document.createElement("option")
                option.value = proxy
                option.text = proxy
                optionsContainer.appendChild(option)

                let titleBarOption = option.cloneNode(true)
                titleBarOptionsContainer.appendChild(titleBarOption)
            })
        } else {
            let optionGroup = document.createElement("optgroup")
            optionGroup.label = pgroup.group

            pgroup.proxies.forEach((proxy) => {
                let option = document.createElement("option")
                option.value = proxy
                option.text = proxy
                optionGroup.appendChild(option)
            })

            optionsContainer.appendChild(optionGroup)

            let titleBarOptionGroup = optionGroup.cloneNode(true)
            titleBarOptionsContainer.appendChild(titleBarOptionGroup)
        }
    })
}

function toggleHiddenOnHover(containerClass: string, targetSelector: string) {
    let container = failedReqsContainer.getElementsByClassName(containerClass)[0] as HTMLElement
    let target = failedReqsContainer.querySelector(targetSelector) as HTMLElement
    if (container == null) {
        return
    }
    container.onmouseenter = () => {
        if (faildReqsCollapsed) {
            return
        }
        (target as HTMLSelectElement).disabled = faildReqsCollapsed;
        (target as HTMLSelectElement).hidden = faildReqsCollapsed;

        target.classList.remove("fadeout")
        target.classList.add("fadein")
    }
    container.onmouseleave = () => {
        if (faildReqsCollapsed) {
            return
        }

        (target as HTMLSelectElement).disabled = true;
        (target as HTMLSelectElement).hidden = true

        target.classList.remove("fadein")
        target.classList.add("fadeout")
    }
}

function expandFailedResourcesIfNeeded() {
    if (!faildReqsCollapsed) {
        return
    }

    faildReqsCollapsed = false;

    let firstResource = failedReqsContainer.querySelector(".infoContainer") as HTMLElement
    firstResource.classList.remove("collapsed")

    let titleBar = failedReqsContainer.querySelector(".titleBar") as HTMLElement
    titleBar.classList.remove("collapsed")

    let containers = failedReqsContainer.querySelectorAll(".infoContainer") as NodeListOf<HTMLElement>;

    containers.forEach((ct, index) => {
        (ct.querySelector("#resourceURL a") as HTMLAnchorElement).style.webkitLineClamp = "3"
        ct.classList.remove("noselect")
        ct.style.height = null
        let lastCtMarginTop = index > 0 ? parseInt(containers[index - 1].style.marginTop) || 0 : titleBar.offsetHeight || 0
        let lastCtHeight = index > 0 ? containers[index - 1].offsetHeight || 0 : 0
        let lastBottomGap = index > 0 ? parseInt(containers[index - 1].style.paddingBottom) || 0 : 0

        ct.style.marginTop = `${lastCtMarginTop + lastCtHeight + lastBottomGap}px`
        ct.style.paddingBottom = "7px"
        ct.style.transform = null
        if (index > 2) {
            ct.classList.remove("fadeout");
            ct.classList.add("fadein");
        }
    })
}

function collapseFailedResourcesIfNeeded() {

    let titleBar = failedReqsContainer.querySelector(".titleBar") as HTMLElement
    titleBar?.classList.add("collapsed")

    let firstURL = failedReqsContainer.querySelector("#resourceURL a") as HTMLAnchorElement
    // update first computed height
    (failedReqsContainer.querySelector("#resourceURL a") as HTMLAnchorElement).style.webkitLineClamp = `${firstURL.numberOfLines()}`

    let firstResource = failedReqsContainer.querySelector(".infoContainer") as HTMLElement

    let firstMarginTop = parseInt(getComputedStyle(firstResource).marginTop) || 0
    let firstHeight = parseInt(getComputedStyle(firstResource).height) || 0
    let containers = failedReqsContainer.querySelectorAll(".infoContainer") as NodeListOf<HTMLElement>


    faildReqsCollapsed = containers.length > 1

    containers.forEach((ct, index) => {
        (ct.querySelector("#resourceURL a") as HTMLAnchorElement).style.webkitLineClamp = `${firstURL.numberOfLines()}`
        ct.style.height = `${firstHeight}px`
        ct.classList.add("noselect");

        ct.onmousedown = null
        let scale = 1 - index / 20;
        let marginTop = 10 * index;
        ct.style.transform = `scale(${scale})`;
        let contentArea = ct.querySelector(".contentArea") as HTMLElement
        if (index == 0) {
            contentArea.onmousedown = () => {
                if (faildReqsCollapsed) {
                    expandFailedResourcesIfNeeded()
                }
            }
            ct.style.marginTop = `0px`;
        } else {
            contentArea.onmousedown = null
            ct.style.marginTop = `${marginTop}px`;
        }

        if (index > 2) {
            ct.classList.remove("fadein");
            ct.classList.add("fadeout");
        }
    })
}