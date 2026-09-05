-- ডাটাবেজ তৈরি ও সিলেক্ট করা
CREATE DATABASE IF NOT EXISTS campusconnect;
USE campusconnect;

-- ১. মূল ইউজার টেবিল (স্ট্যাটাস এবং রোলসহ - ব্যান করার অপশনের জন্য status ফিল্ড যোগ করা হয়েছে)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'alumni', 'club_lead') DEFAULT 'student',
    status ENUM('pending', 'active', 'banned') DEFAULT 'pending', -- ডিফল্ট পেন্ডিং থাকবে, এডমিন এক্সেপ্ট করলে একটিভ হবে
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;




-- ২. স্টুডেন্ট প্রোফাইল টেবিল
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    batch VARCHAR(50) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    profile_pic VARCHAR(255) NULL,
    student_id_card VARCHAR(255) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
ALTER TABLE student_profiles ADD COLUMN linkedin VARCHAR(255) NULL;
ALTER TABLE student_profiles ADD COLUMN bio TEXT NULL;
select * from student_profiles;





-- ৩. ক্লাব টেবিল (Club Lead Role)
CREATE TABLE IF NOT EXISTS clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(100) NOT NULL,
    lead_user_id INT NOT NULL,
    description TEXT,
    FOREIGN KEY (lead_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ৪. অ্যালুনি প্রোফাইল টেবিল
CREATE TABLE IF NOT EXISTS alumni_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    passing_year INT NOT NULL,
    current_job_title VARCHAR(150),
    company VARCHAR(150),
    linkedin_url VARCHAR(255),
    alumni_id_card VARCHAR(255) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
ALTER TABLE alumni_profiles ADD COLUMN profile_pic VARCHAR(255) NULL;

-- ৫. এডমিন লগ টেবিল
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_performed TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ৬. পেমেন্ট টেবিল
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);




-- ৭. নোটস এবং কোয়েশ্চেন শেয়ারিং টেবিল (রিকোয়ারমেন্ট ১: এডমিন বা ইউজার রিসোর্স ডিলিট এবং স্ট্যাটাস ট্র্যাক করার জন্য)
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    note_type ENUM('notes', 'question') NOT NULL DEFAULT 'notes',
    file_path VARCHAR(255) NOT NULL,
    description TEXT,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_ratings INT DEFAULT 0,
    status ENUM('active', 'deleted_by_user', 'deleted_by_admin') DEFAULT 'active', -- রিসোর্স বা নোট স্ট্যাটাস
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
select * from notes;
USE campusconnect;

-- notes টেবিলের note_type এবং status কলামকে VARCHAR বা সঠিক ENUM এ রূপান্তর করা
ALTER TABLE notes MODIFY COLUMN note_type VARCHAR(50) NOT NULL DEFAULT 'NOTES';
ALTER TABLE notes MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending';

-- notes টেবিলের status এ 'pending' যুক্ত করা
ALTER TABLE notes MODIFY COLUMN status ENUM('pending', 'active', 'deleted_by_user', 'deleted_by_admin') DEFAULT 'pending';

-- ৮. নোট রেটিং টেবিল
CREATE TABLE IF NOT EXISTS note_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_note_rating (note_id, user_id)
);

-- ৯. ক্লাব ইভেন্ট টেবিল (রিকোয়ারমেন্ট ৫: ক্লাব লিডার ইভেন্ট ডিলিট করতে পারবে)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    event_title VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    seat_limit INT NOT NULL DEFAULT 50,
    registration_fee DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE, -- ইভেন্ট ডিলিট বা ডিঅ্যাক্টিভেট করার জন্য
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

-- ১০. ইভেন্ট রেজিস্ট্রেশন টেবিল (রিকোয়ারমেন্ট ৬: CSV ডাউনলোড করার জন্য নাম, আইডি, ডিপার্টমেন্ট ও পেমেন্ট মেথড ট্র্যাক করবে)
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_type ENUM('free', 'paid') DEFAULT 'free',
    payment_status ENUM('pending', 'approved', 'free') DEFAULT 'free',
    transaction_id VARCHAR(100) NULL,
    payment_method VARCHAR(50) NULL, -- পেমেন্ট মেথড যুক্ত করা হয়েছে (যেমন: bKash, Nagad)
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_user (event_id, user_id)
);

-- ১১. অ্যালুনি জব পোস্ট টেবিল (রিকোয়ারমেন্ট ২: অ্যালুনি পোস্ট করলে এডমিনের কাছে পেন্ডিং যাবে, এডমিন অ্যাপ্রুভ করলে লাইভ হবে)
CREATE TABLE IF NOT EXISTS job_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_user_id INT NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type ENUM('full_time', 'part_time', 'internship', 'contract') DEFAULT 'full_time',
    description TEXT NOT NULL,
    application_link VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending', -- এডমিন অ্যাপ্রুভালের জন্য
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ১২. জব অ্যাপ্লিকেশন টেবিল
CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    resume_path VARCHAR(255) NOT NULL,
    cover_letter TEXT NULL,
    status ENUM('pending', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_job_user_application (job_id, user_id)
);

-- ১৩. স্টুডেন্ট ও অ্যালুনি মিটিং স্লট রিকোয়েস্ট টেবিল (রিকোয়ারমেন্ট ৩ ও ৪)
CREATE TABLE IF NOT EXISTS alumni_mentorship_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL, -- যে স্টুডেন্ট রিকোয়েস্ট পাঠিয়েছে (users.id)
    alumni_id INT NOT NULL, -- যে অ্যালুনিকে রিকোয়েস্ট পাঠানো হয়েছে (users.id)
    preferred_date DATE NOT NULL,
    message TEXT NULL, -- স্লট বা মিটিংয়ের বিষয়বস্তু নিয়ে বার্তা
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending', -- অ্যালুনি এক্সেপ্ট করলে accepted দেখাবে
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (alumni_id) REFERENCES users(id) ON DELETE CASCADE
);


