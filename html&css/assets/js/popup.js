// Show popup after 3 seconds
setTimeout(() => {
  if (shouldShowPopup()) {
    const popup = document.getElementById("feedbackPopup");
    popup.style.display = "block";
    popup.classList.add("popup-show");
  }
}, 3000);

function dismissPopup() {
  const popup = document.getElementById("feedbackPopup");
  popup.classList.remove("popup-show");
  popup.classList.add("popup-hide");
  // Hide popup after animation completes
  setTimeout(() => {
    popup.style.display = "none";
  }, 300);
  // Save dismissal time to localStorage
  localStorage.setItem("feedbackPopupDismissed", new Date().getTime());
}

function acceptFeedback() {
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSdEnjwSuuKCmMMV-0I4fehVAfmIyg28TR7V6W-cU0HfGffnRA/viewform",
    "_blank"
  );
  dismissPopup();
}

// Check if popup should be shown
function shouldShowPopup() {
  const dismissedTime = localStorage.getItem("feedbackPopupDismissed");
  if (!dismissedTime) return true;

  const currentTime = new Date().getTime();
  const hoursSinceDismissed = (currentTime - dismissedTime) / (1000 * 60 * 60);

  // return true if it's been more than 24 hours
  return hoursSinceDismissed >= 24;
}

// Check on page load
window.onload = function () {
  if (!shouldShowPopup()) {
    document.getElementById("feedbackPopup").style.display = "none";
  }
};
