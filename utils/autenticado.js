import jwt from "jsonwebtoken";

const JWT_SECRET = "chave-secreta";

const autenticado = (req, res, next) => {
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
