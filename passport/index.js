import passport from 'passport';
import local from './localStrategy';
import User from '../schemas/users.js';

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.fineOne({ where: { id }})
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    local();
}