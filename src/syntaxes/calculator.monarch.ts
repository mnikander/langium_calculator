// Monarch syntax highlighting for the calculator language.
export default {
    keywords: [
        
    ],
    operators: [
        '+','-'
    ],
    symbols: /\(|\)|\+|-/,

    tokenizer: {
        initial: [
            { regex: /[_a-zA-Z][\w_]*/, action: {"token":"ID"} },
            { regex: /[0-9]+/, action: {"token":"number"} },
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
