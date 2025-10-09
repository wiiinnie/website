<template>
    <div class="impressum-container">
        <!-- Header -->
        <q-card class="impressum-header q-mb-xl">
            <q-card-section class="text-center">
                <!-- <q-icon name="mdi-file-document-outline" size="4rem" color="white" class="q-mb-md" /> -->
                <h4 class="impressum-title">Impressum</h4>
                <p class="impressum-subtitle">Angaben gemäß § 5 DDG</p>
            </q-card-section>
        </q-card>

        <!-- Contact Section -->
        <q-card class="impressum-section contact-card q-mb-lg">
            <q-card-section class="q-pa-lg">
                <div class="row items-center q-gutter-md q-mb-lg">
                    <q-avatar size="100px" class="q-mb-md">
                        <img src="/avatar.png" alt="Hermes Stake Pool Logo">
                    </q-avatar>
                    <div>
                        <h2 class="section-title q-ma-0 text-weight-bold">Matthias Winter</h2>
                        <!-- <p class="text-subtitle2 text-grey-6 q-mt-xs">Stake Pool Operator</p> -->
                    </div>
                </div>
                <q-separator class="q-my-md" />

                <q-list separator dense class="q-mt-md">
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="mdi-map-marker-outline" size="1.25rem" color="grey-7" />
                        </q-item-section>
                        <q-item-section>
                            <p class="text-body2 text-grey-7 q-ma-0">Schraudolphstrasse 2A, 80799 München</p>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="mdi-account-tie-outline" size="1.25rem" color="secondary" />
                        </q-item-section>
                        <q-item-section>
                            <p class="text-body2 text-grey-7 q-ma-0">Vertreten durch: Matthias Winter</p>
                        </q-item-section>
                    </q-item>

                    <q-item clickable @click="() => window.open('tel:00491719344574', '_blank')">
                        <q-item-section avatar>
                            <q-icon name="mdi-phone-outline" size="1.25rem" color="blue" />
                        </q-item-section>
                        <q-item-section>
                            <p class="text-body2 text-grey-7 q-ma-0">Telefon: 0049-(0)1719344574</p>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat round icon="mdi-phone" size="sm" color="blue" />
                        </q-item-section>
                    </q-item>

                    <q-item clickable @click="() => window.location.href = 'mailto:hermes-stakepool@proton.me'">
                        <q-item-section avatar>
                            <q-icon name="mdi-email-outline" size="1.25rem" color="orange" />
                        </q-item-section>
                        <q-item-section>
                            <p class="text-body2 text-grey-7 q-ma-0">E-Mail: hermes-stakepool@proton.me</p>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat round icon="mdi-email" size="sm" color="orange" />
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="mdi-receipt-text-outline" size="1.25rem" color="green" />
                        </q-item-section>
                        <q-item-section>
                            <p class="text-body2 text-grey-7 q-ma-0">Umsatzsteuer-ID: DE334168661</p>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="mdi-domain-outline" size="1.25rem" color="purple" />
                        </q-item-section>
                        <q-item-section>
                            <p class="text-body2 text-grey-7 q-ma-0">Wirtschafts-ID:</p>
                        </q-item-section>
                    </q-item>
                </q-list>

                <q-separator class="q-my-lg" />

                <div class="row justify-center q-gutter-md">
                    <q-btn flat round size="lg" icon="mdi-twitter" color="blue-6"
                        :to="{ url: 'https://twitter.com/Wiiinnie', external: true }" class="social-btn" />
                    <q-btn flat round size="lg" icon="mdi-telegram" color="blue-5"
                        :to="{ url: 'https://t.me/hermespool', external: true }" class="social-btn" />
                    <q-btn flat round size="lg" icon="mdi-email" color="orange-6"
                        @click="() => window.location.href = 'mailto:hermespool@gmail.com'" class="social-btn" />
                </div>
            </q-card-section>
        </q-card>

        <!-- Disclaimer Section -->
        <q-card class="impressum-section q-mb-lg">
            <q-card-section class="q-pa-lg">
                <div class="row items-center q-gutter-md q-mb-md">
                    <q-icon name="mdi-alert-circle-outline" size="2rem" color="warning" />
                    <h2 class="section-title q-ma-0">Haftungsausschluss</h2>
                </div>
                <q-separator class="q-my-md" />

                <div class="row q-gutter-md">
                    <div>
                        <h3 class="subsection-title q-mb-md">Haftung für Inhalte</h3>
                        <p class="paragraph">Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
                            Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr
                            übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen
                            Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
                            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                            Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                            Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche
                            Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                            möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte
                            umgehend entfernen.</p>
                    </div>
                    <div>
                        <h3 class="subsection-title q-mb-md">Haftung für Links</h3>
                        <p class="paragraph">Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
                            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
                            Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                            oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
                            Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt
                            der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten
                            ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                            Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <!-- Copyright Section -->
        <q-card class="impressum-section q-mb-lg">
            <q-card-section class="q-pa-lg">
                <div class="row items-center q-gutter-md q-mb-md">
                    <q-icon name="mdi-copyright" size="2rem" color="teal" />
                    <h2 class="section-title q-ma-0">Urheberrecht</h2>
                </div>
                <q-separator class="q-my-md" />
                <p class="paragraph">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                    unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                    der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
                    jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten,
                    nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber
                    erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als
                    solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                    bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir
                    derartige Inhalte umgehend entfernen.</p>
            </q-card-section>
        </q-card>

        <!-- Privacy Section -->
        <q-card class="impressum-section q-mb-lg">
            <q-card-section class="q-pa-lg">
                <div class="row items-center q-gutter-md q-mb-md">
                    <q-icon name="mdi-shield-lock-outline" size="2rem" color="indigo" />
                    <h2 class="section-title q-ma-0">Datenschutz</h2>
                </div>
                <q-separator class="q-my-md" />
                <p class="paragraph">Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten
                    möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder
                    eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese
                    Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. Wir weisen darauf
                    hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken
                    aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich. Der
                    Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur
                    Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit
                    ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte
                    im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.</p>
            </q-card-section>
        </q-card>

        <!-- Google Analytics Section -->
        <q-card class="impressum-section q-mb-lg">
            <q-card-section class="q-pa-lg">
                <div class="row items-center q-gutter-md q-mb-md">
                    <q-icon name="mdi-google-analytics" size="2rem" color="red" />
                    <h2 class="section-title q-ma-0">Google Analytics</h2>
                </div>
                <q-separator class="q-my-md" />
                <p class="paragraph">Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc.
                    ('Google'). Google Analytics verwendet sog. 'Cookies', Textdateien, die auf Ihrem Computer
                    gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglicht. Die durch
                    den Cookie erzeugten Informationen über Ihre Benutzung dieser Website (einschließlich Ihrer
                    IP-Adresse) wird an einen Server von Google in den USA übertragen und dort gespeichert. Google wird
                    diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die
                    Websiteaktivitäten für die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung
                    und der Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird Google diese
                    Informationen gegebenenfalls an Dritte übertragen, sofern dies gesetzlich vorgeschrieben oder soweit
                    Dritte diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit
                    anderen Daten der Google in Verbindung bringen. Sie können die Installation der Cookies durch eine
                    entsprechende Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch darauf hin, dass
                    Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen
                    können. Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über Sie
                    erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten
                    Zweck einverstanden.</p>
            </q-card-section>
        </q-card>

        <!-- Footer -->
        <q-card flat bordered class="impressum-footer">
            <q-card-section class="text-center">
                <q-icon name="mdi-information-outline" size="1.25rem" color="grey-6" class="q-mr-xs" />
                <p class="footer-text q-ma-0">Impressum von Impressum-Generator.de. Powered by Franziska Hasselbach,
                    Bonn.</p>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
    // No reactive data or logic needed for this static component
</script>

<style scoped>
    .impressum-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 1rem;
    }

    .impressum-header {
        /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
        background: #1875d1;
        color: white;
        border-radius: 16px;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .impressum-title {
        font-size: 3rem;
        margin: 0.5rem 0;
        font-weight: 300;
        letter-spacing: -0.5px;
    }

    .impressum-subtitle {
        font-size: 1.25rem;
        margin: 0;
        opacity: 0.95;
        font-style: italic;
    }

    .impressum-section {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .impressum-section:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    .section-title,
    .subsection-title {
        color: #1976d2;
        margin-bottom: 0.5rem;
    }

    .section-title {
        font-size: 1.75rem;
        font-weight: 600;
    }

    .subsection-title {
        font-size: 1.25rem;
        font-weight: 500;
    }

    .paragraph {
        text-align: justify;
        margin-bottom: 1rem;
        text-indent: 1.5rem;
        color: #666;
        line-height: 1.8;
        font-size: 1rem;
    }

    .impressum-footer {
        margin-top: 3rem;
        border-radius: 12px;
        background: #f8f9fa;
    }

    .footer-text {
        font-size: 0.95rem;
        color: #95a5a6;
        margin-top: 0.5rem;
    }

    .contact-card {
        background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 16px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .text-body2 {
        line-height: 1.5;
    }

    .q-item {
        min-height: 0;
        padding: 0.5rem 0;
        border-radius: 8px;
        margin-bottom: 0.25rem;
        transition: background-color 0.2s ease;
    }

    .q-item:hover {
        background-color: rgba(25, 118, 210, 0.04);
    }

    .social-btn {
        width: 3rem;
        height: 3rem;
        transition: all 0.3s ease;
    }

    .social-btn:hover {
        transform: scale(1.1) translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
        .impressum-title {
            font-size: 2.25rem;
        }

        .section-title {
            font-size: 1.5rem;
        }

        .paragraph {
            font-size: 0.95rem;
            text-indent: 1rem;
        }
    }
</style>