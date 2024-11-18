import { ErrorCodes } from "./errorCodes.js";

export const ErrorMessages = {
    // User related errors
    USER_REGISTRATION: {
        MISSING_FIELDS: {
            name: "ValidationError",
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Todos los campos son obligatorios para el registro",
            cause: "Faltan campos obligatorios en el registro de usuario"
        },
        INVALID_EMAIL: {
            name: "ValidationError",
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Formato de correo electrónico no válido",
            cause: "El correo electrónico proporcionado no es válido"
        },
        EMAIL_EXISTS: {
            name: "DuplicateError",
            code: ErrorCodes.DUPLICATE_ERROR,
            message: "Correo electrónico ya registrado",
            cause: "Intento de registro con correo electrónico existente"
        },
        PASSWORD_POLICY: {
            name: "ValidationError",
            code: ErrorCodes.VALIDATION_ERROR,
            message: "La contraseña debe tener al menos 8 caracteres y contener letras y números",
            cause: "La contraseña no cumple con los requisitos de seguridad"
        }
    },

    // Pet related errors
    PET_CREATION: {
        MISSING_FIELDS: {
            name: "ValidationError",
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Se deben proporcionar todos los campos obligatorios para la mascota",
            cause: "Faltan campos obligatorios en la creación de la mascota"
        },
        INVALID_SPECIES: {
            name: "ValidationError",
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Especie de mascota no válida. Debe ser dog, cat, bird, or rabbit",
            cause: "Especie de mascota no válida"
        },
        INVALID_DATE: {
            name: "ValidationError",
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Formato de fecha de nacimiento no válido",
            cause: "El formato de fecha de nacimiento es incorrecto"
        }
    },

    // Generate Data user y pets
    GENERATE_DATA: {
        MISSING_FIELDS: {
            name: "ValidationError",
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Todos los campos son obligatorios users y pets para generar la data",
            cause: "Faltan campos obligatorios users o pets"
        },
        INVALID_FORMAT: {
            name: "ValidationError",
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Formato inválido, sólo numérico",
            cause: "Formato inválido, debe ser numérico"
        }
    },

    // Authentication errors
    AUTH: {
        INVALID_CREDENTIALS: {
            name: "AuthenticationError",
            code: ErrorCodes.AUTHENTICATION_ERROR,
            message: "Correo electrónico o contraseña no válidos",
            cause: "Intento de inicio de sesión fallido con credenciales no válidas"
        },
        TOKEN_EXPIRED: {
            name: "AuthenticationError",
            code: ErrorCodes.AUTHENTICATION_ERROR,
            message: "Sesión expirada, por favor, vuelva a iniciar sesión",
            cause: "JWT token vencido"
        },
        UNAUTHORIZED: {
            name: "AuthorizationError",
            code: ErrorCodes.AUTHORIZATION_ERROR,
            message: "Acceso no autorizado",
            cause: "Intento de acceder a un recurso restringido"
        }
    },

    // Database errors
    DATABASE: {
        CONNECTION_ERROR: {
            name: "DatabaseError",
            code: ErrorCodes.DATABASE_ERROR,
            message: "Error de conexión a la base de datos",
            cause: "Error al conectar a la base de datos"
        },
        QUERY_ERROR: {
            name: "DatabaseError",
            code: ErrorCodes.DATABASE_ERROR,
            message: "Error en la consulta de la base de datos",
            cause: "Error al ejecutar la consulta de la base de datos"
        }
    }
};
