"use strict";

const questions = new Map();
const validators = new Map();

/**
 * A question is an HTML element associated with one or more
 * answer zones, and can be given a set of validators used
 * for the correction.
 *
 * A question has a correction used to display general feedback
 * when the user answers it.
 */
class Question {
    /**
     * Constructs a new question.
     * @param {HTMLElement} htmlElement the root of the element used to display the question.
     * @param {Answer[]} answers a list of answers that the user can fill in
     * @param {function} validators a list of validators that will be used to correct the answers.
     */
    constructor(htmlElement, answers, validators) {
        this.htmlElement = htmlElement;
        //note: this cannot be a default parameter
        this.validators = validators || [];
        // allows the syntax `question.add.validator(function)`
        this.add = {validator: (v,i) => this.validators.splice(i == null ? this.validators.length : i, 0, v)};
        // allows the syntax `question.remove.validator(function)`
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

    /**
     * Triggers every validator for this question and determines if the
     * given answers or valid or not.
     */
    validate() {
        this.clearCorrections();
        let ok = true;
        for (const validate of this.validators) 
            if(validate(this) === false)
                ok = false;
        if(!this.correction.text)
            this.correction.text = ok ? "Bravo !" : "Mauvaise réponse";
        this.correction.show(null, ok);
        this.attempts++;
    }
}

/**
 * An answer is an interactive element that the user
 * can use to answer the corresponding question.
 * It can represent a choice, using a checkbox/radio,
 * or a field that the user must fill in, using a
 * text field for instance.
 *
 * Each answer has an associated correction to give
 * tailored feedback depending on what the user answered.
 */
class Answer {
    /**
     * Creates a new answer
     * @param {HTMLElement} htmlElement the root of the html used to display this answer
     * @param {string} inputId the id of the html element that the user directly interacts with
     */
    constructor(htmlElement, inputId) {
        this.htmlElement = htmlElement;
        this.inputId = inputId;
        this.correction = new Correction(this.htmlElement.querySelector(".correction_field"));
    }

    get inputElement() {return document.getElementById(this.inputId)}

    get valid() {return this.isValid()}

    isValid() {return this.inputElement.dataset["valid"] === "true"}

    get checked() {return this.isChecked()}

    get value() {return this.inputElement.type == "text" && this.inputElement.value || ""}

    isChecked() {return this.inputElement.checked || false}

}

/**
 * A correction represents an element of feedback for the user,
 * displayed after he has answered the associated question.
 */
class Correction {
    /**
     * creates a new correction
     * @param {HTMLElement} htmlElement the root of the html used to display this correction
     */
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

    show(text, valid) {
        if (text) this.text = text;
        this.html.classList.remove(!valid ? "correction-right" : "correction-wrong");
        this.html.classList.add(valid ? "correction-right" : "correction-wrong");
        this.html.hidden = false;
    }

    /**
     * Sets the view of this correction to another HTML element.
     *
     * In effect, copies the element with the given id to this correction
     */
    set view(id) {
        let elmt = document.getElementById(id);
        while (this.html.lastChild) {
            this.html.removeChild(this.html.lastChild);
        }
        let cln = setupListeners(elmt.cloneNode(true));
        cln.hidden = false;
        this.html.appendChild(cln);
    }

    /**
     * Equivalent to the setter/getter (depending on the argument), allows chaining
     */
    text(txt) {if(txt) {this.text = txt; return this} else return this.text}

    color(col) {if(col) {this.html.style.color = col; return this} else return this.html.style.color}

    get text() {return this.html.textContent}

    set text(txt) {this.html.textContent = txt}
}

/**
 * Registers a validator for the given question
 *
 * If passed a question, the call is equivalent to {@code question.add.validator(validator);}
 * If passed a string, will resolve the question based on its corresponding html id and then
 * add the validator. If the question does not exist yet, the validator is added to a pending
 * list and will be added as soon as the question is created.
 *
 * The validator will be used to check whether the question was correctly answered to.
 * It must be a function taking a Question as a parameter and returning a boolean.
 * Every validator needs to return true for the answer to be considered right.
 *
 * @param {question|string|number} question The question for which to attach the validator.
 * @param {function} validator A function used to validate the user's answers
 */
function registerValidator(question, validator) {
    if(typeof validator !== "function") {
        console.warn(`Bad call to registerValidator, second argument should be a function (was "${validator}" instead)`);
        return;
    }
    if (question instanceof Question) {
        question.add.validator(validator);
        return;
    }
    let id;
    if (typeof question === "number") {
        id = `question_${question}`;
    } else if (typeof question === "string") {
        id = question;
    } else {
        console.warn(`Bad call to registerValidator, first argument should be a Question, a number or a string (got "${question}" instead)`);
        return;
    }

    if(questions.has(id)) {
        questions.get(id).add.validator(validator);
    } else {
        let arr = validators.get(id) || [];
        arr.push(validator);
        validators.set(id, arr);
    }
}

/**
 * Base validator used to check if checkboxes and
 * radio buttons are in the right state
 * @param {Question} question The question to validate
 */
function validateCheckboxes(question) {
    let ok = true;
    for (const answer of question.answers) {
        if(answer.checked !== answer.valid) {
            ok = false;
        }
        if(answer.checked)
            answer.correction.show(false, ok);
    };
    return ok;
}

/**
 * Base validator used to check if functions input by
 * a user match the ones specified as valid.
 * @param {Question} question The question to validate
 */
function validateFunctions(question) {
    let ok = true;
    for (const funcInput of question.querySelectorAll('[data-function]')) {
        try {
            let f1 = math.parse(funcInput.value);
            let f2 = math.parse(funcInput.dataset["function"]);
            console.log(`${f1.equals(f2)}, ${simplify_2(f1).equals(simplify_2(f2))}`);
            if(!simplify_2(f1).equals(simplify_2(f2))) {
                ok = false;
            }
        } catch (e) {
            console.warn(e.message);
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

