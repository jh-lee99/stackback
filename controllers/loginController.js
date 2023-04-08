import User from'../models/users.json' assert { type: "json" };


export default class LoginController {
  userEmail = '';
  userPassword = '';
  
  async login(req, res) {
    const { userEmail, userPassword } = req.body;

    this.userEmail = userEmail;
    this.userPassword = userPassword;

    // find user by userEmail
    const userfind = await User.findOne({ userEmail });

    if (userfind) {
      // compare password
      if (userPassword === userfind.password) {
        res.status(201).json({});
      } else {
        res.status(401).json({});
      }
    } else {
      res.status(401).json({});
    }
  }
}