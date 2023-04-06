/*
import express from 'express';
const router = express.Router();
import createUser from '../models/users/createUser.js'; //라우트 설정 -> createUser
import findUser from '../models/users/findUser.js'; //라우트 설정 -> findUser



// 회원가입, /register로 받는 부분 처리
router.post('/register', async (req, res) => {
    const userData = req.body;
// schema로 받아야 하는데 이 부분에서 처리를 아직 다 못했음
  try {  
    const result = await createUser(userData);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, error: result.error });
  }
});


// 로그인, /login으로 받는 것들 처리
router.post('/login', async (req, res) => {
    const userData = req.body;
    const result = await findUser(userData);
    if (result.error) {
      res.status(401).json({ success: false, error: result.error });
    } else {
      res.status(200).json({ success: true, user: result.user });
    }
  });

module.exports = router;
*/