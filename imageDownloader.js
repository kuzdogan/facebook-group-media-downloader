// This downloads smaller resolutions.
const imagesContainerSelector = '<paste-here>'
const downloadInterval = 200; //ms
const scrollInterval = 100;

const container = document.querySelector(imagesContainerSelector)

// Scroll to bottom
autoScroll()
  .then(() => {
    let links = getAllLinks(container);
    console.log('Will download ' + links.length + 'files!');
    return downloadAll(links, downloadInterval);
  })
  .then(() => {
    console.log('Downloaded all files successfully!')
  })


// https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
function autoScroll() {
  return new Promise((resolve, reject) => {
    var totalHeight = 0;
    var distance = 50;
    var timer = setInterval(() => {
      var scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, distance);
      totalHeight += distance;

      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, scrollInterval);
  });
}

function downloadAll(links, timeout) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < links.length; i++) {
      download(links[i], `${i}.jpg`);
      // console.log(links[i])
      await timeoutPromise(timeout);
    }
  })
}

function timeoutPromise(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
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
    }
    );
  });
}

function getAllLinks(container) {
  let array = [];
  for (let i = 1; i <= container.childElementCount; i++) {
    let link = container.querySelector(`div:nth-of-type(${i}) > div > div > div > div > a > img`).getAttribute('src');
    array.push(link);
  }
  return array;
}
