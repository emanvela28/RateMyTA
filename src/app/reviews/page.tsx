'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewsPage() {
  const router = useRouter();
  const [bugEncountered, setBugEncountered] = useState('No');
  const [bugDetails, setBugDetails] = useState('');
  const [easeOfUse, setEaseOfUse] = useState(3);
  const [experience, setExperience] = useState(3);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/site-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bugEncountered: bugEncountered === 'Yes',
          bugDetails,
          easeOfUse,
          experience,
          additionalFeedback,
        }),
      });
  
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };  

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-4 text-green-600">Thank you!</h1>
        <p className="text-lg text-gray-600">Redirecting you home...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8">Website Feedback</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Bugs Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Bugs</h2>
            <label className="block mb-2 font-medium">Did you encounter any bugs?</label>
            <select
              value={bugEncountered}
              onChange={(e) => setBugEncountered(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>

            {bugEncountered === 'Yes' && (
              <div className="mt-4">
                <label className="block mb-2 font-medium">If yes, please describe:</label>
                <textarea
                  value={bugDetails}
                  onChange={(e) => setBugDetails(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                  placeholder="Describe the bug you encountered..."
                />
              </div>
            )}
          </section>

          <hr />

          {/* Navigation Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Navigation</h2>
            <label className="block mb-2 font-medium">
              Was the website easy to navigate? (1 = very hard, 5 = very easy)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={easeOfUse}
              onChange={(e) => setEaseOfUse(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="text-center text-gray-600">{easeOfUse}</div>
          </section>

          <hr />

          {/* Experience Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Experience</h2>
            <label className="block mb-2 font-medium">
              How would you rate your overall experience? (1 = bad, 5 = great)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="text-center text-gray-600">{experience}</div>
          </section>

          <hr />

          {/* Additional Feedback */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Additional Feedback</h2>
            <textarea
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Anything else you'd like to share?"
            />
          </section>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
