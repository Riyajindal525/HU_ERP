import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineTimer, MdVerified } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiCheckCircle } from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { BsClipboardCheck } from "react-icons/bs";

const quizDetailsData = [
  {
    quizId: "Q001",

    courseId: "C001",
    courseCode: "CS301",
    courseName: "Data Structures & Algorithms",

    type: "quiz",
    status: "Pending", // Pending | Submitted | Graded

    title: "Quiz 1: Linked Lists & Pointers",
    subtitle: "MCQs + Coding questions based on Linked List concepts.",

    postedDate: "Oct 12, 2023",
    quizDate: "Oct 13, 2023",
    startTime: "09:15 AM",
    endTime: "10:00 AM",

    duration: "45 Minutes",
    totalMarks: 20,
    passingMarks: 8,

    instructions: [
      "Quiz contains 10 MCQs and 2 coding questions.",
      "Do not refresh the page during quiz attempt.",
      "Only 1 attempt is allowed.",
      "Submission will be auto after time ends.",
      "Maintain internet connection for smooth experience.",
    ],

    rules: {
      attemptsAllowed: 1,
      negativeMarking: false,
      proctored: false,
      showResultAfterSubmit: true,
      shuffleQuestions: true,
    },

    topicsCovered: [
      "Singly Linked List",
      "Doubly Linked List",
      "Insertion & Deletion",
      "Pointers & Memory",
    ],

    studentAttempt: {
      attempted: false,
      attemptNo: 0,
      startedAt: null,
      submittedAt: null,
      score: null,
      grade: null,
    },
  },
];

const DetailsQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  //  You can match quiz by quizId (route: /quiz/:id)
  const data =
    quizDetailsData.find((q) => q.quizId === id) || quizDetailsData[0];

  const statusClass =
    data.status?.toLowerCase() === "graded"
      ? "graded"
      : data.status?.toLowerCase() === "submitted"
      ? "submitted"
      : "pending";

  const pillStyles =
    statusClass === "graded"
      ? "bg-blue-100 border-blue-200 text-blue-700"
      : statusClass === "submitted"
      ? "bg-green-100 border-green-200 text-green-700"
      : "bg-yellow-100 border-yellow-200 text-yellow-800";

  const statusTextColor =
    statusClass === "graded"
      ? "text-blue-700"
      : statusClass === "submitted"
      ? "text-green-700"
      : "text-yellow-800";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 box-border">
      <div className="max-w-[1200px] mx-auto">
        {/*  TOPBAR */}
        <div className="flex justify-between items-center gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              className="w-11 h-11 rounded-2xl bg-white border border-slate-200 cursor-pointer flex items-center justify-center transition hover:-translate-y-[1px]"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeftLong size={18} />
            </button>

            <div className="flex gap-2 items-center text-center text-[13px] font-extrabold min-w-0">
              <span className="text-blue-600 font-black text-[29px]">
                Quiz
              </span>
            </div>
          </div>

          <button
            className="w-11 h-11 rounded-2xl bg-white border border-slate-200 cursor-pointer flex items-center justify-center transition hover:-translate-y-[1px]"
            type="button"
          >
            <IoIosNotificationsOutline size={20} />
          </button>
        </div>

        {/*  LAYOUT */}
        <div className="flex gap-5 items-start flex-col lg:flex-row">
          {/*  LEFT */}
          <div className="flex-[2] flex flex-col gap-5">
            {/*  MAIN CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-900/5 flex flex-col gap-4">
              <div className="flex justify-between items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-[12px] font-black border ${pillStyles}`}
                >
                  {data.status}
                </span>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[12px] font-black text-slate-900">
                  <HiOutlineAcademicCap size={16} />
                  <span>{data.courseCode}</span>
                </div>
              </div>

              <h1 className="m-0 text-[26px] font-black text-slate-900 leading-tight">
                {data.title}
              </h1>

              <p className="m-0 text-[14px] font-bold text-slate-500 leading-relaxed">
                {data.subtitle}
              </p>

              {/* QUIZ INFO ROW */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[180px] bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <p className="m-0 text-[12px] font-black text-slate-500">
                    Quiz Date
                  </p>
                  <p className="mt-1.5 text-[13px] font-black text-slate-900">
                    {data.quizDate}
                  </p>
                </div>

                <div className="flex-1 min-w-[180px] bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <p className="m-0 text-[12px] font-black text-slate-500">
                    Time
                  </p>
                  <p className="mt-1.5 text-[13px] font-black text-slate-900">
                    {data.startTime} - {data.endTime}
                  </p>
                </div>

                <div className="flex-1 min-w-[180px] bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <p className="m-0 text-[12px] font-black text-slate-500 flex items-center gap-2">
                    <MdOutlineTimer size={16} /> Duration
                  </p>
                  <p className="mt-1.5 text-[13px] font-black text-slate-900">
                    {data.duration}
                  </p>
                </div>
              </div>

              {/*  STATS CARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[180px] text-center">
                  <p className="m-0 text-[11px] font-black text-slate-500 tracking-wide">
                    TOTAL MARKS
                  </p>
                  <p className="mt-1.5 text-[26px] font-black text-blue-600">
                    {data.totalMarks}
                  </p>
                </div>

                <div className="hidden lg:block w-px h-[54px] bg-slate-200" />

                <div className="flex-1 min-w-[180px] text-center">
                  <p className="m-0 text-[11px] font-black text-slate-500 tracking-wide">
                    PASSING
                  </p>
                  <p className="mt-1.5 text-[26px] font-black text-green-600">
                    {data.passingMarks}
                  </p>
                </div>
              </div>

              {/*  BUTTON */}
              <div className="flex justify-end lg:justify-end">
                {data.studentAttempt.attempted ? (
                  <button
                    className="px-4 py-3 rounded-2xl font-black cursor-pointer flex items-center gap-2 justify-center transition active:scale-[0.98] bg-white border border-slate-200 text-slate-900 w-full lg:w-auto"
                    type="button"
                  >
                    <MdVerified size={18} />
                    Already Attempted
                  </button>
                ) : (
                  <button
                    className="px-4 py-3 rounded-2xl font-black cursor-pointer flex items-center gap-2 justify-center transition active:scale-[0.98] bg-blue-600 text-white w-full lg:w-auto"
                    type="button"
                  >
                    <BsClipboardCheck size={18} />
                    Start Quiz
                  </button>
                )}
              </div>
            </div>

            {/*  INSTRUCTIONS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-900/5 flex flex-col gap-4">
              <h2 className="m-0 text-[15px] font-black text-slate-900 flex items-center gap-2">
                <AiOutlineInfoCircle size={18} />
                Instructions
              </h2>

              <ul className="p-0 m-0 list-none flex flex-col gap-3">
                {data.instructions.map((ins, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[13px] font-extrabold text-slate-700 leading-relaxed"
                  >
                    <FiCheckCircle size={16} className="mt-[2px]" />
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/*  RIGHT */}
          <div className="flex-1 flex flex-col gap-5 w-full">
            {/*  TOPICS COVERED */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-900/5 flex flex-col gap-4">
              <h2 className="m-0 text-[15px] font-black text-slate-900">
                Topics Covered
              </h2>

              <div className="flex flex-wrap gap-3">
                {data.topicsCovered.map((topic, idx) => (
                  <span
                    className="px-3 py-2 rounded-full bg-slate-100 border border-slate-200 font-black text-[12px] text-slate-900"
                    key={idx}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/*  RULES CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-900/5 flex flex-col gap-4">
              <h2 className="m-0 text-[15px] font-black text-slate-900">
                Rules
              </h2>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-3">
                  <span className="text-[13px] font-extrabold text-slate-500">
                    Attempts Allowed
                  </span>
                  <span className="text-[13px] font-black text-slate-900">
                    {data.rules.attemptsAllowed}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[13px] font-extrabold text-slate-500">
                    Negative Marking
                  </span>
                  <span className="text-[13px] font-black text-slate-900">
                    {data.rules.negativeMarking ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[13px] font-extrabold text-slate-500">
                    Proctored
                  </span>
                  <span className="text-[13px] font-black text-slate-900">
                    {data.rules.proctored ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[13px] font-extrabold text-slate-500">
                    Shuffle Questions
                  </span>
                  <span className="text-[13px] font-black text-slate-900">
                    {data.rules.shuffleQuestions ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[13px] font-extrabold text-slate-500">
                    Result After Submit
                  </span>
                  <span className="text-[13px] font-black text-slate-900">
                    {data.rules.showResultAfterSubmit ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/*  QUICK INFO */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-900/5 flex flex-col gap-3">
              <div className="flex justify-between gap-3">
                <span className="text-[13px] font-extrabold text-slate-500">
                  Course
                </span>
                <span className="text-[13px] font-black text-slate-900 text-right">
                  {data.courseName}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[13px] font-extrabold text-slate-500">
                  Posted Date
                </span>
                <span className="text-[13px] font-black text-slate-900 text-right">
                  {data.postedDate}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[13px] font-extrabold text-slate-500">
                  Status
                </span>
                <span className={`text-[13px] font-black ${statusTextColor}`}>
                  {data.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* End layout */}
      </div>
    </div>
  );
};

export default DetailsQuiz;