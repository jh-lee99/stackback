import express from 'express';
import { isLoggedIn, isNotLoggedIn } from './middlewares.js';

const router = express.Router();
router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: ' 내 정보'});
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {title: '회원가입'});
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main',{
        title:'For travel',
        twits,
    });
});

export default router;