// src/app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"pending" | "accepted" | "reportedTAs" | "reportedReviews" | "schoolManagement">("pending");
  const [pendingTAs, setPendingTAs] = useState<any[]>([]);
  const [acceptedTAs, setAcceptedTAs] = useState<any[]>([]);
  const [reportedTAs, setReportedTAs] = useState<any[]>([]);
  const [reportedReviews, setReportedReviews] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [schoolTAs, setSchoolTAs] = useState<any[]>([]);
  const [schoolReviews, setSchoolReviews] = useState<any[]>([]);


  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.email !== "avelazquez48@ucmerced.edu") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.email === "avelazquez48@ucmerced.edu") {
      fetchData();
    }
  }, [session]);

  async function fetchData() {
    const [pending, accepted, reportedTa, reportedReview, allSchools] = await Promise.all([
      fetch("/api/admin/pending-tas").then((res) => res.json()),
      fetch("/api/admin/accepted-tas").then((res) => res.json()),
      fetch("/api/admin/reported-tas").then((res) => res.json()),
      fetch("/api/admin/reported-reviews").then((res) => res.json()),
      // fetch("/api/admin/schools").then((res) => res.json()),
    ]);
    
    setPendingTAs(pending);
    setAcceptedTAs(accepted);
    setReportedTAs(reportedTa);
    setReportedReviews(reportedReview);
    setSchools(allSchools);
    
  }

  async function fetchSchoolData(schoolId: number) {
    const [tas, reviews] = await Promise.all([
      fetch(`/api/admin/school-tas/${schoolId}`).then((res) => res.json()),
      fetch(`/api/admin/school-reviews/${schoolId}`).then((res) => res.json()),
    ]);
    setSchoolTAs(tas);
    setSchoolReviews(reviews);
  }  

  async function handleApproveTA(id: number) {
    await fetch(`/api/admin/approve-ta/${id}`, { method: "PATCH" });
    fetchData();
  }

  async function handleRejectTA(id: number) {
    await fetch(`/api/admin/reject-ta/${id}`, { method: "DELETE" });
    fetchData();
  }

  async function handleDeleteTA(id: number) {
    await fetch(`/api/admin/delete-ta/${id}`, { method: "DELETE" });
    fetchData();
  }

  async function handleDismissReview(reportId: number) {
    await fetch(`/api/admin/dismiss-review/${reportId}`, { method: "DELETE" });
    fetchData();
  }

  async function handleDeleteReview(reviewId: number) {
    await fetch(`/api/admin/delete-review/${reviewId}`, { method: "DELETE" });
    fetchData();
  }

  async function handleDismissTAReport(reportId: number) {
    await fetch(`/api/admin/dismiss-ta-report/${reportId}`, { method: "DELETE" });
    fetchData();
  }

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        {["pending", "accepted", "reportedTAs", "reportedReviews", "schoolManagement"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded font-semibold ${
              tab === t ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"
            }`}
          >
            {t === "pending" && "Pending TAs"}
            {t === "accepted" && "Accepted TAs"}
            {t === "reportedTAs" && "Reported TAs"}
            {t === "reportedReviews" && "Reported Reviews"}
            {t === "schoolManagement" && "School Management"}
          </button>
        ))}

      </div>

      {/* Content */}
      {tab === "pending" && (
        <div>
          {pendingTAs.length === 0 ? <p>No pending TAs.</p> : pendingTAs.map((ta) => (
            <div key={ta.id} className="border p-6 rounded mb-6 shadow bg-white">
              <p className="text-lg font-bold">Name: {ta.name}</p>
              <p className="text-gray-700 mb-4">Department: {ta.department}</p>
              <div className="flex gap-4">
                <button onClick={() => handleApproveTA(ta.id)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                  Approve
                </button>
                <button onClick={() => handleRejectTA(ta.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "accepted" && (
        <div>
          {acceptedTAs.length === 0 ? <p>No accepted TAs.</p> : acceptedTAs.map((ta) => (
            <div key={ta.id} className="border p-6 rounded mb-6 shadow bg-white">
              <p className="text-lg font-bold">Name: {ta.name}</p>
              <p className="text-gray-700 mb-4">Department: {ta.department}</p>
              <button onClick={() => handleDeleteTA(ta.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                Delete TA
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "reportedTAs" && (
        <div>
          {console.log("🪵 reportedTAs from state:", reportedTAs)}

          {reportedTAs.length === 0 ? (
            <p>No reported TAs.</p>
          ) : (
            <>
              {reportedTAs.map((ta) => (
                <div key={ta.taId} className="border p-6 rounded mb-6 shadow bg-white">
                  <p className="text-lg font-bold">Name: {ta.taName}</p>
                  <p className="text-gray-700">School: {ta.schoolName}</p>
                  <p className="text-gray-700 mb-4">Reason: {ta.reason}</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleDismissTAReport(ta.reportId)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleDeleteTA(ta.taId)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                    >
                      Delete TA
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tab === "reportedReviews" && (
        <div>
          {reportedReviews.length === 0 ? <p>No reported reviews.</p> : reportedReviews.map((review) => (
            <div key={review.reviewId} className="border p-6 rounded mb-6 shadow bg-white">
              <p className="text-lg font-bold">TA: {review.taName}</p>
              <p className="text-gray-700">Course Code: {review.courseCode}</p>
              <p className="text-gray-700">Comment: {review.comment}</p>
              <p className="text-gray-700 mb-4">Reason: {review.reason}</p>
              <div className="flex gap-4">
                <button onClick={() => handleDismissReview(review.reportId)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                  Dismiss Report
                </button>
                <button onClick={() => handleDeleteReview(review.reviewId)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "schoolManagement" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Schools</h2>

          {/* Select School */}
          <select
            className="border p-2 mb-6"
            onChange={(e) => {
              const id = parseInt(e.target.value);
              setSelectedSchoolId(id);
              fetchSchoolData(id);
            }}
            value={selectedSchoolId ?? ""}
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>

          {/* Show TAs for selected school */}
          {selectedSchoolId && (
            <div>
              <h3 className="text-xl font-semibold mb-2">TAs</h3>
              {schoolTAs.length === 0 ? (
                <p>No TAs found for this school.</p>
              ) : (
                schoolTAs.map((ta) => (
                  <div key={ta.id} className="border p-4 rounded mb-4 bg-white shadow">
                    <p className="font-bold">{ta.name}</p>
                    <p className="text-gray-700 mb-2">Department: {ta.department}</p>
                    <button
                      onClick={() => handleDeleteTA(ta.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                    >
                      Delete TA
                    </button>

                    {/* Reviews for this TA */}
                    <div className="ml-6 mt-4">
                      <h4 className="font-semibold mb-2">Reviews:</h4>
                      {schoolReviews
                        .filter((review) => review.taId === ta.id)
                        .map((review) => (
                          <div key={review.id} className="border p-3 mb-2 rounded bg-gray-50">
                            <p className="text-gray-800 mb-1">Course: {review.courseCode}</p>
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded text-sm"
                            >
                              Delete Review
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
