/*const router = require('express').Router();
import users from './users'; //users router 호출
import messages from './messages'; // message router 호출

router.all('*',(req, res, next)=>{
	console.log("path="+req.path);
	next();
})

router.use("./users", users); //users router 적용
router.use("./messages", messages); //messages router 적용
router.use("./login", login); //login.js로 적용
router.use("./register", register); // register.js로 보냄

router.all('*',(req, res)=>{
	res.status(404).send({success:false, msg:`api unknown uri ${req.path}`});
})

module.exports = router;
*/
