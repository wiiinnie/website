<template>
    <div ref="containerRef" class="variable-proximity-container" @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave">
        <span v-for="(char, index) in characters" :key="`${char.char}-${index}`" :style="char.style"
            class="proximity-char" :class="{ 'space': char.char === ' ' }">
            {{ char.char === ' ' ? '\u00A0' : char.char }}
        </span>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted, nextTick } from 'vue'

    const props = defineProps({
        text: {
            type: String,
            default: 'Variable Proximity Text'
        },
        baseSize: {
            type: Number,
            default: 32
        },
        maxSize: {
            type: Number,
            default: 64
        },
        proximityRadius: {
            type: Number,
            default: 100
        },
        fontFamily: {
            type: String,
            default: 'inherit'
        },
        fontWeight: {
            type: [String, Number],
            default: 'bold'
        },
        color: {
            type: String,
            default: '#ffffff'
        },
        glowColor: {
            type: String,
            default: '#00A8CC'
        },
        enableGlow: {
            type: Boolean,
            default: true
        },
        enableAnimation: {
            type: Boolean,
            default: true
        }
    })

    const containerRef = ref(null)
    const mousePosition = ref({ x: 0, y: 0 })
    const isMouseInside = ref(false)
    const charElements = ref([])

    const characters = ref([])

    // Инициализация символов
    const initializeCharacters = () => {
        characters.value = props.text.split('').map((char, index) => ({
            char,
            style: {
                fontSize: `${props.baseSize}px`,
                fontFamily: props.fontFamily,
                fontWeight: props.fontWeight,
                color: props.color,
                textShadow: props.enableGlow ? `0 0 10px ${props.glowColor}40` : 'none',
                transition: props.enableAnimation ? 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                transform: 'scale(1)',
                display: 'inline-block',
                transformOrigin: 'center'
            }
        }))
    }

    // Вычисление расстояния между двумя точками
    const getDistance = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    // Обновление стилей символов на основе позиции мыши
    const updateCharacterStyles = () => {
        if (!containerRef.value || !isMouseInside.value) return

        const containerRect = containerRef.value.getBoundingClientRect()
        const chars = containerRef.value.querySelectorAll('.proximity-char')

        chars.forEach((charElement, index) => {
            const charRect = charElement.getBoundingClientRect()
            const charCenterX = charRect.left + charRect.width / 2
            const charCenterY = charRect.top + charRect.height / 2

            const distance = getDistance(
                mousePosition.value.x,
                mousePosition.value.y,
                charCenterX,
                charCenterY
            )

            // Вычисляем эффект близости
            const proximityEffect = Math.max(0, 1 - distance / props.proximityRadius)
            const sizeMultiplier = 1 + (proximityEffect * ((props.maxSize - props.baseSize) / props.baseSize))

            // Обновляем стили
            const char = characters.value[index]
            if (char) {
                const glowIntensity = proximityEffect * 0.8

                char.style = {
                    ...char.style,
                    fontSize: `${props.baseSize * sizeMultiplier}px`,
                    transform: `scale(${sizeMultiplier})`,
                    textShadow: props.enableGlow
                        ? `0 0 ${10 + glowIntensity * 20}px ${props.glowColor}${Math.floor(64 + glowIntensity * 127).toString(16)}`
                        : 'none',
                    fontVariationSettings: `"wght" ${props.fontWeight + proximityEffect * 300}`,
                    zIndex: Math.floor(proximityEffect * 10)
                }
            }
        })
    }

    // Обработка движения мыши
    const handleMouseMove = (event) => {
        mousePosition.value = {
            x: event.clientX,
            y: event.clientY
        }
        isMouseInside.value = true
        updateCharacterStyles()
    }

    // Обработка выхода мыши из контейнера
    const handleMouseLeave = () => {
        isMouseInside.value = false
        resetCharacterStyles()
    }

    // Сброс стилей символов
    const resetCharacterStyles = () => {
        characters.value.forEach(char => {
            char.style = {
                ...char.style,
                fontSize: `${props.baseSize}px`,
                transform: 'scale(1)',
                textShadow: props.enableGlow ? `0 0 10px ${props.glowColor}40` : 'none',
                fontVariationSettings: `"wght" ${props.fontWeight}`,
                zIndex: 1
            }
        })
    }

    // Инициализация при монтировании
    onMounted(() => {
        initializeCharacters()
        nextTick(() => {
            updateCharacterStyles()
        })
    })

    // Переинициализация при изменении текста
    const textWatcher = computed(() => props.text)
    watch(textWatcher, () => {
        initializeCharacters()
    })
</script>

<style scoped>
    .variable-proximity-container {
        display: inline-block;
        cursor: default;
        user-select: none;
        line-height: 1.2;
        position: relative;
    }

    .proximity-char {
        position: relative;
        display: inline-block;
        white-space: pre;
        will-change: transform, font-size, text-shadow;
        backface-visibility: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .proximity-char.space {
        width: 0.3em;
    }

    /* Дополнительные стили для Hermes тематики */
    .hermes-style {
        font-family: 'Orbitron', 'Rajdhani', monospace;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .neon-style {
        color: #ffffff;
        text-shadow:
            0 0 5px #00A8CC,
            0 0 10px #00A8CC,
            0 0 15px #00A8CC,
            0 0 20px #00A8CC;
    }

    .cyber-style {
        background: linear-gradient(45deg, #00A8CC, #F8FBFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Анимации */
    @keyframes glowPulse {

        0%,
        100% {
            text-shadow: 0 0 5px #00A8CC40;
        }

        50% {
            text-shadow: 0 0 20px #00A8CC80;
        }
    }

    .proximity-char:hover {
        animation: glowPulse 2s infinite;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
        .variable-proximity-container {
            font-size: 0.8em;
        }
    }

    @media (max-width: 480px) {
        .variable-proximity-container {
            font-size: 0.7em;
        }
    }
</style>