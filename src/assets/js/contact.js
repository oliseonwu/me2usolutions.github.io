async function submitContactForm(event) {
  event.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const message = document.getElementById("message").value;

  try {
    const _vid = await window._t();
    await Parse.Cloud.run("submitContactForm", {
      name,
      email,
      company,
      message,
      _vid,
    });

    // Clear form
    document.getElementById("contactForm").reset();
    alert("Thank you for contacting us! We'll be in touch soon.");
  } catch (error) {
    console.error("Error: ", error);
    alert("Error submitting the form. Please try again.");
  }
}
