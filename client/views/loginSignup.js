Template.loginSignup.helpers({
  isSignupVisible: function () {
    return Session.get("signup");
  },
  isResetPasswordVisible: function () {
    return Session.get("resetPassword");
  }
});
