import User from'../models/users.js';

export default class LoginController {
  userEmail = '';
  userPassword = '';

  async login(req, res) {
    const { userEmail, userPassword } = req.body;

    this.userEmail = userEmail;
    this.userPassword = userPassword;

    // find user by userEmail
    const user = await User.findOne({ userEmail });

    if (user) {
      // compare password
      if (userPassword === user.password) {
        res.status(201).json({});
      } else {
        res.status(401).json({});
      }
    } else {
      res.status(401).json({});
    }
  }
}