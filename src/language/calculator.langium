grammar Calculator

entry Model:
    (expressions+=(Integer | Float | Application))*;

Application:
    ('(' operator=Unary arguments+=(Integer | Float | Application) ')') |
    ('(' operator=Binary arguments+=(Integer | Float | Application) arguments+=(Integer | Float | Application)')');

Unary:
    value='sqrt';

Binary:
    value=('+' | '-' | '*' | '/' | '%' | '^');

Integer:
    value=INT;

Float:
    value=FLOAT;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal FLOAT returns number: /[-+]?((\d+\.\d*)|(\d*\.\d+))/;
terminal INT returns number: /[-+]?[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal SL_COMMENT: /\#[^\n\r]*/;
