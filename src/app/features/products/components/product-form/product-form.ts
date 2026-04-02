import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

import { FinancialProduct } from '../../models/financial-product.model';
import { ProductsApiService } from '../../services/products-api';
import { releaseDateValidator } from '../../validators/release-date.validator';
import { revisionDateValidator } from '../../validators/revision-date.validator';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialValue: FinancialProduct | null = null;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<FinancialProduct>();
  @Output() formReset = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly productsApiService = inject(ProductsApiService);

  form!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    this.buildForm();
    this.setupReleaseDateSync();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.form && this.initialValue) {
      this.patchForm(this.initialValue);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group(
      {
        id: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(10)
            ],
            asyncValidators: this.mode === 'create' ? [this.productIdExistsValidator()] : [],
            updateOn: 'blur'
          }
        ],
        name: [
          '',
          [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
        ],
        description: [
          '',
          [Validators.required, Validators.minLength(10), Validators.maxLength(200)]
        ],
        logo: ['', [Validators.required]],
        date_release: ['', [Validators.required, releaseDateValidator()]],
        date_revision: ['', [Validators.required]]
      },
      {
        validators: [revisionDateValidator()]
      }
    );

    if (this.initialValue) {
      this.patchForm(this.initialValue);
    }

    if (this.mode === 'edit') {
      this.form.get('id')?.disable();
    }
  }

  private patchForm(product: FinancialProduct): void {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision
    });

    if (this.mode === 'edit') {
      this.form.get('id')?.disable();
    }
  }

  private setupReleaseDateSync(): void {
    this.form.get('date_release')?.valueChanges.subscribe((value: string) => {
      if (!value) {
        return;
      }

      const releaseDate = this.parseLocalDate(value);

      const revisionDate = new Date(
        releaseDate.getFullYear() + 1,
        releaseDate.getMonth(),
        releaseDate.getDate()
      );

      const formattedRevisionDate = this.formatDateToInput(revisionDate);

      this.form.get('date_revision')?.setValue(formattedRevisionDate, { emitEvent: false });
      this.form.updateValueAndValidity();
    });
  }

  public parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  public formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private productIdExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return this.productsApiService.verifyProductId(control.value).pipe(
        map((exists) => (exists ? { productIdExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue() as FinancialProduct;
    this.formSubmit.emit(rawValue);
  }

  onReset(): void {
    this.submitted = false;

    if (this.mode === 'edit' && this.initialValue) {
      this.patchForm(this.initialValue);
      return;
    }

    this.form.reset();
    this.formReset.emit();
  }

  hasControlError(controlName: string, errorKey?: string): boolean {
    const control = this.form.get(controlName);

    if (!control) {
      return false;
    }

    const shouldShow = control.touched || this.submitted;

    if (!errorKey) {
      return shouldShow && control.invalid;
    }

    return shouldShow && control.hasError(errorKey);
  }

  hasFormError(errorKey: string): boolean {
    return (this.form.touched || this.submitted) && this.form.hasError(errorKey);
  }
}