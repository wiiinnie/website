<template>
    <div :class="computedClasses" :style="inlineStyles" :data-text="text" class="glitch-text">
        {{ text }}
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    interface GlitchTextProps {
        text: string;
        speed?: number;
        size?: string;
        enableShadows?: boolean;
        enableOnHover?: boolean;
        className?: string;
    }

    const props = withDefaults(defineProps<GlitchTextProps>(), {
        text: '',
        speed: 0.5,
        enableShadows: true,
        enableOnHover: false,
        className: ''
    });

    const inlineStyles = computed(() => {
        const styles: Record<string, string> = {
            '--speed': `${props.speed}s`,
            '--after-duration': `${props.speed * 3}s`,
            '--before-duration': `${props.speed * 2}s`,
            '--after-shadow': props.enableShadows ? '-5px 0 red' : 'none',
            '--before-shadow': props.enableShadows ? '5px 0 cyan' : 'none'
        };

        // Если size передан, добавляем font-size в стили
        if (props.size) {
            styles['font-size'] = props.size;
        }

        return styles;
    });

    const computedClasses = computed(() => {
        const classes = [
            'glitch-base',
            props.enableOnHover ? 'glitch-hover-only' : 'glitch-active'
        ];

        if (props.className) {
            classes.push(props.className);
        }

        return classes.join(' ');
    });
</script>

<style scoped>
    .glitch-text {
        font-family: 'orbitron', sans-serif;
        color: white;
        font-weight: 900;
        white-space: nowrap;
        position: relative;
        margin: 0 auto;
        user-select: none;
        cursor: pointer;
        /* Убираем font-size из CSS, чтобы он не конфликтовал с inlineStyles */
        line-height: 1.2;
    }

    /* Задаём дефолтный font-size только если inlineStyles не переопределяет его */
    .glitch-text:not([style*="font-size"]) {
        font-size: clamp(2rem, 10vw, 8rem);
    }

    .glitch-base::before,
    .glitch-base::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        color: white;
        background: transparent;
        overflow: hidden;
        clip-path: inset(0 0 0 0);
        width: 100%;
        height: 100%;
        /* Наследуем font-size от родителя, чтобы псевдоэлементы соответствовали */
        font-size: inherit;
    }

    /* Активный глитч эффект */
    .glitch-active::before {
        left: -2px;
        text-shadow: var(--before-shadow, 2px 0 cyan);
        animation: animate-glitch var(--before-duration, 2s) infinite linear alternate-reverse;
    }

    .glitch-active::after {
        left: 2px;
        text-shadow: var(--after-shadow, -2px 0 red);
        animation: animate-glitch var(--after-duration, 3s) infinite linear alternate-reverse;
    }

    /* Глитч только при hover */
    .glitch-hover-only::before,
    .glitch-hover-only::after {
        content: "";
        opacity: 0;
        animation: none;
    }

    .glitch-hover-only:hover::before {
        content: attr(data-text);
        opacity: 1;
        left: -2px;
        text-shadow: var(--before-shadow, 2px 0 cyan);
        animation: animate-glitch var(--before-duration, 2s) infinite linear alternate-reverse;
    }

    .glitch-hover-only:hover::after {
        content: attr(data-text);
        opacity: 1;
        left: 2px;
        text-shadow: var(--after-shadow, -2px 0 red);
        animation: animate-glitch var(--after-duration, 3s) infinite linear alternate-reverse;
    }

    @keyframes animate-glitch {
        0% {
            clip-path: inset(40% 0 61% 0);
        }

        5% {
            clip-path: inset(25% 0 58% 0);
        }

        10% {
            clip-path: inset(40% 0 43% 0);
        }

        15% {
            clip-path: inset(79% 0 15% 0);
        }

        20% {
            clip-path: inset(56% 0 42% 0);
        }

        25% {
            clip-path: inset(22% 0 58% 0);
        }

        30% {
            clip-path: inset(86% 0 4% 0);
        }

        35% {
            clip-path: inset(71% 0 29% 0);
        }

        40% {
            clip-path: inset(63% 0 14% 0);
        }

        45% {
            clip-path: inset(40% 0 44% 0);
        }

        50% {
            clip-path: inset(14% 0 71% 0);
        }

        55% {
            clip-path: inset(28% 0 35% 0);
        }

        60% {
            clip-path: inset(35% 0 31% 0);
        }

        65% {
            clip-path: inset(81% 0 19% 0);
        }

        70% {
            clip-path: inset(97% 0 2% 0);
        }

        75% {
            clip-path: inset(6% 0 16% 0);
        }

        80% {
            clip-path: inset(27% 0 71% 0);
        }

        85% {
            clip-path: inset(99% 0 1% 0);
        }

        90% {
            clip-path: inset(52% 0 33% 0);
        }

        95% {
            clip-path: inset(82% 0 2% 0);
        }

        100% {
            clip-path: inset(34% 0 42% 0);
        }
    }
</style>