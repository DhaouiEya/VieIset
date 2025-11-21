import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  const errors: ValidationErrors = {};

  if (value.length < 6) errors['minLength'] = true;
  if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
  if (!/[a-z]/.test(value)) errors['lowercase'] = true;
  if (!/[0-9]/.test(value)) errors['digit'] = true;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors['special'] = true;
  if (/\s/.test(value)) errors['space'] = true;

  return Object.keys(errors).length ? errors : null;
}
