'use strict';

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS
  }
});

function sendEmail(mailOptions) {
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      return console.log(err);
    }
    console.log('Message sent: ' + info.response);
  });
}


exports.sendOnCampusServiceEmail = function(body) {

  var htmlBody = '<h3> New On-Campus Service </h3>' +
    '<ul>' +
      '<li><strong>Company Name:&nbsp;</strong>' + body.companyName + '</li>' +
      '<li><strong>Recruiter Name:&nbsp;</strong>' + body.recruiterFirstName + ' ' + body.recruiterLastName + '</li>' +
      '<li><strong>Recruiter Email:&nbsp;</strong><span style="text-decoration: underline; color: #3366ff;">' + body.recruiterEmail + '</span></li>' +
      '<li><strong>Type of Event:&nbsp;</strong>' + body.typeEvent + '</li>' +
      '<li><strong>Other Description:&nbsp;</strong>' + body.otherDescription + '</li>' +
      '<li><strong>Date:&nbsp;</strong>' + body.date + '</li>' +
      '<li><strong>Hour:&nbsp;</strong>' + body.hour + '</li>' +
      '<li><strong>Expected Capacity:&nbsp;</strong>' + body.expectedCapacity + '</li>' +
    '</ul>' +
    '<p><strong>Aditional Information</strong></p>' +
    '<p style="padding-left: 30px;">' + body.additionalInfo + '</p>';

  var textBody = 'New On-Campus Service \n' +
    '\t Company Name: ' + body.companyName + '\n' +
    '\t Recruiter Name: ' + body.recruiterFirstName + ' ' + body.recruiterLastName + '\n' +
    '\t Recruiter Email: ' + body.recruiterEmail + '\n' +
    '\t Type of Event: ' + body.typeEvent + '\n' +
    '\t Other Description: ' + body.otherDescription + '\n' +
    '\t Date: ' + body.date + '\n' +
    '\t Hour: ' + body.hout + '\n' +
    '\t ExpectedCapacity: ' + body.expectedCapacity + '\n' +
    'Aditional Information \n' +
    '\t' + body.additionalInfo + '\n';

  // TODO: Add list of active admins
  var receivers = 'eduardo.breijo@upr.edu';

  var subjectLine = 'New On-Campus Service Request';

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: body.recruiterFirstName + ' ' + body.recruiterLastName + '<' + body.recruiterEmail + '>', // sender address
    to: receivers, // list of receivers
    subject: subjectLine, // Subject line
    text: textBody, // plaintext body
    html: htmlBody // html body
  };

  sendEmail(mailOptions);

};

