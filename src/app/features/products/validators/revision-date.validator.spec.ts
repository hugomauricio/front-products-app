import { FormControl, FormGroup } from '@angular/forms';
import { revisionDateValidator } from './revision-date.validator';

describe('revisionDateValidator', () => {
  it('debe retornar null si la fecha de revisión es exactamente +1 año', () => {
    const form = new FormGroup({
      date_release: new FormControl('2025-01-01'),
      date_revision: new FormControl('2026-01-01')
    });

    const result = revisionDateValidator()(form);

    expect(result).toBeNull();
  });

  it('debe retornar error si la fecha de revisión no es exactamente +1 año', () => {
    const form = new FormGroup({
      date_release: new FormControl('2025-01-01'),
      date_revision: new FormControl('2025-12-31')
    });

    const result = revisionDateValidator()(form);

    expect(result).toEqual({ invalidRevisionDate: true });
  });
});