import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineEmail, MdBookmarkBorder } from "react-icons/md";
// import { courseData } from "./courseData";

const tabs = ["Overview", "Syllabus", "Materials"];
const courseData = [
    {
        _id: "C001",
        courseCode: "CS301",
        courseName: "Data Structures & Algorithms",
        semester: 3,
        credits: 4,
        department: "Computer Science",
        imageUrl:
            "https://imgs.search.brave.com/dTxGBozwyZ7jNx_r5RGItFi5DCBxyneXT4tKGi3ynkk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE3LzgyLzY4LzIx/LzM2MF9GXzE3ODI2/ODIxMDBfOEtkZzRs/bEVxbFk4aVk4c2Vn/bmFmV1Aza0FRd1pi/T1cuanBn",
        description:
            "This course builds a strong foundation in data structures and algorithmic thinking. You will study arrays, strings, linked lists, stacks, queues, trees, heaps, and graphs, and learn how to choose the right structure for a problem. The course emphasizes algorithm analysis, time and space complexity, and real-world tradeoffs. Through labs and problem sets, you will implement classic algorithms such as sorting, searching, and traversals, and practice writing clean, efficient code. By the end, you will be able to design optimized solutions and reason about performance for a wide range of problems.",
        faculty: {
            facultyId: "F101",
            name: "Dr. Rahul Sharma",
            title: "Professor of Computer Science",
            email: "rahul.sharma@college.edu",
        },
        academicYear: "2025-26",
        division: "A",
        courseType: "Theory",
        status: "Active",
        enrolledStudents: 58,
        enrollmentLimit: 60,
        syllabusUnits: 5,
        modulesCompleted: 6,
        modulesTotal: 14,
        progress: 68,
        attendance: {
            totalLectures: 28,
            present: 24,
            percentage: 85.71,
        },
        assignments: {
            total: 5,
            submitted: 4,
            pending: 1,
        },
        internalMarks: {
            midTerm: 18,
            assignment: 12,
            attendance: 8,
            total: 38,
            outOf: 50,
        },
        announcementsCount: 3,
        upcomingSession: {
            title: "Binary Search Trees",
            time: "Tomorrow at 10:00 AM",
            room: "Room 302",
        },
        syllabus: [
            "Arrays & Strings",
            "Linked Lists",
            "Stacks & Queues",
            "Trees & BST",
            "Graphs & Traversals",
            "Sorting & Searching",
        ],
        materials: [
            "Lecture Slides - Week 1",
            "DSA Handbook (PDF)",
            "Practice Sheet - Arrays",
            "Lab Guide - Trees",
        ],
        moduleProgress: [
            { title: "Arrays & Strings", completed: true, percent: 100 },
            { title: "Linked Lists", completed: true, percent: 100 },
            { title: "Stacks & Queues", completed: true, percent: 90 },
            { title: "Trees & BST", completed: false, percent: 55 },
            { title: "Graphs & Traversals", completed: false, percent: 30 },
        ],
        syllabusUnitsDetailed: [
            {
                id: "01",
                title: "Introduction to Data Structures",
                topicsCount: 4,
                hours: 6,
                status: "Completed",
                topics: [
                    { title: "What are Data Structures?", done: true },
                    { title: "Abstract Data Types (ADT)", done: true },
                    { title: "Time & Space Complexity", done: true },
                    { title: "Big O Notation", done: true },
                ],
            },
            {
                id: "02",
                title: "Arrays & Linked Lists",
                topicsCount: 5,
                hours: 8,
                status: "Completed",
                topics: [
                    { title: "Array Operations", done: true },
                    { title: "Array Applications", done: true },
                    { title: "Linked List Basics", done: true },
                    { title: "Singly & Doubly Lists", done: true },
                    { title: "Linked List Practice", done: true },
                ],
            },
            {
                id: "03",
                title: "Stacks & Queues",
                topicsCount: 4,
                hours: 8,
                status: "In Progress",
                topics: [
                    { title: "Stack Operations", done: true },
                    { title: "Queue Operations", done: false },
                    { title: "Circular Queue", done: false },
                    { title: "Deque", done: false },
                ],
            },
            {
                id: "04",
                title: "Trees & Binary Search Trees",
                topicsCount: 5,
                hours: 10,
                status: "Upcoming",
                topics: [
                    { title: "Tree Terminology & Types", done: false },
                    { title: "Binary Trees", done: false },
                    { title: "Binary Search Trees", done: false },
                    { title: "Tree Traversals", done: false },
                    { title: "Balanced Trees (AVL, Red-Black)", done: false },
                ],
            },
        ],
        upcomingDeadlines: [
            {
                title: "Assignment 6: Binary Search Trees",
                dueIn: "Due in 3 days",
                actionLabel: "Start Now",
            },
        ],
        materialsDetailed: [
            {
                id: "mat-1",
                type: "Assignment",
                title: "Assignment 6: Binary Search Tree Implementation",
                meta: "Unit 4 • Posted: Jan 15, 2025 • Max Score: 100",
                badge: "Due in 3 days",
                providedBy: "Dr. Rahul Sharma",
                actions: ["View Details", "Start Assignment"],
                accent: "warning",
            },
            {
                id: "mat-2",
                type: "Video",
                title: "Lecture 14: Introduction to Stacks",
                meta: "Unit 3 • Posted: Jan 18, 2025",
                badge: "45 min",
                providedBy: "Dr. Rahul Sharma",
                actions: ["Watch"],
                accent: "primary",
            },
            {
                id: "mat-3",
                type: "PDF",
                title: "Stack Operations & Applications - Notes",
                meta: "Unit 3 • Posted: Jan 17, 2025",
                badge: "2.4 MB",
                providedBy: "Dr. Rahul Sharma",
                actions: ["View", "Download"],
                accent: "info",
            },
            {
                id: "mat-5",
                type: "PDF",
                title: "Lecture Notes: Graph Traversal",
                meta: "Unit 5 • Posted: Jan 20, 2025",
                badge: "1.8 MB",
                providedBy: "Dr. Rahul Sharma",
                actions: ["View", "Download"],
                accent: "info",
            },
            {
                id: "mat-4",
                type: "PDF",
                title: "Lecture 12: Trees & BST - Slides",
                meta: "Unit 4 • Posted: Jan 10, 2025",
                badge: "3.1 MB",
                providedBy: "Dr. Rahul Sharma",
                actions: ["View", "Download"],
                accent: "info",
            },
        ],
        pendingAssignmentsCount: 3,
    },
    {
        _id: "C002",
        courseCode: "CS302",
        courseName: "Database Management Systems",
        semester: 3,
        credits: 3,
        department: "Computer Science",
        imageUrl:
            "https://imgs.search.brave.com/-VtXZeACJfG1YbEoyRDgHgEij3u96O-_uBppt0jv5m4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE3LzQ1LzE4Lzcy/LzM2MF9GXzE3NDUx/ODcyOTVfTWcySk1q/UTdHWjg0MHZSRDhO/ZkRnVVhZakZiSTln/d1kuanBn",
        description:
            "This course introduces the principles of database design and management for real-world applications. You will learn ER modeling, relational algebra, SQL queries, normalization, indexing, and transaction management. The course also covers concurrency control, recovery, and database performance tuning. Through hands-on labs, you will design schemas, write complex queries, and analyze how data is stored and retrieved efficiently. By the end, you will be able to build reliable relational databases and optimize them for performance and integrity.",
        faculty: {
            facultyId: "F102",
            name: "Prof. Neha Verma",
            title: "Associate Professor",
            email: "neha.verma@college.edu",
        },
        academicYear: "2025-26",
        division: "A",
        courseType: "Theory",
        status: "Active",
        enrolledStudents: 56,
        enrollmentLimit: 60,
        syllabusUnits: 4,
        modulesCompleted: 5,
        modulesTotal: 12,
        progress: 54,
        attendance: {
            totalLectures: 24,
            present: 20,
            percentage: 83.33,
        },
        assignments: {
            total: 4,
            submitted: 4,
            pending: 0,
        },
        internalMarks: {
            midTerm: 16,
            assignment: 14,
            attendance: 7,
            total: 37,
            outOf: 50,
        },
        announcementsCount: 2,
        upcomingSession: {
            title: "Normalization",
            time: "Thursday at 11:00 AM",
            room: "Room 203",
        },
        syllabus: [
            "ER Modeling",
            "Relational Algebra",
            "SQL Queries",
            "Normalization",
            "Transactions",
            "Indexing",
        ],
        materials: [
            "SQL Cheatsheet",
            "Lab Sheet - Joins",
            "Lecture Notes - Normalization",
        ],
        moduleProgress: [
            { title: "ER Modeling", completed: true, percent: 100 },
            { title: "SQL Queries", completed: true, percent: 100 },
            { title: "Normalization", completed: false, percent: 60 },
            { title: "Transactions", completed: false, percent: 35 },
        ],
    },
    {
        _id: "C003",
        courseCode: "CS303",
        courseName: "Operating Systems",
        semester: 3,
        credits: 4,
        department: "Computer Science",
        imageUrl:
            "https://imgs.search.brave.com/6dDFAqH427CozQn3Upyv38tOWlIhoqz-mtDAk770A3U/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzA1LzNl/L2M5LzA1M2VjOWVj/ZjRhNWMyMzAzZDQx/MDEwNTM0ZjhjY2Q0LmpwZw",
        description:
            "This course explores how operating systems manage hardware and software resources. Topics include processes and threads, CPU scheduling, synchronization, memory management, virtual memory, file systems, and deadlocks. You will also study OS design concepts such as system calls, kernel structures, and security considerations. Through practical labs, you will observe how OS components interact and build intuition for performance and reliability issues. By the end, you will understand the core services provided by modern operating systems and how they impact application behavior.",
        faculty: {
            facultyId: "F103",
            name: "Dr. Ajay Singh",
            title: "Professor of Systems",
            email: "ajay.singh@college.edu",
        },
        academicYear: "2025-26",
        division: "A",
        courseType: "Theory",
        status: "Active",
        enrolledStudents: 54,
        enrollmentLimit: 60,
        syllabusUnits: 5,
        modulesCompleted: 7,
        modulesTotal: 15,
        progress: 72,
        attendance: {
            totalLectures: 20,
            present: 18,
            percentage: 90,
        },
        assignments: {
            total: 3,
            submitted: 2,
            pending: 1,
        },
        internalMarks: {
            midTerm: 17,
            assignment: 10,
            attendance: 9,
            total: 36,
            outOf: 50,
        },
        announcementsCount: 4,
        upcomingSession: {
            title: "Process Scheduling",
            time: "Friday at 2:00 PM",
            room: "Lab 102",
        },
        syllabus: [
            "Processes & Threads",
            "CPU Scheduling",
            "Memory Management",
            "File Systems",
            "Deadlocks",
        ],
        materials: [
            "Lecture Slides - Scheduling",
            "Lab Sheet - System Calls",
            "OS Reference Notes",
        ],
        moduleProgress: [
            { title: "Processes & Threads", completed: true, percent: 100 },
            { title: "CPU Scheduling", completed: true, percent: 95 },
            { title: "Memory Management", completed: false, percent: 50 },
        ],
    },
    {
        _id: "C004",
        courseCode: "CS304",
        courseName: "Computer Networks",
        semester: 3,
        credits: 3,
        department: "Computer Science",
        imageUrl:
            "https://imgs.search.brave.com/d440_utfP4KGTn9c-HJmJOwJO5Og_6rnPyDTi5JP-wo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjIw/MDEyODcxNi9waG90/by9haS1wb3dlcnMtYmlnLWRhdGEtYW5h/bHlzaXMtYW5kLWF1/dG9tYXRpb24td29y/a2Zsb3dzLXNob3dj/YXNpbmctbmV1cmFs/LW5ldHdvcmtzLWFu/ZC1kYXRhLndlYnA_/YT0xJmI9MSZzPTYx/Mng2MTImdz0wJms9MjAmYz1XY3QzUnFz/dHVaaUhPRWV4ZDBr/U0ROdWZSSEpaX1pj/Q2VCVUFrYldLakRv/PQ",
        description:
            "This course provides a comprehensive overview of computer networks and the Internet stack. You will study the OSI and TCP/IP models, routing and switching, addressing, transport protocols, and network security fundamentals. The course includes practical exercises with network tools to analyze packets, configure routing, and troubleshoot connectivity issues. You will also learn how modern networks handle congestion and reliability. By the end, you will be able to reason about how data moves across networks and how to design reliable, secure networked systems.",
        faculty: {
            facultyId: "F104",
            name: "Prof. Sneha Kulkarni",
            title: "Associate Professor",
            email: "sneha.kulkarni@college.edu",
        },
        academicYear: "2025-26",
        division: "A",
        courseType: "Theory",
        status: "Active",
        enrolledStudents: 55,
        enrollmentLimit: 60,
        syllabusUnits: 4,
        modulesCompleted: 5,
        modulesTotal: 11,
        progress: 49,
        attendance: {
            totalLectures: 18,
            present: 16,
            percentage: 88.89,
        },
        assignments: {
            total: 4,
            submitted: 3,
            pending: 1,
        },
        internalMarks: {
            midTerm: 15,
            assignment: 11,
            attendance: 8,
            total: 34,
            outOf: 50,
        },
        announcementsCount: 1,
        upcomingSession: {
            title: "Transport Layer",
            time: "Monday at 9:00 AM",
            room: "Room 208",
        },
        syllabus: [
            "OSI Model",
            "TCP/IP Stack",
            "Routing & Switching",
            "Transport Protocols",
            "Network Security",
        ],
        materials: [
            "Packet Tracer Exercises",
            "Lecture Slides - TCP/IP",
            "Lab Manual - Routing",
        ],
        moduleProgress: [
            { title: "OSI Model", completed: true, percent: 100 },
            { title: "TCP/IP Stack", completed: true, percent: 90 },
            { title: "Routing & Switching", completed: false, percent: 40 },
        ],
    },
    {
        _id: "C005",
        courseCode: "CS305",
        courseName: "Software Engineering",
        semester: 3,
        credits: 3,
        department: "Computer Science",
        imageUrl:
            "https://imgs.search.brave.com/RDQYoMTg4OHfqo6TpK-h_CJ2Q9SdmuOW8etJGLDM93g/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZWVrc2Zvcmdl/ZWtzLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNjAxMTYx/MTI5NTUzNjU3MDcv/c29mdHdhcmVfZW5n/aW5lZXJpbmctMS53/ZWJw",
        description:
            "This course covers the full software development lifecycle, from requirements and design to testing and deployment. You will study SDLC models, requirements engineering, architectural and design patterns, coding standards, and quality assurance practices. The course emphasizes teamwork, documentation, and project planning methods such as Agile and Scrum. Through case studies and mini-projects, you will apply testing strategies, manage scope, and evaluate tradeoffs between cost, time, and quality. By the end, you will be prepared to contribute effectively to real-world software projects.",
        faculty: {
            facultyId: "F105",
            name: "Dr. Pooja Nair",
            title: "Professor",
            email: "pooja.nair@college.edu",
        },
        academicYear: "2025-26",
        division: "A",
        courseType: "Theory",
        status: "Active",
        enrolledStudents: 57,
        enrollmentLimit: 60,
        syllabusUnits: 4,
        modulesCompleted: 6,
        modulesTotal: 12,
        progress: 61,
        attendance: {
            totalLectures: 22,
            present: 19,
            percentage: 86.36,
        },
        assignments: {
            total: 6,
            submitted: 5,
            pending: 1,
        },
        internalMarks: {
            midTerm: 14,
            assignment: 13,
            attendance: 7,
            total: 34,
            outOf: 50,
        },
        announcementsCount: 5,
        upcomingSession: {
            title: "Design Patterns",
            time: "Wednesday at 1:00 PM",
            room: "Room 301",
        },
        syllabus: [
            "SDLC Models",
            "Requirements Engineering",
            "Design Patterns",
            "Testing Strategies",
            "Project Management",
        ],
        materials: [
            "Design Patterns PDF",
            "Case Study - Agile",
            "Testing Checklist",
        ],
        moduleProgress: [
            { title: "SDLC Models", completed: true, percent: 100 },
            { title: "Requirements", completed: true, percent: 90 },
            { title: "Design Patterns", completed: false, percent: 45 },
        ],
    },
    {
        _id: "C006",
        courseCode: "CS306",
        courseName: "Web Development (MERN Stack)",
        semester: 3,
        credits: 4,
        department: "Computer Science",
        imageUrl:
            "https://imgs.search.brave.com/JjlQdgButn6fYIhbOmFypGa-FzyNNNfyLeNjncH-JSw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9qYXJv/LXdlYnNpdGUuczMuYXAtc291dGgtMS5h/bWF6b25hd3MuY29tLzIwMjQvMDMvRmVh/dHVyZXMtb2YtTWVy/bi1zdGFjay1kZXZl/bG9wbWVudC1zZXJ2/aWNlcy1Zb3UtU2hv/dWxkLUtub3ctNzY4eDM5Ny0xLnBuZw",
        description:
            "This course teaches full-stack web development using the MERN stack: MongoDB, Express, React, and Node.js. You will learn front-end UI development, component-based architecture, API design, database modeling, authentication, and deployment. The course emphasizes clean code, reusable components, and modern tooling such as Git and build systems. Labs will guide you through building end-to-end applications with real-world features. By the end, you will be able to deliver production-ready web apps with a complete client-server architecture.",
        faculty: {
            facultyId: "F106",
            name: "Prof. Kavita Joshi",
            title: "Assistant Professor",
            email: "kavita.joshi@college.edu",
        },
        academicYear: "2025-26",
        division: "A",
        courseType: "Lab",
        status: "Active",
        enrolledStudents: 52,
        enrollmentLimit: 55,
        syllabusUnits: 6,
        modulesCompleted: 8,
        modulesTotal: 16,
        progress: 80,
        attendance: {
            totalLectures: 16,
            present: 14,
            percentage: 87.5,
        },
        assignments: {
            total: 5,
            submitted: 3,
            pending: 2,
        },
        internalMarks: {
            midTerm: 19,
            assignment: 15,
            attendance: 8,
            total: 42,
            outOf: 50,
        },
        announcementsCount: 6,
        upcomingSession: {
            title: "REST APIs",
            time: "Tuesday at 3:00 PM",
            room: "Lab 201",
        },
        syllabus: [
            "HTML/CSS Basics",
            "JavaScript Fundamentals",
            "React Essentials",
            "Node & Express",
            "MongoDB Basics",
            "Deployment",
        ],
        materials: [
            "MERN Roadmap",
            "React Hooks Notes",
            "API Practice Set",
        ],
        moduleProgress: [
            { title: "HTML/CSS", completed: true, percent: 100 },
            { title: "JavaScript", completed: true, percent: 85 },
            { title: "React", completed: false, percent: 50 },
            { title: "Node & Express", completed: false, percent: 30 },
        ],
    },
    {
        _id: "C007",
        courseCode: "CS307",
        courseName: "Artificial Intelligence Basics",
        semester: 3,
        credits: 3,
        department: "Computer Science",
        imageUrl:
            "https://imgs.search.brave.com/WS_RkGrlcdDcpMzUEifAvjfBWASg6CUPkhN8fGLvDpY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZWxlYXJuaW5naW5k/dXN0cnkuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzAy/L1doYXQtaXMtQXJ0/aWZpY2lhbC1JbnRl/bGxpZ2VuY2UtTXVz/dC1Lbm93LUJhc2lj/cy1Gb3ItQmVnaW5u/ZXJzLmpwZw",
        description:
            "This course introduces the foundations of artificial intelligence, including search algorithms, knowledge representation, and reasoning under uncertainty. You will learn how intelligent agents solve problems using heuristics, planning, and basic machine learning concepts. Practical exercises will explore decision-making strategies and evaluate AI system performance. The course also touches on ethical considerations and real-world AI applications. By the end, you will have a clear understanding of the core ideas behind modern intelligent systems.",
        faculty: {
            facultyId: "F107",
            name: "Dr. Arjun Mehta",
            title: "Professor",
            email: "arjun.mehta@college.edu",
        },
        academicYear: "2025-26",
        division: "A",
        courseType: "Theory",
        status: "Active",
        enrolledStudents: 50,
        enrollmentLimit: 60,
        syllabusUnits: 4,
        modulesCompleted: 4,
        modulesTotal: 10,
        progress: 45,
        attendance: {
            totalLectures: 14,
            present: 12,
            percentage: 85.71,
        },
        assignments: {
            total: 4,
            submitted: 2,
            pending: 2,
        },
        internalMarks: {
            midTerm: 12,
            assignment: 9,
            attendance: 7,
            total: 28,
            outOf: 50,
        },
        announcementsCount: 2,
        upcomingSession: {
            title: "Heuristic Search",
            time: "Friday at 10:30 AM",
            room: "Room 105",
        },
        syllabus: [
            "Search Algorithms",
            "Knowledge Representation",
            "Machine Learning Intro",
            "Reasoning Under Uncertainty",
        ],
        materials: [
            "Search Algorithms PDF",
            "ML Overview Slides",
            "Assignment - A* Search",
        ],
        moduleProgress: [
            { title: "Search Algorithms", completed: true, percent: 100 },
            { title: "Knowledge Representation", completed: false, percent: 45 },
            { title: "ML Intro", completed: false, percent: 25 },
        ],
    },
    {
        _id: "C008",
        courseCode: "CS308",
        courseName: "Cyber Security Fundamentals",
        semester: 3,
        credits: 3,
        department: "Computer Science",
        imageUrl:
            "https://imgs.search.brave.com/3jC5YObdYokMQOFRVRU2hdQLak7eiSM9ooji0ZvgK_s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lY2N3ZWIuczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDIyLzExLzI2MTAzOTA2L1doYXQtQXJlLXRoZS1GdW5kYW1lbnRhbHMtb2YtSW5mb3JtYXRpb24tU2VjdXJpdHktMS0xLnBuZw",
        description:
            "This course covers the fundamentals of cybersecurity, including security principles, cryptography basics, common network and web threats, and defensive strategies. You will study authentication, encryption, secure coding practices, and incident response workflows. Hands-on activities will demonstrate how vulnerabilities are discovered and mitigated. The course also discusses compliance, risk assessment, and security awareness practices. By the end, you will be able to identify common security risks and implement basic protections in real systems.",
        faculty: {
            facultyId: "F108",
            name: "Prof. Ritesh Patel",
            title: "Assistant Professor",
            email: "ritesh.patel@college.edu",
        },
        academicYear: "2025-26",
        division: "A",
        courseType: "Theory",
        status: "Active",
        enrolledStudents: 53,
        enrollmentLimit: 60,
        syllabusUnits: 4,
        modulesCompleted: 6,
        modulesTotal: 11,
        progress: 55,
        attendance: {
            totalLectures: 15,
            present: 13,
            percentage: 86.67,
        },
        assignments: {
            total: 3,
            submitted: 3,
            pending: 0,
        },
        internalMarks: {
            midTerm: 15,
            assignment: 12,
            attendance: 8,
            total: 35,
            outOf: 50,
        },
        announcementsCount: 3,
        upcomingSession: {
            title: "Threat Modeling",
            time: "Thursday at 4:00 PM",
            room: "Room 205",
        },
        syllabus: [
            "Security Principles",
            "Cryptography Basics",
            "Web Security",
            "Network Threats",
            "Incident Response",
        ],
        materials: [
            "OWASP Top 10 Summary",
            "Crypto Basics Notes",
            "Lab Sheet - SQLi",
        ],
        moduleProgress: [
            { title: "Security Principles", completed: true, percent: 100 },
            { title: "Cryptography", completed: false, percent: 55 },
            { title: "Web Security", completed: false, percent: 35 },
        ],
    },
]

const CourseDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("Overview");
  const [showTabs, setShowTabs] = useState(false);
  const tabsRef = useRef(null);

  const course = useMemo(() => {
    if (location.state?.course) return location.state.course;
    return courseData.find((item) => item._id === id);
  }, [id, location.state]);

  if (!course) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-900/10 text-center border border-slate-200">
          <h2 className="m-0 font-black text-slate-900">Course not found</h2>
          <p className="mt-2 text-slate-500 font-semibold">
            Please go back and choose a course again.
          </p>
          <button
            className="mt-3 px-4 py-3 rounded-2xl bg-blue-600 text-white font-black cursor-pointer transition active:scale-[0.98]"
            onClick={() => navigate(-1)}
            type="button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(Math.max(course.progress || 0, 0), 100);
  const modulesDone = course.modulesCompleted ?? 0;
  const modulesTotal = course.modulesTotal ?? course.syllabusUnits ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ✅ HEADER */}
      <header className="px-5 pt-4 flex items-center justify-between gap-3">
        <button
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer transition hover:-translate-y-[1px]"
          onClick={() => navigate(-1)}
          aria-label="Back"
          type="button"
        >
          <IoIosArrowBack className="text-xl text-slate-700" />
        </button>

        <h1 className="m-0 text-[18px] font-black text-slate-900">
          Course Details
        </h1>

        <div
          className="w-11 h-11 rounded-2xl bg-transparent"
          aria-hidden="true"
        />
      </header>

      {/* ✅ HERO IMAGE */}
      <div className="mt-4 mx-5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
        <img
          src={course.imageUrl}
          alt={course.courseName}
          className="w-full h-[220px] sm:h-[260px] object-cover"
        />
      </div>

      {/* ✅ TITLE */}
      <section className="mx-5 mt-4">
        <h2 className="m-0 text-[22px] font-black text-slate-900">
          {course.courseName}
        </h2>
        <p className="mt-1 text-[13px] font-bold text-slate-500">
          {course.courseCode} • {course.academicYear} • Sem {course.semester}
        </p>
      </section>

      {/* ✅ ACTIONS */}
      <section className="mx-5 mt-4 flex items-center justify-between gap-3">
        <button
          className="flex-1 px-4 py-3 rounded-2xl bg-blue-600 text-white font-black cursor-pointer transition active:scale-[0.98]"
          onClick={() => {
            setShowTabs(true);
            setActiveTab("Overview");
            tabsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          type="button"
        >
          Continue Learning
        </button>

        <button
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer transition hover:-translate-y-[1px]"
          type="button"
        >
          <MdBookmarkBorder className="text-xl text-slate-700" />
        </button>
      </section>

      {/* ✅ TABS */}
      {showTabs && (
        <>
          <section
            className="mx-5 mt-6 flex gap-2.5 flex-wrap bg-white border border-slate-200 rounded-2xl p-2 shadow-lg shadow-slate-900/5"
            ref={tabsRef}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2.5 rounded-2xl text-[13px] font-extrabold cursor-pointer transition border ${
                  activeTab === tab
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
                }`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </section>

          {/* ✅ CONTENT */}
          {activeTab === "Overview" && (
            <section className="mx-5 mt-5 grid gap-4 pb-10">
              {/* ✅ Progress Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-900/5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="m-0 text-[16px] font-black text-slate-900">
                    Course Progress
                  </h3>
                  <p className="mt-1 text-[13px] font-bold text-slate-500">
                    {modulesDone} of {modulesTotal} modules completed
                  </p>
                </div>

                {/* ✅ Progress Ring (inline conic-gradient) */}
                <div
                  className="w-[72px] h-[72px] rounded-full grid place-items-center"
                  style={{
                    background: `conic-gradient(#7c3aed ${progressPercent}%, #e5e7eb 0)`,
                  }}
                  aria-label={`Progress ${progressPercent}%`}
                >
                  <span className="w-[56px] h-[56px] rounded-full bg-white grid place-items-center font-black text-indigo-600 text-[14px]">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* ✅ Description */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-900/5">
                <h3 className="m-0 text-[16px] font-black text-slate-900">
                  Course Description
                </h3>
                <p className="mt-2 text-[13px] font-bold text-slate-600 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* ✅ Instructor */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-900/5">
                <h3 className="m-0 text-[16px] font-black text-slate-900">
                  Instructor
                </h3>

                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center flex-shrink-0">
                      {course.faculty?.name?.charAt(0) || "I"}
                    </div>

                    <div className="min-w-0">
                      <p className="m-0 font-black text-slate-900 text-[14px]">
                        {course.faculty?.name}
                      </p>
                      <p className="mt-1 text-[12px] font-bold text-slate-500">
                        {course.faculty?.title}
                      </p>
                    </div>
                  </div>

                  <button
                    className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer transition hover:-translate-y-[1px]"
                    aria-label="Email instructor"
                    type="button"
                  >
                    <MdOutlineEmail className="text-xl text-slate-700" />
                  </button>
                </div>
              </div>

              {/* ✅ Upcoming Session */}
              {course.upcomingSession && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-900/5">
                  <h3 className="m-0 text-[16px] font-black text-slate-900">
                    Upcoming Session
                  </h3>

                  <div className="mt-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="m-0 font-black text-slate-900 text-[14px]">
                        {course.upcomingSession.title}
                      </p>
                      <p className="mt-1 text-[12px] font-bold text-slate-500">
                        {course.upcomingSession.time} •{" "}
                        {course.upcomingSession.room}
                      </p>
                    </div>

                    <button
                      className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center cursor-pointer transition active:scale-[0.98]"
                      aria-label="Add to calendar"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "Syllabus" && (
            <section className="mx-5 mt-5 pb-10">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-900/5">
                <h3 className="m-0 text-[16px] font-black text-slate-900">
                  Syllabus Overview
                </h3>

                <p className="mt-2 text-[13px] font-bold text-slate-600">
                  {modulesTotal} modules, {course.syllabusUnits} core units,{" "}
                  {course.assignments?.total} assignments.
                </p>

                <ul className="mt-3 pl-5 grid gap-2 text-[13px] font-bold text-slate-600">
                  {(course.syllabus || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {activeTab === "Materials" && (
            <section className="mx-5 mt-5 pb-10">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-900/5">
                <h3 className="m-0 text-[16px] font-black text-slate-900">
                  Materials
                </h3>

                <ul className="mt-3 pl-5 grid gap-2 text-[13px] font-bold text-slate-600">
                  {(course.materials || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default CourseDetails;