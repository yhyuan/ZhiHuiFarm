// server/smtp.js
Meteor.startup(function () {
	
  smtp = {
    username: 'postmaster@sandbox632d3679920341e0998e40505390f045.mailgun.org',   // eg: server@gentlenode.com
    password: '9073b702a6b24bf840ed0a409351a424',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.mailgun.org',  // eg: mail.gandi.net
    port: 25
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
  
  //process.env.MAIL_URL = 'smtp://postmaster%40zhihuifarm.mailgun.org:yorkyork@smtp.mailgun.org:587';
});