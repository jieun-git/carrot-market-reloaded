/*
request 하는 소스와 user 사이에서 동작
ex) GET profile ----> middleware() ----> <Profile />
    user가 프로필 페이지로 이동하기 전에 임의의 코드 실행
    쿠키를 확인해서 없으면 다른 페이지로 돌리거나 등등
모든 request 가 실행될 때 마다 실행됨.
그래서, middleware 는 빨리 실행되어야 하고 런타임이 무거워서는 안 된다. -> edge runtime 에서만 실행됨.(많은 Npm 패키지들이 middleware 에서 동작하지 않는 이유)
(edge runtime: 모든 npm 모듈을 엑세스 할 수 없음. node.js 내부에서는 실행되지 않고 매우 제한된 버전의 node.js 에서 실행)
 */

import { NextRequest, NextResponse } from "next/server";
import getSession from "@/lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();

  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    // log out
    if (!exists) {
      // 로그인 안 되어 있는데 프로필 같은 페이지에 접근할 때
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // login
    if (exists) {
      // 로그인된 상태인데 계정 생성 같은 페이지에 접근할 때
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }
}

// middleware 가 실행되어야 하는 경로
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
