Template.loginSignup.helpers({
  isSignupVisible: function () {
    return Session.get("signup");
  }
});