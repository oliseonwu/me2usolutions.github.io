let vimeoPlayer;

document.addEventListener("DOMContentLoaded", function () {
  const thumbnail = document.getElementById("videoThumbnail");
  const vimeoContainer = document.getElementById("vimeoContainer");
  const iframe = document.getElementById("demoVideo");

  // Initialize Vimeo player
  vimeoPlayer = new Vimeo.Player(iframe);

  if (thumbnail) {
    thumbnail.addEventListener("click", function () {
      // Hide thumbnail
      thumbnail.style.display = "none";

      // Show iframe container
      vimeoContainer.classList.remove("video-hidden");
      vimeoContainer.classList.add("video-visible");

      // Play video
      vimeoPlayer.play();
    });
  }

  // Listen for video end
  vimeoPlayer.on("ended", function () {
    // Hide video
    vimeoContainer.classList.remove("video-visible");
    vimeoContainer.classList.add("video-hidden");

    // Reset video
    vimeoPlayer.setCurrentTime(0);

    // Show thumbnail
    thumbnail.style.display = "block";
  });

  vimeoPlayer.on("pause", function () {
    // Hide video
    vimeoContainer.classList.remove("video-visible");
    vimeoContainer.classList.add("video-hidden");

    // Show thumbnail
    thumbnail.style.display = "block";
  });
});
