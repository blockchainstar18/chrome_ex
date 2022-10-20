chrome.tabs.onUpdated.addListener(async function (tabId, info, tab) {
    if (info.status === 'complete') {
        // your code ...
        console.log(tab.url)
        let url = new URL(tab.url);
        url = url.hostname;
        console.log(url)
        const flag = (await chrome.storage.sync.get("cookieflag")).cookieflag
        console.log(flag)
        if (url.toString() == 'www.netflix.com' && !flag) {
            chrome.cookies.remove({
                url: 'https://www.netflix.com',
                name: 'NetflixId'
            })
            chrome.cookies.remove({
                url: 'https://www.netflix.com',
                name: 'SecureNetflixId'
            })
        }

    }
});

