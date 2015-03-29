Template.loginSignup.helpers({
  isSignupVisible: function () {
    return Session.get("signup");
  },
  isForgetPasswordVisible: function () {
    return Session.get("forgetPassword");
  }
});
