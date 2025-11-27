import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET; 

export const login = (req, res) => {
    const { usuario, contraseña } = req.body;
    if (!usuario || usuario.trim() === '' || !contraseña || contraseña.trim() === '') {
        return res.status(400).json({ 
            mensaje: 'El usuario y la contraseña son obligatorios y no pueden estar vacíos.' 
        });
    }
    
    if (!JWT_SECRET) {
        console.error("JWT_SECRET no está definido en el entorno.");
        return res.status(500).json({ 
            mensaje: 'Error de configuración del servidor: Clave secreta no encontrada.' 
        });
    }

    const userPayload = { 
        id: Date.now(), 
        name: usuario 
    }; 

    try {
        const token = jwt.sign(
            userPayload, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );
    
        return res.json({ 
            mensaje: 'Autenticación exitosa', 
            token: token 
        });
    } catch (error) {
        console.error("Error al generar el JWT:", error);
        return res.status(500).json({ 
            mensaje: 'Error interno del servidor al generar el token.' 
        });
    }
};