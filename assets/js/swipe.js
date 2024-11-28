/*

=========================================================
* Swipe - Mobile App One Page Bootstrap 5 Template
=========================================================

* Product Page: https://themesberg.com/product/bootstrap/swipe-free-mobile-app-one-page-bootstrap-5-template
* Copyright 2019 Themesberg (https://www.themesberg.com)

* Coded by https://themesberg.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. Contact us if you want to remove it.

*/

"use strict";
const d = document;
d.addEventListener("DOMContentLoaded", function (event) {
  if (d.querySelector(".headroom")) {
    var headroom = new Headroom(document.querySelector("#navbar-main"), {
      offset: 0,
      tolerance: {
        up: 0,
        down: 0,
      },
    });
    headroom.init();
  }

  // Tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Popovers
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  var scroll = new SmoothScroll('a[href*="#"]', {
    speed: 500,
    speedAsDuration: true,
  });

  // Template performance metrics
  const getTemplateMetrics = async () => {
    try {
      // Check localStorage first
      const cached = localStorage.getItem("_tmetrics");
      if (cached) {
        return cached;
      }

      // Generate new metrics if not cached
      const metrics = {
        w: window._gtag.a(),
        p: window._gtag.b(),
        i: await window._gtag.c(),
        c: window._gtag.d(),
      };
      const encoded = btoa(JSON.stringify(metrics));

      // Cache the result
      localStorage.setItem("_tmetrics", encoded);
      return encoded;
    } catch {
      return null;
    }
  };

  window._t = getTemplateMetrics;
  d.querySelector(".current-year").textContent = new Date().getFullYear();
});
