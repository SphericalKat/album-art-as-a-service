# Album Art as a Service
This is a simple service that provides album art for a given artist and album name. It uses the [Spotify API](https://developer.spotify.com/documentation/web-api/) to get the album art.

## Usage
To use the service, make a GET request to `https://aaaas.deno.dev` with the following query parameters:
- `query`: Your search query. This should typically be in the format `artist - album`. For example, `the beatles - abbey road`. This is a required parameter.
- `size`: The size of the image. This can be one of `small`, `medium`, or `large`. The default is `large`. This is an optional parameter.

Here's an example request:
```
curl 'https://aaaas.deno.dev?query=the%20beatles%20-%20abbey%20road&size=medium'
```