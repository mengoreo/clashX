import { ResourcesManager, ReqInfo } from "./resourcesManager"
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

}

export function insertRequest(reqInfo: ReqInfo) {
    if (rsrcMngr.contains(reqInfo)) {
        return
    }
    let clone = resourceInfoTemplate.content.cloneNode(true) as DocumentFragment

    let name = clone.querySelector("#resourceName").querySelector("a")
    name.text = reqInfo.status.toLocaleString() + reqInfo.domain

    let time = clone.querySelector("#resourceTime").querySelector("a")
    time.text = "Now"

    let resourceURL = clone.querySelector("#resourceURL").querySelector("a");
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

    let containers = document.querySelectorAll(".infoContainer") as NodeListOf<HTMLElement>;

    containers.forEach((ct) => {
        ct.classList.remove("noselect")
        ct.removeAttribute("style")
        ct.hidden = false

        let footer = ct.querySelector(".footer") as HTMLElement
        footer.hidden = true
    })
}

function collapseFailedResourcesIfNeeded() {
    if (faildReqsCollapsed) {
        return
    }

    let firstHeight = parseInt(getComputedStyle(document.querySelector(".infoContainer")).height) || 0
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
        ct.style.height = `${firstHeight}px`
        ct.style.position = "absolute"
        ct.style.zIndex = `${containers.length - index}`
        ct.classList.add("noselect");

        let footer = ct.querySelector(".footer") as HTMLElement
        footer.hidden = index == 0;

        let scale = 1 - index / 20;
        let marginTop = 10 * index;
        ct.style.transform = `scale(${scale})`;
        ct.style.marginTop = `${marginTop}px`;

        if (index > 2) {
            ct.style.display = "none";
        }
    })
}