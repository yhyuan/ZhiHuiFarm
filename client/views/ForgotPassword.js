Template.ForgotPassword.events({
    'submit #forgotPasswordForm': function(e, t) {
        e.preventDefault();

        var forgotPasswordForm = $(e.currentTarget),
            email = forgotPasswordForm.find('#forgotPasswordEmail').val();
        if (!email) {
            return false;
        }
        email = trimInput(email.toLowerCase());

        if (isNotEmpty(email) && isEmail(email)) {

            Accounts.forgotPassword({
                email: email
            }, function(err) {
                if (err) {
                    if (err.message === 'User not found [403]') {
                        Session.set('ForgotPasswordDialogMessage', '该电子邮件地址尚未注册，请确认你的输入是正确的');
                    } else {
                        //Session.set("loadingPageOption", 'SignIn');
                        //console.log('We are sorry but something went wrong.');
                        Session.set('ForgotPasswordDialogMessage', '系统出错，请联系管理员');
                    }
                } else {
                    //Session.set("loadingPageOption", 'SignIn');
                    //console.log('Email Sent. Check your mailbox.');
                    Session.set('ForgotPasswordDialogMessage', '邮件已经发送到您的电子邮件信箱，请点击其中的链接来重新设置密码');
                }
                $('#ForgotPasswordDialogModal').modal('show');
            });

        }
        return false;
    },
});


Template.ForgotPasswordDialog.helpers({
    ForgotPasswordDialogMessage: function() {
        return Session.get('ForgotPasswordDialogMessage');
    }
});