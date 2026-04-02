# Bank Products App

Aplicación frontend desarrollada en Angular para la administración de productos.

La solución permite:

- visualizar productos desde una API
- buscar productos
- controlar la cantidad de registros visibles
- agregar productos
- editar productos
- eliminar productos con confirmación
- validar campos con reglas de negocio
- mostrar errores visuales
- ejecutar pruebas unitarias con cobertura

---

## 1. Objetivo

Construir una aplicación Angular que cumpla con los requerimientos, aplicando buenas prácticas de desarrollo, principios de clean code, SOLID, manejo de errores, pruebas unitarias y maquetación sin frameworks de estilos. :contentReference[oaicite:3]{index=3}

---

## 2. Tecnologías utilizadas

- Angular 14+ / Angular standalone
- TypeScript
- SCSS
- RxJS
- Angular Router
- Angular Reactive Forms
- Jasmine / Karma o Jest según configuración del proyecto
- HttpClient

---

## 3. Características implementadas

### F1. Listado de productos financieros
Se consume el endpoint `GET /bp/products` para mostrar el listado de productos en una tabla. :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5}

### F2. Búsqueda de productos financieros
La pantalla principal incluye un campo de búsqueda que filtra por:
- id
- nombre
- descripción :contentReference[oaicite:6]{index=6}

### F3. Cantidad de registros
Se muestra la cantidad de resultados encontrados y un selector con valores:
- 5
- 10
- 20 :contentReference[oaicite:7]{index=7}

### F4. Agregar producto
Se implementó una pantalla de registro con validaciones de negocio y botones:
- Agregar
- Reiniciar :contentReference[oaicite:8]{index=8}

### F5. Editar producto
Cada producto tiene un menú contextual con opción de edición.  
En la pantalla de edición:
- se reutiliza el mismo formulario
- el campo ID permanece deshabilitado :contentReference[oaicite:9]{index=9}

### F6. Eliminar producto
Cada producto tiene opción de eliminar desde un menú contextual.  
Antes de eliminar, se muestra un modal de confirmación con botones:
- Cancelar
- Eliminar :contentReference[oaicite:10]{index=10}

---

## 4. Reglas de validación implementadas

| Campo | Validación |
|---|---|
| ID | Requerido, mínimo 3, máximo 10, validación remota de existencia |
| Nombre | Requerido, mínimo 5, máximo 100 |
| Descripción | Requerido, mínimo 10, máximo 200 |
| Logo | Requerido |
| Fecha de liberación | Requerida, igual o mayor a la fecha actual |
| Fecha de revisión | Requerida, exactamente 1 año posterior a la fecha de liberación |

Estas reglas fueron implementadas mediante:
- validadores síncronos
- validador asíncrono para ID
- validador cruzado para fechas :contentReference[oaicite:11]{index=11} :contentReference[oaicite:12]{index=12}

---

## 5. Diseño de la solución

La solución fue construida con enfoque por funcionalidad y componentes standalone de Angular.

### Estructura principal

```text
src/app
├── core
│   ├── interceptors
│   ├── models
│   └── services
├── features
│   └── products
│       ├── components
│       ├── models
│       ├── pages
│       ├── services
│       └── validators
├── app.config.ts
├── app.routes.ts
└── app.component.ts