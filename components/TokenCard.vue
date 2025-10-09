<template>
    <div>
        <q-card class="my-card">
            <q-card-section class="card-header">
                <div class="token-info">
                    <q-avatar size="48px" class="token-logo">
                        <q-img :src="props.logo" loading="lazy" />
                    </q-avatar>
                    <div class="token-details">
                        <div class="token-name">
                            {{ props.name }}
                            <q-chip v-if="props.soon" size="sm" color="red" text-color="white" icon="schedule"
                                label="Coming Soon" class="soon-chip" />
                        </div>
                        <div class="token-symbol">{{ props.symbol }}</div>
                    </div>
                </div>

                <div class="price-section">
                    <div class="price-label">Current Price</div>
                    <div class="price-value">
                        ${{ props.latestPrice ? props.latestPrice.toFixed(4) : 'N/A' }}
                    </div>
                    <div v-if="props.delegatedAmount !== undefined" class="delegated-info">
                        <div class="delegated-label">Total Delegated</div>
                        <div class="delegated-amount">
                            <template v-if="props.isLoading">
                                <q-spinner-dots color="primary" size="20px" />
                            </template>
                            <template v-else>
                                {{ formatNumber(props.delegatedAmount) }} {{ props.symbol }}
                            </template>
                        </div>
                        <div v-if="!props.isLoading && props.latestPrice" class="delegated-usd">
                            ≈ ${{ formatNumber(props.delegatedAmount * props.latestPrice) }}
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="chart-section">
                <ClientOnly>
                    <component v-if="VueApexCharts && shouldRenderChart" :is="VueApexCharts" type="area" height="150"
                        :options="chartOptions" :series="series" />
                    <div v-else class="chart-loading">Loading chart...</div>
                    <template #fallback>
                        <div class="chart-loading">Loading chart...</div>
                    </template>
                </ClientOnly>
            </q-card-section>

            <q-card-section class="description-section">
                <p class="description-text">{{ props.description || 'Token Description' }}</p>
            </q-card-section>

            <q-separator />

            <q-card-actions class="action-section">
                <q-btn v-if="!props.soon" unelevated color="primary" class="delegation-btn" @click="dialog = true">
                    <span>Start Delegation</span>
                    <q-icon name="arrow_forward" size="20px" class="q-ml-sm" />
                </q-btn>
                <q-btn v-else unelevated color="primary" class="delegation-btn">
                    <span>Coming soon</span>
                </q-btn>
            </q-card-actions>
        </q-card>

        <q-dialog v-model="dialog" persistent maximized transition-show="slide-up" transition-hide="slide-down">
            <q-card>
                <q-bar class="bg-primary text-white">
                    <q-space />
                    <q-btn dense flat icon="close" @click="dialog = false">
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section v-if="props.name === 'Cardano'">
                    <CardanoHowTo />
                </q-card-section>
                <q-card-section v-if="props.name === 'Nym'">
                    <NymHowTo :nodes="props.nymNodes" />
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from "vue";
    import CardanoHowTo from "./projects/CardanoHowTo.vue";
    import NymHowTo from "./projects/NymHowTo.vue";

    // Условный импорт только на клиенте
    let VueApexCharts = null;
    if (process.client) {
        VueApexCharts = (await import('vue3-apexcharts')).default;
    }

    // Props
    const props = defineProps<{
        name: string;
        symbol: string;
        description: string;
        color: string;
        logo: string;
        soon?: boolean;
        priceHistory: number[];
        latestPrice: number | null;
        nymNodes?: any[];
        delegatedAmount?: number;
        isLoading?: boolean;
    }>();

    const dialog = ref(false);
    const shouldRenderChart = ref(false);

    // Отложенная загрузка графика
    onMounted(() => {
        setTimeout(() => {
            shouldRenderChart.value = true;
        }, 300);
    });

    // Функция для форматирования чисел
    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        }
        return num.toFixed(2);
    };

    const chartOptions = computed(() => ({
        chart: {
            id: 'token-price-chart',
            type: 'area',
            sparkline: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
            animations: {
                enabled: false, // Отключаем анимации для производительности
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        colors: [props.color],
        grid: {
            show: true,
            borderColor: '#f0f0f0',
            strokeDashArray: 3,
            padding: {
                left: 10,
                right: 10,
            }
        },
        xaxis: {
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    colors: '#999',
                    fontSize: '11px',
                },
                formatter: (value: number) => `$${value.toFixed(4)}`,
            },
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            y: {
                formatter: (value: number) => `$${value.toFixed(4)}`,
            },
        },
    }));

    const series = computed(() => [
        {
            name: 'Price',
            data: props.priceHistory,
        },
    ]);
</script>

<style scoped>
    .my-card {
        width: 100%;
        max-width: 700px;
        margin: 10px auto;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(200, 200, 200, 0.5);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        position: relative;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        background: rgba(248, 249, 250, 0.95);
        position: relative;
        overflow: hidden;
    }

    .token-info {
        display: flex;
        align-items: center;
        gap: 16px;
        position: relative;
        z-index: 1;
    }

    .token-logo {
        border: 2px solid rgba(224, 224, 224, 0.5);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .token-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .token-name {
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .token-symbol {
        font-size: 13px;
        font-weight: 500;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .soon-chip {
        font-size: 10px;
        height: 20px;
    }

    .price-section {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        border: 1px solid rgba(200, 200, 200, 0.5);
    }

    .price-label {
        font-size: 11px;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .price-value {
        font-size: 20px;
        font-weight: 700;
        color: #1976d2;
    }

    .delegated-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        border-left: 1px solid rgba(224, 224, 224, 0.5);
        padding-left: 12px;
    }

    .delegated-label {
        font-size: 10px;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
    }

    .delegated-amount {
        font-size: 16px;
        font-weight: 700;
        color: #2c3e50;
        display: flex;
        align-items: center;
    }

    .delegated-usd {
        font-size: 12px;
        color: #666;
        font-weight: 500;
    }

    .chart-section {
        padding: 20px 24px;
        background: rgba(248, 249, 250, 0.9);
        position: relative;
    }

    .chart-loading {
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 14px;
    }

    .description-section {
        padding: 24px 28px;
        background: rgba(250, 250, 250, 0.7);
        border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .description-text {
        margin: 0;
        font-size: 14px;
        line-height: 1.7;
        color: #555;
        text-align: justify;
    }

    .action-section {
        padding: 24px 28px;
        justify-content: center;
        background: rgba(248, 249, 250, 0.8);
    }

    .delegation-btn {
        padding: 14px 36px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 12px;
        text-transform: none;
        letter-spacing: 0.3px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
        position: relative;
        overflow: hidden;
    }

    @media (max-width: 600px) {
        .card-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
        }

        .price-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }

        .delegated-info {
            flex-direction: column;
            align-items: flex-start;
            border-left: none;
            border-top: 1px solid rgba(224, 224, 224, 0.5);
            padding-left: 0;
            padding-top: 8px;
        }

        .my-card {
            max-width: 100%;
            margin: 10px;
        }
    }
</style>