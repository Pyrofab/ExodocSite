"use strict";

let expr = "(a+z) + (c+(y * x))";

expr = preprocess(expr);
console.log('result: ', splitAndUnwrap(expr, '+'));
//console.log('result: ', splitAndUnwrap(expr, '*'));

function preprocess(expr) {
    return expr.replace(/ /g, '').replace(/(\D\d+)([a-zA-Z(])/, "$1*$2");
}

function splitAndUnwrap(expr, op) {
    let p = 0;
    let split = [];
    let lastOp = -1;
    let openPar = -1;
    let wrappedInParenthesis = true;
    for (let i = 0; i < expr.length; i++) {
        let lastP = p;
        p += expr[i] === '(' ? 1 : (expr[i] === ')' ? -1 : 0)
        // opening parenthesis at first level
        if (lastP === 0 && p !== lastP) {
            openPar = i;
        } else if (p === 0 && lastP !== p) {    // closing parenthesis at first level
            console.log(expr.substring(0, openPar+1), '|', expr.substring(openPar+1, i), '|', expr.substring(i))
            // recursively evaluate the sub-expression
            expr = expr.substring(0, openPar+1) + splitAndUnwrap(expr.substring(openPar+1, i), op) + expr.substring(i);
        }
        if (p === 0) {
            if(expr[i] === op) {
                split.push(expr.substring(lastOp+1, i));
                lastOp = i;
            }
            if(i < expr.length - 1)
                wrappedInParenthesis = false;
        }
    }
    // if the operator has not been found
    if (lastOp === -1) {
        // either the whole expression is wrapped in parenthesis
        if (false && wrappedInParenthesis) {
            // then retry without the parenthesis
            console.log("Wrapped in parenthesis: " + expr);
            return '(' + splitAndUnwrap(expr.substring(1, expr.length - 1), op) + ')';
        }
        // or there is no work to do
        else {
            console.log("Nothing to do: " + expr);
            // then return what was given
            return expr;
        }
    }
    split.push(expr.substring(lastOp+1, expr.length));
    console.log("Split string: " + split);
    return split.sort().map(str => splitAndUnwrap(str, op)).join(op);
}