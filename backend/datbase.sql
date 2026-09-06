-- ==========================================================
-- ১. ডেটাবেজ তৈরি ও সিলেক্ট করা
-- ==========================================================
CREATE DATABASE IF NOT EXISTS campusconnect;
USE campusconnect;

-- ফরেন কি চেক সাময়িকভাবে বন্ধ রাখা যাতে টেবিল ড্রপ করার সময় কোনো কনস্ট্রেইন্ট এরর না দেয়
SET FOREIGN_KEY_CHECKS = 0;

-- পুরনো টেবিলগুলো ড্রপ করে ফ্রেশভাবে স্কিমা তৈরির ব্যবস্থা
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS note_ratings;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS admin_logs;
DROP TABLE IF EXISTS alumni_profiles;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS clubs;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS job_posts;
DROP TABLE IF EXISTS alumni_mentorship_requests;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;


-- ==========================================================
-- ২. মূল ইউজার টেবিল
-- ==========================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'alumni', 'club_lead') DEFAULT 'student',
    status ENUM('pending', 'active', 'banned') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================================
-- ৩. স্টুডেন্ট প্রোফাইল টেবিল
-- ==========================================================
CREATE TABLE student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    batch VARCHAR(50) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    profile_pic VARCHAR(255) NULL,
    student_id_card VARCHAR(255) NULL,
    linkedin VARCHAR(255) NULL,
    bio TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================================
-- ৪. ক্লাব টেবিল (Club Lead Role)
-- ==========================================================
CREATE TABLE clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(100) NOT NULL,
    lead_user_id INT NOT NULL,
    description TEXT,
    FOREIGN KEY (lead_user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================================
-- ৫. অ্যালুনি প্রোফাইল টেবিল
-- ==========================================================
CREATE TABLE alumni_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    passing_year INT NOT NULL,
    current_job_title VARCHAR(150),
    company VARCHAR(150),
    linkedin_url VARCHAR(255),
    alumni_id_card VARCHAR(255) NULL,
    profile_pic VARCHAR(255) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================================
-- ৬. এডমিন লগ টেবিল
-- ==========================================================
CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_performed TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================================
-- ৭. পেমেন্ট টেবিল
-- ==========================================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'FREE') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================================
-- ৮. নোটস এবং কোয়েশ্চেন শেয়ারিং টেবিল (VARCHAR ব্যবহার করা হয়েছে যাতে কেস সেন্সিটিভিটি এরর না আসে)
-- ==========================================================
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    note_type VARCHAR(50) NOT NULL DEFAULT 'notes',
    file_path VARCHAR(255) NOT NULL,
    description TEXT,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_ratings INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================================
-- ৯. নোট রেটিং টেবিল
-- ==========================================================
CREATE TABLE note_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_note_rating (note_id, user_id)
);


-- ==========================================================
-- ১০. ক্লাব ইভেন্ট টেবিল
-- ==========================================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    event_title VARCHAR(150) NOT NULL,
    venue VARCHAR(150) NULL,
    event_date DATE NOT NULL,
    start_time VARCHAR(50) NULL,
    deadline DATE NULL,
    seat_limit INT NOT NULL DEFAULT 50,
    registration_fee DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT,
    banner_url VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);


-- ==========================================================
-- ১১. ইভেন্ট রেজিস্ট্রেশন টেবিল
-- ==========================================================
CREATE TABLE event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    payment_id INT NULL,
    ticket_number VARCHAR(50) UNIQUE NULL,
    attendance_status ENUM('Not Checked In', 'Checked In') DEFAULT 'Not Checked In',
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    registration_type ENUM('free', 'paid') DEFAULT 'free',
    payment_status ENUM('pending', 'approved', 'free') DEFAULT 'free',
    transaction_id VARCHAR(100) NULL,
    payment_method VARCHAR(50) NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    UNIQUE KEY unique_event_user (event_id, user_id)
);


-- ==========================================================
-- ১২. অ্যালুনি জব পোস্ট টেবিল
-- ==========================================================
CREATE TABLE job_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_user_id INT NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type ENUM('full_time', 'part_time', 'internship', 'contract') DEFAULT 'full_time',
    description TEXT NOT NULL,
    application_link VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================================
-- ১৩. জব অ্যাপ্লিকেশন টেবিল
-- ==========================================================
CREATE TABLE job_applications (
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


-- ==========================================================
-- ১৪. স্টুডেন্ট ও অ্যালুনি মিটিং স্লট রিকোয়েস্ট টেবিল
-- ==========================================================
CREATE TABLE alumni_mentorship_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    alumni_id INT NOT NULL,
    preferred_date DATE NOT NULL,
    message TEXT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (alumni_id) REFERENCES users(id) ON DELETE CASCADE
);