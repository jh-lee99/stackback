import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcrypt';
import User from '../schemas/users.js';

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: { email } });
            if (result) {
                done(null, exUser);
            } else {
                done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};