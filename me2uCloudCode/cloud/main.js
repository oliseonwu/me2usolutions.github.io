const {
  checkAndUpdateRateLimit,
  cleanupOldRecords,
} = require("./services/IpRateLimitService");

Parse.Cloud.job("cleanupIPTracker", async () => {
  return cleanupOldRecords();
});

Parse.Cloud.define("getUserIP", async (request) => {
  console.log("Request: ", request);
  const userIP = request.ip; // Get the user's IP address
  var clientIP = request.headers["x-real-ip"];
  return { ip: request }; // Return the IP address in the response
});

Parse.Cloud.define("joinWaitlist", async (request) => {
  const { email, _vid } = request.params;
  const decodedData = JSON.parse(atob(_vid));
  // _vid is a base64 encoded string of an object with the following properties:
  // w: window.innerWidth
  // p: navigator.hardwareConcurrency
  // i: ThumbmarkJS.getFingerprint() // This is the actual fingerprint for the user client agent
  // c: screen.colorDepth

  try {
    // Check for duplicate email
    await checkDuplicateEmail(email);

    // Check rate limits
    await checkAndUpdateRateLimit(decodedData.i);

    // Create and save waitlist record
    const waitlistRecord = new Parse.Object("Waitlist");
    waitlistRecord.set("email", email);
    await waitlistRecord.save(null, { useMasterKey: true });

    return { success: true, message: "Successfully joined waitlist" };
  } catch (error) {
    throw error;
  }
});

async function checkDuplicateEmail(email) {
  const emailQuery = new Parse.Query("Waitlist");
  emailQuery.equalTo("email", email);
  const existingEmail = await emailQuery.first({ useMasterKey: true });

  if (existingEmail) {
    throw new Parse.Error(
      Parse.Error.DUPLICATE_VALUE,
      "This email is already on the waitlist"
    );
  }
}
