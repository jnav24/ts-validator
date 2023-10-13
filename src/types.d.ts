export type Validator = {
    message: string;
    validate: ((val: string) => void) | ((val: string, option: string) => void)
};

export type RulesOptions = {
    message?: string;
    pattern?: string;
};

export type RulesType = {
    'alpha-numeric'?: RulesOptions;
    email?: RulesOptions;
    [key: `eq:${number}`]: RulesOptions;
    [key: `float:${number}`]: RulesOptions;
    [key: `gt:${number}`]: RulesOptions;
    [key: `lt:${number}`]: RulesOptions;
    'has-int'?: RulesOptions;
    [key: `in:${string}`]: RulesOptions;
    lower?: RulesOptions;
    [key: `match:${string}`]: RulesOptions;
    [key: `max:${number}`]: RulesOptions;
    [key: `min:${number}`]: RulesOptions;
    numeric?: RulesOptions;
    phone?: RulesOptions;
    required?: RulesOptions;
    uuid?: RulesOptions;
    upper?: RulesOptions;
};
