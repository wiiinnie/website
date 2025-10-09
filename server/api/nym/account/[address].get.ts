// server/api/nym/account/[address].get.ts
export default defineEventHandler(async (event) => {
  const address = event.context.params?.address;
  if (!address) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Address not provided',
    });
  }

  try {
    const data = await $fetch(`https://api.nymtech.net/cosmos/auth/v1beta1/accounts/${address}`);
    return data;
  } catch (error) {
    console.error('Error fetching account info from nymtech API:', error);
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch account info from nymtech API.',
    });
  }
});
