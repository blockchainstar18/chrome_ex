import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './Popup.css'

import UserIcon from '../../assets/img/User, Profile, Add 1.png'
import PassIcon from '../../assets/img/lock 1.png'
import CalenIcon from '../../assets/img/calendar-schedule 1.png'
import ReplaIcon from '../../assets/img/refresh-rotate 1.png'
import MsgIcon from '../../assets/img/Messages, Chat 1.png'
import checkIcon from '../../assets/img/checkmark-circle-1 1.png'
import lgnIcon from '../../assets/img/login-logout-arrow.png'

import disneyplusIcon from '../../assets/img/disneyplus.png'
import netflixIcon from '../../assets/img/netflix.png'
import crunchyrollIcon from '../../assets/img/crunchyroll.png'
import daznIcon from '../../assets/img/dazn.png'
import hbomaxIcon from '../../assets/img/hbomax.png'


const Popup = () => {
  const [loading, setLoading] = useState(false);
  const [navigate, setNavigate] = useState(false)

  const [user, setUser] = useState()
  const [password, setPassword] = useState()
  const [ip, setIp] = useState()
  const [stream, setStream] = useState()
  const [membership, setMembership] = useState()

  const [Msgs, setGlobalMsg] = useState('')
  const [url, setUrl] = useState()
  const [replacements, setReplacements] = useState()
  const [days, setDays] = useState()
  const [errormsg, setErrorMsg] = useState('')
  const [tillmsg, setTillmsg] = useState('')
  const [isSupport, setSupport] = useState(false)

  const [messagetitle, setVisible] = useState('Show messages')
  const [Icon, setIcon] = useState()

  const streams = [
    'hbomax',
    'netflix',
    'disneyplus',
    'crunchyroll',
    'dazn'
  ]



  const signin = async () => {
    const userid = getRandomToken();
    await chrome.storage.sync.set({ userid: userid })
    const response = await axios.post('http://devsun.go.ro:3000/membership/signin', {
      user: user,
      password: password,
      ip: ip + ':' + userid
    });
    if (response.data.message) {
      const membership = 'standby'
      await chrome.storage.sync.set({ membership })
      setMembership(membership)
      const reloadpage = () => {
        document.location.reload()
      }
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: reloadpage
        });
      });
    }

    else {
      setErrorMsg('Invalid credential!')
    }
  }

  const loginToStream = async () => {

    if (membership == 'fulfilled') {
      alert('Purchase new membership please')
      return
    }

    const userid = (await chrome.storage.sync.get("userid")).userid

    const membershipCredential = await axios.post('http://devsun.go.ro:3000/membership/credential',
      {
        stream: stream,
        ip: ip + ':' + userid,
        membership: membership
      }
    )
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'login', data: membershipCredential });
    });
  }

  function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
  }

  useEffect(async () => {

    // chrome.identity.getProfileUserInfo((userInfo) => {
    //   alert(userInfo.email + ':' + userInfo.id)
    // });





    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // alert((new URL(tabs[0].url)).hostname)
      streams.forEach(async (stream) => {
        if ((new URL(tabs[0].url)).hostname.includes(stream + '.com')) {
          // chrome.tabs.sendMessage(tabs[0].id, { message: 'check' });
          setLoading(true)

          const ip = await (await axios.get('https://api.ipify.org/?format=json')).data.ip
          await chrome.storage.sync.set({ ip })
          await chrome.storage.sync.set({ stream })


          if (stream == 'disneyplus')
            setIcon(disneyplusIcon)
          if (stream == 'netflix')
            setIcon(netflixIcon)
          if (stream == 'hbomax')
            setIcon(hbomaxIcon)
          if (stream == 'crunchyroll')
            setIcon(crunchyrollIcon)
          if (stream == 'dazn')
            setIcon(daznIcon)

          const userid = (await chrome.storage.sync.get("userid")).userid
          var membership
          if (userid) {
            const membershipState = await axios.post('http://devsun.go.ro:3000/membership',
              {
                stream: stream,
                ip: ip + ':' + userid
              }
            )
            membership = membershipState.data.response
            await chrome.storage.sync.set({ membership })
          }
          else {
            membership = 'new'
          }

          if (membership != 'new') {
            // const stream = (await chrome.storage.sync.get("stream")).stream
            const response = await axios.get('http://devsun.go.ro:3000/msgs')

            setGlobalMsg(response.data)



            const membershipData = await axios.post('http://devsun.go.ro:3000/membership/data',
              {
                stream: stream,
                ip: ip + ':' + userid
              }
            )
            setReplacements(membershipData.data.replacements)
            if (membershipData.data.days != null)
              setDays(membershipData.data.days)

          }

          setMembership(membership)
          setIp(ip)
          setStream(stream)

          setLoading(false)
          setSupport(true)

          if (membership == 'fulfilled') {
            setTillmsg('Your membership is expired')
            setDays(0)
          }

          if (membership == 'standby') {
            setTillmsg('Welcome! Please login with extension.')
          }


          if (membership == 'active') {
            Date.prototype.addDays = function (days) {
              var date = new Date(this.valueOf());
              date.setDate(date.getDate() + days);
              return date;
            }
            var date = new Date();
            const tillday = new Date(date.addDays(days))
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            setTillmsg(`Your membership is active until ${tillday.toLocaleDateString("en-US", options)}`);
          }

        }
      })

    });

    // const membership = (await chrome.storage.sync.get("membership")).membership
    // alert(membership)
    // const ip = (await chrome.storage.sync.get("ip")).ip
    // setMembership(membership)
    // setIp(ip)

    // chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    //   setUrl((new URL(tabs[0].url)).hostname)
    // });






  }, [membership])

  return (
    <div>
      {isSupport ? (<div>

        {(membership != 'new') ? (<div>
          <div className='membershipPane'>
            <img className='calenIcon' src={CalenIcon}></img>
            <div className='remaindays'>{days} days left</div>
            <img className='ReplaIcon' src={ReplaIcon}></img>
            <div className='replacements'>{replacements} replacements left</div>
            <img className={stream == 'disneyplus' || stream == 'hbomax' ? ('stream') : ('streamS')} src={Icon}></img>
            <div className='streamlgnbtn' onClick={() => loginToStream()} >LOGIN</div>
            <img className='lgnIcon' src={lgnIcon}></img>
          </div>
          <div>
            <div className='line'></div>
            <div className='messagepane' onClick={() => {
              if (messagetitle == 'Hide messages')
                setVisible('Show messages')
              else
                setVisible('Hide messages')
            }}>
              <img className='msgIcon' src={MsgIcon}></img>
              <div className='messagetitle'>{messagetitle}</div>
            </div>
            <div className='line'></div>

            {
              messagetitle == 'Show messages' ? (<></>) : (
                <div className='msgcontent'>
                  <div className='msgsubcontent'>
                    {
                      Msgs.map((msg) => {
                        return (<div className='msgs' key={msg.Msgs}>
                          {msg.Msgs}
                        </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            }

          </div>
          <div className='checkpane'>
            <img className='msgIcon' src={checkIcon}></img>
            <div className='messagetitle'>{tillmsg}</div>
          </div>
        </div>) : (<div>
          <div className='loginform'>
            <input className='username' onChange={(e) => setUser(e.target.value)} placeholder='Username'>
            </input>
            <img className='userIcon' src={UserIcon}></img>
            <input className='password' type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Password'>
            </input>
            <img className='PassIcon' src={PassIcon}></img>
            <div className='lgnbtn' onClick={() => signin()}>LOGIN</div>
          </div>
          <div className='lgnpad'></div>
          <div className='errormsg'>{errormsg}</div>
          <div className='lgntxt'>Sometimes you need to log in to see the magic happen</div>
        </div>)}



      </div>) : (<div >
        <div className='extitle'>Welcome to
          <div className='sneaky'>Sneaky</div>!
        </div>
        <div className='tostream'>
          <a href="https://disneyplus.com"
            target="_blank" className='icons'><img src={disneyplusIcon}></img></a>
          <a href="https://netflix.com"
            target="_blank" className='icons'><img src={netflixIcon}></img></a>
          <a href="https://hbomax.com"
            target="_blank" className='icons'><img src={hbomaxIcon}></img></a>
          <a href="https://crunchyroll.com"
            target="_blank" className='icons'><img src={crunchyrollIcon}></img></a>
          <a href="https://dazn.com"
            target="_blank" className='icons'><img src={daznIcon}></img></a>
        </div>

        {loading ? (<progress className="progress is-small is-primary is-radiusless" max="100">15%</progress>) : (<></>)}
      </div>)}

    </div>

  );
};

export default Popup;
