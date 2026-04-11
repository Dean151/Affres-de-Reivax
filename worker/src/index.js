export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));

    if (!key) {
      return new Response("Missing object key", { status: 400 });
    }

    const object =
      request.method === "HEAD"
        ? await env.MEDIA_BUCKET.head(key)
        : await env.MEDIA_BUCKET.get(key);

    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    const filename = key.split("/").pop() || "download";
    const headers = new Headers();

    object.writeHttpMetadata(headers);

    if (object.httpEtag) {
      headers.set("etag", object.httpEtag);
    }

    headers.set(
      "content-disposition",
      `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
    );

    return new Response(request.method === "HEAD" ? null : object.body, {
      status: 200,
      headers,
    });
  },
};
