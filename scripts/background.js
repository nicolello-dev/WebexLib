// Add more buttons for playback speed
const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5];

function onVideoStart() {
  let playbackControl;
  let playbackContainer;
  const video = document.querySelector("video");
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
    }
  });
  playbackControl = document.querySelector("wxp-playback-rate-control");
  const playbackText = playbackControl.children[0];
  playbackContainer = playbackControl.querySelector(
    "ul.wxp-playback-rate-popover-menu"
  );
  playbackContainer.innerHTML = "";

  const checkSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" class="wxp-icon-check-bold wxp-icon" fill="currentcolor"><path d="M11.2 24.2a1 1 0 0 1-.708-.295l-7.2-7.235a1 1 0 1 1 1.417-1.41l6.545 6.577L27.35 8.042a1 1 0 1 1 1.3 1.517l-16.8 14.4a1 1 0 0 1-.65.24"></path></svg>`;

  function onPlaybackRateChange() {
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
  }

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

document.addEventListener("click", () => {
  const playButton = document.querySelector("#vjs_video_3 > button");

  if (!playButton) {
    return;
  }

  playButton.addEventListener("click", () => setTimeout(onVideoStart, 1000));
});
