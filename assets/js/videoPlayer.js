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
      thumbnail.classList.remove("thumbnail-visible");
      thumbnail.classList.add("thumbnail-hidden");
      // thumbnail.style.display = "none";

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

    // Show thumbnail
    thumbnail.classList.remove("thumbnail-hidden");
    thumbnail.classList.add("thumbnail-visible");

    setTimeout(() => {
      // Reset video
      vimeoPlayer.setCurrentTime(0);
    }, 1000);
  });

  vimeoPlayer.on("pause", function () {
    // Hide video
    vimeoContainer.classList.remove("video-visible");
    vimeoContainer.classList.add("video-hidden");

    // Show thumbnail
    thumbnail.classList.remove("thumbnail-hidden");
    thumbnail.classList.add("thumbnail-visible");
  });
});
