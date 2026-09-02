-- ডাটাবেজ তৈরি ও সিলেক্ট করা
CREATE DATABASE IF NOT EXISTS campusconnect;
USE campusconnect;

-- ১. মূল ইউজার টেবিল (সকল রোলের জন্য কমন)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'alumni', 'club_lead') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ২. স্টুডেন্ট প্রোফাইল টেবিল (প্রোফাইল পিক এবং স্টুডেন্ট আইডি কার্ডসহ)
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    batch VARCHAR(50) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    profile_pic VARCHAR(255) NULL,
    student_id_card VARCHAR(255) NULL, -- স্টুডেন্ট আইডি কার্ডের ছবি বা ফাইলের পাথ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ৩. ক্লাব টেবিল (Club Lead Role)
CREATE TABLE IF NOT EXISTS clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(100) NOT NULL,
    lead_user_id INT NOT NULL,
    description TEXT,
    FOREIGN KEY (lead_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ৪. অ্যালুনি প্রোফাইল টেবিল (অ্যালুনি আইডি কার্ড/সার্টিফিকেটসহ)
CREATE TABLE IF NOT EXISTS alumni_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    passing_year INT NOT NULL,
    current_job_title VARCHAR(150),
    company VARCHAR(150),
    linkedin_url VARCHAR(255),
    alumni_id_card VARCHAR(255) NULL, -- অ্যালুনি আইডি কার্ড বা পুরনো স্টুডেন্ট প্রুফ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ৫. এডমিন লগ টেবিল (Admin Role)
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_performed TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ৬. পেমেন্ট টেবিল (স্টুডেন্ট ফি/পেমেন্ট ট্র্যাকিং)
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

-- ৭. নোটস এবং কোয়েশ্চেন শেয়ারিং টেবিল
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

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

-- ৯. ক্লাব ইভেন্ট টেবিল (সিট লিমিট এবং ফি সহ)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    event_title VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    seat_limit INT NOT NULL DEFAULT 50,
    registration_fee DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

-- ১০. ইভেন্ট রেজিস্ট্রেশন টেবিল (পেইড/ফ্রি এবং পেমেন্ট স্ট্যাটাস সহ)
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_type ENUM('free', 'paid') DEFAULT 'free',
    payment_status ENUM('pending', 'approved', 'free') DEFAULT 'free',
    transaction_id VARCHAR(100) NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_user (event_id, user_id)
);

-- ১১. অ্যালুনি জব পোস্ট টেবিল
CREATE TABLE IF NOT EXISTS job_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_user_id INT NOT NULL, -- যে অ্যালুনি জব পোস্ট করেছে (users.id)
    job_title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL, -- যেমন: Dhaka, Remote ইত্যাদি
    job_type ENUM('full_time', 'part_time', 'internship', 'contract') DEFAULT 'full_time',
    description TEXT NOT NULL,
    application_link VARCHAR(255) NOT NULL, -- অ্যাপ্লাই করার লিংক বা ইমেল
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ১২. জব অ্যাপ্লিকেশন টেবিল (স্টুডেন্ট বা প্রার্থীরা জবে এপ্লাই করার জন্য)
CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL, -- কোন জবে এপ্লাই করা হয়েছে (job_posts.id)
    user_id INT NOT NULL, -- যে আবেদন করেছে (users.id)
    resume_path VARCHAR(255) NOT NULL, -- আপলোড করা সিভির ফাইল পাথ বা লিংক
    cover_letter TEXT NULL, -- কাভার লেটার বা সংক্ষিপ্ত বার্তা
    status ENUM('pending', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_job_user_application (job_id, user_id) -- একজন ইউজার একটি জবে একবারই এপ্লাই করতে পারবে
);