async function request(method, url, body) {
  const extra = {};

  if (body) {
    extra.headers = { "Content-Type": "application/json" };
    extra.body = JSON.stringify(body);
  }

  return fetch(url, {
    method,
    credentials: "same-origin",
    headers,
    ...extra,
  });
}

export default request;
