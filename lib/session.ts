import {getIronSession} from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number
}

export default async function  getSession() {
    const cookiesStore = await cookies();

    return  getIronSession<SessionContent>(cookiesStore, {
        cookieName: 'delicious-carrot',
        password: process.env.COOKIE_PASSWORD!,
    })
}