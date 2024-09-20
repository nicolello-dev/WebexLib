// Add more buttons for playback speed
const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5];

const zoomSVG = `<svg fill="#FFFFFF" width="100%" height="100%" version="1.1" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg">
 <path d="m589.38 544.89-108.02-108.02c15.418-23.68 24.434-51.895 24.434-82.223 0-83.332-67.812-151.14-151.14-151.14-83.328 0-151.14 67.812-151.14 151.14s67.812 151.14 151.14 151.14c30.328 0 58.543-9.0195 82.223-24.434l107.96 107.96c5.8945 5.8945 13.652 8.8164 21.363 8.8164 7.707 0 15.469-2.9219 21.363-8.8164l1.7148-1.7148c5.6914-5.6914 8.8672-13.301 8.8672-21.363-0.003906-8.0586-3.0781-15.668-8.7734-21.359zm-234.72-59.25c-72.246 0-130.99-58.746-130.99-130.99s58.746-130.99 130.99-130.99 130.99 58.746 130.99 130.99c-0.003907 72.25-58.746 130.99-130.99 130.99zm220.46 87.715-1.7148 1.7148c-3.9297 3.9297-10.328 3.9297-14.258 0l-106-105.95c5.6914-4.9375 11.035-10.277 15.973-15.973l105.95 105.95c3.9766 3.9844 3.9766 10.332 0.046875 14.262zm-160.01-218.7c0 5.543-4.5352 10.078-10.078 10.078h-40.305v40.305c0 5.543-4.5352 10.078-10.078 10.078-5.543 0-10.078-4.5352-10.078-10.078v-40.305h-40.305c-5.543 0-10.078-4.5352-10.078-10.078s4.5352-10.078 10.078-10.078h40.305v-40.305c0-5.543 4.5352-10.078 10.078-10.078 5.543 0 10.078 4.5352 10.078 10.078v40.305h40.305c5.543 0 10.078 4.5352 10.078 10.078z"/>
</svg>`;

/**
 *
 * @param {HTMLVideoElement} video
 * @returns
 */
function toggleZoom(video) {
  if (video.style.transform === "scale(4)") {
    video.style = videoDefaultComputedStyleMap;
    video.removeEventListener("mousemove", () => {});
  } else {
    video.parentElement.style.position = "relative";
    video.parentElement.style.overflow = "hidden";
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.transform = "scale(4)";
    video.addEventListener("mousemove", (e) => {
      const controlByMouse = video.getAttribute("data-controlmode") === "mouse";
      if (controlByMouse) {
        return;
      }
      const rect = video.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      video.style.transformOrigin = `${(offsetX / rect.width) * 100}% ${
        (offsetY / rect.height) * 100
      }%`;
    });
  }
}

/**
 *
 * @param {HTMLVideoElement} video
 * @returns
 */
function addZoomButton(video) {
  // Do not add the button multiple times
  if (document.querySelector("wxp-zoom-button")) {
    console.log("WEBEXLIB: Button has already been added, skipping");
    return;
  }
  const zoomButtonWrapper = document.createElement("wxp-zoom-button");
  zoomButtonWrapper.classList.add("wxp-control-button");
  zoomButtonWrapper.style = `
    align-items: center;
    border-radius: 32px;
    display: flex;
    height: 32px;
    justify-content: center;
    margin-right: 6px;
    margin-inline-end: 6px;
    min-width: 32px;`;

  const zoomButton = document.createElement("button");

  zoomButton.style = `
    min-width: 32px;`;
  zoomButtonWrapper.appendChild(zoomButton);

  videoDefaultComputedStyleMap = video.computedStyleMap();

  zoomButton.addEventListener("click", () => toggleZoom(video));

  zoomButton.innerHTML = zoomSVG;
  const controlBar = document.querySelector("wxp-controlbar");
  if (!controlBar) {
    console.warn("Control bar not found");
    return;
  }
  // Insert the button before the follow speaker button
  controlBar.children[1].insertBefore(
    zoomButtonWrapper,
    controlBar.children[1].children[7]
  );
}

function onVideoStart() {
  const video = document.querySelector("video");

  addZoomButton(video);
  console.log("Clicked play button");

  // Set up forwards / backwards motions with j and l
  document.addEventListener("keydown", (e) => {
    if (e.key === "j") {
      video.currentTime -= 10;
    } else if (e.key === "l") {
      video.currentTime += 10;
    } else if (e.key === "k") {
      video.paused ? video.play() : video.pause();
    } else if (e.key === "m") {
      video.muted = !video.muted;
    } else if (e.key === "ArrowRight") {
      video.currentTime -= 5;
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "ArrowLeft") {
      video.currentTime += 5;
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "z") {
      const controlMode = video.getAttribute("data-controlmode");
      if (controlMode !== "mouse") {
        video.setAttribute("data-controlmode", "mouse");
      } else {
        video.setAttribute("data-controlmode", "none");
      }
    }
  });
  const playbackControl = document.querySelector("wxp-playback-rate-control");
  const playbackText = playbackControl.children[0];
  const playbackContainer = playbackControl.querySelector(
    "ul.wxp-playback-rate-popover-menu"
  );
  playbackContainer.innerHTML = "";

  const checkSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" class="wxp-icon-check-bold wxp-icon" fill="currentcolor"><path d="M11.2 24.2a1 1 0 0 1-.708-.295l-7.2-7.235a1 1 0 1 1 1.417-1.41l6.545 6.577L27.35 8.042a1 1 0 1 1 1.3 1.517l-16.8 14.4a1 1 0 0 1-.65.24"></path></svg>`;

  const onPlaybackRateChange = () => {
    playbackContainer.childNodes.forEach((node) => {
      const mark = node.children[1];
      console.log(node.innerText, video.playbackRate);
      if (parseFloat(node.innerText) === video.playbackRate) {
        mark.style.display = "block";
      } else {
        mark.style.display = "none";
      }
    });
    // Wait a bit for the text to update
    setTimeout(() => {
      playbackText.innerText = `${video.playbackRate}X`;
    }, 10);
  };

  playbackSpeeds.reverse().forEach((speed) => {
    // li for styling purposes, since the original buttons are styled as list items
    const button = document.createElement("li");
    button.classList.add("wxp-playback-rate-popover-menu-item");
    // The button has two children, one for the text and one for the tick
    const text = document.createElement("div");
    text.classList.add("wxp-playback-rate-li-text");
    text.innerText = `${speed}X`;
    button.appendChild(text);
    const mark = document.createElement("div");
    mark.classList.add("wxp-playback-rate-li-mark");
    mark.innerHTML = checkSVG;
    mark.style.display = "none";
    button.appendChild(mark);
    button.onclick = () => {
      video.playbackRate = speed;
      onPlaybackRateChange();
    };
    playbackContainer.appendChild(button);
  });
}

let i;
// Try to find the play button every 100ms
i = setInterval(() => {
  const playButton = document.querySelector("#vjs_video_3 > button");

  if (!playButton) {
    console.log("Play button not found. Will try again later");
    return;
  }

  playButton.addEventListener("click", () => setTimeout(onVideoStart, 1000));
  clearInterval(i);
}, 100);
