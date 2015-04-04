// All Tomorrow's Parties -- server

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("parties", function () {
  return Parties.find(
    {$or: [{staffs: { $in: [this.userId]}}, {owner: this.userId}]});
});

Meteor.publish("crops", function () {
  return Crops.find({});
});

Meteor.publish("activities", function () {
  return Activities.find({});
});


// server/smtp.js
Meteor.startup(function () {

  smtp = {
    username: 'postmaster@sandbox632d3679920341e0998e40505390f045.mailgun.org',   // eg: server@gentlenode.com
    password: '9073b702a6b24bf840ed0a409351a424',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.mailgun.org',  // eg: mail.gandi.net
    port: 25
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
    
  if (Crops.find().count() === 0) {
    var cropList = [
      { 
        Id: 1,
        name: '小麦'
      },
      {
        Id: 2,
        name: '玉米'
      },
      {
        Id: 3,
        name: '水稻'
      },
      {
        Id: 4,
        name: '大豆'
      },
      {
        Id: 5,
        name: '高粱'
      }
    ];
    _.each(cropList, function(crop) {
      Crops.insert(crop);
    })
  }
  if (Activities.find().count() === 0) {
    var activitiesList = [
      { 
        Id: 1,
        name: '播种'
      },
      {
        Id: 2,
        name: '施肥'
      },
      {
        Id: 3,
        name: '收割'
      }
    ];
    _.each(activitiesList, function(activity) {
      Activities.insert(activity);
    })
  }

  //process.env.MAIL_URL = 'smtp://postmaster%40zhihuifarm.mailgun.org:yorkyork@smtp.mailgun.org:587';
});


// (server-side)
Meteor.startup(function() {
  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
  Accounts.emailTemplates.from = '智慧农场<no-reply@zhihui.farm>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = '智慧农场';

  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return '验证你的电子邮件地址';
  };

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return '请点击以下链接来验证您的电子邮件地址: ' + url;
  };
});

// (server-side)
Accounts.onCreateUser(function(options, user) {
  user.profile = {};

  // we wait for Meteor to create the user before sending an email
  Meteor.setTimeout(function() {
    Accounts.sendVerificationEmail(user._id);
  }, 2 * 1000);

  return user;
});

// (server-side) called whenever a login is attempted
Accounts.validateLoginAttempt(function(attempt){
  if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
    console.log('email not verified');

    return false; // the login is aborted
  }
  return true;
}); 

