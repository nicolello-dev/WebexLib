// Add more buttons for playback speed
const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5];

const zoomSVG = `<?xml version="1.0" encoding="iso-8859-1"?>
<svg stroke="#000000" version="1.1" id="Layer_1"
	xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 299.998 299.998" xml:space="preserve">
<g>
	<g>
		<g>
			<path d="M139.414,96.193c-22.673,0-41.056,18.389-41.056,41.062c0,22.678,18.383,41.062,41.056,41.062
				c22.678,0,41.059-18.383,41.059-41.062C180.474,114.582,162.094,96.193,139.414,96.193z M159.255,146.971h-12.06v12.06
				c0,4.298-3.483,7.781-7.781,7.781c-4.298,0-7.781-3.483-7.781-7.781v-12.06h-12.06c-4.298,0-7.781-3.483-7.781-7.781
				c0-4.298,3.483-7.781,7.781-7.781h12.06v-12.063c0-4.298,3.483-7.781,7.781-7.781c4.298,0,7.781,3.483,7.781,7.781v12.063h12.06
				c4.298,0,7.781,3.483,7.781,7.781C167.036,143.488,163.555,146.971,159.255,146.971z"/>
			<path d="M149.997,0C67.157,0,0.001,67.158,0.001,149.995s67.156,150.003,149.995,150.003s150-67.163,150-150.003
				S232.836,0,149.997,0z M225.438,221.254c-2.371,2.376-5.48,3.561-8.59,3.561s-6.217-1.185-8.593-3.561l-34.145-34.147
				c-9.837,6.863-21.794,10.896-34.697,10.896c-33.548,0-60.742-27.196-60.742-60.744c0-33.548,27.194-60.742,60.742-60.742
				c33.548,0,60.744,27.194,60.744,60.739c0,11.855-3.408,22.909-9.28,32.256l34.56,34.562
				C230.185,208.817,230.185,216.512,225.438,221.254z"/>
		</g>
	</g>
</g>
</svg>`;

/**
 *
 * @param {HTMLVideoElement} video
 * @returns
 */
function addZoomButton(video) {
  const zoomButton = document.createElement("wxp-zoom-button");
  zoomButton.style = `
    cursor: pointer;
    stroke: white;
    background-color: #FFFFFF;
    align-items: center;
    border-radius: 32px;
    display: flex;
    height: 32px;
    justify-content: center;
    margin-right: 6px;
    margin-inline-end: 6px;
    min-width: 32px;`;

  videoDefaultComputedStyleMap = video.computedStyleMap();

  zoomButton.addEventListener("click", () => {
    if (video.style.transform === "scale(4)") {
      video.style = videoDefaultComputedStyleMap;
      video.removeEventListener("mousemove", () => {});
    } else {
      video.parentElement.style.position = "relative";
      video.style.position = "absolute";
      video.style.top = "0";
      video.style.left = "0";
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.transform = "scale(4)";
      video.addEventListener("mousemove", (e) => {
        const rect = video.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        video.style.transformOrigin = `${(offsetX / rect.width) * 100}% ${
          (offsetY / rect.height) * 100
        }%`;
      });
    }
  });

  zoomButton.innerHTML = zoomSVG;
  const controlBar = document.querySelector("wxp-controlbar");
  if (!controlBar) {
    console.warn("Control bar not found");
    return;
  }
  // Insert the button before the follow speaker button
  controlBar.children[1].insertBefore(
    zoomButton,
    controlBar.children[1].children[7]
  );
}

function onVideoStart() {
  let playbackControl;
  let playbackContainer;
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
