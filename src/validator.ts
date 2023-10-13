import { RulesOptions, RulesType, Validator } from './types';

function validateNumeric(value: string): boolean {
    return /^\d+$/.test(value);
}

function validateFunctionParam(val: string, option: string) {
    if (!validateNumeric(option)) {
        throw new Error(`The param for the validation rule, ${val}, must be numeric`);
    }
}

const validators: Record<keyof RulesType, Validator> = {
    'alpha-numeric': {
        message: 'Field must contain letters and numbers',
        validate: (val: string) => /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(val),
    },

    email: {
        message: 'Field must be a valid email address',
        validate: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    },

    eq: {
        message: 'Field should be ##REPLACE## characters',
        validate: (val: string, option: string) => {
            validateFunctionParam('eq', option);
            return value.length === Number(option);
        },
    },

    float: {
        message: 'Field must be numeric with ##REPLACE## decimals',
        validate: (val: string, option: string) => {
            validateFunctionParam('float', string);
            const regex = '^\\d+(\\.\\d{' + string + '})$';
            return new RegExp(regex).test(val);
        },
    },

    gt: {
        message: 'Field must be greater than ##REPLACE##',
        validate: (val: string, option: string) => {
            validateFunctionParam('gt', option);
            return Number(val) > Number(option);
        },
    },

    'has-int': {
        message: 'Field must contain a number',
        validate: (val: string) => /[0-9]+/g.test(val),
    },

    in: {
        message: 'Field must contain one of the following: `##REPLACE##`',
        validate: (val: string, option: string) => option.split(',').includes(val),
    },

    lower: {
        message: 'Field must contain a lowercase letter',
        validate: (val: string) => /[a-z]/.test(val),
    },

    lt: {
        message: 'Field must be less than ##REPLACE##',
        validate: (val: string, option: string) => {
            validateFunctionParam('lt', option);
            return Number(val) < Number(option);
        },
    },

    match: {
        message: 'Field must match with `##REPLACE##`',
        validate: (val: string, option: string) => {
            if (value.includes('|')) {
                return matchingValue === value.split('|')[1];
            }

            return matchingValue === value;
        },
    },

    max: {
        message: 'Field can not exceed ##REPLACE## characters',
        validate: (val: string, option: string) => {
            validateFunctionParam('max', option);
            return val.length <= Number(option);
        }
    },

    min: {
        message: 'Field should be ##REPLACE## or more characters',
        validate: (val: string, option: string) => {
            validateFunctionParam('min', option);
            return val.length >= Number(option);
        },
    },

    numeric: {
        message: 'Field can only contain numbers',
        validate: (val) => validateNumeric(val),
    },

    phone: {
        message: 'Field must be a valid phone number',
        validate: (val: string) => {
            const regex = '^\\+1(\\d{10})$';
            return new RegExp(regex).test(val);
        },
    },

    required: {
        message: 'Field is required',
        validate: (val: string) => !!val.trim(),
    },

    upper: {
        message: 'Field must contain an uppercase letter',
        validate: (val: string) => /[A-Z]/.test(val),
    },

    uuid: {
        message: 'Field must be a valid UUID',
        validate: (val: string) => {
            const regex = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$';
            return new RegExp(regex, 'i').test(val);
        },
    },
};

const getValidatorAndParam = (val: string): string[] => val.split(':');

const getErrorMessage = (name: string, options?: RulesOptions) => {
    if (options && options.message.trim()) {
        return options.message;
    }

    return validators[name].message;
};

export const validateInput = (t: string, val: string, options?: RulesOptions) => {
    const result = { valid: true, message: '' };
    const [validatorName, param] = getValidatorAndParam(t);

    if (!validators[validatorName]) {
        throw new Error(`Function for type, ${validatorName}, does not exist`);
    }

    if (!validators[validatorName].validate) {
        throw new Error(`Function for type, ${validatorName}, is missing`);
    }

    const inputValid = param ? validators[validatorName].validate(val, param) : validators[validatorName].validate(value);

    if (!inputValid) {
        result.valid = false;
        result.message = getErrorMessage(validatorName, options);
    }

    return result;
};
