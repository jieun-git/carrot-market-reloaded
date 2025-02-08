// route.ts
// route.ts 라는 이름은 넥스테에게 api 파일임을 알려준다.
// https 요청을 받아서 json 을 반환하거나 유저를 이동시킴.
// route.ts는 UI를 렌더링하지 않는다!! UI 렌더링은 page.tsx 가 함.

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log(request);

  return Response.json({
    ok: true,
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log("log the user in!!");
  return Response.json(data);
}
