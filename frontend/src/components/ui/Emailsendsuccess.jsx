import React from 'react';

function EmailSentNotification() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">Email sent successfully</h2>
        <p className="text-gray-600 mb-6">
          Please check your email inbox and follow the instructions to securely reset your password.
        </p>
        <img src="emailsent.jpg" alt="Email Icon" className="mx-auto w-50 h-50" />
      </div>
    </div>
  );
}

export default EmailSentNotification;