import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function revisionDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const release = group.get('date_release')?.value;
    const revision = group.get('date_revision')?.value;

    if (!release || !revision) {
      return null;
    }

    const releaseDate = parseLocalDate(release);
    const revisionDate = parseLocalDate(revision);

    const expectedRevisionDate = new Date(
      releaseDate.getFullYear() + 1,
      releaseDate.getMonth(),
      releaseDate.getDate()
    );

    releaseDate.setHours(0, 0, 0, 0);
    revisionDate.setHours(0, 0, 0, 0);
    expectedRevisionDate.setHours(0, 0, 0, 0);

    return revisionDate.getTime() === expectedRevisionDate.getTime()
      ? null
      : { invalidRevisionDate: true };
  };
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}