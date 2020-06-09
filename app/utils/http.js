async function request(method, url, body = undefined) {
  const extra = {};

  if (body) {
    extra.headers = { "Content-Type": "application/json" };
    extra.body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    ...extra,
  });

  if (response.status === 401) {
    const error = new Error("Devi effettuare il login");
    window.location.href = "/login";
    throw error;
  }

  const contentType = response.headers.get("content-type");
  const data =
    contentType && contentType.indexOf("application/json") !== -1
      ? await response.json()
      : response;

  return data;
}

export default request;
