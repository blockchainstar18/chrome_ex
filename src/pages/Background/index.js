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
    return res.request
}


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message === 'reCaptcha') {
        const apiKey = '81ed890586ac7da086f41aba2c328f86'
        const siteKey = '6LeMrv8ZAAAAAIcvo5HKvdj1lxtUdHnS13jUCulQ'
        const pageUrl = 'https://play.hbomax.com/signIn'
        // fetch(`https://2captcha.com/in.php?key=${apiKey}&googlekey=${siteKey}&pageurl=${pageUrl}&enterprise=1&json=1&method=userrecaptcha&version=v3&action=verify&min_score=0.3`,
        // ).then((res) => {
        //     res.json().then(async (result) => {
        //         console.log(result.request)

        //     })
        // })

        const response = await fetch(`https://2captcha.com/in.php?key=${apiKey}&googlekey=${siteKey}&pageurl=${pageUrl}&enterprise=1&json=1&method=userrecaptcha&version=v3&action=verify&min_score=0.3`)
        const res = await response.json()
        const requestId = res.request

        const reCaptchaToken = await getCaptcha(apiKey, requestId)
        console.log('result:', reCaptchaToken)


        // fetch(`http://2captcha.com/res.php?key=${apiKey}&action=reportbad&json=1&id=${requestId}`)
        //     .then((res) => {
        //         res.json().then((res) => console.log(res))
        //     })

        // sendResponse(response)
    }
});
