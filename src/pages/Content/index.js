/* global chrome */

import { printLine } from './modules/print';
import axios from 'axios';
import Cookies from 'js-cookie'
import { Await } from 'react-router-dom';
import React from 'react'

console.log('Content script works!');
// console.log('Must reload extension for modifications to take effect.');



const activeAlert = `<div>
        <div id = "title">Account Login Extension</div>
        <p>You can access this site with extension<p>
        <div id = "flex">
        <button id = "loginbtn">Ok</button>
        <button id = "closebtn">No, thanks</button>
        </div>
        </div>
        `
const standbyAlert = `<div>
        <div id = "title">Account Login Extension</div>
        <p>Welcome! You can use this extension to login from now<p>
        <div id = "flex">
        <button id = "loginbtn">Ok</button>
        <button id = "closebtn">No, thanks</button>
        </div>
        </div>
        `
const fulfilledAlert = `<div>
        <div id = "title">Account Login Extension</div>
        <p>Your membership is expired! Please sign in again with new credentials.<p>
        <div id = "flex">
        <button id = "loginbtn" disabled >Ok</button>
        <button id = "closebtn">Yes, I see </button>
        </div>
        </div>
        `
const notRegisteredAlert = `<div>
        <div id = "title">Account Login Extension</div>
        <p>Please sign in to the extension<p>
        <div id = "flex">
        <button id = "loginbtn" disabled >Log in</button>
        <button id = "closebtn">Yes, I see </button>
        </div>
        </div>
        `





const loginTodisneyplus = async (email, password) => {
    console.log('counting')
    let commonHeaders = {}
    let headers = {}
    let services = {}
    let href = ''
    var Header = {}
    const request = new XMLHttpRequest();
    const device = {
        X_Application_Version: '1.1.2',
        X_BAMSDK_Platform: 'javascript/windows/chrome',
        X_BAMSDK_Version: '15.0'
    }

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            commonHeaders = JSON.parse(request.response).commonHeaders
            services = JSON.parse(request.response).services

            commonHeaders['X-Application-Version'] = device.X_Application_Version
            commonHeaders['X-BAMSDK-Platform'] = device.X_BAMSDK_Platform
            commonHeaders['X-BAMSDK-Version'] = device.X_BAMSDK_Version
            headers = services.externalAuthorization.client.endpoints.createLinkGrant.headers
            href = services.externalAuthorization.client.endpoints.createLinkGrant.href
            headers.Authorization = JSON.parse(localStorage.getItem('__bam_sdk_access--disney-svod-3d9324fc_prod')).context.token
            Header = Object.assign(commonHeaders, headers)
        }
    }
    request.open("GET", "https://bam-sdk-configs.bamgrid.com/bam-sdk/v4.0/disney-svod-3d9324fc/browser/v15.0/windows/chrome/prod.json", false);
    request.send()
    const xhr = new XMLHttpRequest();

    let xhrresponse
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            xhrresponse = JSON.parse(xhr.response)
            const access = JSON.parse(localStorage.getItem('__bam_sdk_access--disney-svod-3d9324fc_prod'))
            if (!xhrresponse.data) {
                tryAgain('disneyplus')
                return
            }
            access.context.token = xhrresponse.extensions.sdk.token.accessToken
            access.context.tokenData.refresh_token = xhrresponse.extensions.sdk.token.refreshToken
            localStorage.setItem('__bam_sdk_access--disney-svod-3d9324fc_prod', JSON.stringify(access))
            if (xhrresponse.data)
                alert('Logged in Successfully! Please click Login Button')

        }
    }
    xhr.open("POST", href, false);
    for (const property in Header) {
        xhr.setRequestHeader(property, Header[property])
    }
    // const email = (await chrome.storage.sync.get("email")).email
    // const password = (await chrome.storage.sync.get("password")).password

    const body = {
        "query": "\n    mutation login($input: LoginInput!) {\n        login(login: $input) {\n            account {\n                ...account\n\n                profiles {\n                    ...profile\n                }\n            }\n            identity {\n                ...identity\n            }\n            actionGrant\n        }\n    }\n\n    \nfragment identity on Identity {\n    attributes {\n        securityFlagged\n        createdAt\n        passwordResetRequired\n    }\n    flows {\n        marketingPreferences {\n            eligibleForOnboarding\n            isOnboarded\n        }\n        personalInfo {\n            eligibleForCollection\n            requiresCollection\n        }\n    }\n    personalInfo {\n        dateOfBirth\n        gender\n    }\n    subscriber {\n        subscriberStatus\n        subscriptionAtRisk\n        overlappingSubscription\n        doubleBilled\n        doubleBilledProviders\n        subscriptions {\n            id\n            groupId\n            state\n            partner\n            isEntitled\n            source {\n                sourceType\n                sourceProvider\n                sourceRef\n                subType\n            }\n            paymentProvider\n            product {\n                id\n                sku\n                offerId\n                promotionId\n                name\n                entitlements {\n                    id\n                    name\n                    desc\n                    partner\n                }\n                categoryCodes\n                redeemed {\n                    campaignCode\n                    redemptionCode\n                    voucherCode\n                }\n                bundle\n                bundleType\n                subscriptionPeriod\n                earlyAccess\n                trial {\n                    duration\n                }\n            }\n            term {\n                purchaseDate\n                startDate\n                expiryDate\n                nextRenewalDate\n                pausedDate\n                churnedDate\n                isFreeTrial\n            }\n            cancellation {\n                type\n                restartEligible\n            }\n            stacking {\n                status\n                overlappingSubscriptionProviders\n                previouslyStacked\n                previouslyStackedByProvider\n            }\n        }\n    }\n}\n\n    \nfragment account on Account {\n    id\n    attributes {\n        blocks {\n            expiry\n            reason\n        }\n        consentPreferences {\n            dataElements {\n                name\n                value\n            }\n            purposes {\n                consentDate\n                firstTransactionDate\n                id\n                lastTransactionCollectionPointId\n                lastTransactionCollectionPointVersion\n                lastTransactionDate\n                name\n                status\n                totalTransactionCount\n                version\n            }\n        }\n        dssIdentityCreatedAt\n        email\n        emailVerified\n        lastSecurityFlaggedAt\n        locations {\n            manual {\n                country\n            }\n            purchase {\n                country\n                source\n            }\n            registration {\n                geoIp {\n                    country\n                }\n            }\n        }\n        securityFlagged\n        tags\n        taxId\n        userVerified\n    }\n    parentalControls {\n        isProfileCreationProtected\n    }\n    flows {\n        star {\n            isOnboarded\n        }\n    }\n}\n\n    \nfragment profile on Profile {\n    id\n    name\n    isAge21Verified\n    attributes {\n        avatar {\n            id\n            userSelected\n        }\n        isDefault\n        kidsModeEnabled\n        languagePreferences {\n            appLanguage\n            playbackLanguage\n            preferAudioDescription\n            preferSDH\n            subtitleAppearance {\n                backgroundColor\n                backgroundOpacity\n                description\n                font\n                size\n                textColor\n            }\n            subtitleLanguage\n            subtitlesEnabled\n        }\n        groupWatch {\n            enabled\n        }\n        parentalControls {\n            kidProofExitEnabled\n            isPinProtected\n        }\n        playbackSettings {\n            autoplay\n            backgroundVideo\n            prefer133\n            preferImaxEnhancedVersion\n            previewAudioOnHome\n            previewVideoOnHome\n        }\n    }\n    personalInfo {\n        dateOfBirth\n        gender\n        age\n    }\n    maturityRating {\n        ...maturityRating\n    }\n    personalInfo {\n        dateOfBirth\n        age\n        gender\n    }\n    flows {\n        personalInfo {\n            eligibleForCollection\n            requiresCollection\n        }\n        star {\n            eligibleForOnboarding\n            isOnboarded\n        }\n    }\n}\n\n\nfragment maturityRating on MaturityRating {\n    ratingSystem\n    ratingSystemValues\n    contentMaturityRating\n    maxRatingSystemValue\n    isMaxContentMaturityRating\n}\n\n\n",
        "operationName": "login",
        "variables": { "input": { "email": email, "password": password } }
    }
    xhr.send(JSON.stringify(body))
}

const loginToNetflix = async (NetflixId, SecureNetflixId) => {
    console.log('MEssage')
    var cookieflag = true
    chrome.storage.sync.set({ cookieflag })

    document.cookie = `NetflixId = ${NetflixId}`
    document.cookie = `SecureNetflixId = ${SecureNetflixId}`
    document.location.reload()

}

const loginToCrunchyroll = async (email, password) => {
    await chrome.storage.sync.set({ email })
    await chrome.storage.sync.set({ password })
    const crunlogin = true
    await chrome.storage.sync.set({ crunlogin })
    window.location.replace('https://www.crunchyroll.com/login')


    // fetch(window.location.href, {
    //     method: 'POST',
    //     headers: {
    //         'content-type': 'application/x-www-form-urlencoded'
    //     },
    //     body: JSON.stringify({
    //         username: email,
    //         password: password,
    //         csrf_token: document.getElementsByName('csrf_token')[0].value,
    //         recaptcha_token: document.getElementById('recaptcha_token').value,
    //         anonymous_id: localStorage.getItem('ajs_anonymous_id')
    //     })
    // }).then((res) => console.log(res))

}




async function hbomaxFillUsername() {
    // const result = await axios.post('http://3.141.40.201:3000/membership/checkuser',
    //     {
    //         user: document.getElementById('EmailTextInput').value,
    //         ip: e.currentTarget.ip
    //     }
    // )
    // if (result.data.message) {
    // document.getElementById('EmailTextInput').type = 'password'
    // document.dispatchEvent(new KeyboardEvent('keypress', { 'key': 'H' }));

    // document.getElementById('EmailTextInput').disabled = 'true'
    // }

}

async function hbomaxFillPassword() {
    document.getElementById('PasswordTextInput').value = (await chrome.storage.sync.get('password')).password
    // document.getElementById('PasswordTextInput').disabled = 'true'
    // document.getElementsByClassName('css-175oi2r r-1loqt21 r-1otgn73 r-173mn98 r-1niwhzg r-1mwlp6a r-1777fci r-u8s1d r-usgzl9')[0]
    //     .disabled = 'true'
}



function crunchyrollFillFakeUsername() {
    document.getElementsByName('username')[0].value = ''
}
function crunchyrollFillFakePassword() {
    document.getElementsByName('password')[0].value = ''
}

function crunchyrollFillUsername() {

    if (document.getElementsByName('username')[0].value == '') {
        return
    }

    chrome.storage.sync.get('email').then(res => {
        document.getElementsByName('username')[0].value = res.email
        document.getElementsByName('username')[0].type = 'password'
    })
}
function crunchyrollFillPassword() {
    if (document.getElementsByName('password')[0].value == '') {
        return
    }

    chrome.storage.sync.get('password').then(res => {
        document.getElementsByName('password')[0].value = res.password
    })
}


const loginToDazn = (email, password) => {
    fetch('https://authentication-prod.ar.indazn.com/v5/SignIn', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            Email: email,
            Password: password
        })
    }).then((res) => {
        res.json().then((res) => {
            console.log(res)
            localStorage.setItem('MISL.authToken', res.AuthToken.Token)
            document.location.reload()
        })
    })
}




var hboemail, hbopassword


function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const loginToHbomax = async (email, password) => {
    await chrome.storage.sync.set({ email })
    await chrome.storage.sync.set({ password })
    const hbomaxlogin = true
    await chrome.storage.sync.set({ hbomaxlogin })
    window.location.replace('https://play.hbomax.com/signIn')
}





const tryAgain = (stream) => {
    chrome.runtime.sendMessage({ message: 'retry', stream: stream });
}


// don't forget manifest 
const streams = [
    'hbomax',
    'netflix',
    'disneyplus',
    'crunchyroll',
    'dazn'
]





const executeLogin = async (membershipCredential) => {
    const stream = (await chrome.storage.sync.get("stream")).stream
    console.log(stream)

    var port = chrome.runtime.connect({ name: 'remove' })
    port.postMessage({ stream: stream })
    port.onMessage.addListener((msg) => {
        console.log(msg)
        if (stream == 'disneyplus')
            loginTodisneyplus(membershipCredential.data.email, membershipCredential.data.password)
        if (stream == 'crunchyroll')
            loginToCrunchyroll(membershipCredential.data.email, membershipCredential.data.password)
        if (stream == 'dazn')
            loginToDazn(membershipCredential.data.email, membershipCredential.data.password)
        if (stream == 'netflix')
            loginToNetflix(membershipCredential.data.NetflixId, membershipCredential.data.SecureNetflixId)
        if (stream == 'hbomax')
            loginToHbomax(membershipCredential.data.email, membershipCredential.data.password)
    })
}


const checkMembership = async (stream, ip) => {
    const membershipState = await axios.post('http://3.141.40.201:3000/membership',
        {
            stream: stream,
            ip: ip
        }
    )
    const membership = membershipState.data.response
    console.log(membership)
    await chrome.storage.sync.set({ membership })

    const modal = document.createElement("dialog")
    modal.setAttribute("style", "height:170px;width:302px;border: 1px solid white;")
    if (membership == 'new')
        modal.innerHTML = notRegisteredAlert
    if (membership == 'active')
        modal.innerHTML = activeAlert
    if (membership == 'standby')
        modal.innerHTML = standbyAlert
    if (membership == 'fulfilled')
        modal.innerHTML = fulfilledAlert
    document.body.appendChild(modal)
    const dialog = document.querySelector("dialog")

    // if (stream == 'netflix') {
    // const flag = (await chrome.storage.sync.get("cookieflag")).cookieflag
    // if (!flag)
    dialog.showModal()
    // }

    document.getElementById("loginbtn").addEventListener("click", async () => {
        const dialog = document.querySelector("dialog");
        dialog.close()
        await chrome.storage.sync.set({ visible: true });
        executeLogin(stream, ip, membership)
    })


    document.getElementById("closebtn").addEventListener("click", async () => {
        const dialog = document.querySelector("dialog");
        dialog.close()
        await chrome.storage.sync.set({ visible: true });
    })
}


const checkLoggedInState = (stream) => {
    if (stream == 'crunchyroll') {
        return document.cookie.includes('ajs_user_id')
    }
    if (stream == 'disneyplus') {
        return localStorage.getItem('isLoggedIn') == 'true'
    }
    // if (stream == 'netflix') {
    // return document.cookie.includes('NetflixId')
    // }
    if (stream == 'dazn')
        return localStorage.getItem('MISL.authToken')
}


window.onload = async function () {
    if (window.location.href.includes('crunchyroll.com/login?')) {
        if ((await chrome.storage.sync.get("crunlogin")).crunlogin) {
            document.getElementsByClassName('cx-cta cx-cta--s cx-password-input__button')[0].disabled = 'true'
            document.getElementsByName('username')[0].value = ''
            document.getElementsByName('password')[0].value = ''

            document.getElementsByName('username')[0].addEventListener('focusin', crunchyrollFillFakeUsername)
            document.getElementsByName('password')[0].addEventListener('focusin', crunchyrollFillFakePassword)

            document.getElementsByName('username')[0].addEventListener('focusout', crunchyrollFillUsername)
            document.getElementsByName('password')[0].addEventListener('focusout', crunchyrollFillPassword)
            await chrome.storage.sync.set({ crunlogin: false });

        }

    }

    if (window.location.href.includes('hbomax.com/signIn')) {
        if ((await chrome.storage.sync.get("hbomaxlogin")).hbomaxlogin) {
            chrome.storage.sync.get('email').then((res) => {
                const email = res.email
                waitForElm('#EmailTextInput').then((elm) => {



                    const guide = document.createElement('p')
                    guide.innerText = 'Please delete last character from every input fields'
                    guide.style = 'font-weight: 400; font-style: normal; font-size: 14px;color:white;'
                    document.getElementById('EmailTextInput').before(guide)

                    const inputEmail = document.createElement('input')
                    inputEmail.value = 'email'
                    inputEmail.type = 'password'

                    inputEmail.addEventListener('change', () => {
                        document.getElementById('EmailTextInput').type = 'password'

                        document.getElementById('EmailTextInput').value = email + '1'

                        document.getElementById('EmailTextInput').addEventListener('change', () => {
                            if (document.getElementById('EmailTextInput').value == email)
                                document.getElementById('EmailTextInput').remove()
                        })
                    })
                    document.getElementById('EmailTextInput').before(inputEmail)


                });
            }
            )

            chrome.storage.sync.get('password').then((res) => {
                const password = res.password
                waitForElm('#PasswordTextInput').then((elm) => {
                    console.log('password is ready');
                    const inputPassword = document.createElement('input')
                    inputPassword.value = 'password'
                    inputPassword.type = 'password'

                    inputPassword.addEventListener('change', () => {



                        document.getElementById('PasswordTextInput').value = password + '1'
                        document.getElementById('PasswordTextInput').addEventListener('focusout', () => {
                            if (document.getElementById('PasswordTextInput').value == password)
                                document.getElementById('PasswordTextInput').remove()
                        })
                    })
                    document.getElementById('PasswordTextInput').before(inputPassword)
                });
            }
            )



            waitForElm('.css-175oi2r r-1loqt21 r-1otgn73 r-173mn98 r-1niwhzg r-1mwlp6a r-1777fci r-u8s1d r-usgzl9').then((elm) => {
                console.log('Element is ready');
                document.getElementsByClassName('css-175oi2r r-1loqt21 r-1otgn73 r-173mn98 r-1niwhzg r-1mwlp6a r-1777fci r-u8s1d r-usgzl9')[0]
                    .remove()
            });

            await chrome.storage.sync.set({ hbomaxlogin: false });

        }

    }



}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.message === 'login') {
        console.log(message.data)
        executeLogin(message.data)


        // fetch('https://oauth-us.api.hbo.com/auth/tokens', {
        //     method: 'POST',
        //     headers: message.Header,
        //     body: JSON.stringify(message.Body)
        // }).then((response) => {
        //     response.json().then((res) =>
        //         console.log(res)
        //     )
        // });

        // console.log(message.reCaptchaToken)

        // const xhr = new XMLHttpRequest();
        // xhr.open("POST", `https://oauth-us.api.hbo.com/auth/tokens`, false);

        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === 4) {

        //     }
        // }
        // xhr.setRequestHeader('x-hbo-headwaiter', 'entitlements:eyJpIjoiZ2F0ZXdheUAwLjAuMzE0IiwidiI6MSwicyI6NDIsImFsZyI6ImRpciIsImVuYyI6IkEyNTZHQ00ifQ..mSG4CQmA4ZLrbYUr.KpWnV_XAA88I0wg_vuWFV9cPWS3FkaMkiEKqVLaUo9bEkDve1_wcO3Q_Me5m99jQgrEGvORnSC8s__rByWelrF7EqC5LxF7q3YdME-aBTHknhDnUvR9XjsL2OPzY06-4zgmjztwSsFOR7pcDyCZLPW65MmrcUA7K7N5ZbBO-bdDcXfPPPhYz1J1qKr3sq9qc_42VTMwVCsz8hKMymj4KZ_XwyIFkV1vWnJ1UlasgJj-2SjZSA1ICjVo4QsabJQfC-PmumQkG3pG6iGCxVcHa7B5YzrRK5olHSkY4qJ7XMzm9fa6v669oWjSbA_QaXztJ6_FQX-oX1_8NKG6fYDkFsGKqOp6uHQqiHBbXZ4Ftx2tyGxA4PMDieL_AXoXIsQ6xRt48FSJlNQyU4RqObP4vPO4AUwfA7AnijYpPV1Npd2EOa0UDaaibwtJmLVct5QdgV5wr.jU-aHts3F-3f-AGps8AlLg,globalization:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImkiOiJnYXRld2F5QDAuMC4zMTQiLCJ2IjoxLCJzIjo0Mn0.eyJkIjp7InVpTGFuZ3VhZ2UiOiJlbi1VUyIsImZvcm1hdCI6InJvLVJPIiwiYWx0ZXJuYXRlVWlMYW5ndWFnZSI6InJvLVJPIiwicHJlZmVycmVkTGFuZ3VhZ2VzIjpbImVuLVVTIl19LCJpYXQiOjE2NjY1NjUwNTB9.1xVm6ijCaEsG5VAcTzro8wDtHJIl3kobFAbSuiblSu8,privacy:eyJpIjoiZ2F0ZXdheUAwLjAuMzE0IiwidiI6MSwicyI6NDIsImFsZyI6ImRpciIsImVuYyI6IkEyNTZHQ00ifQ..Llsb2Axpe3DAa4Uu.Hy7kY1sN5mnSpnVrHVZc7kX7_9ym5R3RtjXUyPbqF2KLeT447HQdWmkuBUAbyXFiKRzgOq88m1l3a9L7tGQgOexm2EXjn774IHUTKtXfsEWJrGVqtusd-2VcjnPEGqDukE9OTaQy7Ewdr_8_49hx6XHyYB4k5RVmgRbNwniwATx7PaPNCY6sVwzBU5_jDgke8E0veg.Tby2Mzg9upKB1qF_aAnO5g,profile:eyJpIjoiZ2F0ZXdheUAwLjAuMzE0IiwidiI6MSwicyI6NDIsImFsZyI6ImRpciIsImVuYyI6IkEyNTZHQ00ifQ..0SL8IZOEgr7kp_2F.xkcKaIiZKABwsxHmyQE7JClbY5hcWMuTrVovECLfsU1XwPQ1Pu2rT_nlizcetQfjl8vTvvuQOy9cUw7FFyYdPv_Y3LGUIVM-QjoTsxIlbrIS-3D_1_Q762A7FAqyKfz_IgXAeVK16B1snjsxFGxi7A.5TadQwwz8a-wa-Vs12c-Hg,telemetry:eyJpIjoiZ2F0ZXdheUAwLjAuMzE0IiwidiI6MSwicyI6NDIsImFsZyI6ImRpciIsImVuYyI6IkEyNTZHQ00ifQ..ThNjW61xaYr9cJ7k.k11IUXFFGT5Djp6-3c5fjMPaUyoIPKaIt0_0_o8_Vr-rD6PfPTCIUrBgGyLrsmb_OPNA1KUuwdeTvHAhZ4d4qSIf_EsW492vw7xMKfJL6LIszc3HeMqOssTiKk_dstUNOBwqROcJ3ZtDAkWL1ejrR4mkz-OsCbT1uEo0.wmH-sps81Q8K4by6bZrsVA')
        // xhr.setRequestHeader('authorization', 'Bearer ' + JSON.parse(localStorage.getItem('authToken')).access_token)
        // xhr.setRequestHeader('x-recaptchatoken', message.reCaptchaToken)
        // xhr.setRequestHeader('Content-type', 'application/json');
        // const body = {
        //     "grant_type": "user_name_password",
        //     "password": hbopassword,
        //     "username": hboemail,
        //     "scope": "browse video_playback device elevated_account_management"
        // }
        // xhr.send(JSON.stringify(body))
    }

    // if (message.message === 'check') {
    // if ((await chrome.storage.sync.get('stream')).stream != stream)
    //     await chrome.storage.sync.set({ visible: false });

    // const ip = await (await axios.get('https://api.ipify.org/?format=json')).data.ip
    // await chrome.storage.sync.set({ ip })
    // await chrome.storage.sync.set({ stream })



    // const visible = (await chrome.storage.sync.get('visible')).visible;


    // if (!checkLoggedInState(stream) && !visible)
    // checkMembership(stream, ip)
    // }


});







