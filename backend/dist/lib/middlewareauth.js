import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
export default async function middlewareauth(req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ message: "No token" });
        }
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        const email = decoded.email;
        const userfound = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!userfound) {
            res.status(401).json({ message: "failed auth" });
            return;
        }
        req.user = userfound;
        next();
    }
    catch (e) {
        res.status(500).json(e);
    }
}
//# sourceMappingURL=middlewareauth.js.map