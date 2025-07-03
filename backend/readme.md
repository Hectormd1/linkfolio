# DevTree Backend

Este es el backend de **DevTree**, una API REST construida con **Express** y **TypeScript** para gestionar usuarios, autenticación y enlaces sociales.

## Tecnologías principales

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Cloudinary](https://cloudinary.com/) (para imágenes de perfil)
- [JWT](https://jwt.io/) (autenticación)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (hash de contraseñas)
- [formidable](https://www.npmjs.com/package/formidable) (subida de archivos)

## Scripts principales

```bash
npm run dev         # Inicia el servidor en modo desarrollo (nodemon)
npm run build       # Compila el código TypeScript a JavaScript
npm start           # Inicia el servidor en producción (usa dist/)