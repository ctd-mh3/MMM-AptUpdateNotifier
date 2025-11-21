/* node_helper.js
   Place this file in: ~/MagicMirror/modules/MMM-AptUpdateNotifier/node_helper.js
*/

const NodeHelper = require("node_helper");
const { exec } = require("child_process");

module.exports = NodeHelper.create({
  start: function () {
    this.logInformation("info", "MMM-AptUpdateNotifier(node_helper.js) start() called");
  },

  socketNotificationReceived: function (notification, payload) {

    const self = this;

    // Allows MMM-AptUpdateNotifier.js to send logging to go into mm log files 
    if (notification === "APT_CLIENT_LOG" && payload && payload.message) {
      const logLevel = (payload.level || "info").toLowerCase();
      const logMessage = `[APT_CLIENT_LOG] ${payload.message}`;
      this.logInformation(logLevel, logMessage);
    } else if (notification === "APT_START_CHECK") {
      // Configuration from payload
      const command = payload.command;
      const useSudo = payload.useSudo;
      const timeoutMS = payload.timeoutMS;
      const customTextUniqueID = payload.customTextUniqueID;

      // Build the shell command. Using shell allows sudo if required.
      const runCommand = useSudo ? `sudo ${command}` : command;

      // Execute the command
      exec(runCommand, { shell: true, timeout: timeoutMS, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        // Combine stdout/stderr for robust parsing (some warnings may appear on stderr)
        const out = (stdout || "").trim();
        const err = (stderr || "").trim();
        const combined = (out + "\n" + err).trim();

        // Defensive parsing: find all integer sequences and take the last one found.
        // This handles stray warnings or lines preceding the numeric count.
        let count = 0;
        const numMatches = combined.match(/\d+/g);

        if (numMatches && numMatches.length > 0) {
          // Use the last numeric token found
          count = parseInt(numMatches[numMatches.length - 1], 10) || 0;
        } else {
          // If there's no numeric match, fall back to 0
          count = 0;
        }

        // Log for debugging
        if (error) {
          const logMessage = "MMM-AptUpdateNotifier(node_helper.js): APT_START_CHECK received but error running script to pull apt info:" + (error.message || error);

          this.logInformation("error", logMessage);
          // will send result anyway (count may be 0)
        }

        this.logInformation("info","MMM-AptUpdateNotifier(node_helper.js): Sending APT_RESULT notification to MMM-AptUpdateNotifier.js with count:" + count);

        // For debugging keeping combined output; can remove or redact if don't want raw output sent
        self.sendSocketNotification("APT_RESULT", {
          count: count,
          customTextUniqueID: customTextUniqueID, 
          raw: combined,            // optional, useful while testing
          error: error ? error.message : null
        });
      });
    } else {
      this.logInformation("info", "MMM-AptUpdateNotifier(node_helper.js) ignoring socketNotificationReceived() called with notification:" + notification) 
      // Nothing special to do
    }
  },

  // Log info
  logInformation: function(level, message) {

    if (level == "info") {
      console.log(message);
    } else if (level == "warn") {
      console.warn(message);
    } else {
      console.error(message);
    }
  } 
});
