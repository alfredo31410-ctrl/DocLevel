# Anexo seguro de accesos DocLevel

Este archivo es una plantilla para documentar accesos sensibles. No se recomienda compartirlo junto con el PDF general.

Fecha de actualización: 26 de junio de 2026

---

## Reglas para usar este anexo

- Compartir solo con personas autorizadas.
- No enviar por grupos abiertos.
- No subir a carpetas públicas.
- No incluir capturas donde se vean contraseñas.
- Rotar contraseñas cuando alguien deje el equipo.
- Usar contraseñas distintas para MongoDB, Vercel y panel admin.

---

## Acceso al sitio

| Elemento | Valor |
|---|---|
| Sitio público | https://doclevelacademy.com/ |
| Panel admin | https://doclevelacademy.com/admin |

---

## Basic Auth de `/admin`

Este acceso corresponde a la primera ventana emergente del navegador.

| Campo | Valor |
|---|---|
| Usuario / email | admin@doclevelacademy.com |
| Contraseña | COMPLETAR EN CANAL SEGURO |
| Variable en Vercel | `ADMIN_PASSWORD` |
| Variable local | `ADMIN_PASSWORD` |

---

## Login interno del panel

Este acceso corresponde al formulario dentro de la página de administración.

| Campo | Valor |
|---|---|
| Correo admin | admin@doclevelacademy.com |
| Contraseña | COMPLETAR EN CANAL SEGURO |
| Dónde se valida | MongoDB, colección `admins` |

Nota: esta contraseña se guarda como hash bcrypt en MongoDB. No debe guardarse en texto plano dentro del repositorio.

---

## MongoDB Atlas

| Campo | Valor |
|---|---|
| Plataforma | MongoDB Atlas |
| Base de datos | DocLevel |
| Usuario DB | COMPLETAR EN CANAL SEGURO |
| Contraseña DB | COMPLETAR EN CANAL SEGURO |
| Connection string | COMPLETAR EN CANAL SEGURO |
| Variables relacionadas | `MONGO_URL`, `MONGODB_URI`, `DB_NAME` |

---

## Vercel

| Campo | Valor |
|---|---|
| Plataforma | Vercel |
| Proyecto | DocLevel |
| Dominio | doclevelacademy.com |
| Equipo/cuenta responsable | COMPLETAR |
| Variables configuradas | `MONGO_URL`, `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, `SETUP_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` |

---

## Variables de entorno locales

Archivo:

```text
.env.local
```

Plantilla segura:

```env
MONGO_URL="COMPLETAR_EN_CANAL_SEGURO"
MONGODB_URI="COMPLETAR_EN_CANAL_SEGURO"
DB_NAME="DocLevel"
JWT_SECRET="COMPLETAR_EN_CANAL_SEGURO"
SETUP_TOKEN="COMPLETAR_EN_CANAL_SEGURO"
ADMIN_EMAIL="admin@doclevelacademy.com"
ADMIN_PASSWORD="COMPLETAR_EN_CANAL_SEGURO"
```

---

## Historial de cambios de accesos

| Fecha | Cambio | Responsable |
|---|---|---|
| 26 de junio de 2026 | Admin actualizado y administradores anteriores eliminados | Pendiente |

