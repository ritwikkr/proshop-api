function generateOTP(otpLength = 6) {
  let otp = "";
  for (let i = 0; i < otpLength; i++) {
    // Generate a random digit between 0 and 9
    const randomDigit = Math.floor(Math.random() * 10);
    otp += randomDigit.toString();
  }
  return otp;
}

export default generateOTP;
