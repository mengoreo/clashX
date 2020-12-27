
import tldjs from 'tldjs';

export const domainOrHost = url => {
    let domain = tldjs.getDomain(url);
    if (domain) {
        return domain
    }
    return tldjs.extractHostname(url);
};