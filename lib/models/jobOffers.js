'use strict';

module.exports = function (sequelize, DataTypes) {
  var jobOffers = sequelize.define('jobOffers', {
    //  id (PK) (INT UNSIGNED) (NOT NULL) (FK Job_Offer_Edit)
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    //  company_name (VARCHAR (63)) (FK Company) (NOT NULL) (Should be preselected)
    companyName: {
      type: DataTypes.STRING(63),
      field: 'company_name',
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 63]
      }
    },
    //  recruiter_email (FK Recruiter)
    email: {
      type: DataTypes.STRING(255),
      field: 'recruiter_email',
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    //  title (VARCHAR (127)) (NOT NULL)
    title: {
      type: DataTypes.STRING(127),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 127]
      }
    },
    // description (VARCHAR (511)) (NOT NULL)
    description: {
      type: DataTypes.STRING(511),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 511]
      }
    },
    // job_position (ENUM ‘Internship’, ‘CO-OP’, ‘Full-Time’, ‘Part-Time’) (NOT NULL)
    jobPosition: {
      type: DataTypes.ENUM('Internship', 'CO-OP', 'Full-Time', 'Part-Time'),
      field: 'job_position',
      allowNull: false,
      validate: {
        isIn: [['Internship', 'CO-OP', 'Full-Time', 'Part-Time']],
        notEmpty: true
      }
    },
    // education_level (ENUM ‘Bachelors’, ‘Masters’, ‘PhD’) (NOT NULL)
    educationLevel: {
      type: DataTypes.ENUM('Bachelors', 'Masters', 'PhD'),
      field: 'education_level',
      allowNull: false,
      validate: {
        isAlpha: true,
        isIn: [['Bachelors', 'Masters', 'PhD']],
        notEmpty: true
      }
    },
    // recent_graduate (BOOLEAN) (NOT NULL) (DEFAULT = ‘false’)
    recentGraduate: {
      type: DataTypes.BOOLEAN,
      field: 'recent_graduate',
      defaultValue: false,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['false', 'true']]
      }
    },
    // creation_date (TIMESTAMP) (NOT NULL) (DEFAULT = CURRENT_TIMESTAMP)
    creationDate: {
      type: DataTypes.DATE,
      field: 'creation_date'
    },
    // expiration_date (DATETIME) (NOT NULL)
    expirationDate: {
      type: DataTypes.DATE,
      field: 'expiration_date',
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    //  announcement_number (VARCHAR (45))
    announcementNumber: {
      type: DataTypes.STRING(45),
      field: 'announcement_number',
      allowNull: true
    },
    // flyer_path (VARCHAR (255))
    flyerPath: {
      type: DataTypes.STRING(255),
      field: 'flyer_path',
      allowNull: true
    },
    // job_offer_status (ENUM ‘pending’, ‘approved’, ‘rejected’) (NOT NULL) (DEFAULT = ‘pending)’
    jobOfferStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      field: 'job_offer_status',
      defaultValue: 'pending',
      validate: {
        isAlpha: true,
        isIn: [['pending', 'approved', 'rejected']]
      }
    },
    // location (VARCHAR (127))
    location: {
      type: DataTypes.STRING(127),
      allowNull: true
    }
  }, {
    tableName: 'job_offer',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        jobOffers.belongsTo(models.companies, {foreignKey: 'companyName'});
        jobOffers.belongsTo(models.recruiters, {foreignKey: 'email'});
      }
    }
  });
  return jobOffers;
};
