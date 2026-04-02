import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function releaseDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const inputDate = parseLocalDate(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return inputDate.getTime() >= today.getTime()
      ? null
      : { invalidReleaseDate: true };
  };
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}