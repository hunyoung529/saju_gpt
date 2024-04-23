import { queryExecute } from "../Db";

export async function GET(req) {
  const id = req.nextUrl.searchParams.get("id");
  let data = await queryExecute("SELECT * from member where id=?", [id]);

  if (data.length) {
    return Response.json("중복");
  } else {
    return Response.json("사용");
  }
}
