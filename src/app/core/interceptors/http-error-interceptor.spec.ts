import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { httpErrorInterceptor } from './http-error-interceptor';
import { NotificationService } from '../services/notification';

describe('httpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  const testUrl = 'http://localhost:3002/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
    notificationService.clear();
  });

  it('debe dejar pasar una respuesta exitosa', () => {
    const mockResponse = { ok: true };

    httpClient.get(testUrl).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(notificationService.getMessage()).toBe('');
  });

  it('debe manejar error 400 y guardar el mensaje del backend', () => {
    let receivedError: Error | undefined;

    httpClient.get(testUrl).subscribe({
      next: () => fail('debía fallar'),
      error: (error: Error) => {
        receivedError = error;
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(
      { message: 'Solicitud inválida desde backend' },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(receivedError).toBeTruthy();
    expect(receivedError?.message).toBe('Solicitud inválida desde backend');
    expect(notificationService.getMessage()).toBe('Solicitud inválida desde backend');
  });

  it('debe manejar error 404 y guardar el mensaje del backend', () => {
    let receivedError: Error | undefined;

    httpClient.get(testUrl).subscribe({
      next: () => fail('debía fallar'),
      error: (error: Error) => {
        receivedError = error;
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(
      { message: 'Recurso no encontrado' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(receivedError).toBeTruthy();
    expect(receivedError?.message).toBe('Recurso no encontrado');
    expect(notificationService.getMessage()).toBe('Recurso no encontrado');
  });

  it('debe manejar error 500 con mensaje genérico', () => {
    let receivedError: Error | undefined;

    httpClient.get(testUrl).subscribe({
      next: () => fail('debía fallar'),
      error: (error: Error) => {
        receivedError = error;
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(
      { any: 'payload' },
      { status: 500, statusText: 'Server Error' }
    );

    expect(receivedError).toBeTruthy();
    expect(receivedError?.message).toBe('Error interno del servidor.');
    expect(notificationService.getMessage()).toBe('Error interno del servidor.');
  });

  it('debe manejar error de red con status 0', () => {
    let receivedError: Error | undefined;

    httpClient.get(testUrl).subscribe({
      next: () => fail('debía fallar'),
      error: (error: Error) => {
        receivedError = error;
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.error(new ProgressEvent('error'));

    expect(receivedError).toBeTruthy();
    expect(receivedError?.message).toBe('No se pudo conectar con el servidor.');
    expect(notificationService.getMessage()).toBe('No se pudo conectar con el servidor.');
  });

  it('debe usar mensaje genérico si un 400 no trae message', () => {
    let receivedError: Error | undefined;

    httpClient.get(testUrl).subscribe({
      next: () => fail('debía fallar'),
      error: (error: Error) => {
        receivedError = error;
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(receivedError).toBeTruthy();
    expect(receivedError?.message).toBe('Solicitud inválida.');
    expect(notificationService.getMessage()).toBe('Solicitud inválida.');
  });
});