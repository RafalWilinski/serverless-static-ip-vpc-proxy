export default (
  body: string | any,
  statusCode: number = 200,
  cors: boolean = true,
  extraHeaders?: any
) => ({
  statusCode,
  body: typeof body === "string" ? body : JSON.stringify(body, null, 2),
  headers: cors
    ? {
        ...extraHeaders,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      }
    : extraHeaders
});
