const failedResources = document.getElementById("failedResources");
const resourceStatusTemplate = document.getElementById("resourceStatusTemplate");

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("openHomePage").addEventListener("click", openHomePage);
});

function hideAllActionsInModules() {
    let actions = document.getElementsByClassName("actions");
    for (let i=0; i < actions.length; i++) {
        actions[i].hidden = true;
    }
}

function setupOnHoverModule() {
    let moduleContents = document.getElementsByClassName("module-bg");
    for (let i=0; i < moduleContents.length; i++) {
        let module = moduleContents[i];
        module.onmouseover = function() {
            this.getElementsByClassName("actions")[0].hidden = false;
        };
        module.onmouseout = function() {
            this.getElementsByClassName("actions")[0].hidden = true;
        };
    }
}

function buildActions(actions) {
    let keys = Object.keys(actions);
    if (keys.length < 1) {
        return;
    }

    let values = Object.values(actions);

    let optionsContainer = document.getElementById("resourceStatusTemplate").content.getElementById("optionsContainer");
    if (keys.length == 1) {
        console.log("one", keys, values);
        let options = values[0];
        for (let v=0; v<options.length; v++) {
            let option = document.createElement("option");
            option.value = options[v];
            optionsContainer.appendChild(option);
        }
    } else {
        console.log("many", keys, values);
        for (let k=0; k<keys.length; k++) {            
            let optionGroup = document.createElement("optgroup");
            optionGroup.label = keys[k];

            let options = values[k];
            for (let v=0; v<options.length; v++) {
                let option = document.createElement("option");
                option.value = options[v];
                option.text = options[v];
                optionGroup.appendChild(option);
            }
            optionsContainer.appendChild(optionGroup);
        }
    }
}
function insertFaildResource(url) {
    let clone = resourceStatusTemplate.content.cloneNode(true);
    console.log(clone);
    let name = clone.getElementById("resourceName").getElementsByTagName("a")[0];
    name.text = "⚠️ FAILED";
    
    let time = clone.getElementById("resourceTime").getElementsByTagName("a")[0];
    time.text = "Now";

    let resourceDomain = clone.getElementById("resourceDomain").getElementsByTagName("a")[0];
    resourceDomain.text = "apple.com";

    let resourceURL = clone.getElementById("resourceURL").getElementsByTagName("a")[0];
    resourceURL.text = url;

    failedResources.appendChild(clone);
}

window.onload = function() {
    buildActions({"Group1": ["proxy1", "proxy2", "direct"], "Group2": ["proxy1", "proxy2", "direct"]});
    insertFaildResource("https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-2.1.dmg");
    insertFaildResource("https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-2.1.dmg");
    insertFaildResource("https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-2.1.dmg");
    insertFaildResource("https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-2.1.dmg");
};

function openHomePage() {
    browser.permissions.request({origins: ['https://www.baidu.com/']}, (granted) => {
        if (granted) {
            console.log("Open Home Page Now")
        }
    })
}
