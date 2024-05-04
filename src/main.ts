import { getAlbum } from "./album.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const { query, size } = Object.fromEntries(url.searchParams.entries());

  if (!query) {
    return new Response(
      JSON.stringify({
        error: "No query provided",
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const image = await getAlbum(query, { size });

  return new Response(
    JSON.stringify({
      image
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
});
