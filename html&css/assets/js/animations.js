document.addEventListener("DOMContentLoaded", function () {
  // Create the Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Add the is-visible class when the element enters the viewport
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Unobserve after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Trigger when at least 10% of the element is visible
    }
  );

  // Observe all elements with animate-up class
  document.querySelectorAll(".animate-up").forEach((element) => {
    observer.observe(element);
  });
});
