<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="container">
        <!-- Header -->
        <div class="header-section">
            <GlitchText font-style="neon" text="Cardano" size="2.5em" :speed="5" :enable-shadows="true"
                :enable-on-hover="false" />
        </div>

        <!-- Staking guide timeline -->
        <div class="staking-guide">
            <q-timeline color="secondary" dense>
                <!-- Step 1: Stake delegation -->
                <q-timeline-entry title="Delegate Stake" subtitle="Manage your stakes" icon="account_balance">
                    <q-card class="delegation-card">
                        <div class="card-glow card-glow-green"></div>
                        <q-card-section class="delegation-header">
                            <div class="pool-name">Hermes Stakepool Germany #1</div>
                            <div class="pool-id">
                                pool16fyda57p3c8gp5r6gmcq5tvqsp6mnzwvkxswgznkuh8wztrp6vv
                            </div>
                        </q-card-section>

                        <q-card-section class="delegation-stats">
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <q-icon name="show_chart" size="24px" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-label">Total stake:</div>
                                    <div class="stat-value">
                                        <!-- Показываем stake или состояние загрузки -->
                                        <span v-if="!isLoading && poolData?.data?.stake">
                                            {{ (Number(poolData.data.stake) / 1_000_000_000_000).toLocaleString('en-US',
                                                { maximumFractionDigits: 2 }) }}M ₳
                                        </span>
                                        <span v-else-if="isLoading">Loading...</span>
                                        <span v-else>Error</span>
                                    </div>
                                </div>
                            </div>

                            <div class="stat-item">
                                <div class="stat-icon">
                                    <q-icon name="security" size="24px" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-info">
                                        <div class="stat-label">Total blocks created:</div>
                                        <div class="stat-value">
                                            <!-- Показываем stake или состояние загрузки -->
                                            <span v-if="!isLoading && poolData?.data?.blocks_lifetime">
                                                {{ formatStake(poolData.data.blocks_lifetime) }}
                                            </span>
                                            <span v-else-if="isLoading">Loading...</span>
                                            <span v-else>Error</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="stat-item">
                                <div class="stat-icon">
                                    <q-icon name="public" size="24px" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-info">
                                        <div class="stat-label">Total delegators: </div>
                                        <div class="stat-value">
                                            <!-- Показываем stake или состояние загрузки -->
                                            <span v-if="!isLoading && poolData?.data?.delegators">
                                                {{ formatStake(poolData.data.delegators) }}
                                            </span>
                                            <span v-else-if="isLoading">Loading...</span>
                                            <span v-else>Error</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-actions class="delegation-actions">
                            <q-btn class="delegate-btn" label="Delegate Now"
                                href="https://tool.jamonbread.io/delegate/pool16fyda57p3c8gp5r6gmcq5tvqsp6mnzwvkxswgznkuh8wztrp6vv"
                                target="_blank" icon-right="rocket_launch" flat no-caps />
                        </q-card-actions>
                    </q-card>
                </q-timeline-entry>

                <!-- Step 2: Governance delegation -->
                <q-timeline-entry title="Delegate Votes" subtitle="Governance delegation" icon="how_to_vote">
                    <q-card class="delegation-card">
                        <div class="card-glow card-glow-purple"></div>
                        <q-card-section class="delegation-header">
                            <div class="pool-name">Hermes Stakepool Germany (HRMS)</div>
                            <div class="pool-id">
                                drep1y99u6r8vdexm854trlwt3svysy953tv7e855vs4rxvaqsqehclg
                            </div>
                        </q-card-section>

                        <q-card-section class="delegation-stats">
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <q-icon name="show_chart" size="24px" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-label">Objectives</div>
                                    <div class="stat-value">Value long term technical innovation</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <q-icon name="security" size="24px" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-label">Status</div>
                                    <div class="stat-value">Active</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <q-icon name="public" size="24px" />
                                </div>
                                <div class="stat-info">
                                    <div class="stat-label">Location</div>
                                    <div class="stat-value">Germany</div>
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-actions class="delegation-actions">
                            <q-btn class="delegate-btn delegate-btn-purple" label="Delegate Now"
                                href="https://gov.tools/drep_directory/drep1y99u6r8vdexm854trlwt3svysy953tv7e855vs4rxvaqsqehclg"
                                target="_blank" icon-right="rocket_launch" flat no-caps />
                        </q-card-actions>
                    </q-card>
                </q-timeline-entry>
            </q-timeline>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import GlitchText from '../GlitchText.vue'

    // Определяем тип данных, возвращаемых из API
    interface PoolResponse {
        data?: {
            stake?: string | number
            blocks_lifetime?: string | number
            delegators?: string | number
            [key: string]: any
        }
        [key: string]: any
    }

    const poolData = ref<PoolResponse>({})
    const isLoading = ref(true)

    const getPool = async () => {
        isLoading.value = true
        try {
            const response = await fetch(
                'https://js.cexplorer.io/api-static/pool/pool16fyda57p3c8gp5r6gmcq5tvqsp6mnzwvkxswgznkuh8wztrp6vv.json'
            )

            if (!response.ok) throw new Error('Failed to fetch pool data')

            poolData.value = await response.json()
            // console.log('Fetched pool data:', poolData.value)
        } catch (error) {
            console.error('Ошибка при получении данных:', error)
        } finally {
            isLoading.value = false
        }
    }

    // Функция для форматирования ADA стейка
    const formatStake = (stake: string | number | undefined): string => {
        if (!stake) return '—'
        const num = typeof stake === 'string' ? parseFloat(stake) : stake
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num)
        // return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num) + ' ₳'
    }

    onMounted(() => {
        getPool()
    })
</script>

<style scoped>

    /* Стили оставлены без изменений из твоего исходного кода */
    .container {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        height: 100%;
        width: 100%;
        padding: 0 10px;
    }

    .header-section {
        text-align: center;
        margin-bottom: 10px;
        padding: 10px 0;
    }

    .staking-guide {
        margin-top: 0;
    }

    .delegation-card {
        position: relative;
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
        backdrop-filter: blur(10px);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        color: white;
        margin-bottom: 15px;
    }

    .delegation-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.3);
    }

    .card-glow {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 0;
    }

    .card-glow-green {
        background: radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.3), transparent 70%);
    }

    .card-glow-purple {
        background: radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.3), transparent 70%);
    }

    .delegation-card:hover .card-glow {
        opacity: 1;
    }

    .delegation-header {
        position: relative;
        z-index: 1;
        text-align: center;
        padding: 20px 15px 10px !important;
    }

    .pool-name {
        font-size: 1.5em;
        font-weight: 700;
        margin-bottom: 10px;
        background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .pool-id {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 15px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        font-size: 0.95em;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .pool-id:hover {
        background: rgba(0, 0, 0, 0.4);
        color: rgba(255, 255, 255, 0.9);
    }

    .delegation-stats {
        position: relative;
        z-index: 1;
        padding: 15px !important;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 10px;
    }

    .stat-item {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1 1 150px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        transition: all 0.3s ease;
    }

    .stat-item:hover {
        background: rgba(255, 255, 255, 0.12);
        transform: translateY(-3px);
    }

    .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.9);
    }

    .stat-info {
        flex: 1;
    }

    .stat-label {
        font-size: 0.75em;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 2px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    .stat-value {
        font-size: 1em;
        font-weight: 600;
        color: white;
    }

    .delegation-actions {
        position: relative;
        z-index: 1;
        padding: 10px 15px 20px !important;
        justify-content: center;
    }

    .delegate-btn {
        padding: 12px 32px;
        font-size: 1em;
        font-weight: 600;
        border-radius: 12px;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: white;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .delegate-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.4s ease;
    }

    .delegate-btn:hover::before {
        left: 100%;
    }

    .delegate-btn:hover {
        background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
        box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        transform: scale(1.03);
    }

    .delegate-btn-purple {
        background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
    }

    .delegate-btn-purple:hover {
        background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
        box-shadow: 0 8px 20px rgba(168, 85, 247, 0.4);
    }

    @media (max-width: 768px) {
        .container {
            padding: 0 5px;
        }

        .pool-name {
            font-size: 1.2em;
        }

        .pool-id {
            font-size: 0.8em;
            word-break: break-all;
        }

        .delegation-stats {
            flex-direction: column;
        }
    }
</style>
