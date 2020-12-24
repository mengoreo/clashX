document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("openHomePage").addEventListener("click", openHomePage);
});

function openHomePage() {
    browser.permissions.request({origins: ['https://www.baidu.com/']}, (granted) => {
        if (granted) {
            console.log("Open Home Page Now")
        }
    })
}
