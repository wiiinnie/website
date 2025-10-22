<template>
    <div class="new-page-container" ref="scrollContainer" @scroll="handleScroll">
        <div class="background-layer-fixed"></div>
        <div class="background-blur-fixed"></div>

        <StaggeredMenu class="main-menu" position="left" soon="true" :items="menuItems" :display-item-numbering="true"
            :change-menu-color-on-open="true" @menu-open="handleMenuOpen" @menu-close="handleMenuClose"
            @item-click="handleScrollTo" />

        <!-- Кнопка "Наверх" -->
        <q-btn v-show="showScrollToTop" class="scroll-to-top-btn" round color="primary" icon="keyboard_arrow_up"
            @click="scrollToTop" />

        <main class="content-scroll">
            <section id="home" class="page-section hero-section">
                <div class="cube-background">
                    <LogoCube />
                </div>
                <div class="glitch-container">
                    <GlitchText font-style="neon" text="Hermes" :speed="5" :enable-shadows="true"
                        :enable-on-hover="false" />
                    <GlitchText font-style="neon" text="Stakepool" :speed="5" :enable-shadows="true"
                        :enable-on-hover="false" />
                </div>

                <div>
                    <!-- <div
                        style="text-align: right; margin-bottom: -11px; padding-bottom: -10px; font-size: 40px; color: #9a9a9a; font-weight: 600; text-shadow: var(--hermes-text-shadow);"> -->
                    <div
                        style="text-align: right; margin-bottom: -55px; padding-bottom: -10px; font-size: 40px; color: #9a9a9a; font-weight: 600; text-shadow: var(--hermes-text-shadow);">
                        TOTAL POOL STAKED
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="row flex-center">
                                <TotalStake :delay="0" separator=" " :from="0" :to="totalStakeInUSD" start-when />
                                <div style="font-size: 72px; color: rgb(222, 222, 222, 0.4);">$</div>
                            </div>
                        </div>
                        <div class="row flex-center">
                            <div class="col flex-center">
                                <div class="row stake-row">
                                    <div class="stake-right">
                                        <TotalStake v-if="!isLoadingCardanoStake" :delay="0" :class-name="'underline'"
                                            separator=" " :from="0" :to="hermesCardanoStake" start-when />
                                        <div v-else style="color: #9a9a9a;">Loading...</div>
                                    </div>
                                    <div class="token-left" style="color: rgb(222, 222, 222, 0.6);">ADA</div>
                                </div>
                                <div class="row stake-row">
                                    <div class="stake-right">
                                        <TotalStake v-if="!isLoadingNymStake" :delay="0" :class-name="'underline'"
                                            separator=" " :from="0" :to="hermesNymNodesStake" start-when />
                                        <div v-else style="color: #9a9a9a;">Loading...</div>
                                    </div>
                                    <div class="token-left" style="color: rgb(222, 222, 222, 0.6);">NYM</div>
                                </div>
                                <div class="row stake-row">
                                    <div class="stake-right">
                                        <TotalStake v-if="!isLoadingDuskStake" :delay="0" :class-name="'underline'"
                                            separator=" " :from="0" :to="hermesDuskStake" start-when />
                                        <div v-else style="color: #9a9a9a;">Loading...</div>
                                    </div>
                                    <div class="token-left" style="color: rgb(222, 222, 222, 0.6);">DUSK</div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div class="welcome-text">
                    <p class="description-text" style="color: #9a9a9a;">
                        Welcome to Hermes Stakepool – your trusted multi-chain staking partner from Germany, committed
                        to security, transparency, and reliability. Discover the projects we support and explore
                        step-by-step guidance on how to start delegating your coins with confidence.
                    </p>
                </div>
            </section>

            <!-- Обновленные секции для страницы index.vue -->

            <section id="cardano" class="page-section">
                <h2>
                    <GlitchText font-style="neon" text="CARDANO" :speed="5" :enable-shadows="true"
                        :enable-on-hover="false" />
                </h2>
                <div class="projects-grid">
                    <TokenCard :name="TokensNetworks[0].name" :symbol="TokensNetworks[0].symbol"
                        :description="TokensNetworks[0].description" :color="TokensNetworks[0].color"
                        :logo="TokensNetworks[0].logo" :price-history="cardanoPriceHistory"
                        :latest-price="cardanoLatestPrice" :delegated-amount="hermesCardanoStake"
                        :is-loading="isLoadingCardanoStake" />
                </div>
            </section>

            <section id="midnight" class="page-section">
                <h2>
                    <GlitchText font-style="neon" text="MIDNIGHT" :speed="5" :enable-shadows="true"
                        :enable-on-hover="false" />
                </h2>
                <div class="projects-grid">
                    <TokenCard :soon="true" :name="TokensNetworks[1].name" :symbol="TokensNetworks[1].symbol"
                        :description="TokensNetworks[1].description" :color="TokensNetworks[1].color"
                        :logo="TokensNetworks[1].logo" :price-history="nightPriceHistory"
                        :latest-price="nightLatestPrice" />
                </div>
            </section>

            <section id="nym" class="page-section">
                <h2>
                    <GlitchText font-style="neon" text="NYM" :speed="5" :enable-shadows="true"
                        :enable-on-hover="false" />
                </h2>
                <div class="projects-grid">
                    <TokenCard :name="TokensNetworks[2].name" :symbol="TokensNetworks[2].symbol"
                        :description="TokensNetworks[2].description" :color="TokensNetworks[2].color"
                        :logo="TokensNetworks[2].logo" :price-history="nymPriceHistory" :latest-price="nymLatestPrice"
                        :nym-nodes="hermesNymNodes" :delegated-amount="hermesNymNodesStake"
                        :is-loading="isLoadingNymStake" />
                </div>
            </section>

            <section id="dusk" class="page-section">
                <h2>
                    <GlitchText font-style="neon" text="DUSK" :speed="5" :enable-shadows="true"
                        :enable-on-hover="false" />
                </h2>
                <div class="projects-grid">
                    <TokenCard :soon="true" :name="TokensNetworks[3].name" :symbol="TokensNetworks[3].symbol"
                        :description="TokensNetworks[3].description" :color="TokensNetworks[3].color"
                        :logo="TokensNetworks[3].logo" :price-history="duskPriceHistory" :latest-price="duskLatestPrice"
                        :delegated-amount="hermesDuskStake" :is-loading="isLoadingDuskStake" />
                </div>
            </section>

            <section id="about" class="page-section">
                <h2>
                    <GlitchText font-style="neon" text="ABOUT" :speed="5" :enable-shadows="true"
                        :enable-on-hover="false" />
                </h2>
                <div class="projects-grid">
                    <AboutPage />
                </div>
            </section>

        </main>
    </div>
</template>

<script setup lang="ts">
    import { onBeforeMount, ref, computed } from 'vue';
    import AboutPage from '../components/AboutPage.vue'
    import StaggeredMenu from '../components/StaggeredMenu.vue'
    import LogoCube from '../components/LogoCube.vue'
    import GlitchText from '../components/GlitchText.vue'
    // import VariableProximity from '../components/VariableProximity.vue'
    import TotalStake from '../components/TotalStake.vue';
    import TokenCard from '../components/TokenCard.vue';
    import { useTokenData } from '../composables/useTokenData';


    // Data for tokens
    const TokensNetworks = [
        {
            name: 'Cardano',
            symbol: 'ADA',
            description: "Cardano is a third-generation blockchain platform founded in 2015 by Charles Hoskinson, a co-founder of Ethereum, and developed by three main organizations: IOHK (Input Output Hong Kong) for engineering, Emurgo for business adoption, and the Cardano Foundation for governance. Technically, Cardano is distinguished by its Ouroboros proof-of-stake consensus protocol, formal verification methods, and a layered architecture that separates settlement and computation to enhance scalability, security, and sustainability.",
            color: '#000033',
            logo: '/logo/ada.png'
        },
        {
            name: 'Midnight',
            symbol: 'NIGHT',
            description: 'Midnight is a data-protection blockchain developed by Input Output Global (IOG) with engineering led by Shielded Technologies, and is headed by CEO Eran Barak alongside the newly established Midnight Foundation. First announced in late 2022, the project gained momentum with Barak\'s appointment in March 2023 and the formal launch of the Midnight Foundation in May 2025 to oversee ecosystem growth and governance. Technically, Midnight distinguishes itself as a Cardano sidechain that uses zero-knowledge cryptography to enable programmable privacy and selective disclosure, supported by a dual-token model (NIGHT for governance/utility and DUST for shielded transactions).',
            color: '#2222FF',
            logo: '/logo/night.png'
        },
        {
            name: 'Nym',
            symbol: 'NYM',
            description: 'Nym is a privacy-focused infrastructure project founded in 2019 by Harry Halpin (former researcher at MIT and Inria) along with a team of cryptographers and privacy engineers.  Its technical USP lies in its mixnet technology (mixing network) that provides strong, metadata-resistant privacy at the network layer, combined with zk-Nym credentials that enable selective disclosure and anonymous authentication for decentralized applications.',
            color: '#58CC55',
            logo: '/logo/nym.png'
        },
        {
            name: 'Dusk',
            symbol: 'DUSK',
            description: 'Dusk is a privacy-and-regulation-friendly blockchain project founded in 2018 in Amsterdam by Emanuele Francioni, Fulvio Venturelli, Jelle Pol, Pascal Putman, and Mels Dees—drawing on experience in cryptography, finance, IoT and distributed systems.  Technically, Dusk is designed for financial applications, supporting privacy-preserving smart contracts, using a Proof-of-Stake consensus with novel features like "Segregated Byzantine Agreement", zero-knowledge proofs (e.g. using PLONK), and tools for tokenization of real-world and security assets, balancing regulatory compliance, confidentiality, and performance.',
            color: '#8C8C8C',
            logo: '/logo/dusk.png'
        },
    ];

    // Menu items
    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
        { label: 'Cardano', ariaLabel: 'View Cardano projects', link: '#cardano' },
        { label: 'Midnight', ariaLabel: 'View Midnight projects', link: '#midnight', soon: true },
        { label: 'Nym', ariaLabel: 'View Nym projects', link: '#nym' },
        { label: 'Dusk', ariaLabel: 'View Dusk projects', link: '#dusk', soon: true },
        { label: 'About', ariaLabel: 'Learn about us', link: '#about' },
    ];

    // Refs and state
    const scrollContainer = ref(null);
    const showScrollToTop = ref(false);
    const hermesCardanoStake = ref(0);
    const isLoadingCardanoStake = ref(true);
    const cardanoStakeError = ref<string | null>(null);

    const hermesNymNodes = ref<any[]>([]);
    const hermesNymNodesStake = ref(0);
    const isLoadingNymStake = ref(true);
    const nymStakeError = ref<string | null>(null);

    // DUSK state
    const hermesDuskStake = ref(0);
    const isLoadingDuskStake = ref(true);
    const duskStakeError = ref<string | null>(null);

    let totalStakeInUSD = ref(0);

    // Token price data using composable
    const { price: cardanoPriceHistory, latestPrice: cardanoLatestPrice, fetchData: fetchCardanoPrice } = useTokenData('ADA');
    const { price: nymPriceHistory, latestPrice: nymLatestPrice, fetchData: fetchNymPrice } = useTokenData('NYM');
    const { price: duskPriceHistory, latestPrice: duskLatestPrice, fetchData: fetchDuskPrice } = useTokenData('DUSK');
    const { price: nightPriceHistory, latestPrice: nightLatestPrice, fetchData: fetchNightPrice } = useTokenData('NIGHT');

    // Computed property for total stake in USD
    totalStakeInUSD = computed(() => {
        const cardanoValue = hermesCardanoStake.value * (cardanoLatestPrice.value || 0);
        const nymValue = hermesNymNodesStake.value * (nymLatestPrice.value || 0);
        const duskValue = hermesDuskStake.value * (duskLatestPrice.value || 0);
        return cardanoValue + nymValue + duskValue;
    });

    // Functions
    const handleMenuOpen = () => console.log('Menu opened');
    const handleMenuClose = () => console.log('Menu closed');

    const scrollToTop = () => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainer.value) {
            showScrollToTop.value = scrollContainer.value.scrollTop > 300;
        }
    };

    const handleScrollTo = (link: any) => {
        if (!link || link === '#') return;
        const targetId = link.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement && scrollContainer.value) {
            scrollContainer.value.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    const getHermesCardanoNodes = async () => {
        try {
            isLoadingCardanoStake.value = true;
            cardanoStakeError.value = null;
            const response = await fetch(`https://api-mainnet-stage.cexplorer.io/v1/pool/detail?pool_id=pool16fyda57p3c8gp5r6gmcq5tvqsp6mnzwvkxswgznkuh8wztrp6vv`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data?.data?.active_stake || data?.data?.live_stake || 0;
        } catch (error) {
            console.error('Error fetching Cardano nodes:', error);
            cardanoStakeError.value = error instanceof Error ? error.message : 'Unknown error';
            return 0;
        } finally {
            isLoadingCardanoStake.value = false;
        }
    };

    const getHermesNymNodes = async () => {
        try {
            isLoadingNymStake.value = true;
            nymStakeError.value = null;
            const response = await fetch('/api/hermes');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid response format');
            hermesNymNodes.value = data;
            let totalStake = 0;
            data.forEach((element: any) => {
                if (element.delegations && Array.isArray(element.delegations)) {
                    element.delegations.forEach((delegation: any) => {
                        const amount = Number(delegation.amount);
                        if (!isNaN(amount)) totalStake += amount;
                    });
                }
            });
            return { stake: totalStake, nodes: data };
        } catch (error) {
            console.error('Error fetching Nym nodes:', error);
            nymStakeError.value = error instanceof Error ? error.message : 'Unknown error';
            return { stake: 0, nodes: [] };
        } finally {
            isLoadingNymStake.value = false;
        }
    };

    const getHermesDuskNodes = async () => {
        try {
            isLoadingDuskStake.value = true;
            duskStakeError.value = null;

            // Выполняем POST запрос к API
            const response = await fetch('https://nodes.dusk.network/on/node/provisioners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Проверяем успешность запроса
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Получаем данные в формате JSON
            const data = await response.json();

            // Фильтруем данные по конкретному ключу
            const targetKey = "25WuCXfQeqzB6rjHiviS4jsKwTGdq4eDHa2hhbp4KGP8xxH9eEwrX6AvhoToBNLbs6D5B5qKStoKNZeKopoBjYDRTy3diUqqNXnYB2vtXSbjKuiYvJjRP2vZp3QgWyNjMr8F";
            const filteredNode = data.find((node: any) => node.key === targetKey);

            if (filteredNode) {
                // Возвращаем сумму amount + reward, конвертированную в DUSK
                return (filteredNode.amount) / 1000000000;
            }

            return 0;

        } catch (error) {
            console.error('Error fetching Dusk nodes:', error);
            duskStakeError.value = error instanceof Error ? error.message : 'Unknown error';
            return 0;
        } finally {
            isLoadingDuskStake.value = false;
        }
    };

    // Lifecycle hook
    onBeforeMount(() => {
        // Fetch all data in parallel to update the UI as soon as possible
        Promise.all([
            getHermesCardanoNodes().then(stake => {
                hermesCardanoStake.value = stake / 1000000;
            }),
            getHermesNymNodes().then(result => {
                hermesNymNodesStake.value = result.stake / 1000000;
                hermesNymNodes.value = result.nodes;
            }),
            getHermesDuskNodes().then(stake => {
                hermesDuskStake.value = stake;
            }),
            fetchCardanoPrice(),
            fetchNymPrice(),
            fetchDuskPrice(),
            fetchNightPrice()
        ]);
    });
</script>

<style>

    /* Глобальные CSS переменные */
    html {
        --hermes-primary-color: #F8FBFF;
        --hermes-secondary-color: #00A8CC;
        --hermes-tertiary-color: #2C3E50;
        --hermes-text-color: #ffffff;
        --hermes-background-color: #1a1a1a;
        --hermes-background-overlay: rgba(0, 0, 0, 0.4);
        --hermes-blur-amount: 4px;
        /* Уменьшил blur для четкости текста */
        --hermes-cube-opacity: 0.3;
        --hermes-text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        --hermes-border-radius: 15px;
        --hermes-transition: all 0.3s ease;
        scroll-behavior: smooth;
    }

    body {
        background-color: var(--hermes-background-color);
        color: var(--hermes-text-color);
        margin: 0;
        font-family: sans-serif;
    }
</style>

<style scoped>
    .new-page-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
    }

    /* Фиксированные фоновые слои */
    .background-layer-fixed,
    .background-blur-fixed {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .background-layer-fixed {
        background-image: url('/wallpaper.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 1;
    }

    .background-blur-fixed {
        /* backdrop-filter: blur(var(--hermes-blur-amount)); */
        /* -webkit-backdrop-filter: blur(var(--hermes-blur-amount)); */
        background: var(--hermes-background-overlay);
        z-index: 2;
    }

    /* Меню */
    .main-menu {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        z-index: 20;
        pointer-events: none;
    }

    /* Стили для кнопки скролла наверх */
    .scroll-to-top-btn {
        position: fixed !important;
        bottom: 20px;
        right: 20px;
        width: 48px !important;
        height: 48px !important;
        z-index: 1000;
        background: linear-gradient(135deg, var(--hermes-secondary-color), var(--hermes-primary-color)) !important;
        color: white !important;
        border: none !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 12px rgba(0, 168, 204, 0.3) !important;
    }

    .scroll-to-top-btn:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 8px 20px rgba(0, 168, 204, 0.4) !important;
        background: linear-gradient(135deg, #00B8DC, #FFFFFF) !important;
    }

    .scroll-to-top-btn:before {
        opacity: 0 !important;
    }

    /* Контейнер для скроллящегося контента */
    .content-scroll {
        position: relative;
        z-index: 15;
        /* Увеличил для четкости */
    }

    .page-section {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
        box-sizing: border-box;
        text-align: center;
        position: relative;
        z-index: 16;
        /* Добавил для четкости */
    }

    .page-section h2 {
        font-size: 3rem;
        margin-bottom: 40px;
        text-shadow: var(--hermes-text-shadow);
    }

    /* Стили для секции "hero" */
    .hero-section {
        position: relative;
        overflow: hidden;
    }

    .cube-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        opacity: var(--hermes-cube-opacity);
        pointer-events: none;
    }

    .glitch-container {
        position: relative;
        z-index: 18;
        margin-bottom: 2rem;
    }

    .welcome-text {
        position: relative;
        z-index: 19;
        /* Высокий z-index для четкости */
        color: var(--hermes-text-color);
        max-width: 1200px;
        /* Уменьшил для лучшей читаемости */
        font-size: 1.1rem;
        line-height: 1.6;
        text-shadow: var(--hermes-text-shadow);
        background: rgba(0, 0, 0, 0.3);
        /* Увеличил непрозрачность */
        backdrop-filter: blur(2px);
        /* Отдельный слабый blur */
        /* -webkit-backdrop-filter: blur(2px); */
        padding: 10px;
        border-radius: var(--hermes-border-radius);
        border: 0px solid rgba(255, 255, 255, 0.2);
        animation: fadeInUp 1s ease-out;
        transition: var(--hermes-transition);

        /* Улучшение четкости текста */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        backface-visibility: hidden;
        transform: translateZ(0);
    }

    .welcome-text:hover {
        background: rgba(0, 0, 0, 0.7);
        transform: translateY(-2px) translateZ(0);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    /* Контейнеры для VariableProximity */
    .proximity-text-container {
        margin-bottom: 20px;
        position: relative;
        z-index: 20;
    }

    .welcome-proximity-text {
        display: block;
        margin-bottom: 15px;
    }

    .description-text {
        font-size: 1rem;
        opacity: 0.9;
        line-height: 1.5;
    }

    .signature-container {
        margin-top: 20px;
        font-style: italic;
    }

    /* Стили для секций контента */
    .services-content,
    .about-content {
        max-width: 800px;
        text-align: center;
    }

    .services-content p,
    .about-content p {
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 15px 0;
    }

    /* Стили для секции проектов */
    .projects-grid {
        display: grid;
        gap: 30px;
        /* width: 100%; */
        margin-top: 40px;
    }

    .social-links {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        padding: 2rem 0;
        border-top: 1px solid rgba(248, 251, 255, 0.1);
    }

    .social-link {
        color: #F8FBFF;
        text-decoration: none;
        font-size: 1rem;
        transition: color 0.2s ease-in-out;
    }

    .social-link:hover {
        color: var(--hermes-secondary-color);
    }

    /* Анимация появления */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px) translateZ(0);
        }

        to {
            opacity: 1;
            transform: translateY(0) translateZ(0);
        }
    }

    /* Адаптивность */
    @media (max-width: 768px) {
        .content-scroll {
            padding-left: 80px;
            width: calc(100% - 80px);
        }

        .page-section {
            padding: 20px;
        }

        .page-section h2 {
            font-size: 2.5rem;
        }

        .projects-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .welcome-text {
            max-width: 100%;
            font-size: 1rem;
            padding: 20px;
        }

        .proximity-text-container {
            font-size: 0.9rem;
        }

        .scroll-to-top-btn {
            bottom: 80px !important;
            right: 15px !important;
            width: 44px !important;
            height: 44px !important;
        }
    }

    @media (max-width: 480px) {
        .welcome-text {
            padding: 15px;
        }

        .page-section {
            padding: 15px;
        }
    }

    .stake-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0px 2px;
        /* Внутренние отступы */
        margin-bottom: 0px;
        /* Отступ между строками */
    }

    .token-left {
        text-align: left;
        /* Токены строго по левому краю */
        flex: 0 0 auto;
        /* Не растягивается */
        min-width: 60px;
        /* Минимальная ширина для консистентности */
        padding-right: 16px;
        /* Отступ справа от токена */
    }

    .stake-right {
        text-align: right;
        /* Значения строго по правому краю */
        flex: 1;
        /* Занимает оставшееся пространство */
        padding-left: 16px;
        /* Отступ слева от значения */
        display: flex;
        justify-content: flex-end;
        /* Дополнительное выравнивание вправо */
    }

</style>
