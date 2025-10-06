import User, {IUser} from "../models/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_here"

export const registerUser = async (
    username: string,
    email: string,
    password: string
): Promise<IUser> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({username, email, password: hashedPassword});
    return user.save();
}

export const loginUser = async (
    email: string,
    password: string
): Promise<{ token: string; user: IUser } | null> => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    return { token, user };
};