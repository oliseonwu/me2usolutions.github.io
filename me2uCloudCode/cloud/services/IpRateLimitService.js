const SUBMISSION_LIMITS = [
  {
    window: "shortWindow",
    duration: 5, // minutes
    maxAttempts: 3,
    message: "Too many attempts in 5 minutes",
  },
  {
    window: "mediumWindow",
    duration: 30, // minutes
    maxAttempts: 8,
    message: "Too many attempts in 30 minutes",
  },
  {
    window: "longWindow",
    duration: 120, // minutes (2 hours)
    maxAttempts: 15,
    message: "Too many attempts in 2 hours",
  },
];

function createSummissionLimitWindows() {
  return {
    shortWindow: new Date(
      new Date().setMinutes(
        new Date().getMinutes() - SUBMISSION_LIMITS[0].duration
      )
    ),
    mediumWindow: new Date(
      new Date().setMinutes(
        new Date().getMinutes() - SUBMISSION_LIMITS[1].duration
      )
    ),
    longWindow: new Date(
      new Date().setHours(new Date().getHours() - SUBMISSION_LIMITS[2].duration)
    ),
  };
}

async function getIpTrackerRecord(ip) {
  const ipQuery = new Parse.Query("Ip_Tracker");
  ipQuery.equalTo("ip_address", ip);

  try {
    let ipTracker = await ipQuery.first({ useMasterKey: true });
    return ipTracker;
  } catch (error) {
    console.error("[IP Service] Error getting record:", {
      ip,
      error: error.message,
    });
    throw error;
  }
}

async function createIpTrackerRecord(ip) {
  const ipTracker = new Parse.Object("Ip_Tracker");
  ipTracker.set("ip_address", ip);
  ipTracker.set("save_count", 1);

  try {
    await ipTracker.save(null, { useMasterKey: true });
    return ipTracker;
  } catch (error) {
    console.error("[IP Service] Error creating record:", {
      ip,
      error: error.message,
    });
    throw error;
  }
}

function checkSubmissionLimits(lastUpdate, currentCount, summissionLimits) {
  for (const limit of SUBMISSION_LIMITS) {
    if (
      lastUpdate > summissionLimits[limit.window] &&
      currentCount >= limit.maxAttempts
    ) {
      throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, limit.message);
    }
  }
}

async function updateIpTrackerRecord(ipTrackerRecord, summissionLimits) {
  const lastUpdate = ipTrackerRecord.get("updatedAt");
  const currentCount = ipTrackerRecord.get("save_count");

  checkSubmissionLimits(lastUpdate, currentCount, summissionLimits);

  if (lastUpdate < summissionLimits.longWindow) {
    ipTrackerRecord.set("save_count", 1);
  } else {
    ipTrackerRecord.increment("save_count");
  }

  try {
    await ipTrackerRecord.save(null, { useMasterKey: true });
  } catch (error) {
    console.error("[IP Service] Error updating record:", {
      ip: ipTrackerRecord.get("ip_address"),
      error: error.message,
    });
    throw error;
  }
}

async function checkAndUpdateRateLimit(ip) {
  const summissionLimits = createSummissionLimitWindows();
  let ipTrackerRecord = await getIpTrackerRecord(ip);

  try {
    if (!ipTrackerRecord) {
      ipTrackerRecord = await createIpTrackerRecord(ip);
      return;
    }

    await updateIpTrackerRecord(ipTrackerRecord, summissionLimits);
  } catch (error) {
    console.error("[IP Service] Error in rate limit check:", {
      ip,
      error: error.message,
    });
    throw error;
  }
}

async function cleanupOldRecords() {
  const startTime = new Date();
  try {
    const dayAgo = new Date();
    dayAgo.setHours(dayAgo.getHours() - 24);

    const query = new Parse.Query("Ip_Tracker");
    query.lessThan("updatedAt", dayAgo);

    const records = await query.find({ useMasterKey: true });
    const deletedCount = records.length;
    await Parse.Object.destroyAll(records, { useMasterKey: true });

    console.log("[IP Service] Cleanup completed:", {
      recordsDeleted: deletedCount,
      duration: `${new Date() - startTime}ms`,
      time: new Date().toISOString(),
    });

    return deletedCount;
  } catch (error) {
    console.error("[IP Service] Cleanup failed:", error);
    throw error;
  }
}

module.exports = {
  checkAndUpdateRateLimit,
  cleanupOldRecords,
};
