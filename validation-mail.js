"use strict";

function submitForm() {
  let mail ="";
  questions.forEach((value, key) => mail += `${key}\n<br/>\n${value.validate()}\n<hr/>`);
  const result = document.querySelector("body > div:last-child") || document.createElement("div");
  result.innerHTML = mail;
  document.body.appendChild(result);
  return false;
}

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

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}
