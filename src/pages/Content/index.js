/* global chrome */

import { printLine } from './modules/print';
import axios from 'axios';
import Cookies from 'js-cookie'
import { Await } from 'react-router-dom';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');



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

const loginToCrunchyroll = async (email, password) => {
    console.log(email)
}

const loginToHbomax = async (email, password) => {



    // 1. Send a message to the service worker requesting the user's data
    var reCaptchaToken
    chrome.runtime.sendMessage('reCaptcha', (response) => {
        console.log(response)
        console.log(JSON.parse(localStorage.getItem('authToken')).access_token)
        reCaptchaToken = response
    });

    // const xhr = new XMLHttpRequest();
    // xhr.open("POST", `https://oauth-us.api.hbo.com/auth/tokens`, false);

    // xhr.onreadystatechange = () => {
    //     if (xhr.readyState === 4) {

    //     }
    // }
    // xhr.setRequestHeader('authorization', 'Bearer ' + JSON.parse(localStorage.getItem('authToken')).access_token)
    // xhr.setRequestHeader('x-recaptchatoken', reCaptchaToken)
    // const body = {
    //     "grant_type": "user_name_password",
    //     "password": password,
    //     "username": email,
    //     "scope": "browse video_playback device elevated_account_management"
    // }
    // xhr.send(JSON.stringify(body))
}



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
    'crunchyroll'
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
    if (stream == 'crunchyroll')
        loginToCrunchyroll(membershipCredential.data.email, membershipCredential.data.password)
    if (stream == 'netflix')
        loginToNetflix(membershipCredential.data.NetflixId, membershipCredential.data.SecureNetflixId)
    if (stream == 'hbomax')
        loginToHbomax(membershipCredential.data.email, membershipCredential.data.password)
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





