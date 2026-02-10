import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";

const assignmentDetailsData = [
  {
    assignmentId: "A001",
    courseId: "C001",
    courseCode: "CS301",
    courseName: "Data Structures & Algorithms",

    status: "Pending",
    title: "Homework 1: Big O Notation",
    subtitle: "Analysis of time and space complexity in algorithms.",

    submittedOn: "Oct 14, 2023",
    startedOn: "Oct 18, 2023",

    outOf: "100",
    grade: "A",

    instructions:
      "Solve all questions based on Time Complexity and Big-O notation. Write clean explanation and dry run for each problem. Upload PDF or handwritten images clearly.",

    submission: {
      fileName: "hw1_big_o_final.pdf",
      fileSize: "1.2 MB",
      submittedAt: "Oct 14, 2023, 8:42 PM",
    },
  },
];

const DetailsAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = assignmentDetailsData.find((item) => item.courseId === id);

  const statusClass =
    data?.status?.toLowerCase() === "graded"
      ? "graded"
      : data?.status?.toLowerCase() === "submitted"
      ? "submitted"
      : "pending";

  const pillStyles =
    statusClass === "graded"
      ? "bg-blue-100 border-blue-200 text-blue-700"
      : statusClass === "submitted"
      ? "bg-green-100 border-green-200 text-green-700"
      : "bg-yellow-100 border-yellow-200 text-yellow-800";

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-5 box-border m-2.5">
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-900/5 text-center">
            <h2 className="m-0 font-black text-slate-900">
              Assignment Not Found
            </h2>
            <p className="mt-2 mb-4 text-slate-500 font-bold">
              No details available for this course.
            </p>
            <button
              className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-black cursor-pointer transition active:scale-[0.98]"
              onClick={() => navigate(-1)}
              type="button"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 box-border m-2.5">
      <div className="w-full max-w-[1000px] mx-auto">
        {/*  Top Navigation */}
        <div className="w-full flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer transition hover:-translate-y-[1px]"
              onClick={() => navigate(-1)}
              type="button"
            >
              <FaArrowLeftLong size={18} />
            </button>

            <div className="flex items-center gap-2 text-[13px] font-extrabold min-w-0">
              <span className="text-blue-600 font-black text-[29px]">
                Assignment
              </span>
            </div>
          </div>

          <button
            className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer transition hover:-translate-y-[1px]"
            type="button"
          >
            🔔
          </button>
        </div>

        {/*  Assignment Overview Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-900/5 m-2.5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-black border ${pillStyles}`}
            >
              {data.status}
            </span>
          </div>

          <h1 className="m-0 text-[28px] font-black text-slate-900 leading-tight">
            {data.title}
          </h1>

          <p className="m-0 text-[14px] font-bold text-slate-500 leading-relaxed">
            {data.subtitle}
          </p>

          {/*  Timeline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-2xl bg-green-100 border border-green-200 text-green-600 flex items-center justify-center flex-shrink-0">
                <MdVerified size={18} />
              </div>
              <p className="m-0 text-[13px] font-extrabold text-slate-700">
                Started on:{" "}
                <b className="font-black text-slate-900">{data.startedOn}</b>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0">
                <BsFileEarmarkPdfFill size={16} />
              </div>
              <p className="m-0 text-[13px] font-extrabold text-slate-700">
                Submitted on:{" "}
                <b className="font-black text-slate-900">{data.submittedOn}</b>
              </p>
            </div>
          </div>

          {/*  Score Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[180px] text-center">
              <p className="m-0 text-[11px] font-black text-slate-500 tracking-wide">
                TOTAL SCORE
              </p>
              <div className="mt-2 flex justify-center items-baseline gap-1">
                <span className="text-[28px] font-black text-green-600">
                  {data.outOf}
                </span>
              </div>
            </div>

            <div className="hidden md:block w-px h-[54px] bg-slate-200" />

            <div className="flex-1 min-w-[180px] text-center">
              <p className="m-0 text-[11px] font-black text-slate-500 tracking-wide">
                GRADE
              </p>
              <div className="mt-2 text-[32px] font-black text-green-600">
                {data.grade}
              </div>
            </div>
          </div>
        </div>

        {/*  Submission Card */}
        <div className="m-3.5">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-[15px] font-black text-slate-900">
              Your Tasks
            </h2>
          </div>

          <div className="mt-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl shadow-slate-900/5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-[52px] h-[52px] rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center flex-shrink-0">
                <BsFileEarmarkPdfFill size={22} />
              </div>

              <div className="min-w-0">
                <h3 className="m-0 text-[14px] font-black text-slate-900 max-w-[380px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {data.submission.fileName}
                </h3>
                <p className="mt-1 text-[12px] font-bold text-slate-500">
                  {data.submission.fileSize} • {data.submission.submittedAt}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl font-black cursor-pointer transition active:scale-[0.98] bg-white border border-slate-200 text-slate-900"
                type="button"
              >
                View File
              </button>
              <button
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl font-black cursor-pointer transition active:scale-[0.98] bg-blue-600 text-white flex items-center justify-center gap-2"
                type="button"
              >
                <FiDownload size={16} />
                Download
              </button>
            </div>
          </div>
        </div>

        {/*  Submission Card 2 */}
        <div className="m-3.5">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-[15px] font-black text-slate-900">
              Your Submission
            </h2>
          </div>

          <div className="mt-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl shadow-slate-900/5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-[52px] h-[52px] rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center flex-shrink-0">
                <BsFileEarmarkPdfFill size={22} />
              </div>

              <div className="min-w-0">
                <h3 className="m-0 text-[14px] font-black text-slate-900 max-w-[380px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {data.submission.fileName}
                </h3>
                <p className="mt-1 text-[12px] font-bold text-slate-500">
                  {data.submission.fileSize} • {data.submission.submittedAt}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl font-black cursor-pointer transition active:scale-[0.98] bg-blue-600 text-white"
                type="button"
              >
                Submitted
              </button>
            </div>
          </div>
        </div>

        {/*  Instructions */}
        <div className="m-3.5">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-[15px] font-black text-slate-900">
              Instructions
            </h2>
          </div>

          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="m-0 text-[13px] font-extrabold text-slate-700 leading-relaxed">
              {data.instructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsAssignment;