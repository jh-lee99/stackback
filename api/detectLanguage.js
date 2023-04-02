// 네이버 Papago 언어감지 API 예제
// import express from "express";
// var app = express();
import axios from 'axios';
// const axios = require('axios');
var client_id = 'YOUR_CLIENT_ID';
var client_secret = 'YOUR_CLIENT_SECRET';

var query = "언어를 감지할 문장을 입력하세요.";

export default async function (req, res, dest, start) {
// (dest, start)
const api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
  try {
    const response = await axios.post(
      api_url, { query }, 
      {
        headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret
      }
    });
    // res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).send(error.message);
    console.log('error = ' + error.response.status);
  }
};