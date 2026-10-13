import jwt from "jsonwebtoken";

const JWT_SECRET = "segredo_super_secreto";


const autenticado = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Acesso não autorizado!",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido!",
    });
  }
};

export default autenticado;
