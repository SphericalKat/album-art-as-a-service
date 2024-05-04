const apiEndpoint = "https://api.spotify.com/v1";
const authEndpoint = "https://accounts.spotify.com/api/token";
const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");
const method = "album";

interface AlbumOpts {
  size: string;
}

export const getAlbum = async (rawQuery: string, opts: AlbumOpts) => {
  const query = rawQuery.replaceAll("&", "and");
  const queryParams = `?q=${encodeURIComponent(
    query // your query here
  )}&type=${method}&limit=1`;
  const searchUrl = `${apiEndpoint}/search${queryParams}`;
  const authString = `${clientId}:${clientSecret}`;
  const authorization = `Basic ${btoa(authString)}`;

  // authorize
  const authToken = await fetch(authEndpoint, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `${authorization}`,
    },
  })
    .then((res) => res.json())
    .then((json) => json.access_token)
    .catch((err) => {
      console.error(err);
    });

  // fetch the image
  const image = await fetch(searchUrl, {
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (typeof json.error !== "undefined") {
        // Error
        return Promise.reject(
          new Error(`JSON - ${json.error} ${json.message}`)
        );
      }

      if (!json[method + "s"] || json[method + "s"].items.length === 0) {
        // Error
        return Promise.reject(new Error("No results found"));
      }

      // Select image size
      const images = json[method + "s"].items[0].images;

      let smallest = images[0];
      let largest = images[0];

      for (const element of images) {
        if (parseInt(element.width) < parseInt(smallest.width)) {
          smallest = element;
        }

        if (parseInt(element.width) > parseInt(largest.width)) {
          largest = element;
        }
      }

      if (opts.size === "small") return smallest.url;

      if (opts.size === "medium" && images.length > 1) return images[1].url;

      // Large by default
      return largest.url;
    })
    .catch((err) => {
      console.error(err);
    });

  return image;
};
