"use strict";

const parser = math.parser();

/**
 * initializes spoiler logic
 */
document.addEventListener('DOMContentLoaded', () => setupListeners(document));

function setupListeners(element) {
    element.querySelectorAll('.spoiler>:first-child')
        .forEach(e => {
            e.addEventListener('click', (ev) => {
                ev.target.parentElement.classList.toggle('revealed');
            });
        });
    return element;
} 

/**
 * Applies some transformations to the given element and initializes the validator.
 * @param {String} id the id of the element representing the question
 */
function populateQuestion(id) {
    let question = document.getElementById(id);
    let i = 1;
    let answers = [];
    question.querySelectorAll('ul li input').forEach(input => {
        input.id = `${id}_answer_${i++}`;
        let sibling = input.nextSibling;
        let li = input.parentNode;
        let label = li.querySelector('label');
        label.htmlFor = input.id;
        li.classList.add('answer');
        // create an empty correction field if no default was specified
        let corrDiv = li.querySelector(".correction_field")
        if(!corrDiv) {
            corrDiv = document.createElement("span");
            corrDiv.classList.add('correction_field');
            li.appendChild(corrDiv);
        }
        answers.push(new Answer(li, input.id));
    });
    question.querySelectorAll('ul').forEach(ul => randomizeAnswers(ul));
    let q = new Question(question, answers, validators.get(id));
    q.add.validator(validateCheckboxes);
    q.add.validator(() => validateFunctions(question));
    question.querySelector(".check_answer").addEventListener('click', () => q.validate());
    questions.set(id, q);
}

/**
 * Shuffles the answers for a given question fieldset.
 * Only groups of adjacent answers will be shuffled.
 * @param {Element} question An element with one or more "answer" children
 */
function randomizeAnswers(question) {
    let answers = [];
    for (const node of question.childNodes) {
        if (node.classList && node.classList.contains("answer"))
            answers.push(node);
        else if (answers.length > 0 && (!node.textContent || node.textContent.trim())) {
            shuffle(answers);
            for (let n of answers) n.parentNode.insertBefore(n, node);
            answers = [];
        }
    }
    shuffle(answers);
    for (let n of answers) n.parentNode.insertBefore(n, null);
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

/**
 * Converts a byte array into the string that it represents
 */
function binToString(bin) {
    let result = "";
    for (const i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
}
