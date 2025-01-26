# Calculator DSL

This domain-specific language (DSL) allows writing and evaluating basic arithmetic expressions in prefix-notation, i.e. Polish notation.
The equation `1+2*3` would be expressed as: `(+ 1 (* 2 3))`.
Note that the parethesis make the order of execution explicit, so there is no order-of-precedence amongst functions.

## How does the toolchain work?

This project was built using [Langium](https://langium.org/), a language engineering tool.
The grammar for the language is defined in _src/language/calculator.langium_.
Langium uses this grammar definition to generate a tokenizer, parser, and VS code extension with syntax highlighting and auto-completion for the language.
After everything has been generated, langium is able to parse a document written in the 'calculator language' and generate an abstract syntax tree for it.

**An example document in the calculator language:**
```lisp
(+ 1 2)
```

**The abstract syntax tree (AST), exported to JSON:**

```json
{
    "$type": "Model",
    "expressions": [
        {
            "$type": "Application",
            "operator": {
                "$type": "Binary",
                "value": "+"
            },
            "arguments": [
                {
                    "$type": "Integer",
                    "value": 1
                },
                {
                    "$type": "Integer",
                    "value": 2
                }
            ]
        },
    ]
}
```

To get executable code, the AST must be translated into a language which we can execute.
The hand-written code generator can be found in _src/cli/generator.ts_.
It takes any 'calculator AST' and converts (transpiles) it to the corresponding C++ code.

**The generated C++ code:**

```c++
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <functional>

int main()
{
    std::cout << std::to_string(std::plus<>{}(1, 2)) << std::endl;
    return EXIT_SUCCESS;
}
```

The C++ code can then be compiled and executed to evaluate the calculator expressions.
C++ was chosen as the target language because it's fast and provides useful abstractions.
This makes it easier to develop and debug the code generator, than if LLVM IR or WebAssembly was chosen as the target language.
Function objects from the functional header were used, instead of the inbuild `operator+`, for example. 
This maintains a more consistent syntax even with functions for which there are no inbuilt operators in C++.

Generators could be written for other languages as well.
JavaScript is a very attractive target language because an IDE and the entire toolchain, including execution of the code, could be run inside the browser.
The langauge could then be used by simply visiting the right website.
The IDE and execution environment would run locally on the client (in the browser) and not on the server, which ensures the IDE is very responsive and hosting costs stay reasonable.
For the time being, that approach was not chosen here though.

## Setup

1. Setup Langium on your machine: https://www.npmjs.com/package/langium
2. Clone this repo
3. Build using the task in vscode (or execute `npm run langium:generate && npm run build` in a terminal)
4. Run the resulting program in vscode, to start a new vscode window which has the extension for 'Calculator' loaded
5. In this new vscode window, open a .calc file in the example/ directory to try out syntax highlighting and auto-completion

## Compile and run the entire pipeline

Ensure you have [langium](https://www.npmjs.com/package/langium) and gcc (or another C++ compiler) installed on your Unix machine and run the following commands:

```bash
npm run langium:generate && \
npm run build && \
node bin/cli.js toJSON examples/example.calc out/generated.json && \
node bin/cli.js toCPP examples/example.calc out/generated.cpp && \
g++ -o out/generated out/generated.cpp && \
./out/generated
```
