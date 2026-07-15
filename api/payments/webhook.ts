export default async function handler(_request: any, response: any) {
  response.statusCode = 501;
  response.setHeader("content-type", "application/json");
  response.end(
    JSON.stringify({
      ok: false,
      error: "Payment provider webhook is not configured yet.",
    }),
  );
}
