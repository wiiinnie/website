// server/api/hermes.ts
//
// Returns the Hermes Stakepool node family (Nym family #19) with its total stake
// and all member nodes, including their delegations.
//
// Previously this proxied https://nymesis.vercel.app/api/hermes, which went offline
// (HTTP 402). It now queries the official Nym node-status API directly.
//
// Response shape:
//   {
//     family: { id, name, description, stake },   // stake in unym
//     nodes: [{ node_id, identity_key, description: { moniker, ... }, delegations: [{ amount, owner }], ... }]
//   }
// where delegation `amount` is a string in unym.

const NODE_STATUS_API = 'https://mainnet-node-status-api.nymtech.cc/explorer/v3';
const PAGE_SIZE = 200;
const MAX_PAGES = 20;
const HERMES_FAMILY_ID = 19;
const HERMES_HOST_SUFFIX = '.hermes-stakepool.de';

interface Coin {
  denom: string;
  amount: string;
}

interface RawDelegation {
  amount: Coin | string;
  owner?: string;
  proxy?: string | null;
  block_height?: number;
}

interface RawNode {
  node_id: number;
  identity_key: string;
  total_stake: string;
  original_pledge?: string | number;
  bonding_address?: string;
  bonded?: boolean;
  node_type?: string;
  description?: { moniker?: string; website?: string; details?: string; security_contact?: string };
  self_description?: { host_information?: { hostname?: string | null } } | null;
  rewarding_details?: { delegates?: string; unique_delegations?: number } | null;
  geoip?: unknown;
  family_data?: { id?: number; name?: string; description?: string; family_stake?: number | string } | null;
}

interface NodesPage {
  items: RawNode[];
  total?: number;
}

const isFamilyMember = (node: RawNode): boolean => Number(node.family_data?.id) === HERMES_FAMILY_ID;

// Fallback if the family assignment is ever missing from the API.
const isHermesNode = (node: RawNode): boolean => {
  const hostname = node.self_description?.host_information?.hostname?.toLowerCase() || '';
  const moniker = node.description?.moniker?.toLowerCase() || '';
  return hostname.endsWith(HERMES_HOST_SUFFIX) || moniker.includes('hermes stakepool');
};

const fetchAllNodes = async (): Promise<RawNode[]> => {
  const nodes: RawNode[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await $fetch<NodesPage>(`${NODE_STATUS_API}/nym-nodes`, {
      query: { size: PAGE_SIZE, page },
      timeout: 15000,
    });
    const items = Array.isArray(res?.items) ? res.items : [];
    nodes.push(...items);
    if (items.length < PAGE_SIZE) break;
  }
  return nodes;
};

const fetchDelegations = async (node: RawNode) => {
  try {
    const raw = await $fetch<RawDelegation[]>(`${NODE_STATUS_API}/nym-nodes/${node.node_id}/delegations`, {
      timeout: 15000,
    });
    if (!Array.isArray(raw)) throw new Error('Invalid delegations response');
    return raw.map((d) => ({
      amount: typeof d.amount === 'string' ? d.amount : d.amount?.amount ?? '0',
      owner: d.owner,
      proxy: d.proxy ?? null,
      block_height: d.block_height,
    }));
  } catch (error) {
    // Fallback: use the aggregated delegated amount reported for the node.
    console.warn(`Could not load delegations for node ${node.node_id}, using aggregate:`, error);
    const delegates = node.rewarding_details?.delegates;
    const amount = delegates ? String(Math.floor(Number(delegates))) : '0';
    return [{ amount, owner: undefined, proxy: null, block_height: undefined }];
  }
};

export default defineCachedEventHandler(
  async () => {
    try {
      const allNodes = await fetchAllNodes();
      let hermesNodes = allNodes.filter(isFamilyMember);
      if (hermesNodes.length === 0) hermesNodes = allNodes.filter(isHermesNode);

      if (hermesNodes.length === 0) {
        throw new Error('No Hermes nodes found in Nym node-status API response');
      }

      const familyData = hermesNodes.find((n) => n.family_data)?.family_data;
      const familyStake =
        familyData?.family_stake !== undefined && familyData?.family_stake !== null
          ? Number(familyData.family_stake)
          : hermesNodes.reduce((sum, n) => sum + Number(n.total_stake || 0), 0);

      const nodes = await Promise.all(
        hermesNodes.map(async (node) => ({
          node_id: node.node_id,
          identity_key: node.identity_key,
          bonding_address: node.bonding_address,
          bonded: node.bonded,
          node_type: node.node_type,
          total_stake: node.total_stake,
          original_pledge: node.original_pledge,
          hostname: node.self_description?.host_information?.hostname ?? null,
          description: node.description ?? {},
          geoip: node.geoip ?? null,
          delegations: await fetchDelegations(node),
        })),
      );

      return {
        family: {
          id: familyData?.id ?? HERMES_FAMILY_ID,
          name: familyData?.name ?? 'Hermes Stakepool',
          description: familyData?.description ?? '',
          stake: Math.floor(familyStake),
        },
        nodes: nodes.sort((a, b) => a.node_id - b.node_id),
      };
    } catch (error) {
      console.error('Error fetching Hermes nodes from Nym node-status API:', error);
      throw createError({
        statusCode: 502,
        statusMessage: 'Failed to fetch Hermes node data from Nym API.',
      });
    }
  },
  {
    name: 'hermes-nym-nodes',
    maxAge: 300, // cache for 5 minutes
    swr: true,
  },
);
