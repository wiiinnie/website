
import { ref } from "vue";
import type { Ref } from "vue";

// Base URL Bybit
const BYBIT_BASE_URL = "https://api.bybit.com/v5";

// Универсальная функция для запроса
async function fetchWithTimeout(url: string, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Получение цены токена
async function getTokenPrice(symbol: string) {
    const baseSymbol = symbol.toUpperCase();
    const possiblePairs = [
        `${baseSymbol}USDT`,
        `${baseSymbol}USDC`,
        `${baseSymbol}BTC`,
        `${baseSymbol}ETH`,
    ];
    const categories = ["spot", "linear", "inverse"];
    const now = Date.now();
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const interval = "60"; // 1 час
    const limit = 720;

    // Проверка комбинаций
    const priorityChecks = [
        { category: "spot", pair: `${baseSymbol}USDT` },
        { category: "linear", pair: `${baseSymbol}USDT` },
        { category: "spot", pair: `${baseSymbol}USDC` },
    ];

    let responseData: any = null;

    // Сначала приоритетные пары
    for (const check of priorityChecks) {
        try {
            const url = `${BYBIT_BASE_URL}/market/kline?category=${check.category}&symbol=${check.pair}&interval=${interval}&start=${oneMonthAgo}&end=${now}&limit=${limit}`;
            const data = await fetchWithTimeout(url, 5000);

            if (data?.result?.list?.length > 0) {
                responseData = data;
                break;
            }
        } catch {
            continue;
        }
    }

    // Если не нашли — полный перебор
    if (!responseData) {
        for (const category of categories) {
            for (const pair of possiblePairs) {
                if (priorityChecks.some((c) => c.category === category && c.pair === pair)) {
                    continue;
                }
                try {
                    const url = `${BYBIT_BASE_URL}/market/kline?category=${category}&symbol=${pair}&interval=${interval}&start=${oneMonthAgo}&end=${now}&limit=${limit}`;
                    const data = await fetchWithTimeout(url, 3000);
                    if (data?.result?.list?.length > 0) {
                        responseData = data;
                        break;
                    }
                } catch {
                    continue;
                }
            }
            if (responseData) break;
        }
    }

    if (!responseData?.result?.list) {
        throw new Error(`No data found for ${symbol}`);
    }

    // Обработка данных
    return responseData.result.list
        .map((kline: string[]) => ({
            timestamp: parseInt(kline[0]),
            price: parseFloat(kline[4]),
        }))
        .filter((item: { timestamp: number; price: number }) => !isNaN(item.timestamp) && !isNaN(item.price))
        .sort((a: { timestamp: number; price: number }, b: { timestamp: number; price: number }) => a.timestamp - b.timestamp);
};

export function useTokenData(symbol: string) {
    const timestamp: Ref<number[]> = ref([]);
    const price: Ref<number[]> = ref([]);
    const latestPrice: Ref<number | null> = ref(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchData = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const priceData = await getTokenPrice(symbol);
            timestamp.value = priceData.map((item: { timestamp: number; price: number }) => item.timestamp);
            price.value = priceData.map((item: { timestamp: number; price: number }) => item.price);
            if (price.value.length > 0) {
                latestPrice.value = price.value[price.value.length - 1];
            }
        } catch (e: any) {
            error.value = e.message;
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        timestamp,
        price,
        latestPrice,
        isLoading,
        error,
        fetchData,
    };
}
