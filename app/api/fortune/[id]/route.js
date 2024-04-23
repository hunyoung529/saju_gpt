import { queryExecute } from "../../Db";

export async function PUT(req, res) {
  const url = new URL(req.url);

  const id = decodeURIComponent(url.pathname.split("/").pop());
  const body = await req.json();
  const { fortune, myelement, yourelement } = body;

  try {
    const data = await queryExecute(
      `UPDATE fortune SET fortune = ?, myelement = ?, yourelement = ? WHERE id = ?`,
      [fortune, myelement, yourelement, id]
    );

    return Response.json(data);
  } catch (error) {
    console.error("Error updating fortune:", error);
    return Response.json({ error: "Error updating fortune" });
  }
}

export async function GET(req, res) {
  const id = req.nextUrl.searchParams.get("id");

  try {
    const data = await queryExecute("SELECT * from fortune WHERE id = ?", [id]);
    return new Response.json(data);
  } catch (error) {
    console.error("Database error:", error);
    return new Response.json({ error: "Database error" });
  }
}
