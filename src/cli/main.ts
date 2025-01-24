import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { CalculatorLanguageMetaData } from '../language/generated/module.js';
import { createCalculatorServices } from '../language/calculator-module.js';
import { extractAstNode, extractDocument } from './cli-util.js';
import { generateCpp, generateJavaScript, generateJSON } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createCalculatorServices(NodeFileSystem).Calculator;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export const toJSON = async (inputFile: string, outputFile: string): Promise<void> => {
    const services = createCalculatorServices(NodeFileSystem).Calculator;
    const document = await extractDocument(inputFile, services);
    const parseResult = document.parseResult;
    if (parseResult.lexerErrors.length === 0 &&
        parseResult.parserErrors.length === 0
    ) {
        console.log(chalk.green(`Parsed and validated ${inputFile} successfully!`));
        const serializer = services.serializer.JsonSerializer;
        const json = serializer.serialize(document.parseResult.value, { space: 4 });
        generateJSON(json, outputFile);
        console.log(chalk.green(`Wrote AST in JSON form to ${outputFile}.`));
    } else {
        console.log(chalk.red(`Failed to parse and validate ${inputFile}!`));
    }
};

export const toCPP = async (inputFile: string, outputFile: string): Promise<void> => {
    const services = createCalculatorServices(NodeFileSystem).Calculator;
    const document = await extractDocument(inputFile, services);
    const model = document.parseResult?.value as Model;
    const parseResult = document.parseResult;
    if (parseResult.lexerErrors.length === 0 &&
        parseResult.parserErrors.length === 0
    ) {
        console.log(chalk.green(`Parsed and validated ${inputFile} successfully!`));
        generateCpp(model, outputFile);
        console.log(chalk.green(`Wrote C++ code to ${outputFile}.`));
    } else {
        console.log(chalk.red(`Failed to parse and validate ${inputFile}!`));
    }
};

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = CalculatorLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program
        .command('toJSON')
        .argument('<inputFile>', `source file (possible file extensions: ${fileExtensions})`)
        .argument('<outputFile>', 'destination file (JSON)')
        .description('parses the input file and writes the AST to an output JSON file')
        .action(toJSON);

    program
        .command('toCPP')
        .argument('<inputFile>', `source file (possible file extensions: ${fileExtensions})`)
        .argument('<outputFile>', 'destination file (CPP)')
        .description('parses the input file, transpiles to C++, and writes it to a .cpp file')
        .action(toCPP);

    program.parse(process.argv);
}
