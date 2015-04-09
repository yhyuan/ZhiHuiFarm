if (Accounts._resetPasswordToken) {
  Session.set('resetPassword', Accounts._resetPasswordToken);
}
//Accounts.onResetPasswordLink 
Template.ResetPassword.helpers({
 resetPassword: function(){
  //console.log(Session.get('resetPassword'));
  return Session.get('resetPassword');
 }
});

Template.ResetPassword.events({
  'submit #resetPasswordForm': function(e, t) {
    e.preventDefault();

    var resetPasswordForm = $(e.currentTarget),
        password = resetPasswordForm.find('#resetPasswordPassword').val(),
        passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();

    if (isNotEmpty(password) && areValidPasswords(password, passwordConfirm)) {
      Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
        if (err) {
          //console.log('We are sorry but something went wrong.');
          Session.set('ResetPasswordDialogMessage', '系统出错，请联系管理员');
        } else {
          //console.log('Your password has been changed. Welcome back!');
          Session.set('ResetPasswordDialogMessage', '密码重置成功，您已经成功登陆');
          Session.set('resetPassword', null);
        }
        $('#ResetPasswordDialogModal').modal('show');
      });
    }
    return false;
  }
});

Template.ResetPasswordDialog.helpers({
     ResetPasswordDialogMessage: function() {
         return Session.get('ResetPasswordDialogMessage');
     }
});
