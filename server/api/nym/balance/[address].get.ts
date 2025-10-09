// server/api/nym/balance/[address].get.ts
export default defineEventHandler(async (event) => {
  const address = event.context.params?.address;
  if (!address) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Address not provided',
    });
  }

  try {
    const data = await $fetch(`https://api.nymtech.net/cosmos/bank/v1beta1/balances/${address}`);
    return data;
  } catch (error) {
    console.error('Error fetching balance from nymtech API:', error);
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch balance from nymtech API.',
    });
  }
});
