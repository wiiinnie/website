<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="container">
        <!-- Header with glitch text -->
        <div class="header-section">
            <GlitchText font-style="neon" text="DUSK" size="3em" :speed="5" :enable-shadows="true"
                :enable-on-hover="false" />
        </div>

        <!-- Staking guide timeline -->
        <div class="staking-guide">
            <q-timeline color="secondary">
                <!-- Step 1: Install Browser Extension -->
                <q-timeline-entry title="Step 1" subtitle="Install Browser Extension" icon="extension">
                    <q-card class="my-card">
                        <q-card-section>
                            <p class="step-text q-mb-md">
                                Install the Sozu wallet extension in your browser to manage your DUSK and sign transactions.
                            </p>
                            <div class="row q-gutter-sm">
                                <q-btn color="primary" icon-right="open_in_new" label="Firefox"
                                    href="https://addons.mozilla.org/en-GB/firefox/addon/sozu-extension/"
                                    target="_blank" rel="noopener noreferrer" />
                                <q-btn color="primary" icon-right="open_in_new" label="Chrome"
                                    href="https://chromewebstore.google.com/detail/sozu-extension/hljebgodjdmefpgochfoboakigijjpgo"
                                    target="_blank" rel="noopener noreferrer" />
                            </div>
                        </q-card-section>
                    </q-card>
                </q-timeline-entry>

                <!-- Step 2: Stake on Sozu -->
                <q-timeline-entry title="Step 2" subtitle="Stake on Sozu" icon="account_balance_wallet">
                    <q-card class="my-card">
                        <q-card-section>
                            <p class="step-text q-mb-md">
                                Open sozu.fi, connect your wallet via the extension, and stake your DUSK to start earning rewards.
                            </p>
                            <div class="row q-gutter-sm">
                                <q-btn color="primary" icon-right="open_in_new" label="Open sozu.fi"
                                    href="https://sozu.fi/" target="_blank" rel="noopener noreferrer" />
                            </div>
                        </q-card-section>
                    </q-card>
                </q-timeline-entry>
            </q-timeline>
        </div>
    </div>
</template>

<script setup lang="ts">
    import GlitchText from '../GlitchText.vue';
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

    .step-text {
        color: rgb(11, 11, 11);
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
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
