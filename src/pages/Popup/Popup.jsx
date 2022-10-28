import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";


const Popup = () => {
  const [navigate, setNavigate] = useState(false)

  const [user, setUser] = useState()
  const [password, setPassword] = useState()
  const [ip, setIp] = useState()

  const [membership, setMembership] = useState()
  const [globalMsg, setGlobalMsg] = useState('Hello!')
  const [url, setUrl] = useState()
  const [replacements, setReplacements] = useState()
  const [days, setDays] = useState(30)
  const [errormsg, setErrorMsg] = useState('')

  const signin = async () => {

    const response = await axios.post('http://localhost:5000/membership/signin', {
      user: user,
      password: password,
      ip: ip
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

  const loginToStream = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'login' });
    });
  }



  useEffect(async () => {

    const membership = (await chrome.storage.sync.get("membership")).membership
    const ip = (await chrome.storage.sync.get("ip")).ip

    setMembership(membership)
    setIp(ip)

    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      setUrl((new URL(tabs[0].url)).hostname)
    });
    const response = await axios.get('http://localhost:5000/msgs')
    setGlobalMsg(response.data.globalMsg)

    if (membership != 'new') {
      const stream = (await chrome.storage.sync.get("stream")).stream
      const membershipData = await axios.post('http://localhost:5000/membership/data',
        {
          stream: stream,
          ip: ip
        }
      )
      setReplacements(membershipData.data.replacements)
      if (membershipData.data.days != null)
        setDays(membershipData.data.days)
    }

  })

  return (
    <div className='has-background-black has-text-centered'>
      <div className="subtitle mt-0 pt-3 has-text-white" style={{ "fontWeight": "bold" }}>Account Login Extension</div>
      {
        membership != 'new' ? (<div>
          <div className="m-auto has-background-primary has-text-white">Extension Dashboard</div>
          <div className="has-background-link has-text-white mt-0 pl-3 pr-3 pt-3 pb-3">
            <div className='ml-3' style={{ "textAlign": "left", "fontWeight": "bold" }}>ADMIN MESSAGE</div>
            {globalMsg}
          </div>
          <div className='has-background-white pb-3 pt-3'>
            <div className='is-flex'>
              <div className='m-auto' style={{ "textAlign": "left", "fontWeight": "bold" }}>REPLACEMENTS</div>
              <div className='m-auto' style={{ "textAlign": "right", "fontWeight": "bold" }}>REMAININGDAY</div>
            </div>
            <div className='is-flex'>
              <div className='box has-background-primary has-text-white m-auto pt-0' style={{ "width": "40%", "height": "50px", "fontSize": "30px", "fontWeight": "bold" }}>{replacements}</div>
              <div className='box has-background-primary has-text-white m-auto pt-0' style={{ "width": "40%", "height": "50px", "fontSize": "30px", "fontWeight": "bold" }}>{days}</div>
            </div>
          </div>
          <div className="mt-5 pt-3 pb-3 has-background-info has-text-white is-clickable" onClick={() => loginToStream()} style={{ "fontWeight": "bold" }}>Login</div>

          <div>{url}</div>
        </div>) : (<div>
          <p className="m-auto has-background-primary has-text-white">Sign in to Extension</p>
          <div className="box is-radiusless">
            <div className="field">
              <label className="label">User</label>
              <div className="control">
                <input className="input" type="text"
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="User" />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input className="input" type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" />
              </div>
            </div>
            <div className='label has-text-danger'>{errormsg}</div>
            <button className="button is-primary" onClick={() => signin()}>Sign in</button>
          </div>
        </div>)
      }
    </div>
  );
};

export default Popup;
