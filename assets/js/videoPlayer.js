document
  .getElementById("videoThumbnail")
  .addEventListener("click", function () {
    // Hide thumbnail
    this.style.display = "none";
    // Show and play video
    const video = document.getElementById("demoVideo");
    video.classList.remove("video-hidden");
    video.classList.add("video-visible");
    video.play();
  });

// Add event listener for when video ends
document.getElementById("demoVideo").addEventListener("ended", function () {
  // Hide video
  this.classList.remove("video-visible");
  this.classList.add("video-hidden");
  // Reset video to beginning
  this.currentTime = 0;
  // Show thumbnail
  document.getElementById("videoThumbnail").style.display = "block";
});
