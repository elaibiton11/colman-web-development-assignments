import { Request, Response } from 'express';
import UserModel from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send("invalid email or password");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send("invalid email or password");
        }

        const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET as string, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET as string);

        if ((user as any).refreshTokens == null) {
            (user as any).refreshTokens = [refreshToken];
        } else {
            (user as any).refreshTokens.push(refreshToken);
        }
        await user.save();

        res.status(200).send({ accessToken, refreshToken, _id: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

const logout = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(400).send("refreshToken is required");
    try {
        const user = await UserModel.findOne({ refreshTokens: refreshToken });
        if (user) {
            (user as any).refreshTokens = (user as any).refreshTokens.filter((t: string) => t !== refreshToken);
            await user.save();
        }
        res.status(200).send();
    } catch (err) {
        res.status(400).send(err);
    }
};

const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(400).send("refreshToken is required");
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { _id: string };
        const user = await UserModel.findOne({ _id: payload._id });
        if (!user) return res.status(400).send("user not found");

        if (!(user as any).refreshTokens || !(user as any).refreshTokens.includes(refreshToken)) {
            (user as any).refreshTokens = [];
            await user.save();
            return res.status(400).send("invalid refresh token");
        }

        const newAccessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET as string, { expiresIn:'1h' });
        const newRefreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET as string);

        (user as any).refreshTokens = (user as any).refreshTokens.filter((t: string) => t !== refreshToken);
        (user as any).refreshTokens.push(newRefreshToken);
        await user.save();

        res.status(200).send({ accessToken: newAccessToken, refreshToken: newRefreshToken, _id: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

export default {
    login,
    logout,
    refresh
}
