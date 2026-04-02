import { FormControl } from '@angular/forms';
import { releaseDateValidator } from './release-date.validator';

describe('releaseDateValidator', () => {
  it('debe retornar null si la fecha es hoy', () => {
    const today = formatDateToInput(new Date());
    const control = new FormControl(today);

    const result = releaseDateValidator()(control);

    expect(result).toBeNull();
  });

  it('debe retornar null si la fecha es futura', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const control = new FormControl(formatDateToInput(tomorrow));

    const result = releaseDateValidator()(control);

    expect(result).toBeNull();
  });

  it('debe retornar error si la fecha es menor a hoy', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const control = new FormControl(formatDateToInput(yesterday));

    const result = releaseDateValidator()(control);

    expect(result).toEqual({ invalidReleaseDate: true });
  });

  it('debe retornar null si el control no tiene valor', () => {
    const control = new FormControl('');

    const result = releaseDateValidator()(control);

    expect(result).toBeNull();
  });
});

function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}