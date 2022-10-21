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


const getCaptcha = (apiKey, requestId) => {
    fetch(`http://2captcha.com/res.php?key=${apiKey}&action=get&json=1&id=${requestId}`)
        .then((res) => {
            res.json().then((result) => {
                // console.log(result.request)
                if (result.request == 'CAPCHA_NOT_READY') {
                    setTimeout(() => {
                        getCaptcha(apiKey, requestId)
                    }, 1000);
                }
                // if (result.request == 'ERROR_CAPTCHA_UNSOLVABLE')
                //     return
                else
                    return result.request

            })
        })
}


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message === 'reCaptcha') {
        const apiKey = '81ed890586ac7da086f41aba2c328f86'
        const siteKey = '6LeMrv8ZAAAAAIcvo5HKvdj1lxtUdHnS13jUCulQ'
        const pageUrl = 'https://play.hbomax.com/signIn'
        fetch(`https://2captcha.com/in.php?key=${apiKey}&googlekey=${siteKey}&pageurl=${pageUrl}&enterprise=1&json=1&method=userrecaptcha&version=v3&action=verify&min_score=0.3`,
        ).then((res) => {
            res.json().then((result) => {
                console.log(result.request)
                const requestId = result.request

                const reCaptchaToken = getCaptcha(apiKey, requestId)

                console.log('result:', reCaptchaToken)
                fetch(`http://2captcha.com/res.php?key=${apiKey}&action=reportbad&json=1&id=${requestId}`)
                    .then((res) => {
                        console.log(res.json())
                    })

                // fetch(`http://2captcha.com/res.php?key=${apiKey}&action=get&json=1&id=${requestId}`)
                //     .then((res) => {
                //         res.json().then((result) => {
                //             console.log(result.request)
                //             var reCaptchaToken
                //             if (result.request == 'CAPCHA_NOT_READY') {

                //                 setTimeout(() => {
                //                     reCaptchaToken = getCaptcha(apiKey, requestId)



                //                 }, 500);
                //             }
                //             // else {
                //             //     reCaptchaToken = result.request
                //             // }
                //         })


                //     })

            })
        })

        // sendResponse(response)
    }
});
