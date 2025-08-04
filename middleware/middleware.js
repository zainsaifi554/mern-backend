import HelperFunction from '../HelperFunction/HelperFunction.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const middleware = (req, res, next) => {
    console.log("Authorization middleware running...");
    const bearerToken = req?.headers?.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return HelperFunction(res, 401, true, null, "Token Not Found");
    }

    const token = bearerToken.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("User Verified:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT verification error:", error.message);
        HelperFunction(res, 401, true, null, "Invalid Token!");
    }
}

export default middleware;