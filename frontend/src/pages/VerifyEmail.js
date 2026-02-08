import React, { useState } from 'react';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');

  return (
    <div className="container">
      <h2>Email Verification</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button>Verify</button>
    </div>
  );
};

export default VerifyEmail;
