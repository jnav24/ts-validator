import type { ValidatorType, RulesOptions, RulesType, Validator } from './types';

function validateNumeric(value: string): boolean {
    return /^\d+$/.test(value);
}

function validateFunctionParam(val: string, option: string) {
    if (!validateNumeric(option)) {
        throw new Error(`The param for the validation rule, ${val}, must be numeric`);
    }
}

const validators: Record<keyof ValidatorType, Validator> = {
    'alpha-numeric': {
        message: () => 'Field must contain letters and numbers',
        validate: (val: string) => /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(val),
    },

    email: {
        message: () => 'Field must be a valid email address',
        validate: (val: string) =>
            /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i.test(
                val,
            ),
    },

    eq: {
        message: (option?: string) => `Field should be ${option as string} characters`,
        validate: (val: string, option?: string) => {
            validateFunctionParam('eq', option as string);
            return val.length === Number(option);
        },
    },

    float: {
        message: (option?: string) => `Field must be numeric with ${option as string} decimals`,
        validate: (val: string, option?: string) => {
            validateFunctionParam('float', option as string);
            const regex = '^\\d+(\\.\\d{' + option + '})$';
            return new RegExp(regex).test(val);
        },
    },

    gt: {
        message: (option?: string) => `Field must be greater than ${option}`,
        validate: (val: string, option?: string) => {
            validateFunctionParam('gt', option as string);
            return Number(val) > Number(option);
        },
    },

    'has-int': {
        message: () => 'Field must contain a number',
        validate: (val: string) => /[0-9]+/g.test(val),
    },

    in: {
        message: (option?: string) => `Field must contain one of the following: '${option}'`,
        validate: (val: string, option?: string) => {
            validateFunctionParam('in', option as string);
            return (option as string).split(',').includes(val);
        },
    },

    lower: {
        message: () => 'Field must contain a lowercase letter',
        validate: (val: string) => /[a-z]/.test(val),
    },

    lt: {
        message: (option?: string) => `Field must be less than ${option}`,
        validate: (val: string, option?: string) => {
            validateFunctionParam('lt', option as string);
            return Number(val) < Number(option);
        },
    },

    match: {
        message: (option?: string) => `Field must match with '${(option as string).split('|')?.[0]}' field`,
        validate: (val: string, matchingValue?: string) => {
            matchingValue = matchingValue as string;
            if (matchingValue.includes('|')) {
                return val === matchingValue.split('|')[1];
            }

            return matchingValue === val;
        },
    },

    max: {
        message: (option?: string) => `Field can not exceed ${option} characters`,
        validate: (val: string, option?: string) => {
            validateFunctionParam('max', option as string);
            return val.length <= Number(option);
        },
    },

    min: {
        message: (option?: string) => `Field should be ${option} or more characters`,
        validate: (val: string, option?: string) => {
            validateFunctionParam('min', option as string);
            return val.length >= Number(option);
        },
    },

    mixedCase: {
        message: () => 'Field must contain both uppercase and lowercase letters',
        validate: (val: string) => {
            return validators.lower?.validate(val) && validators.upper?.validate(val);
        },
    },

    numeric: {
        message: () => 'Field can only contain numbers',
        validate: (val: string) => validateNumeric(val),
    },

    phone: {
        message: () => 'Field must be a valid phone number',
        validate: (val: string) => {
            const regex = '^\\+1(\\d{10})$';
            return new RegExp(regex).test(val);
        },
    },

    required: {
        message: () => 'Field is required',
        validate: (val: string) => !!val.trim(),
    },

    symbol: {
        message: () => 'Field must contain a special character',
        validate: (val: string) => /[!@#$%^&*)(+=._-]+/g.test(val),
    },

    upper: {
        message: () => 'Field must contain an uppercase letter',
        validate: (val: string) => /[A-Z]/.test(val),
    },

    uuid: {
        message: () => 'Field must be a valid UUID',
        validate: (val: string) => {
            const regex =
                '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$';
            return new RegExp(regex, 'i').test(val);
        },
    },
};

const getValidatorAndParam = (val: string): string[] => val.split(':');

const getErrorMessage = (name: string, param?: string, options?: RulesOptions) => {
    if (options && options?.message?.trim()) {
        return options.message;
    }

    return validators[name as keyof ValidatorType].message(param);
};

const getRule = (key: string, value: string | RulesOptions) => {
    const isNumeric = validateNumeric(key);

    if (isNumeric) {
        return { rule: value as string, options: undefined };
    }

    return { rule: key as string, options: value as RulesOptions };
};

const validateInput = (rule: string, val: string, options?: RulesOptions) => {
    const result = { valid: true, message: '' };
    const [validatorName, param] = getValidatorAndParam(rule);

    if (!validators[validatorName as keyof ValidatorType]) {
        throw new Error(`Function for type, ${validatorName}, does not exist`);
    }

    if (!validators[validatorName as keyof ValidatorType].validate) {
        throw new Error(`Function for type, ${validatorName}, is missing`);
    }

    const inputValid = param
        ? validators[validatorName as keyof ValidatorType].validate(val, param)
        : validators[validatorName as keyof ValidatorType].validate(val);

    if (!inputValid) {
        result.valid = false;
        result.message = getErrorMessage(validatorName, param, options);
    }

    return result;
};

const validateRules = (inputValue: string, rules: RulesType | Array<keyof RulesType>) => {
    let tempValid = true;
    let error = null;

    if (
        !Object.values(rules).includes('required') &&
        !Object.keys(rules).includes('required') &&
        (!inputValue || !inputValue.toString().trim().length)
    ) {
        return { error, valid: tempValid };
    }

    for (const [key, value] of Object.entries(rules)) {
        const { rule, options } = getRule(key, value);
        const { message, valid } = validateInput(rule, inputValue, options);

        if (!tempValid) {
            continue;
        }

        if (!valid && tempValid) {
            error = message;
            tempValid = false;
            continue;
        }

        error = null;
        tempValid = true;
    }

    return { error, valid: tempValid };
};

export { validateInput, validateRules };
