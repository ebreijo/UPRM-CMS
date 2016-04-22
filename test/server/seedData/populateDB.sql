INSERT INTO about_us (vision, mission_desc, policies_desc, requirements_desc)
VALUES ('Serve as liaison between students and businesses while providing the best and most effective service to all.',
'Provide students the necessary tools that will help achieve an effective job search, while maintaining lines of communication with businesses and the College community.',
'The following, apply to all students, seniors, graduate and alumni that request our services:',
'The following, apply to all students, seniors, graduate and alumni that request our services:');

INSERT INTO administrator_access (email, is_root, admin_account_status)
VALUES ('placement@uprm.edu', 1, 'active');

INSERT INTO administrator_access (email, is_root, admin_account_status)
VALUES ('juan.rodriguez@upr.edu', 0, 'active');

INSERT INTO administrator_access (email, is_root, admin_account_status)
VALUES ('pedro.rivera@upr.edu', 0, 'pending');

INSERT INTO administrator_access (email, is_root, admin_account_status)
VALUES ('maria.hernandez@upr.edu', 0, 'inactive');

INSERT INTO administrator (email, password, first_name, last_name)
VALUES ('placement@uprm.edu', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'Placement', 'Office');

INSERT INTO administrator (email, password, first_name, last_name)
VALUES ('juan.rodriguez@upr.edu', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'Juan', 'Rodriguez');

INSERT INTO administrator (email, password, first_name, last_name)
VALUES ('maria.hernandez@upr.edu', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'Maria', 'Hernandez');

INSERT INTO company (name, website_url, company_description, company_status)
VALUES ('IBM', 'http://www.ibm.com/us-en/', 'This is IBM', 'active');

INSERT INTO company (name, website_url, company_description, company_status)
VALUES ('Apple', 'http://www.apple.com/', 'This is Apple', 'active');

INSERT INTO company (name, website_url, company_description)
VALUES ('Google', 'https://www.google.com/', 'This is Google');

INSERT INTO company (name, website_url, company_description, company_status)
VALUES ('EVERTEC', 'https://www.evertecinc.com/', 'This is EVERTEC', 'inactive');

INSERT INTO company_location (company_name, street_address, city, state, country, zip_code)
VALUES ('IBM', '3039 E Cornwallis Road', 'Durham', 'NC', 'United States', '27709');

INSERT INTO company_location (company_name, street_address, city, state, country, zip_code)
VALUES ('IBM', '1 New Orchard Road', 'Armonk', 'NY', 'United States', '10504');

INSERT INTO company_location (company_name, street_address, city, state, country, zip_code)
VALUES ('Apple', '1 Infinite Loop', 'Cupertino', 'CA', 'United States', '95014');

INSERT INTO company_location (company_name, street_address, city, state, country, zip_code)
VALUES ('Google', '1600 Amphitheatre Parkway', 'Mountain View', 'CA', 'United States', '94043');

INSERT INTO company_location (company_name, street_address, city, country, zip_code)
VALUES ('EVERTEC', 'Carr. #176 k.m. 1.3 Cupey Bajo', 'San Juan', 'Puerto Rico', '00926');

INSERT INTO company_services (service)
VALUES ('Announce any job offers (part time, summer and permanent)');

INSERT INTO company_services (service)
VALUES ('Collect and send resumes of students and alumni');

INSERT INTO company_services (service)
VALUES ('Coordinate on-campus interviews');

INSERT INTO company_services (service)
VALUES ('Organize the Annual Job Fair');

INSERT INTO company_services (service)
VALUES ('Organize information sessions');

INSERT INTO company_services (service)
VALUES ('Coordinate meetings with faculty and student organizations');

INSERT INTO company_services (service)
VALUES ('We refer resumes of recent graduates with minimum experience.');

INSERT INTO home_page_photos (file_label, file_path)
VALUES ('photo1', 'media/landing/slide-1.jpg');

INSERT INTO home_page_photos (file_label, file_path)
VALUES ('photo2', 'media/landing/slide-2.jpg');

INSERT INTO home_page_photos (file_label, file_path)
VALUES ('photo3', 'media/landing/slide-3.jpg');

INSERT INTO home_page_photos (file_label, file_path)
VALUES ('photo4', 'media/landing/slide-3.jpg');

INSERT INTO home_page_photos (file_label, file_path)
VALUES ('photo5', 'media/landing/slide-3.jpg');

INSERT INTO job_fair_company_information (company_name, min_gpa, extra_information, collecting_resumes_before_job_fair, must_fill_online, interviews_during_weekend, attending, website_application)
VALUES ('IBM', '3.30', 'This is a company attending the Job Fair', '1', '0', '1', '1', 'http://www-03.ibm.com/employment/us/');

INSERT INTO job_fair_company_information (company_name, min_gpa, extra_information, collecting_resumes_before_job_fair, must_fill_online, interviews_during_weekend, attending, website_application)
VALUES ('Apple', '3.40', 'This is Apple attending the Job Fair', '1', '0', '1', '1', 'http://www.apple.com/jobs/us/');

INSERT INTO job_fair_company_looking_for (company_name, job_position, status)
VALUES ('IBM', 'Internship', '1');

INSERT INTO job_fair_company_looking_for (company_name, job_position, status)
VALUES ('IBM', 'Full-Time', '1');

INSERT INTO job_fair_company_looking_for (company_name, job_position, status)
VALUES ('IBM', 'Part-Time', '0');

INSERT INTO job_fair_company_looking_for (company_name, job_position, status)
VALUES ('Apple', 'Internship', '1');

INSERT INTO job_fair_company_looking_for (company_name, job_position, status)
VALUES ('Apple', 'Full-Time', '1');

INSERT INTO job_fair_dates (header_en, location_en, date_en, time, header_es, location_es, date_es, resume_deadline_date, show_resume_deadline_date)
VALUES ('8th Spring Job Fair', 'Mayaguez Resort & Casino', 'Friday, February 19, 2016', '8:30am - 2:30pm', '8va Feria de Empleo de Primavera', 'Hotel Mayaguez Resort & Casino', 'viernes, 19 de febrero de 2016', '2016-02-19', '1');

INSERT INTO recruiter (email, password, company_name, first_name, last_name, phone_number, account_status, company_location)
VALUES ('sergio@ibm.com', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'IBM', 'Sergio', 'Rivera', '787-555-5555', 'active', '1');

INSERT INTO recruiter (email, password, company_name, first_name, last_name, phone_number, account_status, company_location)
VALUES ('leonardo@ibm.com', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'IBM', 'Leonardo', 'Dicaprio', '787-555-5555', 'active', '2');

INSERT INTO recruiter (email, password, company_name, first_name, last_name, phone_number, account_status, company_location)
VALUES ('pending@ibm.com', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'IBM', 'Pending', 'Pending', '787-555-5555', 'pending', '2');

INSERT INTO recruiter (email, password, company_name, first_name, last_name, phone_number, company_location)
VALUES ('juanito@gmail.com', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'Google', 'Juanito', 'Perez', '787-555-5555', '4');

INSERT INTO recruiter (email, password, company_name, first_name, last_name, phone_number, account_status, company_location)
VALUES ('diana@gmail.com', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'Google', 'Diana', 'Diaz', '787-555-5555', 'active', '4');

INSERT INTO recruiter (email, password, company_name, first_name, last_name, phone_number, account_status, company_location)
VALUES ('pancho@evertec.com', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'EVERTEC', 'Pancho', 'Rivera', '787-555-5555', 'inactive', '5');

INSERT INTO recruiter (email, password, company_name, first_name, last_name, phone_number, account_status, company_location)
VALUES ('celia@evertec.com', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'EVERTEC', 'Celia', 'Santiago', '787-555-5555', 'active', '5');

INSERT INTO recruiter (email, password, company_name, first_name, last_name, phone_number, account_status, company_location)
VALUES ('pepe@apple.com', '$2a$08$FSYCTTU7tqmyPx3JuVW5De/a3S0b0N5G7tUedxmZyV6fGyxo42r1a', 'Apple', 'Pepe', 'Tembleque', '787-555-5555', 'active', '3');

INSERT INTO job_offer (company_name, title, description, job_position, education_level, recent_graduate, expiration_date, job_offer_status, creation_date, recruiter_email, location)
VALUES ('IBM', 'New Job Offer', 'This is a job offer', 'Full-Time', 'Bachelors', '1', '2030-07-22 12:12:12', 'approved', '2016-02-22 12:12:12', 'sergio@ibm.com', 'Durham, NC');

INSERT INTO job_offer (company_name, title, description, job_position, education_level, recent_graduate, expiration_date, creation_date, recruiter_email, location)
VALUES ('IBM', 'Different Job Offer', 'This is a job offer which is different', 'CO-OP', 'Bachelors', '0', '2030-07-22 12:12:12', '2016-02-22 12:12:12', 'sergio@ibm.com', 'Durham, NC');

INSERT INTO job_offer (company_name, title, description, job_position, education_level, recent_graduate, expiration_date, job_offer_status, creation_date, recruiter_email, location)
VALUES ('IBM', 'Another different Job Offer', 'This is a job offer which is different from all the job offers', 'Internship', 'Bachelors', '0', '2030-07-22 12:12:12', 'rejected', '2016-02-22 12:12:12', 'sergio@ibm.com', 'Durham, NC');

INSERT INTO job_offer (company_name, title, description, job_position, education_level, recent_graduate, expiration_date, job_offer_status, creation_date, recruiter_email, location)
VALUES ('Apple', 'Apple Job Offer', 'This is a job offer', 'Full-Time', 'Bachelors', '1', '2030-07-22 12:12:12', 'approved', '2016-02-22 12:12:12', 'pepe@apple.com', 'Cupertino, CA');

INSERT INTO job_offer (company_name, title, description, job_position, education_level, recent_graduate, expiration_date, job_offer_status, creation_date, recruiter_email, location)
VALUES ('Apple', 'Apple Different Job Offer', 'This is a job offer', 'Part-Time', 'Bachelors', '1', '2030-07-22 12:12:12', 'approved', '2016-02-22 12:12:12', 'pepe@apple.com', 'Cupertino, CA');

INSERT INTO major (major_code, name_english, name_spanish)
VALUES ('ICOM', 'Computer Engineering', 'Ingenieria en Computadoras');

INSERT INTO major (major_code, name_english, name_spanish)
VALUES ('CCOM', 'Computer Science', 'Ciencias de Computos');

INSERT INTO major (major_code, name_english, name_spanish)
VALUES ('INSO', 'Software Engineering', 'Ingenieria de Software');

INSERT INTO major (major_code, name_english, name_spanish)
VALUES ('INME', 'Mechanical Engineering', 'Ingenieria Mecanica');

INSERT INTO major (major_code, name_english, name_spanish)
VALUES ('ININ', 'Industrial Engineering', 'Ingenieria Industrial');

INSERT INTO major (major_code, name_english, name_spanish)
VALUES ('INGL', 'English', 'Ingles');

INSERT INTO major (major_code, name_english, name_spanish)
VALUES ('ESPA', 'Spanish', 'Español');

INSERT INTO major (major_code, name_english, name_spanish)
VALUES ('MATE', 'Mathematics', 'Matematicas');

INSERT INTO company_interested_majors (company_name, major_code)
VALUES ('IBM', 'ICOM');

INSERT INTO company_interested_majors (company_name, major_code)
VALUES ('IBM', 'CCOM');

INSERT INTO company_interested_majors (company_name, major_code)
VALUES ('IBM', 'INSO');

INSERT INTO company_interested_majors (company_name, major_code)
VALUES ('Apple', 'ICOM');

INSERT INTO company_interested_majors (company_name, major_code)
VALUES ('Apple', 'CCOM');

INSERT INTO our_staff (name, position)
VALUES ('Sra. Nancy Nieves Arán', 'Director');

INSERT INTO our_staff (name, position)
VALUES ('Srta. Margarita Carlo Cuebas', 'Employment Interviewer');

INSERT INTO our_staff (name, position)
VALUES ('Sr. William Pacheco', 'Employment Interviewer');

INSERT INTO our_staff (name, position)
VALUES ('Sra. Eva E. Troche Morales', 'Administrative Secretary');

INSERT INTO policies (policy)
VALUES ('Register at the Placement Office with any member of the staff.');

INSERT INTO policies (policy)
VALUES ('Clear through any staff member, if you miss an interview. Any student who fails in this aspect for a second time will not be allowed future interviews. Remember your actions will reflect on your peers.');

INSERT INTO policies (policy)
VALUES ('Every student must sign up for an interview on their spare time. The Placement Office will not provide excuse letters for missing classes on account of an interview.');

INSERT INTO policies (policy)
VALUES ('There is no limit to the number of interviews a student can have. However, once a student has accepted a job offer, he or she must stop interviewing.');

INSERT INTO policies (policy)
VALUES ('Students that accept a job offer should notify the Placement Office.');

INSERT INTO promotional_material (company_name, title, file_path, expiration_date, status)
VALUES ('IBM', 'Promotion1', '/lib/promotionalMaterial', '2030-07-22 12:12:12', 'approved');

INSERT INTO promotional_material (company_name, title, file_path, expiration_date)
VALUES ('IBM', 'Promotion2', '/lib/promotionalMaterial', '2030-08-01 12:12:12');

INSERT INTO promotional_material (company_name, title, file_path, expiration_date, status)
VALUES ('IBM', 'Promotion3', '/lib/promotionalMaterial', '2016-11-30 12:12:12', 'rejected');

INSERT INTO promotional_material (company_name, title, file_path, expiration_date, status)
VALUES ('Apple', 'Promotion4', '/lib/promotionalMaterial', '2030-07-22 12:12:12', 'approved');

INSERT INTO public_documents (file_label, file_path)
VALUES ('Job Fair Dress Code', '/lib/documents');

INSERT INTO public_documents (file_label, file_path)
VALUES ('Resume Template', '/lib/documents');

INSERT INTO public_documents (file_label, file_path)
VALUES ('8th Job Fair', '/lib/documents');

INSERT INTO public_documents (file_label, file_path)
VALUES ('Interview Tips', '/lib/documents');

INSERT INTO requirements (requirement)
VALUES ('Five or more copies of your resume (preferably in English).');

INSERT INTO requirements (requirement)
VALUES ('Copy of your course program.');

INSERT INTO requirements (requirement)
VALUES ('Transcript (preferably in English).');

INSERT INTO requirements (requirement)
VALUES ('Fill out student evaluation form');

INSERT INTO requirements (requirement)
VALUES ('2x2 photograph (optional).');

INSERT INTO requirements (requirement)
VALUES ('Every student is responsible for maintaining his/her file updated and with enough copies at the Placement Office.');

INSERT INTO student_services (service)
VALUES ('Register students and alumni, creating records for our files.');

INSERT INTO student_services (service)
VALUES ('Assist students and alumni explore the job market.');

INSERT INTO student_services (service)
VALUES ('Help with the correction of resumes.');

INSERT INTO student_services (service)
VALUES ('Offer talks to groups of students on resume writing, interviews, job search, etc.');

INSERT INTO student_services (service)
VALUES ('Coordinate on campus interviews.');

INSERT INTO student_services (service)
VALUES ('Refer resumes to companies and or agencies.');

INSERT INTO student_services (service)
VALUES ('Announce job opportunities (part-time, summer and permanent).');

INSERT INTO student_services (service)
VALUES ('Keep a list of companies and agencies with their addresses.');

INSERT INTO student_services (service)
VALUES ('Coordinate meetings between student organizations and companies.');

INSERT INTO student_services (service)
VALUES ('Prepare salary statistics.');

INSERT INTO student_services (service)
VALUES ('Prepare annual employment statistics.');

INSERT INTO student_services (service)
VALUES ('Organize Annual Job Fair.');

INSERT INTO student_services (service)
VALUES ('Work with student organizations.');

INSERT INTO temporary_contact (email, company_name, first_name, last_name, phone_number)
VALUES ('chencho@gmail.com', 'Google', 'Chencho', 'Ramos', '787-555-5555');

