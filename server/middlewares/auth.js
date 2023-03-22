import jwt from 'jsonwebtoken';

export const verifyLogin = (req, res, next) => {
    let token  = req.header("Authorization");

    try {
        if(!token){
            return res.status(403).send("Access denied!");
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const userId = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = userId;

        next();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}