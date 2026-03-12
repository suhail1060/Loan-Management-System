import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loanAPI } from '../services/api';

function ApplyLoan() {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loanAPI.create({
        user_id: user.id,
        amount: parseFloat(amount),
        purpose: purpose
      });

      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit loan application');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Apply for Loan
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Loan Application
            </h2>
            <p className="text-gray-600">
              Fill out the form below to apply for a loan. Our team will review your application.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Loan Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1000"
                max="1000000"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 50000"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter an amount between $1,000 and $1,000,000
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Purpose of Loan
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a purpose</option>
                <option value="Home Purchase">Home Purchase</option>
                <option value="Home Renovation">Home Renovation</option>
                <option value="Car Purchase">Car Purchase</option>
                <option value="Education">Education</option>
                <option value="Business Expansion">Business Expansion</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Debt Consolidation">Debt Consolidation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {purpose === 'Other' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Please specify
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the purpose of your loan"
                />
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Loan Summary
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p><span className="font-medium">Requested Amount:</span> ${amount ? parseFloat(amount).toLocaleString() : '0'}</p>
                <p><span className="font-medium">Purpose:</span> {purpose || 'Not selected'}</p>
                <p><span className="font-medium">Applicant:</span> {user?.full_name}</p>
                <p><span className="font-medium">Status:</span> <span className="text-yellow-600 font-semibold">Pending Review</span></p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplyLoan;