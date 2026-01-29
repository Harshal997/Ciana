export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversation_id = searchParams.get("conversation_id");

  if (!conversation_id) {
    return new Response("conversation_id missing", { status: 400 });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return new Response("Api key not set", { status: 500 });
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversations/${conversation_id}`,
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      },
    },
  );

  const text = await response.text(); // 👈 IMPORTANT

  console.log("ElevenLabs status:", response.status);
  console.log("ElevenLabs raw response:", text);

  if (!response.ok) {
    return new Response(text, { status: response.status });
  }

  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
