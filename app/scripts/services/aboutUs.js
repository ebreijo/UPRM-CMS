'use strict';

var app = angular.module('uprmcmsApp');

app.factory('AboutUs', function(Restangular) {
  var obj = {};

  obj.aboutUsInfo = {
    'aboutUs': [
      {
        'id': 1,
        'vision': 'Serve as liaison between students and businesses while providing the best and most effective service to all.',
        'missionDesc': 'Provide students the necessary tools that will help achieve an effective job search, while maintaining lines of communication with businesses and the College community.',
        'policiesDesc': 'The following, apply to all students, seniors, graduate and alumni that request our services:',
        'requirementsDesc': 'The following, apply to all students, seniors, graduate and alumni that request our services:'
      }
    ],
    'requirements': [
      {
        'id': 1,
        'requirement': 'Five or more copies of your resume (preferably in English).'
      },
      {
        'id': 2,
        'requirement': 'Copy of your course program.'
      },
      {
        'id': 3,
        'requirement': 'Transcript (preferably in English).'
      },
      {
        'id': 4,
        'requirement': 'Fill out student evaluation form'
      },
      {
        'id': 5,
        'requirement': '2x2 photograph (optional).'
      },
      {
        'id': 6,
        'requirement': 'Every student is responsible for maintaining his/her file updated and with enough copies at the Placement Office.'
      }
    ],
    'companyServices': [
      {
        'id': 1,
        'service': 'Announce any job offers (part time, summer and permanent)'
      },
      {
        'id': 2,
        'service': 'Collect and send resumes of students and alumni'
      },
      {
        'id': 3,
        'service': 'Coordinate on-campus interviews'
      },
      {
        'id': 4,
        'service': 'Organize the Annual Job Fair'
      },
      {
        'id': 5,
        'service': 'Organize information sessions'
      },
      {
        'id': 6,
        'service': 'Coordinate meetings with faculty and student organizations'
      },
      {
        'id': 7,
        'service': 'We refer resumes of recent graduates with minimum experience.'
      }
    ],
    'policies': [
      {
        'id': 1,
        'policy': 'Register at the Placement Office with any member of the staff.'
      },
      {
        'id': 2,
        'policy': 'Clear through any staff member, if you miss an interview. Any student who fails in this aspect for a second time will not be allowed future interviews. Remember your actions will reflect on your peers.'
      },
      {
        'id': 3,
        'policy': 'Every student must sign up for an interview on their spare time. The Placement Office will not provide excuse letters for missing classes on account of an interview.'
      },
      {
        'id': 4,
        'policy': 'There is no limit to the number of interviews a student can have. However, once a student has accepted a job offer, he or she must stop interviewing.'
      },
      {
        'id': 5,
        'policy': 'Students that accept a job offer should notify the Placement Office.'
      }
    ],
    'ourStaff': [
      {
        'id': 1,
        'name': 'Sra. Nancy Nieves Arán',
        'position': 'Director'
      },
      {
        'id': 2,
        'name': 'Srta. Margarita Carlo Cuebas',
        'position': 'Employment Interviewer'
      },
      {
        'id': 3,
        'name': 'Sr. William Pacheco',
        'position': 'Employment Interviewer'
      },
      {
        'id': 4,
        'name': 'Sra. Eva E. Troche Morales',
        'position': 'Administrative Secretary'
      }
    ],
    'studentServices': [
      {
        'id': 1,
        'service': 'Register students and alumni, creating records for our files.'
      },
      {
        'id': 2,
        'service': 'Assist students and alumni explore the job market.'
      },
      {
        'id': 3,
        'service': 'Help with the correction of resumes.'
      },
      {
        'id': 4,
        'service': 'Offer talks to groups of students on resume writing, interviews, job search, etc.'
      },
      {
        'id': 5,
        'service': 'Coordinate on campus interviews.'
      },
      {
        'id': 6,
        'service': 'Refer resumes to companies and or agencies.'
      },
      {
        'id': 7,
        'service': 'Announce job opportunities (part-time, summer and permanent).'
      },
      {
        'id': 8,
        'service': 'Keep a list of companies and agencies with their addresses.'
      },
      {
        'id': 9,
        'service': 'Coordinate meetings between student organizations and companies.'
      },
      {
        'id': 10,
        'service': 'Prepare salary statistics.'
      },
      {
        'id': 11,
        'service': 'Prepare annual employment statistics.'
      },
      {
        'id': 12,
        'service': 'Organize Annual Job Fair.'
      },
      {
        'id': 13,
        'service': 'Work with student organizations.'
      }
    ]
  };

  obj.getAll = function() {
    return Restangular.all('/api/aboutUs').customGET().then(function(data) {
      angular.copy(data, obj.aboutUsInfo);
    });
  };

  return obj;
});
