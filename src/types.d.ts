export type Validator = {
  message: (param?: string) => string;
  validate: (val: string, option?: string) => boolean;
};

export type RulesOptions = {
  message?: string;
  pattern?: string;
};

export type RulesType = {
  "alpha-numeric"?: RulesOptions;
  email?: RulesOptions;
  "eq:"?: RulesOptions;
  "float:"?: RulesOptions;
  "gt:"?: RulesOptions;
  "lt:"?: RulesOptions;
  "has-int"?: RulesOptions;
  "in:"?: RulesOptions;
  lower?: RulesOptions;
  "match:"?: RulesOptions;
  "max:"?: RulesOptions;
  "min:"?: RulesOptions;
  mixedCase?: RulesOptions;
  numeric?: RulesOptions;
  phone?: RulesOptions;
  required?: RulesOptions;
  symbol?: RulesOptions;
  uuid?: RulesOptions;
  upper?: RulesOptions;
};
