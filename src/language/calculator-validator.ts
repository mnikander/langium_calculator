import type { ValidationChecks } from 'langium';
// import type { ValidationAcceptor, ValidationChecks } from 'langium';
// import type { CalculatorAstType, Person } from './generated/ast.js';
import type { CalculatorAstType } from './generated/ast.js';
import type { CalculatorServices } from './calculator-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CalculatorServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.CalculatorValidator;
    const checks: ValidationChecks<CalculatorAstType> = {
        // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CalculatorValidator {

    // checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
    //     if (person.name) {
    //         const firstChar = person.name.substring(0, 1);
    //         if (firstChar.toUpperCase() !== firstChar) {
    //             accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
    //         }
    //     }
    // }

}
