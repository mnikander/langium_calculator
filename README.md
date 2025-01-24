# Calculator DSL

This is a DSL which allows writing basic arithmetic expressions in Polish notation.
For example, the equation 1+2*3 would be expressed as: `(+ 1 (* 2 3))`.

## Setup

1. Setup Langium on your machine: https://www.npmjs.com/package/langium
2. Clone this repo
3. Build using the task in vscode (or execute `npm run langium:generate && npm run build` in a terminal)
4. Run the resulting program in vscode, to start a new vscode window which has the extension for 'Calculator' loaded
5. In this new vscode window, open a .calc file in the example/ directory to try out syntax highlighting and auto-completion
