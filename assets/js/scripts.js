function trackMatomo(command) {
  const queue = (window._paq = window._paq || []);
  queue.push(command);
}

function clickBehavior(event) {
  if (event) {
    event.preventDefault();
  }

  const section = this.parentElement.parentElement;
  const isActive = section.classList.contains("active");

  for (const currentSection of document.getElementsByTagName("section")) {
    currentSection.classList.remove("active");
    const article = currentSection.getElementsByTagName("article")[0];
    article.setAttribute("aria-hidden", "true");
  }

  let title;
  let link;

  if (!isActive) {
    section.classList.add("active");
    const article = section.getElementsByTagName("article")[0];
    article.removeAttribute("aria-hidden");
    title = this.getAttribute("data-title");
    link = this.getAttribute("href");
  } else {
    title = document.body.getAttribute("data-title");
    link = "/";
  }

  if (event) {
    history.pushState({ id: section.getAttribute("id") }, title, link);
    trackMatomo(["setCustomUrl", link]);
    trackMatomo(["setDocumentTitle", title]);
    trackMatomo(["trackPageView"]);
  }

  document.title = title;
  return false;
}

function audioBehaviors(element) {
  element.addEventListener("play", function () {
    trackMatomo(["trackEvent", "Audio", "Play", element.getAttribute("data-title"), element.currentTime]);
  });
  element.addEventListener("pause", function () {
    trackMatomo(["trackEvent", "Audio", "Pause", element.getAttribute("data-title"), element.currentTime]);
  });
  element.addEventListener("seeked", function () {
    trackMatomo(["trackEvent", "Audio", "Seeked", element.getAttribute("data-title"), element.currentTime]);
  });
  element.addEventListener("ended", function () {
    trackMatomo(["trackEvent", "Audio", "Ended", element.getAttribute("data-title"), element.currentTime]);
  });
}

window.onpopstate = function (event) {
  let section;

  if (event.state?.id) {
    section = document.getElementById(event.state.id);
  } else {
    section = document.getElementsByClassName("active")[0];
  }

  if (section) {
    const link = section.getElementsByTagName("h2")[0].getElementsByTagName("a")[0];
    clickBehavior.call(link);
  }
};

for (const link of document.getElementsByClassName("mono-link")) {
  link.addEventListener("click", clickBehavior);
}

for (const audio of document.getElementsByTagName("audio")) {
  audioBehaviors(audio);
}
