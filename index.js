'use strict';

import fetch from 'node-fetch';
import express, { response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import url from 'url';


// Constants
const PORT = 8080;
// const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.status(200).json({success:true});
  res.end();
});

// Card

app.get('/card/store', async (req, res) => {
  const response = await fetch("https://yc97463.github.io/DHSA-API/store.json", {
    method: "GET" 
  });
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(JSON.stringify(await response.json()));
  res.end();
  
})

// LINE Notify

const lineNotifyOAuthHost = "https://notify-bot.line.me/oauth";
const lineNotifyAPIHost = "https://notify-api.line.me/api";

app.get('/lineNotify/connect',async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const code = queryObject.code;
  const state = queryObject.state;
  if(!code){
    res.status(200).json({return:lineNotifyOAuthHost+"/authorize?client_id="+process.env.lineNotify_ClientID+"&redirect_uri="+process.env.lineNotify_CallbackURi+"&scope=notify&state=asdf&response_type=code"})
  }else{
    const response = await fetch(lineNotifyOAuthHost+"/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.lineNotify_CallbackURi,
        client_id: process.env.lineNotify_ClientID,
        client_secret: process.env.lineNotify_ClientSecret,
      }),
    });
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(JSON.stringify(await response.json()));
    res.end();
  }
})

app.post('/lineNotify/notify',async (req, res) => {
  const response = await fetch(lineNotifyAPIHost+"/notify", {
    method: "POST",
    headers: {
      "Authorization": "Bearer "+LN_Usertoken,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      message: `早安！
晚安大家`,
      imageThumbnail: "https://miro.medium.com/max/1400/1*cYbw3hyi3dDG7aFy_-wdUg.png",
      imageFullsize: "https://miro.medium.com/max/1400/1*cYbw3hyi3dDG7aFy_-wdUg.png",
      stickerPackageId: 8522,
      stickerId: 16581267
    }),
  });
  
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(JSON.stringify(await response.json()));
  res.end();
})

app.post('/lineNotify/status', async (req, res) => {
  const response = await fetch(lineNotifyAPIHost+"/status", {
    method: "GET",
    headers: {
      "Authorization": "Bearer "+LN_Usertoken,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(JSON.stringify(await response.json()));
  res.end();
})

// Webhook

app.post('/webhook/lineMessaging', async (req, res) => {
  res.status(200).json({success:true});
  res.end();
})

// Callback

app.get('/callback/lineLogin', (req, res) => {
  res.status(200).json({success:true});
  res.end();
})

app.get('/callback/lineNotify', (req, res) => {
  res.status(200).json({success:true});
  // process.env.lineNotify_ClientID
  res.end();
})


app.listen(parseInt(process.env.PORT) || 8080, () => {
  console.log(`Running on ${PORT}`);
});