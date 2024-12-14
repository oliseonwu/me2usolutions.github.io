// Initialize Parse

async function joinWaitlist(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;

  try {
    const _vid = await window._t();
    await Parse.Cloud.run("joinWaitlist", {
      email,
      _vid,
    });

    // Clear form
    document.getElementById("waitlistForm").reset();
    alert("Successfully joined the waiting list!");
  } catch (error) {
    if (error.code === Parse.Error.DUPLICATE_VALUE) {
      alert(
        "Looks like you're already on our waiting list! We'll notify you when we launch."
      );
    } else {
      console.error("Error: ", error);
      alert("Error joining the waiting list. Please try again.");
    }
  }
}
