'use client';

import { useState } from 'react';
import { Flag, X, CheckCircle, AlertTriangle } from 'lucide-react';

type Props = {
  targetType: 'TA' | 'Review';
  targetId: number;
};

export default function ReportButton({ targetType, targetId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function handleSubmit() {
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetType, targetId, reason }),
      });

      if (res.ok) {
        setFeedbackMessage('Thank you for your report. We will review it.');
        setIsError(false);
      } else {
        setFeedbackMessage('Failed to submit your report. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error reporting:', error);
      setFeedbackMessage('Error submitting your report. Please try again.');
      setIsError(true);
    } finally {
      setIsOpen(false);
      setReason('');
    }
  }

  return (
    <>
      {/* Report Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center bg-white border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold px-3 py-2 rounded-md text-sm transition-all shadow-sm"
        title="Report"
      >
        <Flag className="w-4 h-4 mr-1" />
        Report
      </button>

      {/* Report Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-6 py-5 border-b">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Flag className="w-5 h-5 text-red-500 mr-2" /> Report {targetType}
              </h2>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-gray-600">
                Please tell us why you're reporting this {targetType.toLowerCase()}:
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for reporting (optional)"
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:border-red-400 focus:ring-1 focus:ring-red-300 transition resize-none"
              />
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Feedback Modal (Success/Error) */}
      {feedbackMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition"
              onClick={() => setFeedbackMessage('')}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-6 py-8 flex flex-col items-center justify-center space-y-4">
              {isError ? (
                <AlertTriangle className="w-12 h-12 text-red-500" />
              ) : (
                <CheckCircle className="w-12 h-12 text-green-500" />
              )}
              <p className="text-lg font-medium text-gray-700 text-center">
                {feedbackMessage}
              </p>
              <button
                onClick={() => setFeedbackMessage('')}
                className={`mt-2 px-5 py-2 rounded-md ${
                  isError
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white transition`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
