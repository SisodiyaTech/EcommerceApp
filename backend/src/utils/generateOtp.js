const generateOtp = async () => {
     const otp = await Math.floor(100000 + Math.random() * 900000);
    return otp;
}
export default generateOtp;