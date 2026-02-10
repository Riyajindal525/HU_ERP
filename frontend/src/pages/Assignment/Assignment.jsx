import React, { useState } from "react";
import { FaArrowLeftLong, FaCheck } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { MdGrading } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const statusTabs = [
  { id: "pending", label: "Pending" },
  { id: "submitted", label: "Submitted" },
  { id: "graded", label: "Graded" },
];

const allAssignments = [
  {
    id: 1,
    courseId: "C001",
    courseCode: "CS301",
    courseName: "Data Structures & Algorithms",
    statusId: "pending",
    tag: "DUE IN 2 DAYS",
    type: "homework",
    title: "Homework 1: Big O Notation & Time Complexity",
    postedDate: "Oct 10, 2023",
    dueDate: "Oct 15, 2023",
    dueTime: "11:59 PM",
    isGraded: false,
    isSubmitted: false,
    buttonText: "View Assignment",
    buttonAction: "view_assignment",
  },

  {
    id: 2,
    courseId: "C001",
    courseCode: "CS301",
    courseName: "Data Structures & Algorithms",
    statusId: "pending",
    tag: "DUE IN 2 DAYS",
    type: "quiz",
    title: "Quiz 1: Linked Lists & Pointers",
    postedDate: "Oct 12, 2023",
    dueDate: "Tomorrow",
    dueTime: "10:00 AM",
    isGraded: false,
    isSubmitted: false,
    duration: "45 Minutes",
    buttonText: "View Quiz",
    buttonAction: "view_quiz",
  },

  {
    id: 3,
    courseId: "C002",
    courseCode: "CS302",
    courseName: "Database Management Systems",
    statusId: "submitted",
    tag: "SUBMITTED",
    type: "project",
    title: "Programming Project: AVL Tree Implementation",
    postedDate: "Oct 14, 2023",
    isSubmitted: true,
    isGraded: false,
    dueDate: "Oct 22, 2023",
    dueTime: "11:59 PM",
  },

  {
    id: 4,
    courseId: "C003",
    courseCode: "CS303",
    courseName: "Operating Systems",
    statusId: "graded",
    tag: "GRADED",
    type: "homework",
    title: "Homework 2: Stack & Queue Implementation",
    postedDate: "Oct 05, 2023",
    isGraded: true,
    isSubmitted: true,
    dueDate: "Oct 09, 2023",
    dueTime: "11:59 PM",
    grade: "8/10",
  },
];

const Assignment = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortType, setSortType] = useState("A-Z"); // ✅ A-Z | Z-A

  const navigate = useNavigate();

  // ✅ Same filter logic (status)
  const currentData = allAssignments.filter(
    (item) => item.statusId === activeTab
  );

  // ✅ ONLY EXTRA: sorted data (does not affect core logic)
  const sortedData = [...currentData].sort((a, b) => {
    if (sortType === "A-Z") return a.title.localeCompare(b.title);
    return b.title.localeCompare(a.title);
  });

  const handleAction = (item) => {
    if (activeTab !== "pending") return;

    console.log("handleAction called with:", item);

    if (item.buttonAction === "view_quiz") {
      console.log("Navigating to quiz:", `/quiz/details/${item.courseId}`);
      navigate(`/quiz/details/${item.courseId}`);
    } else if (item.buttonAction === "view_assignment") {
      console.log(
        "Navigating to assignment details:",
        `/assignment/details/${item.courseId}`
      );
      navigate(`/assignment/details/${item.courseId}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-5 box-border">
      <div className="w-full max-w-[1200px] mx-auto box-border">
        {/* ✅ Top Header */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex justify-between items-center gap-4 flex-wrap shadow-lg shadow-slate-900/5">
          <div className="flex items-center gap-4 flex-1 min-w-[250px]">
            <button
              className="h-[42px] w-[42px] flex items-center justify-center border border-slate-200 rounded-2xl bg-slate-100 cursor-pointer transition hover:-translate-y-[1px]"
              type="button"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeftLong size={18} />
            </button>

            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="m-0 text-[18px] font-extrabold text-slate-900 leading-tight break-words">
                Data Structure & Algorithms
              </h1>
              <p className="m-0 text-[13px] font-semibold text-slate-500 leading-tight">
                Assignments • Quizzes
              </p>
            </div>
          </div>

          {/* ✅ Filter Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white font-bold cursor-pointer transition whitespace-nowrap hover:bg-slate-100"
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <IoFilter size={18} />
              <span>Filter</span>
            </button>

            {isFilterOpen && (
              <div className="absolute top-[52px] right-0 w-[140px] bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/20 p-2 flex flex-col gap-1.5 z-[999]">
                <button
                  className={`w-full px-3 py-2.5 rounded-xl text-[13px] font-extrabold cursor-pointer text-left border border-transparent transition ${
                    sortType === "A-Z"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    setSortType("A-Z");
                    setIsFilterOpen(false);
                  }}
                  type="button"
                >
                  A → Z
                </button>

                <button
                  className={`w-full px-3 py-2.5 rounded-xl text-[13px] font-extrabold cursor-pointer text-left border border-transparent transition ${
                    sortType === "Z-A"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    setSortType("Z-A");
                    setIsFilterOpen(false);
                  }}
                  type="button"
                >
                  Z → A
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Tabs + Stats */}
        <div className="mt-5 flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-2.5 flex-wrap">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2.5 rounded-2xl text-[13px] font-extrabold cursor-pointer transition border border-transparent ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-900 hover:-translate-y-[1px]"
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="m-0 px-3 py-2 rounded-full bg-slate-100 border border-slate-200 text-[13px] font-extrabold text-slate-900 whitespace-nowrap">
            {sortedData.length} items
          </p>
        </div>

        {/* ✅ Cards Grid */}
        <div className="mt-5">
          {sortedData.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-7 text-center shadow-lg shadow-slate-900/5">
              <h3 className="m-0 font-black text-slate-900">
                No assignments found
              </h3>
              <p className="mt-2 font-bold text-slate-500">
                Switch tabs to see different assignments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {sortedData.map((item) => {
                const showButton =
                  activeTab === "pending" &&
                  !item.isSubmitted &&
                  !item.isGraded;

                const isUrgent = item.tag?.toLowerCase().includes("urgent");

                return (
                  <div
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg shadow-slate-900/5 flex flex-col gap-3 transition hover:-translate-y-[2px]"
                    key={item.id}
                  >
                    {/* ✅ Card Header */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="w-fit px-2.5 py-1 rounded-full text-[12px] font-black bg-sky-100 text-sky-700">
                          {item.courseCode}
                        </span>
                        <span className="text-[13px] font-bold text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.courseName}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[12px] font-black border whitespace-nowrap ${
                          isUrgent
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-slate-100 text-slate-900 border-slate-200"
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>

                    {/* ✅ Title */}
                    <h2 className="m-0 text-[16px] font-black text-slate-900 leading-snug">
                      {item.title}
                    </h2>

                    {/* ✅ Status Row */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {item.isSubmitted && !item.isGraded && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-black bg-green-100 text-green-800">
                          <FaCheck size={16} />
                          <span>Submitted</span>
                        </div>
                      )}

                      {item.isGraded && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-black bg-violet-100 text-violet-800">
                          <MdGrading size={18} />
                          <span>Graded</span>
                        </div>
                      )}

                      {!item.isSubmitted && !item.isGraded && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-black bg-slate-200 text-slate-900">
                          <span>{item.type.toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    {/*  Details */}
                    <div className="border-t border-dashed border-slate-200 pt-3 flex flex-col gap-2.5">
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-[13px] font-bold text-slate-500">
                          Posted
                        </span>
                        <span className="text-[13px] font-black text-slate-900 text-right">
                          {item.postedDate}
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-3">
                        <span className="text-[13px] font-bold text-slate-500">
                          Due
                        </span>
                        <span className="text-[13px] font-black text-slate-900 text-right">
                          {item.dueDate} • {item.dueTime}
                        </span>
                      </div>

                      {activeTab === "pending" && item.duration && (
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-[13px] font-bold text-slate-500">
                            Duration
                          </span>
                          <span className="text-[13px] font-black text-slate-900 text-right">
                            {item.duration}
                          </span>
                        </div>
                      )}

                      {activeTab === "graded" && item.grade && (
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-[13px] font-bold text-slate-500">
                            Grade
                          </span>
                          <span className="text-[13px] font-black text-green-600 text-right">
                            {item.grade}
                          </span>
                        </div>
                      )}
                    </div>

                    {/*  Footer */}
                    <div className="mt-auto">
                      {showButton ? (
                        <button
                          className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white font-black cursor-pointer transition hover:-translate-y-[1px]"
                          onClick={() => handleAction(item)}
                          type="button"
                        >
                          {item.buttonText}
                        </button>
                      ) : (
                        <p className="m-0 py-2.5 text-[13px] font-bold text-slate-500 text-center">
                          {item.isSubmitted && !item.isGraded
                            ? " Your assignment has been submitted."
                            : item.isGraded
                            ? " Your assignment has been graded."
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignment;