const router = require('express').Router();
import gptApi from './gptApi'; //gptApi router 호출
import papagoApi from './papagoApi'; //papagoApi router 호출

router.all('*',(req, res, next)=>{
	console.log("path="+req.path);
	next();
})