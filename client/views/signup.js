 /*
  http://bootsnipp.com/snippets/featured/full-page-sign-in
   */
 Template.SignUp.events({
     'submit #signUpForm': function(e, t) {
         e.preventDefault();

         var signUpForm = $(e.currentTarget),
             email = signUpForm.find('#signUpEmail').val(),
             password = signUpForm.find('#signUpPassword').val(),
             passwordConfirm = signUpForm.find('#signUpPasswordConfirm').val();
         if ((!email) || (!password) || (!passwordConfirm)) {
             return false;
         }
         email = trimInput(email.toLowerCase());

         if (isNotEmpty(email) && isNotEmpty(password) && isEmail(email) && areValidPasswords(password, passwordConfirm)) {
             Accounts.createUser({
                 email: email,
                 password: password
             }, function(err) {
                 if (err) {
                     if (err.message === 'Email already exists. [403]') {
                         //console.log('We are sorry but this email is already used.');
                         Session.set('SignUpDialogMessage', '此电子邮件地址已经被注册过，请点击忘记密码来重新设置您的密码');
                     } else if (err.message === 'Login forbidden [403]') {
                         Session.set('SignUpDialogMessage', '请检查您的邮箱，并点击其中的链接来激活您的账号。');
                     } else {
                         Session.set('SignUpDialogMessage', '系统出错，请联系管理员');
                     }
                 } else {
                     Session.set('SignUpDialogMessage', '请检查您的邮箱，并点击其中的链接来激活您的账号。');
                 }
                 $('#SignUpDialogModal').modal('show');

             });

         }
         return false;
     },
 });

 Template.SignUpDialog.helpers({
     SignUpDialogMessage: function() {
         return Session.get('SignUpDialogMessage');
     }
 });