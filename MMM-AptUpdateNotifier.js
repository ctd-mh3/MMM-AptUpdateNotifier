Module.register("MMM-AptUpdateNotifier", {

  defaults: {
    checkIntervalInMS: 60 * 60 * 1000, // 1 hour
    command: "/usr/local/bin/check_for_apt_updates.sh",
    useSudo: true,
    timeoutMS: 30000, // 30 seconds
    customTextUniqueID: "aptUpdateNotifier",
  },

  // Perform startup logic
  start: function() {

    this.logInformation("info", "MMM-AptUpdateNotifier: start() called");

    // Hide this module entirely (no UI)
    this.hide(0);

    var self = this;

    // Perform shallow merge with self.config from MagicMirror/config/config.js having precedence
    // Understand that checkIntervalInMS is not used in APT_START_CHECK but for simplicity leaving all defaults in the one structure
    const mergedConfig = { ...defaults, ...(self.config || {}) };

    // Trigger first check immediately, then on interval
    this.sendSocketNotification("APT_START_CHECK", this.config);

    // Set check interval to what was provided in config.js or use default
    const checkIntervalInMS = this.config.checkIntervalMS || this.defaults.checkIntervalInMS;

    this.logInformation("info", "MMM-AptUpdateNotifier: setting command interval (MS) to " + checkIntervalInMS);

    // Set this check to occur at regular intervals
    setInterval(function() { self.sendSocketNotification("APT_START_CHECK", mergedConfig); }, checkIntervalInMS);
  },

  // Keep getDom minimal and empty (module is hidden anyway)
  getDom: function () {

    var wrapper = document.createElement("div");
    wrapper.style.display = "none";

    return wrapper;
  },

  // Process notification received
  socketNotificationReceived: function(notification, payload) {

    // Received a notification with the latest information on # of packages which have updates
    if (notification === "APT_RESULT") {

      this.logInformation("info", "MMM-AptUpdateNotifier: socketNotificationReceived() with notification=APT_RESULT");

      // Forward a notification to MMM-CustomText
      var text = "";
      if (payload.count && payload.count > 0) {
        text = "<span style='color:orange; font-weight:bold;'>" + payload.count + " package update(s) available</span>";
      } else {
        text = ""; // empty hides MMM-CustomText if you prefer
      }
      this.sendNotification("CUSTOMTEXT_UPDATE", {message: text, uniqueID: payload.customTextUniqueID});
    } else {
      // No other notifications are expected
      this.logInformation("warn", "MMM-AptUpdateNotifier: socketNotificationReceived() with incorrect=" + notification);
    }
  },

  // Log to browser console and server-side
  logInformation: function(level, message) {

    if (level == "info") {
      Log.info(message);
    } else if (level == "warn") {
      Log.warn(message);
    } else {
      Log.error(message);
    }

    // client: send message to node_helper.js for server-side logging
    this.sendSocketNotification("APT_CLIENT_LOG", {
        level: level,
        message: message
    });
  }

});
