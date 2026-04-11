import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";

function createObject({
  contentType = "audio/mpeg",
  etag = '"abc123"',
  body = "file-body",
} = {}) {
  return {
    body,
    httpEtag: etag,
    writeHttpMetadata(headers) {
      headers.set("content-type", contentType);
    },
  };
}

function createEnv({ object = null } = {}) {
  const calls = [];

  return {
    calls,
    MEDIA_BUCKET: {
      async get(key) {
        calls.push(["get", key]);
        return object;
      },
      async head(key) {
        calls.push(["head", key]);
        return object;
      },
    },
  };
}

test("rejects unsupported methods", async () => {
  const env = createEnv();
  const request = new Request("https://downloads.example.com/file.mp3", {
    method: "POST",
  });

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
  assert.deepEqual(env.calls, []);
});

test("returns 400 when the object key is missing", async () => {
  const env = createEnv();
  const request = new Request("https://downloads.example.com/");

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 400);
  assert.equal(await response.text(), "Missing object key");
  assert.deepEqual(env.calls, []);
});

test("returns 404 when the object is not found", async () => {
  const env = createEnv({ object: null });
  const request = new Request("https://downloads.example.com/missing.mp3");

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Not found");
  assert.deepEqual(env.calls, [["get", "missing.mp3"]]);
});

test("returns the object body and forces download for GET requests", async () => {
  const env = createEnv({ object: createObject() });
  const request = new Request(
    "https://downloads.example.com/nested/Noelbride.mp3",
  );

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "audio/mpeg");
  assert.equal(response.headers.get("etag"), '"abc123"');
  assert.equal(
    response.headers.get("content-disposition"),
    `attachment; filename="Noelbride.mp3"; filename*=UTF-8''Noelbride.mp3`,
  );
  assert.equal(await response.text(), "file-body");
  assert.deepEqual(env.calls, [["get", "nested/Noelbride.mp3"]]);
});

test("uses HEAD for head requests and returns no body", async () => {
  const env = createEnv({ object: createObject({ body: "ignored" }) });
  const request = new Request(
    "https://downloads.example.com/space%20track.mp3",
    {
      method: "HEAD",
    },
  );

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("content-disposition"),
    `attachment; filename="space track.mp3"; filename*=UTF-8''space%20track.mp3`,
  );
  assert.equal(await response.text(), "");
  assert.deepEqual(env.calls, [["head", "space track.mp3"]]);
});
