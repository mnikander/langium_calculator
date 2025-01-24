grammar Calculator

entry Model:
    (expressions+=Expression)*;

Expression:
    value=Integer | ('(' binary_operator=('+' | '-') arguments+=Expression arguments+=Expression ')');

Integer:
    value=INT;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal SL_COMMENT: /\#[^\n\r]*/;
