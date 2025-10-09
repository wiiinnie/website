// server/api/nym/delegations/[address].get.ts
export default defineEventHandler(async (event) => {
  const address = event.context.params?.address;
  if (!address) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Address not provided',
    });
  }

  try {
    const data = await $fetch(`https://explorer.nymtech.net/api/v1/tmp/unstable/account/${address}`);
    return data;
  } catch (error) {
    console.error('Error fetching delegations from nymtech API:', error);
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch delegations from nymtech API.',
    });
  }
});
