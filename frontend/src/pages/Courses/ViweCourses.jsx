import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdCastForEducation } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const userData = [
  {
    _id: "C001",
    courseCode: "CS301",
    courseName: "Data Structures & Algorithms",
    semester: 3,
    credits: 4,
    department: "Computer Science",
    imageUrl:
      "https://imgs.search.brave.com/dTxGBozwyZ7jNx_r5RGItFi5DCBxyneXT4tKGi3ynkk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE3LzgyLzY4LzIx/LzM2MF9GXzE3ODI2/ODIxMDBfOEtkZzRs/bEVxbFk4aVk4c2Vn/bmFmV1Aza0FRd1pi/T1cuanBn",
    faculty: {
      facultyId: "F101",
      name: "Dr. Rahul Sharma",
      email: "rahul.sharma@college.edu",
    },
    academicYear: "2025-26",
    division: "A",
    courseType: "Theory",
    status: "Active",
    enrolledStudents: 58,
    enrollmentLimit: 60,
    syllabusUnits: 5,
    progress: 68,
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
    faculty: {
      facultyId: "F102",
      name: "Prof. Neha Verma",
      email: "neha.verma@college.edu",
    },
    academicYear: "2025-26",
    division: "A",
    courseType: "Theory",
    status: "Active",
    enrolledStudents: 56,
    enrollmentLimit: 60,
    syllabusUnits: 4,
    progress: 54,
  },
  {
    _id: "C003",
    courseCode: "CS303",
    courseName: "Operating Systems",
    semester: 3,
    credits: 4,
    department: "Computer Science",
    imageUrl:
      "https://imgs.search.brave.com/KqJX_0QsSUvbd9mzD9FgujVjDPgKpXW4vHlI-faSkjE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzQxL2U1/Lzg0LzQxZTU4NGEy/ZWU4ZGYxYTgzYWUw/YjhhNGRkY2ZiYzFj/LmpwZw",
    faculty: {
      facultyId: "F103",
      name: "Dr. Ajay Singh",
      email: "ajay.singh@college.edu",
    },
    academicYear: "2025-26",
    division: "A",
    courseType: "Theory",
    status: "Active",
    enrolledStudents: 54,
    enrollmentLimit: 60,
    syllabusUnits: 5,
    progress: 72,
  },
];

const ViewCourses = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  //  Search Filter Logic (Course Name + Course Code)
  const filteredCourses = userData.filter((course) => {
    const query = searchText.toLowerCase().trim();
    return (
      course.courseName.toLowerCase().includes(query) ||
      course.courseCode.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/*  Navbar */}
      <nav className="w-full px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <MdCastForEducation className="text-3xl text-blue-600" />
          <h1 className="text-lg font-black text-slate-900 m-0">
            View Courses
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="flex items-center gap-1">
            <span className="text-[13px] text-slate-500 font-extrabold">
              User:
            </span>
            <span className="text-[13px] text-slate-900 font-black">
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[13px] text-slate-500 font-extrabold">
              Role:
            </span>
            <span className="text-[13px] text-slate-900 font-black">
              {user?.role}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[13px] text-slate-500 font-extrabold">
              Status:
            </span>
            <span
              className={`text-[13px] font-black ${
                user ? "text-green-600" : "text-red-600"
              }`}
            >
              {user ? "Available" : "Not available"}
            </span>
          </div>
        </div>
      </nav>

      {/*  Courses Content */}
      <div className="w-full min-h-screen p-5 bg-slate-50">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <h2 className="m-0 text-[22px] font-black text-slate-900">
              My Courses
            </h2>
            <p className="mt-1 text-[13px] text-slate-500 font-bold">
              Academic Year: 2025-26 • Semester 3
            </p>
          </div>

          {/*  Search Box */}
          <div className="flex items-center gap-2 w-[380px] max-w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/5 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/20">
            <IoIosSearch className="text-xl text-slate-500 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search Courses..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-transparent outline-none border-none text-[14px] font-extrabold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/*  Count shows filtered length */}
          <p className="m-0 text-[13px] font-black text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-full">
            {filteredCourses.length} Courses
          </p>
        </div>

        {/*  Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.length === 0 ? (
            <p className="font-bold text-slate-500">No course found</p>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-900/5 transition duration-200 hover:-translate-y-1 flex flex-col"
              >
                <div className="w-full h-[170px] relative overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-slate-900/85 text-white text-[12px] font-black px-3 py-1 rounded-full">
                    {course.status}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <h3 className="m-0 text-[16px] font-black text-slate-900 leading-snug">
                    {course.courseName}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-black px-3 py-1 rounded-full">
                      {course.courseCode}
                    </span>
                    <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-black px-3 py-1 rounded-full">
                      Sem {course.semester}
                    </span>
                    <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-black px-3 py-1 rounded-full">
                      {course.credits} Credits
                    </span>
                    <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-black px-3 py-1 rounded-full">
                      {course.courseType}
                    </span>
                  </div>

                  <p className="m-0 text-[13px] text-slate-700 font-extrabold">
                    <b>Faculty:</b> {course.faculty.name}
                  </p>

                  <div className="flex gap-3 flex-wrap mt-2">
                    <button className="flex-1 border-none bg-blue-600 text-white px-3 py-3 rounded-2xl text-[13px] font-black cursor-pointer transition hover:-translate-y-[1px] hover:bg-blue-700"
                    onClick={() => navigate(`/course/details/${course._id}`)}>
                      View Details
                    </button>

                    <button
                      className="flex-1 border border-slate-200 bg-white text-slate-900 px-3 py-3 rounded-2xl text-[13px] font-black cursor-pointer transition hover:-translate-y-[1px] hover:bg-slate-50"
                      onClick={() => navigate(`/assignment/${course._id}`)}
                    >
                      Assignments
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ViewCourses;