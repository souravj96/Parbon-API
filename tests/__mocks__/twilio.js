// Mock for Twilio
const mockTwilio = () => ({
  verify: {
    v2: {
      services: () => ({
        verifications: {
          create: () => Promise.resolve({
            sid: 'VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            status: 'pending',
            valid: false
          }),
        },
        verificationChecks: {
          create: () => Promise.resolve({
            sid: 'VExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            status: 'approved',
            valid: true
          }),
        }
      })
    }
  },
  messages: {
    create: () => Promise.resolve({
      sid: 'SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      body: 'Your OTP is: 123456',
      to: '+919876543210',
      from: '+1234567890',
      status: 'sent'
    })
  }
});

export default mockTwilio;