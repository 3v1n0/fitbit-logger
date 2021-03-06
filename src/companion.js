import { inbox } from "file-transfer"

// receive that file from device app
// read it, log it with timestamps and TAG app
// potentially log to a server

var doConsoleLog = false
var url = undefined

const init = (options) => {
  options = options || {}
  if (options.doConsoleLog) { doConsoleLog = true }
  if (options.url) { url = options.url }

  processAllFiles()
  inbox.addEventListener("newfile", processAllFiles)
}

async function processAllFiles() {
  let file;
  while ((file = await inbox.pop())) {
    const text = await file.text();

    let logs = text.split('\n')

    for (let i = 0; i < logs.length; i++) {
      let log = logs[i];

      if (log.length == 0) {
        continue
      }

      if (doConsoleLog) {
        console.log(log);
      }

      if (url) {
        url = url + '?data=' + log
        fetch(url)
          .then((response) => {
            return response.text();
          })
          .catch((error) => {
            console.error("fitbit-logger: fetch failed " + error)
          });
      }
    }
  }
  // TODO clear the file
}

const fitlogger = {
  init: init,
}

export default fitlogger