/* global chrome */

import { printLine } from './modules/print';
import axios from 'axios';
import Cookies from 'js-cookie'
import { Await } from 'react-router-dom';

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
                tryAgain()
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
var tempEmail, tempPassword

const loginToCrunchyroll = async (email, password) => {
    tempEmail = email
    tempPassword = password
    window.location.replace('https://www.crunchyroll.com/login')
}


window.onload = function () {
    if (window.location.href.includes('crunchyroll.com/login?')) {
        // var authid = window.location.href.split('=')[1]
        // alert(document.getElementsByName('csrf_token')[0].value)
        // alert(document.getElementById('recaptcha_token').value)

        // fetch(window.location.href, {
        //     method: 'POST',
        //     headers: {
        //         'content-type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         username: Email,
        //         password: Password,
        //         csrf_token: document.getElementsByName('csrf_token')[0].value,
        //         recaptcha_token: document.getElementById('recaptcha_token').value
        //     })
        // }).then((res) => console.log(res.json()))
        document.getElementsByName('username')[0].addEventListener('change', CrunchyrollUserNameInput)
        document.getElementsByName('password')[0].addEventListener('change', CrunchyrollPasswordInput)

    }
}

function CrunchyrollUserNameInput() {
    alert(tempEmail)

    document.getElementsByName('username')[0].value = tempEmail
    // document.getElementsByName('username')[0].type = 'password'
    document.getElementsByName('username')[0].disabled = 'true'
}

function CrunchyrollPasswordInput() {
    document.getElementsByName('password')[0].value = tempPassword
    document.getElementsByName('password')[0].disabled = 'true'
    // document.getElementsByClassName('cx-cta cx-cta--s cx-password-input__button')[0].disabled = 'true'
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

const loginToHbomax = async (email, password, ip) => {

    hboemail = email
    hbopassword = password

    // 1. Send a message to the service worker requesting the user's data
    // chrome.runtime.sendMessage('reCaptcha');
    document.getElementById('EmailTextInput').addEventListener('change', EmailTextInput, false)
    document.getElementById('EmailTextInput').ip = ip
    document.getElementById('PasswordTextInput').addEventListener('change', PasswordTextInput)
    // document.getElementsByClassName('css-175oi2r r-1awozwy r-14t88dt r-42olwf r-z2wwpe r-d045u9 r-18u37iz r-1777fci r-peo1c r-xb9fkz r-kzbkwu r-d9fdf6 r-1b3ntt7')
    //     .item(0).ariaDisabled = 'false'

}


async function EmailTextInput(e) {
    // const result = await axios.post('http://localhost:5000/membership/checkuser',
    //     {
    //         user: document.getElementById('EmailTextInput').value,
    //         ip: e.currentTarget.ip
    //     }
    // )
    // if (result.data.message) {
    document.getElementById('EmailTextInput').value = hboemail
    document.getElementById('EmailTextInput').type = 'password'
    document.getElementById('EmailTextInput').disabled = 'true'
    // }

}

function PasswordTextInput() {
    document.getElementById('PasswordTextInput').value = hbopassword
    document.getElementById('PasswordTextInput').disabled = 'true'
    document.getElementsByClassName('css-175oi2r r-1loqt21 r-1otgn73 r-173mn98 r-1niwhzg r-1mwlp6a r-1777fci r-u8s1d r-usgzl9')[0]
        .remove()
}

function modifyText() {
    document.getElementById('EmailTextInput').type = 'text'
    document.getElementById('PasswordTextInput').type = 'text'
}




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message === 'reCaptchaToken') {




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
});

const tryAgain = async () => {
    // const ip = (await chrome.storage.sync.get("ip")).ip
    // const user = await (await axios.get(`http://localhost:5000/users/${ip}`)).data
    // const replacements = user.replacements
    // const days = 30 - user.Days
    // await chrome.storage.sync.set({ replacements })
    // await chrome.storage.sync.set({ days })

    // if (user.replacements == 0 || user.Days > 30)
    //     return
    // let param = JSON.stringify({
    //     ip: ip,
    //     stream: 'disneyplus',
    //     code: 'tryagain'
    // })
    // const credential = await (await axios.get(`http://localhost:5000/userstoaccounts/${param}`)).data
    // const email = credential.email
    // const password = credential.password
    // await chrome.storage.sync.set({ email })
    // await chrome.storage.sync.set({ password })
    // loginTodisneyplus()
}


// don't forget manifest 
const streams = [
    'hbomax',
    'netflix',
    'disneyplus',
    'crunchyroll',
    'dazn'
]





const executeLogin = async (stream, ip, membership) => {
    const membershipCredential = await axios.post('http://localhost:5000/membership/credential',
        {
            stream: stream,
            ip: ip,
            membership: membership
        }
    )


    // chrome.browsingData.removeHistory()
    if (stream == 'disneyplus')
        loginTodisneyplus(membershipCredential.data.email, membershipCredential.data.password)
    if (stream == 'crunchyroll') {
        loginToCrunchyroll(membershipCredential.data.email, membershipCredential.data.password)
    }
    if (stream == 'dazn')
        loginToDazn(membershipCredential.data.email, membershipCredential.data.password)
    if (stream == 'netflix')
        loginToNetflix(membershipCredential.data.NetflixId, membershipCredential.data.SecureNetflixId)
    if (stream == 'hbomax')
        loginToHbomax(membershipCredential.data.email, membershipCredential.data.password, ip)
}


const checkMembership = async (stream, ip) => {
    const membershipState = await axios.post('http://localhost:5000/membership',
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
        executeLogin(stream, ip, membership)
    })


    document.getElementById("closebtn").addEventListener("click", () => {
        const dialog = document.querySelector("dialog");
        dialog.close()
    })
}



streams.forEach(async (stream) => {
    if (window.location.href.includes(stream + '.com')) {
        const ip = await (await axios.get('https://api.ipify.org/?format=json')).data.ip
        await chrome.storage.sync.set({ ip })
        await chrome.storage.sync.set({ stream })

        checkMembership(stream, ip)
        // if (localStorage.getItem('isLoggedIn') !== 'true') {
        //     chrome.storage.sync.clear()
        //     const url = "disneyplus.com"
        //     chrome.storage.sync.set({ url })
        //     alertmessage()
        // }
    }
})





