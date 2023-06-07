// validation rules
const validationMethods = {
    required: function (value) {
        if (value) return true;
        return 'This is a required field';
    },

    email: function (value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value) || 'This email is invalid';
    },

    max: function(value, params) {
        return (value.length <= params[0]) || `This field length sould be greater than or equal to ${params[0]}`
    },
    
    size: function (value, params) {
        return (value.length == params[0]) || `This field's length should be equal to ${params[0]}`
    }
}

export default {
    validateForm(model, validationRules) {
        const keys = Object.keys(validationRules);

        const errors = {};
        
        keys.forEach(key => {
            if (Object.keys(model).includes(key)) {
                let rules = validationRules[key].split('|');
                let messages = [];
                rules.forEach(rule => {
                    if (Object.keys(validationMethods).includes(rule)) {
                        if (validationMethods[rule](model[key]) !== true) {
                            messages.push(validationMethods[rule](model[key]));
                        }
                    }

                    // for validation rules with parameters
                    if (rule.includes(':')) {
                        let ruleParams = rule.split(':')[1].split(',');
                        rule = rule.split(':')[0];
                        
                        if (Object.keys(validationMethods).includes(rule)) {
                            if (validationMethods[rule](model[key], ruleParams) !== true) {
                                messages.push(validationMethods[rule](model[key], ruleParams));
                            }
                        }
                    }
                });

                errors[key] = messages;
            }
        });
        return errors;
    },

    initializedErrors(validationRules) {
        const keys = Object.keys(validationRules);
        const errors = {};

        keys.forEach(key => {
            errors[key] = [];
        });

        return errors;
    },

    hasError(errors) {
        const keys = Object.keys(errors);
        let hasError = false;
        keys.forEach(key => {
            if (errors[key].length) {
                hasError = true;
            }
        });

        return hasError;
    }
}

