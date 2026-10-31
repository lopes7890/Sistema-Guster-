import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT;

function autenticado (req, res, next){
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/");
  }

  try {
    const dadosToken = jwt.verify(token, JWT_SECRET);

    req.medico = dadosToken;

    return next();
  } catch (error) {
    res.clearCookie("token");

    return res.redirect("/");
  }
};

export default autenticado;
