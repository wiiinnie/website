<template>
    <div class="counter-container">
        <!-- <span class="counter-label">total stake: </span> -->
        <span ref="elementRef" :class="className" />
        <!-- <span class="counter-label">$</span> -->

    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted, watch, computed, useTemplateRef } from 'vue';

    interface Props {
        to: number;
        from?: number;
        direction?: 'up' | 'down';
        delay?: number;
        duration?: number;
        className?: string;
        startWhen?: boolean;
        separator?: string;
        onStart?: () => void;
        onEnd?: () => void;
    }

    const props = withDefaults(defineProps<Props>(), {
        from: 0,
        direction: 'up',
        delay: 0,
        duration: 1,
        className: 'counter',
        startWhen: true,
        separator: '',
    });

    const elementRef = useTemplateRef<HTMLSpanElement>('elementRef');
    const currentValue = ref(props.direction === 'down' ? props.to : props.from);
    const isInView = ref(false);
    const animationId = ref<number | null>(null);
    const hasStarted = ref(false);

    let intersectionObserver: IntersectionObserver | null = null;

    const damping = computed(() => 20 + 40 * (1 / props.duration));
    const stiffness = computed(() => 500 * (1 / props.duration));

    let velocity = 0;
    let startTime = 0;

    const formatNumber = (value: number) => {
        const options = {
            useGrouping: !!props.separator,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        };

        const formattedNumber = Intl.NumberFormat('ru-RU', options).format(Number(value.toFixed(0)));

        return props.separator ? formattedNumber.replace(/,/g, props.separator) : formattedNumber;
        // return formattedNumber;
    };

    const updateDisplay = () => {
        if (elementRef.value) {
            elementRef.value.textContent = formatNumber(currentValue.value);
        }
    };

    const springAnimation = (timestamp: number) => {
        if (!startTime) startTime = timestamp;

        const target = props.direction === 'down' ? props.from : props.to;
        const current = currentValue.value;

        const displacement = target - current;
        const springForce = displacement * stiffness.value;
        const dampingForce = velocity * damping.value;
        const acceleration = springForce - dampingForce;

        velocity += acceleration * 0.016; // Assuming 60fps
        currentValue.value += velocity * 0.016;

        updateDisplay();

        if (Math.abs(displacement) > 0.01 || Math.abs(velocity) > 0.01) {
            animationId.value = requestAnimationFrame(springAnimation);
        } else {
            currentValue.value = target;
            updateDisplay();
            animationId.value = null;

            if (props.onEnd) {
                props.onEnd();
            }
        }
    };

    const startAnimation = () => {
        if (hasStarted.value || !isInView.value || !props.startWhen) return;

        hasStarted.value = true;

        if (props.onStart) {
            props.onStart();
        }

        setTimeout(() => {
            startTime = 0;
            velocity = 0;
            animationId.value = requestAnimationFrame(springAnimation);
        }, props.delay * 1000);
    };

    const setupIntersectionObserver = () => {
        if (!elementRef.value) return;

        intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isInView.value) {
                    isInView.value = true;
                    startAnimation();
                }
            },
            {
                threshold: 0,
                rootMargin: '0px'
            }
        );

        intersectionObserver.observe(elementRef.value);
    };

    const cleanup = () => {
        if (animationId.value) {
            cancelAnimationFrame(animationId.value);
            animationId.value = null;
        }

        if (intersectionObserver) {
            intersectionObserver.disconnect();
            intersectionObserver = null;
        }
    };

    watch(
        [() => props.from, () => props.to, () => props.direction],
        () => {
            currentValue.value = props.direction === 'down' ? props.to : props.from;
            updateDisplay();
            hasStarted.value = false;
        },
        { immediate: true }
    );

    watch(
        () => props.startWhen,
        () => {
            if (props.startWhen && isInView.value && !hasStarted.value) {
                startAnimation();
            }
        }
    );

    watch(() => props.to, () => {
        hasStarted.value = false;
        startAnimation();
    });

    onMounted(() => {
        updateDisplay();
        setupIntersectionObserver();
    });

    onUnmounted(() => {
        cleanup();
    });
</script>

<style scoped>
    .counter-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: rgb(198, 255, 175);
        font-weight: bold;

    }

    .counter-label {
        font-weight: bold;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-size: 6rem;
        /* Размер шрифта для текста */
        color: #9b9b9b;
        /* Цвет текста, можно настроить */
    }

    .counter {
        font-size: 6rem;
        /* Увеличенный шрифт для счетчика */
        font-weight: bold;
        /* Делаем шрифт жирным для акцента */
    }

    @media (max-width: 600px) {
        .counter {
            font-size: 2rem;
        }

        .counter-label {
            font-size: 1.5rem;
        }
    }
</style>