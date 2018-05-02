"use strict";

const questions = new Map();
const validators = new Map();

class Question {
    constructor(htmlElement, answers, validators) {
        this.htmlElement = htmlElement;
        this.validators = validators || [];
        this.add = {validator: (v,i) => this.validators.splice(i == null ? this.validators.length : i, 0, v)};
        this.remove = {validator: v => {
            let index = typeof v == "number" ? v : this.validators.indexOf(v);
            if (index > -1) this.validators.splice(index, 1);
             }};
        this.answers = answers;
        this.correction = new Correction(this.htmlElement.querySelector("fieldset > .correction_field:last-child"));
        this.attempts = 0;
        for(let i = 0; i < this.answers.length; i++) {
            Object.defineProperty(this, `answer_${i+1}`, {get: function() {return this.answers[i]}});
            Object.defineProperty(this, `correction_${i+1}`, {
                get: function() {return this.answers[i].correction},
                set: function(text) {this.answers[i].correction = text}}
            )
        }
    }

    get correctionField() {return this.htmlElement.querySelector("fieldset > .correction_field:last-child")}


    clearCorrections() {
        this.correction.clear();
        this.correction.hide();
        this.answers.forEach(c => c.correction.hide());
    }

    validate() {
        this.clearCorrections();
        let ok = true;
        for (const validate of this.validators) 
            if(validate(this) === false)
                ok = false;
        if(!this.correction.text)
            this.correction.text = (ok ? "Bravo !" : "Nop");
        this.correction.show();
        this.attempts++;
    }
}

class Answer {
    constructor(htmlElement, inputId) {
        this.htmlElement = htmlElement;
        this.inputId = inputId;
        this.correction = new Correction(this.htmlElement.querySelector(".correction_field"));
        this.correction.color(this.isValid() ? "green" : "red");
    }

    get inputElement() {return document.getElementById(this.inputId)}

    get valid() {return this.isValid()}

    isValid() {return this.inputElement.dataset["valid"] === "true"}

    get checked() {return this.isChecked()}

    get value() {return this.inputElement.type == "text" && this.inputElement.value || ""}

    isChecked() {return this.inputElement.checked || false}

}

class Correction {
    constructor(htmlElement) {
        this.html = htmlElement || {};
        this.def = "";
    }

    setDefault(def) {
        this.def = def;
    }

    clear() {
        this.html.innerHTML = this.def;
        this.hide();
    }

    hide() {
        this.html.hidden = true;
    }

    show(text) {
        if (text) this.text = text;
        this.html.hidden = false;
    }

    set view(id) {
        let elmt = document.getElementById(id);
        while (this.html.lastChild) {
            this.html.removeChild(this.html.lastChild);
        }
        let cln = setupListeners(elmt.cloneNode(true));
        cln.hidden = false;
        this.html.appendChild(cln);
    }

    text(txt) {if(txt) {this.text = txt; return this} else return this.text}

    color(col) {if(col) {this.html.style.color = col; return this} else return this.html.style.color}

    get text() {return this.html.textContent}

    set text(txt) {this.html.textContent = txt}
}

function registerValidator(question, validator) {
    let id = typeof question === "number" ? `question_${question}` : `${question}`;
    if(typeof validator !== "function") {
        console.warn(`Bad call to registerValidator, second argument should be a function (was "${validator}" instead)`);
        return;
    }
    if(questions.has(id))
        questions.get(id).add.validator(validator);
    else {
        let arr = validators.get(id) || []
        arr.push(validator);
        validators.set(id, arr);
    }
}

function validateCheckboxes(question) {
    let ok = true;
    for (const answer of question.answers) {
        if(answer.checked !== answer.valid) {
            ok = false;
        }
        if(answer.checked)
            answer.correction.show();
    };
    return ok;
}

function validateFunctions(question) {
    let ok = true;
    for (const funcInput of question.querySelectorAll('.function_input')) {
        let f1 = math.parse(funcInput.value);
        let f2 = math.parse(funcInput.dataset["function"]);
        console.log(`${f1.equals(f2)}, ${simplify_2(f1).equals(simplify_2(f2))}`);
        if(!simplify_2(f1).equals(simplify_2(f2))) {
            ok = false;
        }
    }
    return ok;
}

/**
 * Simplifies an expression using math#simplify and applies additional operations to help with equality checks
 * @param {Node} expr The expression to simplify
 * @return a simplified and normalized expression
 */
function simplify_2(expr) {
    let simpl = expr.cloneDeep();
    // sort the expression to get more consistent results
    simpl.traverse((node, path, parent) => {
        if (node.op === "*" || node.op === "+")
            node.args.sort();
    });
    return math.simplify(simpl);
}

