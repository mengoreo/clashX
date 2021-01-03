interface HTMLAnchorElement {
    numberOfLines(): number
}

HTMLAnchorElement.prototype.numberOfLines = function (): number {
    let self = this as HTMLAnchorElement
    let contentHeight = parseInt(getComputedStyle(self).height) || 0

    let lineHeight = parseInt(getComputedStyle(self).lineHeight) || 0

    if (lineHeight == 0) {
        let normalRatio = 1.2
        let fontSize = parseInt(getComputedStyle(self).fontSize) || 0
        if (fontSize == 0) {
            return 0
        }

        return Math.min(3, Math.trunc(contentHeight / (normalRatio * fontSize)))
    } else {
        return Math.min(3, Math.trunc(contentHeight / lineHeight))
    }
}
