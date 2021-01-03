import { ResourcesManager, ReqInfo } from "./resourcesManager"
import "./utils"
const resourceInfoTemplate = document.querySelector("#resourceStatusTemplate") as HTMLTemplateElement
const failedReqsContainer = document.querySelector("#failedResources") as HTMLElement

const rsrcMngr = new ResourcesManager()
var faildReqsCollapsed = false

export interface ProxyGroup {
    readonly group: string | null,
    readonly proxies: Array<string>
}
export function prepareWithActions(proxyGroups: Iterable<ProxyGroup>) {
    buildActions(new Set(proxyGroups))

    let showLessButton = document.querySelector("#collapseButton") as HTMLElement
    let changeAllButton = document.querySelector("#changeAllButton") as HTMLElement

    showLessButton.onmousedown = collapseFailedResourcesIfNeeded

    changeAllButton.onmouseout = () => {
        changeAllButton.classList.add("squeezed")
        showLessButton.classList.remove("squeezed")
    }

    changeAllButton.onmouseenter = () => {
        showLessButton.classList.add("squeezed")
        changeAllButton.classList.remove("squeezed")
    }
}

export function insertRequest(reqInfo: ReqInfo) {
    if (rsrcMngr.contains(reqInfo)) {
        return
    }
    let clone = resourceInfoTemplate.content.cloneNode(true) as DocumentFragment

    let statusContainer = clone.querySelector("#resourceName").querySelector(".statusContainer") as HTMLDivElement
    statusContainer.appendChild(reqInfo.statusNode)

    let name = clone.querySelector("#resourceName").querySelector(".domain") as HTMLAnchorElement
    name.text = reqInfo.domain.toUpperCase()

    let time = clone.querySelector("#resourceTime").querySelector("a") as HTMLAnchorElement
    time.text = "Now"

    let resourceURL = clone.querySelector("#resourceURL").querySelector("a") as HTMLAnchorElement
    resourceURL.text = reqInfo.url

    clone.firstElementChild.classList.add(reqInfo.domain)

    failedReqsContainer.appendChild(clone)
    collapseFailedResourcesIfNeeded()
    toggleHiddenOnHover(reqInfo.domain, ".actions select")
    rsrcMngr.insertRequest(reqInfo)
}

function buildActions(proxyGroups: Set<ProxyGroup>) {
    if (proxyGroups.size < 1) {
        return
    }

    let optionsContainer = resourceInfoTemplate.content.querySelector("#optionsContainer") as HTMLSelectElement
    optionsContainer.disabled = faildReqsCollapsed

    proxyGroups.forEach((pgroup) => {
        if (proxyGroups.size == 1) {
            pgroup.proxies.forEach((proxy) => {
                let option = document.createElement("option")
                option.value = proxy
                option.text = proxy
                optionsContainer.appendChild(option)
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
        }
    })
}

function toggleHiddenOnHover(containerClass: string, targetSelector: string) {
    let module = document.getElementsByClassName(containerClass)[0] as HTMLElement
    let target = module.querySelector(targetSelector) as HTMLElement
    module.onmouseenter = () => {
        if (faildReqsCollapsed) {
            return
        }
        (target as HTMLSelectElement).disabled = faildReqsCollapsed

        target.classList.remove("fadeout")
        target.classList.add("fadein")
    }
    module.onmouseleave = () => {
        if (faildReqsCollapsed) {
            return
        }

        (target as HTMLSelectElement).disabled = true

        target.classList.remove("fadein")
        target.classList.add("fadeout")
    }
}

function expandFailedResourcesIfNeeded() {
    if (!faildReqsCollapsed) {
        return
    }

    faildReqsCollapsed = false;

    let firstResource = document.querySelector(".infoContainer") as HTMLElement
    firstResource.classList.remove("collapsed")

    let titleBar = document.querySelector(".titleBar") as HTMLElement
    titleBar.classList.remove("collapsed")

    let containers = document.querySelectorAll(".infoContainer") as NodeListOf<HTMLElement>;

    containers.forEach((ct) => {
        (ct.querySelector("#resourceURL a") as HTMLAnchorElement).style.webkitLineClamp = "3"
        ct.classList.remove("noselect")
        ct.removeAttribute("style")
        ct.hidden = false
    })
}

function collapseFailedResourcesIfNeeded() {

    let titleBar = document.querySelector(".titleBar") as HTMLElement
    titleBar.classList.add("collapsed")

    let firstURL = document.querySelector("#resourceURL a") as HTMLAnchorElement
    // update first computed height
    (document.querySelector("#resourceURL a") as HTMLAnchorElement).style.webkitLineClamp = `${firstURL.numberOfLines()}`

    let firstResource = document.querySelector(".infoContainer") as HTMLElement
    firstResource.classList.add("collapsed")

    let firstMarginTop = parseInt(getComputedStyle(firstResource).marginTop) || 0
    let firstHeight = parseInt(getComputedStyle(firstResource).height) || 0
    let containers = document.querySelectorAll(".infoContainer") as NodeListOf<HTMLElement>


    faildReqsCollapsed = containers.length > 2

    if (containers.length > 1) {
        let contentArea = document.querySelector(".contentArea") as HTMLElement
        contentArea.onmousedown = () => {
            if (faildReqsCollapsed) {
                expandFailedResourcesIfNeeded()
            }
        }
    }


    containers.forEach((ct, index) => {
        (ct.querySelector("#resourceURL a") as HTMLAnchorElement).style.webkitLineClamp = `${firstURL.numberOfLines()}`
        ct.style.height = `${firstHeight}px`
        ct.style.position = "absolute"
        ct.style.zIndex = `${containers.length - index}`
        ct.classList.add("noselect");

        let scale = 1 - index / 20;
        let marginTop = 10 * index + firstMarginTop;
        ct.style.transform = `scale(${scale})`;
        if (index > 0) {
            ct.style.marginTop = `${marginTop}px`;
        }
        if (index > 2) {
            ct.style.display = "none";
        }
    })
}