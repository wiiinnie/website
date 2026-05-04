<template>
    <div class="how-to-container">
        <div class="header">
            <q-img src="/logo/dusk.png" class="header-logo" />
            <h1 class="header-title">Stake DUSK</h1>
            <p class="header-subtitle">
                DUSK staking is handled through the Sozu Pool. Hermes Stakepool
                operates 4 provisioner nodes within the pool.
            </p>
        </div>

        <div class="steps-container">
            <div class="step">
                <div class="step-marker">
                    <div class="step-icon">
                        <q-icon name="extension" size="28px" />
                    </div>
                    <div class="step-line" />
                </div>
                <div class="step-content">
                    <div class="step-label">INSTALL BROWSER EXTENSION</div>
                    <div class="step-number">Step 1</div>
                    <div class="step-description">
                        Install the Sozu wallet extension in your browser to manage your DUSK and sign transactions.
                    </div>
                    <div class="step-actions">
                        <q-btn
                            unelevated
                            color="primary"
                            size="md"
                            class="action-btn"
                            href="https://addons.mozilla.org/en-GB/firefox/addon/sozu-extension/"
                            target="_blank"
                            rel="noopener noreferrer"
                            icon-right="open_in_new"
                            label="Firefox"
                        />
                        <q-btn
                            unelevated
                            color="primary"
                            size="md"
                            class="action-btn"
                            href="https://chromewebstore.google.com/detail/sozu-extension/hljebgodjdmefpgochfoboakigijjpgo"
                            target="_blank"
                            rel="noopener noreferrer"
                            icon-right="open_in_new"
                            label="Chrome"
                        />
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-marker">
                    <div class="step-icon">
                        <q-icon name="account_balance_wallet" size="28px" />
                    </div>
                </div>
                <div class="step-content">
                    <div class="step-label">STAKE ON SOZU</div>
                    <div class="step-number">Step 2</div>
                    <div class="step-description">
                        Open sozu.fi, connect your wallet via the extension, and stake your DUSK to start earning rewards.
                    </div>
                    <div class="step-actions">
                        <q-btn
                            unelevated
                            color="primary"
                            size="md"
                            class="action-btn"
                            href="https://sozu.fi/"
                            target="_blank"
                            rel="noopener noreferrer"
                            icon-right="open_in_new"
                            label="Open sozu.fi"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    // static how-to: no reactive logic needed
</script>

<style scoped>
    .how-to-container {
        background: linear-gradient(180deg, #1a3a5c 0%, #2a4a7c 100%);
        color: white;
        min-height: 100vh;
        padding: 60px 24px;
    }

    .header {
        text-align: center;
        margin-bottom: 56px;
    }

    .header-logo {
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
    }

    .header-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 12px 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        letter-spacing: -0.5px;
    }

    .header-subtitle {
        font-size: 1rem;
        opacity: 0.85;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.5;
    }

    .steps-container {
        max-width: 900px;
        margin: 0 auto;
    }

    .step {
        display: flex;
        gap: 24px;
        margin-bottom: 24px;
        align-items: stretch;
    }

    .step-marker {
        flex-shrink: 0;
        width: 56px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .step-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #4a90a4;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        flex-shrink: 0;
    }

    .step-line {
        flex: 1;
        width: 2px;
        background: rgba(255, 255, 255, 0.25);
        margin-top: 8px;
    }

    .step-content {
        flex: 1;
        background: white;
        border-radius: 10px;
        padding: 28px;
        color: #1a1a1a;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .step-label {
        font-size: 0.75rem;
        color: #888;
        letter-spacing: 1.2px;
        font-weight: 600;
        margin-bottom: 6px;
    }

    .step-number {
        font-size: 1.75rem;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 12px;
    }

    .step-description {
        font-size: 0.95rem;
        color: #555;
        line-height: 1.5;
        margin-bottom: 20px;
    }

    .step-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .action-btn {
        text-transform: none;
        font-weight: 600;
        padding: 10px 24px;
        border-radius: 6px;
    }

    @media (max-width: 600px) {
        .how-to-container {
            padding: 32px 16px;
        }
        .header-title {
            font-size: 2rem;
        }
        .step {
            flex-direction: column;
            gap: 16px;
        }
        .step-marker {
            flex-direction: row;
            width: auto;
        }
        .step-line {
            display: none;
        }
        .step-content {
            padding: 20px;
        }
    }
</style>
