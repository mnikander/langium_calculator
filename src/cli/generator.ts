import type { Application, Integer, Model } from '../language/generated/ast.js';
// import { expandToNode, joinToNode, toString } from 'langium/generate';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    // const fileNode = expandToNode`
    //     "use strict";

    //     ${joinToNode(model.greetings, greeting => `console.log('Hello, ${greeting.person.ref?.name}!');`, { appendNewLineIfNotEmpty: true })}
    // `.appendNewLineIfNotEmpty();

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    // fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

export function generateJSON(json: string, outputFile: string): void {
    fs.writeFileSync(outputFile, json, 'utf-8');
}

export function generateCpp(model: Model, outputFile: string): void {
    let body : string = "";
    body += expressions(model);
    let output : string = generateCppMain(body);
    fs.writeFileSync(outputFile, output);
}

function display(text: string)
{
    return `std::cout << std::to_string(${text}) << std::endl;`
}

function indent(indentationLevel : number = 0, line : string = "") : string {
    let prefix : string = "";
    for (let i : number = 0; i<indentationLevel; i++)
    {
        prefix += " ";
    }
    return prefix + line;
}

function expressions(model: Model): string {
    let body: string = "";

    for (let expr of model.expressions) {
        body += indent(4, "");
        body += display(generateExpression(expr)) + "\n";
    }
    return body;
}

function generateExpression(node: Integer | Application): string {
    let body: string = "";
    if(node.$type == "Integer") {
        body += generateInteger(node);
    }
    else if(node.$type == "Application") {
        body += generateApplication(node);
    } else {
        console.error("Unknown argument type in expression.")
    }
    return body;
}

function generateInteger(node: Integer): string {
    return node.value.toString();
}

function generateApplication(node: Application): string {
    let body: string = "";
    if(node.operator.$type == "Unary") {
        body += generateUnary(node);
    }
    else if(node.operator.$type == "Binary") {
        body += generateBinary(node);
    } else {
        console.error("Unknown operator arity.");
    }
    return body;
}

function generateUnary(node: Application): string {
    let body: string = "";
    if (node.operator.value == "sqrt") {
        body += `std::sqrt(${generateExpression(node.arguments[0])})`;
    } else {
        console.error("Unknown operator type in unary function.");
    }
    return body;
}

function generateBinary(node: Application): string {
    let body: string = "";
    let args: string = `${generateExpression(node.arguments[0])}, ${generateExpression(node.arguments[1])}`;
    switch (node.operator.value) {
        case "+":
            body += `std::plus<>{}(${args})`;
            break;
        case "-":
            body += `std::plus<>{}(${args})`;
            break;
        case "*":
            body += `std::multiplies<>{}(${args})`;
            break;
        case "/":
            body += `std::divides<>{}(${args})`;
            break;
        case "%":
            body += `std::modulus<>{}(${args})`;
            break;
        case "^":
            body += `std::pow(${args})`;
            break;
        default:
            console.error("Unknown binary operator.");
            break;
    }
    return body;
}

function generateCppMain(body : string = ""): string {
    return preamble() + body + postamble();
}

function preamble() : string {
    return `#include <cmath>
#include <cstdlib>
#include <iostream>
#include <functional>

int main()
{
`;
}

function postamble() : string {
    return `    return EXIT_SUCCESS;
}
`;
}
