grammar Calculator

entry Model:
    (expressions+=(INT | Application))*;

Application:
    ('(' operator=Binary arguments+=(INT | Application) arguments+=(INT | Application)')');

terminal Binary:
    ('+' | '-' | '*' | '/' | '%' | '^');

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal SL_COMMENT: /\#[^\n\r]*/;
