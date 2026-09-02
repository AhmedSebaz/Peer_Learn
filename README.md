# *CampusConnect - Campus Collaboration & Resource Platform*

CampusConnect is a dynamic, module-based web application designed to bridge the gap between Students, Alumni, Club Leads, and System Administrators. It facilitates resource sharing, event ticketing, career opportunities, and administrative oversight within a centralized campus ecosystem.


# *Key Features & Modules*

# Admin Dashboard
* User & Role Management: Manage registered users and handle role-based administrative actions.
* ID Verification Queue: Review and approve pending student/alumni identity verifications.
* Job Approval Queue: Moderation panel for approving job/internship postings submitted by Alumni.
* Content Moderation: Monitor, flag, or remove platform posts and comments violating campus guidelines.

# Student Portal
* Academic Resources: Access and share course materials, notes, and study guides.
* Career Portal & Mentorship: Browse verified job openings and book 1 on 1 mentorship slots with Alumni.
* Event Tickets: Discover upcoming campus events, reserve tickets, and manage passes.

# Alumni Network
* Job Board: Post internships and career opportunities for current students.
* Slot Manager & Mentorship: Define available time slots to offer career guidance and mock interviews.

# Club Lead Portal
* Event Calendar: Interactive calendar for planning, scheduling, and managing campus events.
* Ticket Oversight: Monitor registrations and handle ticketing logistics for club activities.



## *Tech Stack*

* Frontend Framework: React.js (v18+)
* Build Tool: Vite
* Styling: Tailwind CSS
* Version Control: Git & GitHub



##  *Project Structure*

```text
Peer_Learn/
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── admin/            
│   │   │   ├── alumni/            
│   │   │   ├── club_lead/        
│   │   │   └── student/           
│   │   ├── pages/                 # Auth Components (Login, Register)
│   │   ├── App.jsx                # Application Routes & Setup
│   │   ├── main.jsx               # React Entry Point
│   │   └── index.css              # Global & Tailwind Styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md


## *Installation & Execution*

# Prerequisites
   Ensure you have Node.js (v16.0 or higher) and npm installed.

1. Clone the repository:
   git clone [https://github.com/AhmedSebaz/Peer_Learn.git](https://github.com/AhmedSebaz/Peer_Learn.git)

2. Navigate to the frontend directory:
   cd Peer_Learn/frontend

3. Install dependencies:
   npm install

4. Start the Vite local development server:
   npm run dev

5. Open in browser:
   Navigate to http://localhost:5173/ to view the application.


## *Contributors*

Sabbir Hossain - 
Istiack Ahmed -
Sadman Ahmed Sebaz -
Arafat Aziz -
