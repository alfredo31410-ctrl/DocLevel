# DocLevel

Plataforma de cursos médicos para DocLevel. El proyecto está construido con Next.js 14, rutas API internas y MongoDB Atlas.

## Stack

- Frontend y backend: Next.js App Router
- Base de datos: MongoDB Atlas
- Autenticación admin: JWT + bcrypt
- Deploy frontend: Vercel
- Deploy backend alternativo: Railway solo si se separa el backend; hoy la API vive dentro de Next.js

## Fase 1 - Correr local

1. Clonar el repositorio.
2. Instalar dependencias:

```bash
npm install
```

3. Crear `.env.local` tomando como base `.env.example`.
4. Configurar MongoDB Atlas:

```env
MONGO_URL=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority&appName=DocLevel
DB_NAME=DocLevel
JWT_SECRET=replace_with_at_least_32_random_characters
ADMIN_EMAIL=admin@doclevelacademy.com
ADMIN_PASSWORD=replace_with_a_strong_password
SETUP_TOKEN=replace_with_a_private_setup_token
```

5. Crear o actualizar el usuario admin:

```bash
npm run admin:upsert
```

6. Cargar los cuatro cursos base:

```bash
npm run courses:replace
```

7. Levantar local:

```bash
npm run dev
```

8. Entrar a `http://localhost:3000/admin` para crear o editar cursos.

## Cursos Actuales

El catálogo inicial queda limitado a:

- Pediatría
- Odontología
- Ginecología
- Cardiología

La fuente de verdad para el seed está en `lib/doclevelCourses.json`.

## Scripts

- `npm run dev`: corre el proyecto local en el puerto 3000.
- `npm run build`: compila producción.
- `npm run start`: sirve el build.
- `npm run admin:upsert`: crea o actualiza el admin usando `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
- `npm run courses:replace`: reemplaza la colección `courses` con los cuatro cursos oficiales actuales.

## Deploy

### MongoDB Atlas

Crear cluster, usuario de base de datos y permitir conexiones desde Vercel/Railway. Guardar el connection string como `MONGO_URL`.

### Vercel

Configurar estas variables:

- `MONGO_URL`
- `DB_NAME`
- `JWT_SECRET`
- `SETUP_TOKEN`

Luego desplegar desde Vercel conectado al repo. El proyecto ya tiene API interna, por lo que Vercel puede servir frontend y endpoints `/api/*`.

### Railway

Railway solo es necesario si decides separar backend en un servicio independiente. En el estado actual del repo no hay backend separado Express/FastAPI; la API está integrada en Next.js. Si quieres Railway, el siguiente cambio sería extraer `app/api` a un servicio backend independiente y apuntar el frontend a esa URL.

### Dominio

Conectar el dominio desde Vercel y revisar que las variables de producción apunten a la base correcta.

## Checklist De Fases

- Fase 1: local listo con instalación, `.env.local`, Mongo Atlas, admin y seed de cursos.
- Fase 2: README real, scripts claros, variables documentadas y limpieza de archivos residuales.
- Fase 3: textos corregidos, cursos reducidos, responsive existente conservado y panel admin pulido.
- Fase 4: pendiente crear/configurar producción en Vercel y, si se requiere de verdad, Railway.
