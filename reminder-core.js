(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.KinVowReminder = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var practices = Object.freeze({
    listen: Object.freeze({
      label: "Listen with care",
      suggestion: "Ask someone willing what they would like me to understand, then listen without rushing to offer advice."
    }),
    promise: Object.freeze({
      label: "Keep or revise a promise",
      suggestion: "Keep one promise I have already made, or explain honestly what needs to change."
    }),
    help: Object.freeze({
      label: "Offer useful help",
      suggestion: "Ask what would be useful before offering one manageable act of help."
    }),
    boundary: Object.freeze({
      label: "Respect a boundary",
      suggestion: "Respect a request for space, or state a limit clearly and without humiliation."
    })
  });

  function boundedText(value, limit) {
    if (typeof value !== "string") return "";
    return Array.from(value.trim()).slice(0, limit).join("").trim();
  }

  function createReminder(choice, action, revisit) {
    var selected = typeof choice === "string" && Object.prototype.hasOwnProperty.call(practices, choice) ? choice : "listen";
    var nextStep = boundedText(action, 400);
    var returnTime = boundedText(revisit, 80);
    var usedDefault = nextStep.length === 0;
    if (usedDefault) nextStep = practices[selected].suggestion;

    var lines = [
      "Kin Vow: my personal reminder",
      "",
      "My practice: " + practices[selected].label,
      "",
      "My next step:",
      nextStep
    ];
    if (returnTime) lines.push("", "When I will revisit this:", returnTime);
    if (usedDefault) lines.push("", "This is a suggested starting point. Change it to fit your circumstances and capacity.");
    lines.push("", "Listening can be enough. A commitment should be wanted, manageable, and freely chosen.");

    return { choice: selected, action: nextStep, revisit: returnTime, usedDefault: usedDefault, text: lines.join("\n") };
  }

  return Object.freeze({ practices: practices, createReminder: createReminder });
}));
