export default function handler(_request: unknown, response: any) {
  response.statusCode = 200;
  response.setHeader("content-type", "application/json");
  response.end(
    JSON.stringify({
      ok: true,
      service: "delirio-rpg",
    }),
  );
}
