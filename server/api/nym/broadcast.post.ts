function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'data' in err && 'message' in err) {
    const e = err as { data?: { message?: string }; message?: string };
    return e.data?.message || e.message || String(err);
  }
  return String(err);
}

// server/api/nym/broadcast.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body || !body.tx_bytes) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing tx_bytes in request body',
    });
  }

  const broadcastMode = body.mode || 'BROADCAST_MODE_SYNC';
  const broadcastBody = {
    tx_bytes: body.tx_bytes, // Assuming tx_bytes is already a base64 string
    mode: broadcastMode,
  };

  try {
    const data = await $fetch('https://nym-api.polkachu.com/cosmos/tx/v1beta1/txs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: broadcastBody,
    });
    return data;
  } catch (error) {
    console.error('Error broadcasting transaction to nym API:', error);
    throw createError({
      statusCode: 502,
      statusMessage: `Failed to broadcast transaction to nym API: ${getErrorMessage(error)}`,
    });
  }
});
