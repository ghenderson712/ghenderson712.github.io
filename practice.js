(function () {
  "use strict";

  function initializeReminder() {
    var core = window.KinVowReminder;
    var form = document.getElementById("reminder-form");
    var action = document.getElementById("next-step");
    var revisit = document.getElementById("revisit");
    var hint = document.getElementById("practice-hint");
    var result = document.getElementById("reminder-result");
    var output = document.getElementById("reminder-text");
    var status = document.getElementById("reminder-status");
    var edit = document.getElementById("edit-reminder");
    var copy = document.getElementById("copy-reminder");
    var download = document.getElementById("download-reminder");
    var print = document.getElementById("print-reminder");
    var clear = document.getElementById("clear-reminder");
    var blank = document.getElementById("blank-worksheet");

    // Leave the printable worksheet visible unless the enhancement is complete.
    if (!core || !form || !action || !revisit || !hint || !result || !output || !status || !edit || !copy || !download || !print || !clear || !blank) return;
    var radios = Array.from(form.querySelectorAll('input[name="practice"]'));
    if (!radios.length) return;

    var current = null;
    var actionEdited = false;

    function selectedChoice() {
      var selected = radios.find(function (radio) { return radio.checked; });
      return selected && Object.prototype.hasOwnProperty.call(core.practices, selected.value) ? selected.value : "listen";
    }

    function updateSuggestion() {
      var suggestion = core.practices[selectedChoice()].suggestion;
      hint.textContent = "Suggested starting point: " + suggestion;
      if (!actionEdited) action.value = suggestion;
    }

    function selectReminderText() {
      result.focus();
      var selection = window.getSelection();
      if (selection) {
        var range = document.createRange();
        range.selectNodeContents(output);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    function clearPrintMode() {
      document.body.classList.remove("print-reminder");
    }

    function resetEntries() {
      current = null;
      actionEdited = false;
      form.reset();
      radios.forEach(function (radio) { radio.checked = radio.value === "listen"; });
      revisit.value = "";
      updateSuggestion();
      output.textContent = "";
      result.hidden = true;
      form.hidden = false;
      clearPrintMode();
    }

    action.addEventListener("input", function () { actionEdited = true; });
    radios.forEach(function (radio) { radio.addEventListener("change", updateSuggestion); });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var choice = selectedChoice();
      var enteredAction = !actionEdited && action.value === core.practices[choice].suggestion ? "" : action.value;
      current = core.createReminder(choice, enteredAction, revisit.value);
      output.textContent = current.text;
      result.hidden = false;
      form.hidden = true;
      status.textContent = current.usedDefault ? "Reminder ready with a suggested starting point. You can edit it at any time." : "Reminder ready. You can edit, copy, download, or print it.";
      result.focus();
    });

    edit.addEventListener("click", function () {
      form.hidden = false;
      result.hidden = true;
      status.textContent = "Edit your entries, then make your reminder again.";
      action.focus();
    });

    clear.addEventListener("click", function () {
      resetEntries();
      status.textContent = "Your entries and reminder have been cleared. The listening suggestion is ready to edit.";
      action.focus();
    });

    copy.addEventListener("click", async function () {
      if (!current) return;
      var reminderToCopy = current;
      copy.disabled = true;
      try {
        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(reminderToCopy.text);
        if (current === reminderToCopy && !result.hidden) status.textContent = "Reminder copied.";
      } catch (error) {
        if (current === reminderToCopy && !result.hidden) {
          selectReminderText();
          status.textContent = "Copy did not work. The reminder text is selected. Use your device's Copy command, or download the text instead.";
        }
      } finally {
        copy.disabled = false;
      }
    });

    download.addEventListener("click", function () {
      if (!current) return;
      var objectURL;
      var link;
      try {
        var file = new Blob([current.text + "\n"], { type: "text/plain;charset=utf-8" });
        objectURL = URL.createObjectURL(file);
        link = document.createElement("a");
        link.href = objectURL;
        link.download = "kin-vow-reminder.txt";
        link.hidden = true;
        document.body.appendChild(link);
        link.click();
        status.textContent = "Text download requested. Your browser may ask where to save it.";
      } catch (error) {
        status.textContent = "The download could not start. You can copy the reminder text or print it instead.";
      } finally {
        if (link) link.remove();
        if (objectURL) window.setTimeout(function () { URL.revokeObjectURL(objectURL); }, 1000);
      }
    });

    print.addEventListener("click", function () {
      if (!current) return;
      document.body.classList.add("print-reminder");
      try {
        window.print();
      } catch (error) {
        clearPrintMode();
        status.textContent = "Printing could not start. You can copy or download the reminder instead.";
      }
    });
    window.addEventListener("afterprint", clearPrintMode);

    resetEntries();
    status.textContent = "";
    blank.hidden = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeReminder);
  else initializeReminder();
}());
