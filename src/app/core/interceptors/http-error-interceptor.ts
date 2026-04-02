import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';


export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ha ocurrido un error inesperado.';

      if (error.status === 0) {
        message = 'No se pudo conectar con el servidor.';
      } else if (error.status === 400) {
        message = error.error?.message || 'Solicitud inválida.';
      } else if (error.status === 404) {
        message = error.error?.message || 'Recurso no encontrado.';
      } else if (error.status >= 500) {
        message = 'Error interno del servidor.';
      }

      notificationService.setMessage(message);

      return throwError(() => new Error(message));
    })
  );
};