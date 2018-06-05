"use strict";
/**
 * Override script file used when the user's answers are to be sent by mail
 * to be manually corrected
 */


/**
 * Called when the user clicks the send button
 */
function submitForm() {
  let mail ="";
  questions.forEach((value, key) => mail += `${key}\n<br/>\n${value.validate()}\n<hr/>`);
  const result = document.querySelector("body > div:last-child") || document.createElement("div");
  result.innerHTML = mail;
  document.body.appendChild(result);
  return false;
}

/**
 * Override the question class to change the validation behaviour
 */
Question = class extends Question {
  constructor(htmlElement, answers) {
    super(htmlElement, answers);
  }
  
  validate() {
    this.clearCorrections();
    let corr = "";
    for (const answer of this.answers) {
      let line = "";
      if (answer.inputElement.type == "checkbox")
        line += "[ ]";
      else if (answer.inputElement.type == "radio")
        line += "( )";
      line += answer.htmlElement.querySelector("label").dataset["original"];
      if (answer.inputElement.type == "text")
        line += " " + answer.value;
      if (answer.checked) line = line.replaceAt(1, "x");
      corr += (line + "\n<br/>");
    }
    return corr;
  }
}

/**
 * Replaces a substring at the given index of {@code this} string
 * with the given replacement
 * @param {number} index
 * @param {string} replacement
 * @return {string} the string with the replacement done
 */
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}
