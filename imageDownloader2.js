// Downloads original sizes and keeps video links.
const nextButtonSelector = '[aria-label="Next photo"]'

const imageSelector = '<paste-here>'

const downloadInterval = 2000; //ms

let nextButton;
let imageLink;
let videoLink;
let prevImageLink;
let prevVideoLink;
let i = 1;
let videoLinks = [];
console.log('Starting downloads...');

iterateMedia().then(() => {
  console.log("Here are the links to the videos:")
  console.log(videoLinks)
});

function iterateMedia() {
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      nextButton = document.querySelector(nextButtonSelector);
      if (document.querySelector(imageSelector)) { // is photo
        imageLink = document.querySelector(imageSelector).getAttribute('src');
        if (prevImageLink === imageLink) { // end
          clearInterval(interval)
          console.log("Downloaded all images!")
          console.log("Total: " + i + " images");
          console.log("Total: " + videoLinks.length + " videos");
          resolve();
        } else {
          console.log('Downloading image ' + i);
          console.log('Photo: ' + window.location.href);
          window.localStorage.setItem('lastImageURL', window.location.href)
          download(imageLink, `${i++}.jpg`)
          prevImageLink = imageLink;
        }
      } else { // is video
        console.log('Video: ' + window.location.href);
        videoLink = videoLinks.push(window.location.href);
        if (prevVideoLink === videoLink) { // end
          console.log("Downloaded all images!")
          console.log("Total: " + i + " images");
          console.log("Total: " + videoLinks.length + " videos");
          resolve();
        } else {
          window.localStorage.setItem('videos', videoLinks)
          prevVideoLink = videoLink;
        }
      }
      nextButton.click();
    }, downloadInterval)
  })
}

// https://stackoverflow.com/questions/3916191/download-data-url-file
function download(url, filename) {
  fetch(url).then(function (t) {
    return t.blob().then((b) => {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.setAttribute("download", filename);
      a.click();
      a.remove();
    }
    );
  });
}
