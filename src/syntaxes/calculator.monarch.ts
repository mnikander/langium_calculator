// Monarch syntax highlighting for the calculator language.
export default {
    keywords: [
        'sqrt'
    ],
    operators: [
        '%','*','+','-','/','^'
    ],
    symbols: /%|\(|\)|\*|\+|-|\/|\^/,

    tokenizer: {
        initial: [
            { regex: /[_a-zA-Z][\w_]*/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { regex: /[-+]?((\d+\.\d*)|(\d*\.\d+))/, action: {"token":"number"} },
            { regex: /[-+]?[0-9]+/, action: {"token":"number"} },
            { regex: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/, action: {"token":"string"} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /\s+/, action: {"token":"white"} },
            { regex: /\#[^\n\r]*/, action: {"token":"comment"} },
        ],
        comment: [
        ],
    }
};
