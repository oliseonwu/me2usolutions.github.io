const {
  checkAndUpdateRateLimit,
  cleanupOldRecords,
} = require("./services/IpRateLimitService");

// Parse.Cloud.beforeSave("Waitlist", async (request) => {
//   const email = request.object.get("email");
//   const ip = request.ip;

//   try {
//     await checkDuplicateEmail(email);
//     await checkAndUpdateRateLimit(ip);
//   } catch (error) {
//     throw error;
//   }
// });

Parse.Cloud.job("cleanupIPTracker", async () => {
  return cleanupOldRecords();
});

Parse.Cloud.define("joinWaitlist", async (request) => {
  const { email } = request.params;
  const ip = request.ip;
  console.log("Email: ", email);
  console.log("IP: ", ip);

  try {
    // Check for duplicate email
    await checkDuplicateEmail(email);

    // Check rate limits
    await checkAndUpdateRateLimit(ip);

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
