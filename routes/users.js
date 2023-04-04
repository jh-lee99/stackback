import express from 'express';
const router = express.Router();
//import createUser from '../models/users/createUser.js'; //라우트 설정 -> createUser
//import findUser from '../models/users/findUser.js'; //라우트 설정 -> findUser

/*으아아아아아아아아 왜 안되는 것이냐아... 기능 다 넣어야 돌아가는건데..

// 회원가입, /register로 받는 부분 처리
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
// schema로 받아야 하는데 이 부분에서 처리를 아직 다 못했음
  try {  
    const result = await createUser(username, password);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error : 500' });
  }
});
*/

// 로그인, /login으로 받는 것들 처리
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
// schema로 받아야 하는데 이 부분에서 처리를 아직 다 못했음
  try {
    const result = await findUser(username, password);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error : 500' });
  }
});

module.exports = router;