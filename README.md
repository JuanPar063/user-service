# User Service - Servicio de Usuarios

Microservicio de gestión de usuarios y perfiles para el sistema de préstamos, construido con **NestJS**, **TypeScript** y **arquitectura hexagonal**.

## Descripción

Este microservicio forma parte del sistema [loans-software](https://github.com/JuanPar063/loans-software) y es responsable de la gestión completa de usuarios: registro, actualización de perfiles, validación de documentos y teléfonos, y consulta de información de clientes.

## Arquitectura Hexagonal

El proyecto está organizado siguiendo la arquitectura hexagonal (ports & adapters):

```
src/
├── application/
│   └── services/          # Casos de uso y lógica de negocio
├── domain/                # Entidades y puertos (interfaces)
├── infrastructure/        # Adaptadores: controladores, repositorios, DB
├── migrations/            # Migraciones de base de datos
├── app.module.ts
└── main.ts
```

## Tecnologías Utilizadas

- **NestJS** – Framework Node.js para el backend
- - **TypeScript** – Tipado estático
  - - **PostgreSQL** – Base de datos relacional
    - - **Docker** – Contenedorización del servicio
      - - **Jest** – Testing unitario y e2e
       
        - ## Funcionalidades
       
        - - Registro de nuevos usuarios
          - - Actualización de datos del cliente
            - - Consulta de perfiles de usuario
              - - Validación de documentos de identidad y teléfonos
                - - Gestión de ingresos mensuales del cliente
                 
                  - ## Requisitos Previos
                 
                  - - Node.js >= 18
                    - - Docker (opcional, para base de datos)
                      - - PostgreSQL
                       
                        - ## Instalación
                       
                        - ```bash
                          npm install
                          ```

                          ## Ejecución

                          ```bash
                          # Desarrollo
                          npm run start:dev

                          # Producción
                          npm run start:prod
                          ```

                          ## Tests

                          ```bash
                          # Pruebas unitarias
                          npm run test

                          # Pruebas e2e
                          npm run test:e2e

                          # Cobertura
                          npm run test:cov
                          ```

                          ## Variables de Entorno

                          ```env
                          DB_HOST=localhost
                          DB_PORT=5432
                          DB_USERNAME=postgres
                          DB_PASSWORD=password
                          DB_NAME=users_db
                          PORT=3001
                          ```

                          ## Parte del Ecosistema

                          Este servicio es parte del sistema de préstamos:

                          - [loans-software](https://github.com/JuanPar063/loans-software) – Orquestador principal
                          - - [loan-service](https://github.com/JuanPar063/loan-service) – Servicio de préstamos
                            - - [admin-service](https://github.com/JuanPar063/admin-service) – Servicio de administración
                              - - [loans-frontend](https://github.com/JuanPar063/loans-frontend) – Frontend
                               
                                - ## Autor
                               
                                - Juan Sebastian Pardo Anzola – [@JuanPar063](https://github.com/JuanPar063)
