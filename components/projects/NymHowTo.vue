<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="container">
        <!-- Header with glitch text -->
        <div class="header-section">
            <GlitchText font-style="neon" text="Nym" size="3em" :speed="5" :enable-shadows="true"
                :enable-on-hover="false" />
        </div>

        <!-- Staking guide timeline -->
        <div class="staking-guide">
            <q-timeline color="secondary">
                <!-- Step 1: Wallet Connection -->
                <q-timeline-entry title="Step 1" subtitle="Connect Wallet" icon="wallet">
                    <q-card class="my-card">
                        <q-card-section>
                            <div class="row items-center">
                                <div class="col-auto">
                                    <q-btn :color="getButtonColor" :label="getButtonLabel" :loading="isConnecting"
                                        :icon="getButtonIcon" @click="handleWalletAction" />
                                </div>
                                <div class="col q-pl-md">
                                    <div v-if="!keplrInstalled" class="text-warning">
                                        ⚠️ Keplr wallet not detected. Please install it first.
                                    </div>
                                    <div v-else-if="!walletConnected">
                                        Connect Keplr wallet and select Nym network
                                    </div>
                                    <div v-else style="color: rgb(11, 11, 11);">
                                        <div>Connected: <b>{{ connectedAddress }}</b></div>
                                        <div>Balance: {{ walletAmount.toFixed(2) }} NYM</div>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-timeline-entry>

                <!-- Step 2: User Delegations -->
                <q-timeline-entry v-if="walletConnected" title="Your Delegations" subtitle="Manage your stakes"
                    icon="account_balance">
                    <q-card class="my-card">
                        <q-card-section>
                            <div v-if="isDelegationsLoading" class="text-center q-pa-md">
                                <q-spinner color="primary" size="3em" />
                                <p class="q-mt-md">Loading your delegations...</p>
                            </div>
                            <div v-else-if="userDelegations.length === 0 && pendingDelegations.filter(p => p.type === 'Delegation').length === 0"
                                class="text-center q-pa-md">
                                <q-icon name="info" size="3em" color="grey-5" />
                                <p class="text-grey-6 q-mt-md">You have no active delegations.</p>
                                <p class="text-grey-6">Start by delegating to a node below!</p>
                            </div>
                            <div v-else>
                                <div class="row items-center q-mb-md">
                                    <div class="col">
                                        <h6 class="q-ma-none">Your Active Delegations</h6>
                                        <p class="text-grey-6 q-ma-none">
                                            Total delegated: {{ totalDelegated.toLocaleString() }} NYM
                                        </p>
                                    </div>
                                </div>
                                <q-table :rows="userDelegations" :columns="delegationColumns" row-key="node_id"
                                    :rows-per-page-options="[0]" :pagination="{ rowsPerPage: 10 }">
                                    <template v-slot:body-cell-node_type="props">
                                        <q-td :props="props">
                                            <q-chip :color="props.value === 'mixnode' ? 'primary' : 'secondary'"
                                                text-color="white" size="sm">
                                                {{ props.value === 'mixnode' ? 'Mix Node' : 'Nym Node' }}
                                            </q-chip>
                                        </q-td>
                                    </template>
                                    <template v-slot:body-cell-actions="props">
                                        <q-td :props="props">
                                            <q-btn size="sm" color="negative" icon="remove_circle" label="Undelegate"
                                                @click="showDialog('undelegate', props.row.node_id)"
                                                :disable="props.row.amount === 0" />
                                        </q-td>
                                    </template>
                                </q-table>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-timeline-entry>

                <q-timeline-entry v-if="walletConnected && pendingDelegations.length > 0" title="Pending Actions"
                    subtitle="These will be processed in the next epoch" icon="hourglass_top" color="orange">
                    <q-card class="my-card">
                        <q-card-section>
                            <div v-if="isPendingLoading" class="text-center q-pa-md">
                                <q-spinner color="primary" size="3em" />
                            </div>
                            <div v-else>
                                <q-table :rows="pendingDelegations" :columns="pendingDelegationColumns"
                                    row-key="node_id" :rows-per-page-options="[0]">
                                    <template v-slot:body-cell-type="props">
                                        <q-td :props="props">
                                            <q-chip :color="props.value === 'Delegation' ? 'positive' : 'negative'"
                                                text-color="white" size="sm" :label="props.value" />
                                        </q-td>
                                    </template>
                                </q-table>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-timeline-entry>

                <!-- Step 3: Node Selection -->
                <q-timeline-entry title="Step 2" subtitle="Select a Node to Delegate" icon="lan">
                    <q-card class="my-card">
                        <q-card-section>
                            <q-table :rows="processedNodes" :columns="columns" row-key="node_id" virtual-scroll
                                :rows-per-page-options="[0]">
                                <template v-slot:body-cell-actions="props">
                                    <q-td :props="props">
                                        <div v-if="!walletConnected">
                                            <q-btn size="sm" color="secondary" icon="wallet" label="Connect Wallet"
                                                :disable="true" />
                                        </div>
                                        <div v-else>
                                            <q-btn v-if="props.row.saturation < 100" size="sm" color="primary"
                                                icon="add_circle" label="Delegate"
                                                @click="showDialog('delegate', props.row.node_id)" />
                                        </div>
                                    </q-td>
                                </template>
                            </q-table>
                        </q-card-section>
                    </q-card>
                </q-timeline-entry>
            </q-timeline>
        </div>

        <!-- Unified Dialog for Delegate/Undelegate -->
        <q-dialog v-model="dialogState.isOpen" persistent>
            <q-card>
                <q-card-section>
                    <div class="text-h6 text-primary">
                        {{ dialogState.type === 'delegate' ? 'Delegate to Node' : 'Confirm Undelegation' }}
                    </div>
                </q-card-section>

                <q-card-section v-if="dialogState.type === 'delegate'" class="q-pt-none">
                    <div class="q-mt-sm flex gap-2">
                        <q-chip v-for="pct in [15, 50, 75, 100]" :key="pct" clickable @click="setAmount(pct)"
                            :color="dialogState.type === 'delegate' ? 'primary' : 'negative'" text-color="white">
                            {{ pct }}%
                        </q-chip>
                    </div>
                    <q-input v-model.number="dialogState.amount" label="Amount (NYM)" type="number" min="0"
                        :max="walletAmount - 1" step="any" autofocus :rules="[
                            val => val > 0 || 'Amount must be greater than 0',
                            val => val <= walletAmount - 1 || 'Max allowed is ' + (walletAmount - 1)
                        ]" />
                </q-card-section>

                <q-card-section v-else class="q-pt-none">
                    Are you sure you want to undelegate from this node?
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn flat label="Confirm" color="primary" v-close-popup @click="handleDialogConfirm"
                        :disable="dialogState.type === 'delegate' && dialogState.amount <= 0" />
                </q-card-actions>
            </q-card>
        </q-dialog>

    </div>
</template>

<script setup lang="ts">
    import { computed, ref, onMounted } from 'vue';
    import { useQuasar } from 'quasar';
    import GlitchText from '../GlitchText.vue';
    import { Keplr } from '@keplr-wallet/provider-extension';
    import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
    import { GasPrice } from '@cosmjs/stargate';
    import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
    import { toBase64 } from '@cosmjs/encoding';

    // Props for receiving node data
    const props = defineProps<{
        nodes: any[];
    }>();

    // Quasar instance for notifications
    const $q = useQuasar();

    // --- Состояние для ждущих операций ---
    const pendingDelegations = ref<any[]>([]);
    const isPendingLoading = ref(false);

    // Wallet state
    const keplrInstalled = ref(false);
    const walletConnected = ref(false);
    const connectedAddress = ref('');
    const walletAmount = ref(0);
    const isConnecting = ref(false);
    const userDelegations = ref([]);
    const isDelegationsLoading = ref(false);

    // Dialog state
    const dialogState = ref({
        isOpen: false,
        type: '' as 'delegate' | 'undelegate' | '',
        nodeId: 0,
        amount: 0,
    });

    // Nym chain configuration
    const nymChainConfig = {
        chainId: 'nyx',
        chainName: 'Nym',
        rpc: 'https://rpc.nymtech.net',
        rest: 'https://api.nymtech.net',
        bip44: { coinType: 118 },
        currencies: [{ coinDenom: 'NYM', coinMinimalDenom: 'unym', coinDecimals: 6 }],
        stakeCurrency: { coinDenom: 'NYM', coinMinimalDenom: 'unym', coinDecimals: 6 },
    };

    // Nym contract addresses
    const NYM_MIXNET_CONTRACT = 'n17srjznxl9dvzdkpwpw24gg668wc73val88a6m5ajg6ankwvz9wtst0cznr';

    const setAmount = (pct: number) => {
        const maxAllowed = Math.max(0, walletAmount.value - 1); // не может быть отрицательным
        const value = Math.floor(walletAmount.value * pct / 100);
        dialogState.value.amount = Math.max(0, Math.min(value, maxAllowed)); // между 0 и max
    }


    // Computed properties for wallet button
    const getButtonLabel = computed(() => {
        if (!keplrInstalled.value) return 'Download Keplr';
        if (walletConnected.value) return 'Disconnect';
        return 'Connect Wallet';
    });

    const getButtonColor = computed(() => {
        if (!keplrInstalled.value) return 'orange';
        if (walletConnected.value) return 'negative';
        return 'primary';
    });

    const getButtonIcon = computed(() => {
        if (!keplrInstalled.value) return 'download';
        if (walletConnected.value) return 'logout';
        return 'account_balance_wallet';
    });

    // Table columns for node selection
    const columns = [
        { name: 'node_id', required: true, label: 'ID', align: 'left', field: 'node_id', sortable: true },
        { name: 'moniker', align: 'left', label: 'Moniker', field: (row: any) => row.description?.moniker || 'Unknown', sortable: true },
        { name: 'identity_key', align: 'left', label: 'Identity Key', field: 'identity_key', sortable: true },
        { name: 'saturation', align: 'right', label: 'Saturation', field: 'saturation', sortable: true, format: (val: number) => `${val}%`, style: (row: any) => `color: ${row.saturation < 100 ? 'green' : 'red'}` },
        { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
    ];

    // Table columns for user delegations
    const delegationColumns = [
        { name: 'node_id', required: true, label: 'Node ID', align: 'left', field: 'node_id', sortable: true, style: 'max-width: 150px;' },
        { name: 'node_type', align: 'center', label: 'Type', field: 'node_type', sortable: true, format: (val: string) => val === 'mixnode' ? 'Mix Node' : 'Nym Node' },
        { name: 'amount', align: 'right', label: 'Delegated Amount', field: 'amount', sortable: true, format: (val: number) => `${(val / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NYM` },
        { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
    ];

    // --- Колонки для таблицы ждущих операций ---
    const pendingDelegationColumns = [
        { name: 'node_id', label: 'Node ID', field: 'node_id', align: 'left', sortable: true },
        {
            name: 'amount',
            label: 'Amount',
            field: 'amount',
            align: 'right',
            format: (val: any) => {
                if (!val || !val.amount) return 'All'; // For undelegations
                const numericAmount = parseInt(val.amount, 10);
                if (isNaN(numericAmount)) return 'N/A';
                return `${(numericAmount / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NYM`;
            }
        },
        { name: 'type', label: 'Action Type', field: 'type', align: 'center' },
    ];

    // Computed property for processed nodes with saturation
    const processedNodes = computed(() => {
        if (!props.nodes) return [];
        return props.nodes.map(node => {
            const totalDelegations = node.delegations.reduce((sum: number, delegation: { amount: string | number }) =>
                sum + (typeof delegation.amount === 'number' ? delegation.amount / 1_000_000 : parseFloat(delegation.amount) / 1_000_000), 0);
            return { ...node, saturation: Math.round(totalDelegations / 2500) };
        });
    });

    // Computed property for total delegated amount
    const totalDelegated = computed(() => {
        return userDelegations.value.reduce((sum, delegation) => sum + (delegation.amount / 1_000_000), 0);
    });

    // --- REFACTORED DATA FETCHING ---

    const getPendingEvents = async (address: string) => {
        if (!address) return;
        isPendingLoading.value = true;
        try {
            const query = { get_pending_epoch_events: {} };
            const encodedQuery = toBase64(new TextEncoder().encode(JSON.stringify(query)));
            const url = `${nymChainConfig.rest}/cosmwasm/wasm/v1/contract/${NYM_MIXNET_CONTRACT}/smart/${encodedQuery}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch pending events: ${response.statusText}`);
            const data = await response.json();

            const allPendingEvents: any[] = [];
            if (data?.data?.events && Array.isArray(data.data.events)) {
                data.data.events.forEach((eventWrapper: any) => {
                    const { event } = eventWrapper;
                    if (!event?.kind) return;

                    if (event.kind.delegate && event.kind.delegate.owner === address) {
                        allPendingEvents.push({ ...event.kind.delegate, type: 'Delegation' });
                    } else if (event.kind.undelegate && event.kind.undelegate.owner === address) {
                        allPendingEvents.push({ ...event.kind.undelegate, amount: null, type: 'Undelegation' });
                    }
                });
            }
            pendingDelegations.value = allPendingEvents;
        } catch (error) {
            console.error("Error fetching pending events:", error);
            $q.notify({ type: 'negative', message: 'Could not fetch pending operations.' });
            pendingDelegations.value = [];
        } finally {
            isPendingLoading.value = false;
        }
    };

    const getNymBalance = async (address: string) => {
        try {
            const response = await fetch(`/api/nym/balance/${address}`);
            const data = await response.json();
            const nymBalance = data.balances.find((b: any) => b.denom === 'unym');
            walletAmount.value = nymBalance ? parseFloat(nymBalance.amount) / 1_000_000 : 0;
        } catch (error) {
            console.error('Error fetching balance:', error);
            walletAmount.value = 0;
        }
    };

    const getUserDelegations = async (address: string) => {
        isDelegationsLoading.value = true;
        try {
            const response = await fetch(`/api/nym/delegations/${address}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            let delegations: any[] = [];

            if (data.delegations && Array.isArray(data.delegations)) {
                delegations = data.delegations
                    .map((d: any) => {
                        const amount = d.delegated?.amount ? parseInt(d.delegated.amount.toString().replace('unym', '')) : 0;
                        const nodeId = parseInt(d.node_id || d.mix_identity, 10);
                        return amount > 0 ? { node_id: nodeId, node_type: 'mixnode', amount } : null;
                    })
                    .filter(Boolean);
            }

            const pendingUndelegateNodeIds = new Set(
                pendingDelegations.value
                    .filter(p => p.type === 'Undelegation')
                    .map(p => p.node_id)
            );

            userDelegations.value = delegations.filter(d => !pendingUndelegateNodeIds.has(d.node_id));
        } catch (error) {
            console.error('Error fetching user delegations:', error);
            userDelegations.value = [];
        } finally {
            isDelegationsLoading.value = false;
        }
    };

    const refreshAllData = async (address: string) => {
        if (!address) return;
        try {
            await getPendingEvents(address);
            await Promise.all([getNymBalance(address), getUserDelegations(address)]);
        } catch (error) {
            console.error("Error refreshing data:", error);
            $q.notify({ type: 'negative', message: 'Failed to refresh data.' });
        }
    };

    // --- TRANSACTION LOGIC ---

    const createDelegationMessage = (nodeId: number, amount: number) => {
        const amountInMicroNym = Math.floor(amount * 1_000_000);
        const delegateMsg = { delegate_to_mixnode: { node_id: nodeId } };
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: connectedAddress.value,
                contract: NYM_MIXNET_CONTRACT,
                msg: new TextEncoder().encode(JSON.stringify(delegateMsg)),
                funds: [{ amount: amountInMicroNym.toString(), denom: "unym" }],
            },
        };
    };

    const createUndelegationMessage = (nodeId: number) => {
        const undelegateMsg = { undelegate_from_mixnode: { node_id: nodeId } };
        return {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: connectedAddress.value,
                contract: NYM_MIXNET_CONTRACT,
                msg: new TextEncoder().encode(JSON.stringify(undelegateMsg)),
                funds: [],
            },
        };
    };

    const signAndBroadcastTx = async (messages: any[], memo: string) => {
        const keplr = await getKeplr();
        if (!keplr) throw new Error('Keplr not available');

        const offlineSigner = keplr.getOfflineSigner(nymChainConfig.chainId);
        const client = await SigningCosmWasmClient.connectWithSigner(
            nymChainConfig.rpc,
            offlineSigner,
            { gasPrice: GasPrice.fromString("0.025unym") }
        );

        const fee = { amount: [{ denom: "unym", amount: "5000" }], gas: "200000" };
        const txRaw = await client.sign(connectedAddress.value, messages, fee, memo);
        const txBytes = TxRaw.encode(txRaw).finish();
        const base64Tx = toBase64(txBytes);

        const broadcastResponse = await fetch(`/api/nym/broadcast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tx_bytes: base64Tx, mode: 'BROADCAST_MODE_SYNC' }),
        });

        const result = await broadcastResponse.json();
        if (!broadcastResponse.ok || result.tx_response?.code !== 0) {
            throw new Error(result.tx_response?.raw_log || 'Transaction broadcast failed');
        }
        return result;
    };

    const handleTransaction = async (
        action: () => Promise<any>,
        { loadingMessage, successMessage }: { loadingMessage: string, successMessage: string }
    ) => {
        try {
            $q.loading.show({ message: loadingMessage });
            const result = await action();
            console.log(`✅ Transaction Successful: ${result.tx_response.txhash}`);
            $q.loading.show({ message: 'Updating state...' });

            setTimeout(async () => {
                await refreshAllData(connectedAddress.value);
                $q.loading.hide();
                $q.notify({ type: 'positive', message: successMessage });
            }, 6000);
        } catch (error: any) {
            $q.loading.hide();
            $q.notify({ type: 'negative', message: `Operation failed: ${error.message}` });
        }
    };

    const delegateToNode = (nodeId: number, amount: number) => {
        const msg = createDelegationMessage(nodeId, amount);
        handleTransaction(() => signAndBroadcastTx([msg], "Delegation via Hermes Pool"), {
            loadingMessage: 'Please sign in Keplr...',
            successMessage: 'Delegation successfully queued!',
        });
    };

    const undelegateFromNode = (nodeId: number) => {
        const msg = createUndelegationMessage(nodeId);
        handleTransaction(() => signAndBroadcastTx([msg], "Undelegation via Hermes Pool"), {
            loadingMessage: 'Please sign in Keplr...',
            successMessage: 'Undelegation successfully queued!',
        });
    };

    // --- DIALOG AND WALLET LOGIC ---

    const showDialog = (type: 'delegate' | 'undelegate', nodeId: number) => {
        if (!nodeId) {
            $q.notify({ type: 'negative', message: 'Node ID not found.' });
            return;
        }
        dialogState.value = { isOpen: true, type, nodeId, amount: 0 };
    };

    const handleDialogConfirm = () => {
        const { type, nodeId, amount } = dialogState.value;
        if (type === 'delegate') {
            if (amount <= 0 || amount > walletAmount.value) {
                $q.notify({ type: 'negative', message: 'Please enter a valid amount.' });
                return;
            }
            delegateToNode(nodeId, amount);
        } else if (type === 'undelegate') {
            undelegateFromNode(nodeId);
        }
        dialogState.value.isOpen = false;
    };

    const getKeplr = async (): Promise<any> => {
        if (typeof window === 'undefined') return undefined;
        try {
            return await Keplr.getKeplr();
        } catch (error) {
            return window.keplr || undefined;
        }
    };

    const checkKeplrInstallation = async () => {
        keplrInstalled.value = !!(await getKeplr());
    };

    const connectWallet = async () => {
        if (isConnecting.value) return;
        isConnecting.value = true;
        try {
            const keplr = await getKeplr();
            if (!keplr) throw new Error('Keplr wallet not found');
            await keplr.experimentalSuggestChain(nymChainConfig);
            await keplr.enable(nymChainConfig.chainId);
            const key = await keplr.getKey(nymChainConfig.chainId);

            connectedAddress.value = key.bech32Address;
            walletConnected.value = true;
            await refreshAllData(key.bech32Address);
            console.log('Successfully connected to Nym network:', key.bech32Address);
        } catch (error: any) {
            console.error('Failed to connect wallet:', error);
            $q.notify({ type: 'negative', message: `Failed to connect wallet: ${error.message}` });
        } finally {
            isConnecting.value = false;
        }
    };

    const disconnectWallet = () => {
        walletConnected.value = false;
        connectedAddress.value = '';
        walletAmount.value = 0;
        userDelegations.value = [];
        pendingDelegations.value = [];
        console.log('Wallet disconnected');
    };

    const handleWalletAction = async () => {
        if (!keplrInstalled.value) {
            window.open('https://www.keplr.app/download', '_blank');
            setTimeout(checkKeplrInstallation, 2000);
        } else if (walletConnected.value) {
            disconnectWallet();
        } else {
            await connectWallet();
        }
    };

    onMounted(async () => {
        await checkKeplrInstallation();
        // if (keplrInstalled.value) {
        //     try {
        //         const keplr = await getKeplr();
        //         const key = await keplr.getKey(nymChainConfig.chainId).catch(() => null);
        //         if (key) await connectWallet();
        //     } catch (error) {
        //         console.log('Wallet not connected yet');
        //     }
        // }
        // window.addEventListener('keplr_keystorechange', () => {
        //     if (walletConnected.value) connectWallet().catch(disconnectWallet);
        // });
    });
</script>
<style scoped>
    .container {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        height: 100%;
        width: 100%;
        padding: 0 20px;
    }

    .header-section {
        text-align: center;
        margin-bottom: 0px;
        padding: 0px 0;
    }

    .staking-guide {
        margin-top: 0px;
    }

    @media (max-width: 768px) {
        .container {
            padding: 0 10px;
        }

        .header-section {
            padding: 20px 0;
        }
    }
</style>
