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

// TODO: Add list of active admins
function getReceivers() {
  return 'eduardo.breijo@upr.edu';
}

/**
 * Send email notification with request of on campus service to all admins
 * @param body
 */
exports.sendOnCampusServiceEmail = function(body) {

  var htmlBody = '<h3>New On-Campus Service</h3>' +
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

  var receivers = getReceivers();

  var subjectLine = 'UPRM-CMS On-Campus Service Request';

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

/**
 * Send email notification to all admins with a new recruiter registration
 * @param recInfo
 * @param companyLocation
 */
exports.sendNewRegistrationEmail = function(recInfo, companyLocation) {

  var htmlBody = '<h3>New Recruiter Registration</h3>' +
    '<ul>' +
    '<li><strong>Company Name:&nbsp;</strong>' + recInfo.companyName + '</li>' +
    '<li><strong>Recruiter Name:&nbsp;</strong>' + recInfo.firstName + ' ' + recInfo.lastName + '</li>' +
    '<li><strong>Recruiter Email:&nbsp;</strong><span style="text-decoration: underline; color: #3366ff;">' + recInfo.email + '</span></li>' +
    '<li><strong>Recruiter Phone:&nbsp;</strong>' + recInfo.phoneNumber + '</li>' +
    '<li><strong>Recruiter Location:&nbsp;</strong>' + companyLocation.city + ', ' + companyLocation.country + '</li>' +
    '</ul>';

  var textBody = 'New Recruiter Registration \n' +
    '\t Company Name: ' + recInfo.companyName + '\n' +
    '\t Recruiter Name: ' + recInfo.firstName + ' ' + recInfo.lastName + '\n' +
    '\t Recruiter Email: ' + recInfo.email + '\n' +
    '\t Recruiter Phone: ' + recInfo.phoneNumber + '\n' +
    '\t Recruiter Location: ' + companyLocation.city + ', ' + companyLocation.country + '\n';

  var receivers = getReceivers();

  var subjectLine = 'UPRM-CMS Recruiter Registration';

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: recInfo.firstName + ' ' + recInfo.lastName + '<' + recInfo.email + '>', // sender address
    to: receivers, // list of receivers
    subject: subjectLine, // Subject line
    text: textBody, // plaintext body
    html: htmlBody // html body
  };

  sendEmail(mailOptions);

};

/**
 * Send email notification to an administrator to access the register link after access has been granted.
 * @param req
 */
exports.sendAdminAccessEmail = function(req) {

  var fullUrl = req.protocol + '://' + req.get('host') + '/admins/register';

  var htmlBody = '<p>Greetings,</p>' +
    '<p>You have been given access to the Placement Office website as administrator. Please follow the link below to register.</p>' +
    '<p>Link: <span style="color: #3366ff;"><span style="text-decoration: underline;">' + fullUrl + '</span></span></p>';

  var textBody = 'Greetings, \n' +
    '\t You have been given access to the Placement Office website as administrator. Please follow the link below to register.\n' +
    '\t Link:  ' + fullUrl + '\n';

  var receiver = req.body.email;

  var subjectLine = 'UPRM-CMS Admin Registration';

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '<' + req.body.email + '>', // sender address
    to: receiver, // list of receivers
    subject: subjectLine, // Subject line
    text: textBody, // plaintext body
    html: htmlBody // html body
  };

  sendEmail(mailOptions);
};


exports.sendNewJobOfferEmail = function(jobOffer) {

  var htmlBody = '<h3>New Job Offer</h3>' +
    '<ul>' +
    '<li><strong>Title:&nbsp;</strong>' + jobOffer.title + '</li>' +
    '<li><strong>Company Name:&nbsp;</strong>' + jobOffer.companyName + '</li>' +
    '<li><strong>Recruiter Email:&nbsp;</strong><span style="text-decoration: underline; color: #3366ff;">' + jobOffer.email + '</span></li>' +
    '<li><strong>Expiration Date:&nbsp;</strong>' + new Date(jobOffer.expirationDate) + '</li>' +
    '<li><strong>Location:&nbsp;</strong>' + jobOffer.location + '</li>' +
    '<li><strong>Status:&nbsp;</strong>' + jobOffer.jobOfferStatus + '</li>' +
    '</ul>' +
    '<p><strong>Description of Job Offer</strong></p>' +
    '<p style="padding-left: 30px;">' + jobOffer.description + '</p>';

  var textBody = 'New Job Offer \n' +
    '\t Title: ' + jobOffer.title + '\n' +
    '\t Company Name: ' + jobOffer.companyName + '\n' +
    '\t Recruiter Email: ' + jobOffer.email + '\n' +
    '\t Expiration Date: ' + jobOffer.expirationDate + '\n' +
    '\t Location: ' + jobOffer.location + '\n' +
    '\t Status: ' + jobOffer.jobOfferStatus + '\n' +
    'Description of Job Offer \n' +
    '\t' + jobOffer.description + '\n';

  var receivers = getReceivers();

  var subjectLine = 'UPRM-CMS Job Offer';

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '<' + jobOffer.email + '>', // sender address
    to: receivers, // list of receivers
    subject: subjectLine, // Subject line
    text: textBody, // plaintext body
    html: htmlBody // html body
  };

  sendEmail(mailOptions);
};
