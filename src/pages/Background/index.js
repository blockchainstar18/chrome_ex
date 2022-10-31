console.log('backgroundScript works')




// chrome.declarativeNetRequest.updateEnabledRulesets({
//     disableRulesetIds: ['1001']
// })
var headers = []
var form
var flag = false


// chrome.declarativeNetRequest.updateDynamicRules({
//     addRules: [{
//         'id': 1001,
//         'priority': 1,
//         'action': {
//             'type': 'block'
//         },
//         'condition': {
//             'urlFilter': 'hbomax.com',
//             'resourceTypes': [
//                 'csp_report', 'font', 'image', 'main_frame', 'media', 'object', 'other', 'ping', 'script',
//                 'stylesheet', 'sub_frame', 'webbundle', 'websocket', 'webtransport', 'xmlhttprequest'
//             ]
//         }
//     }], removeRuleIds: [1001]
// })


chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.url == 'https://oauth-us.api.hbo.com/auth/tokens' && !flag && details.method == 'POST') {
            var dec = new TextDecoder()
            form = JSON.parse(dec.decode(details.requestBody.raw[0].bytes))
            form.username = 'rolexluis@gmail.com'
            form.password = 'Itzel2312'
            console.log('BeforeRequest')
        }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
);


chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.url == 'https://oauth-us.api.hbo.com/auth/tokens' && !flag && details.method == 'POST') {
            flag = true
            headers = details.requestHeaders

            var Header = {}
            headers.forEach((header) => {
                Header[header.name] = header.value
            })
            console.log('BeforeSendHeader')

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message: 'reCaptchaToken', Header: Header, Body: form });
            });


        }
    },
    { urls: ["<all_urls>"] },
    ["requestHeaders"]
)





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

var reCaptchaToken

const getCaptcha = async (apiKey, requestId) => {
    const response = await fetch(`http://2captcha.com/res.php?key=${apiKey}&action=get&json=1&id=${requestId}`)
    const res = await response.json()
    if (res.request == 'CAPCHA_NOT_READY') {
        console.log('state: ', res.request)
        await getCaptcha(apiKey, requestId)
    }
    else {
        reCaptchaToken = res.request
        return
    }

}

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
        if (msg.stream == 'netflix') {
            chrome.browsingData.remove({
                "origins": [`https://www.netflix.com`]
            }, {
                "cacheStorage": true,
                "cookies": true,
                // "fileSystems": true,
                // "indexedDB": true,
                // "localStorage": true,
                // "serviceWorkers": true,
                // "webSQL": true
            }, () => {
                port.postMessage(true)
            });
        }
        if (msg.stream == 'disneyplus') {
            chrome.browsingData.remove({
                "origins": [`https://www.disneyplus.com`]
            }, {
                "cacheStorage": true,
                "cookies": true
            }, () => {
                port.postMessage(true)
            });
        }
        if (msg.stream == 'dazn') {
            chrome.browsingData.remove({
                "origins": [`https://www.dazn.com`]
            }, {
                "cacheStorage": true,
                "cookies": true
            }, () => {
                port.postMessage(true)
            });
        }
        if (msg.stream == 'crunchyroll') {
            chrome.browsingData.remove({
                "origins": [`https://www.crunchyroll.com`]
            }, {
                "cacheStorage": true,
                "cookies": true
            }, () => {
                port.postMessage(true)
            });
        }
    })
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message === 'reCaptcha') {
        const apiKey = '81ed890586ac7da086f41aba2c328f86'
        const siteKey = '6LeMrv8ZAAAAAIcvo5HKvdj1lxtUdHnS13jUCulQ'
        const pageUrl = 'https://play.hbomax.com/signIn'
        const response = await fetch(`https://2captcha.com/in.php?key=${apiKey}&googlekey=${siteKey}&pageurl=${pageUrl}&enterprise=1&json=1&method=userrecaptcha&version=v3&action=verify&min_score=0.8`)
        const res = await response.json()
        const requestId = res.request
        await getCaptcha(apiKey, requestId)
        console.log('result:', reCaptchaToken)
        // fetch(`http://2captcha.com/res.php?key=${apiKey}&action=reportbad&json=1&id=${requestId}`)
        //     .then((res) => {
        //         res.json().then((res) => console.log(res))
        //     })

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: 'reCaptchaToken', reCaptchaToken: reCaptchaToken });
        });
    }

    if (message.code == 'removehistory') {
        // var callback = function () {
        //     // Do something clever here once data has been removed.
        // };

        // // var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
        // // var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
        // chrome.browsingData.remove({
        //     // "since": oneWeekAgo,
        //     "originTypes": {
        //         "unprotectedWeb": true
        //     },
        //     "origins": [`https://www.${message.stream}.com`]

        // }, {
        //     "appcache": true,
        //     "cache": true,
        //     "cacheStorage": true,
        //     "cookies": true,
        //     "downloads": true,
        //     "fileSystems": true,
        //     "formData": true,
        //     "history": true,
        //     "indexedDB": true,
        //     "localStorage": true,
        //     "passwords": true,
        //     "serviceWorkers": true,
        //     "webSQL": true
        // }, callback);





    }



});

