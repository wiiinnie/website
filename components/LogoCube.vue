<script setup>
    import { useAnimationFrame } from "motion-v"
    import { ref } from "vue"

    const cubeRef = ref(null)

    useAnimationFrame((t) => {
        if (!cubeRef.value) return

        const rotate = Math.sin(t / 10000) * 200
        const y = (1 + Math.sin(t / 1000)) * -50
        cubeRef.value.style.transform = `translateY(${y}px) rotateX(${rotate + 90}deg) rotateY(${rotate - 90}deg)`
    })

    const allCubes = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                allCubes.push({ x: i, y: j, z: k })
            }
        }
    }

    const removedCubes = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: 1 },
    ]

    const cubes = allCubes.filter(cube =>
        !removedCubes.some(removed =>
            removed.x === cube.x && removed.y === cube.y && removed.z === cube.z
        )
    )

    const CUBE_SIZE = 400 // Увеличен в два раза
    const SMALL_CUBE_SIZE = CUBE_SIZE / 3

    const getCubeStyle = (cube) => {
        const offsetX = (cube.x - 1) * SMALL_CUBE_SIZE
        const offsetY = (cube.y - 1) * SMALL_CUBE_SIZE
        const offsetZ = (cube.z - 1) * SMALL_CUBE_SIZE
        return {
            transform: `translateX(${offsetX}px) translateY(${offsetY}px) translateZ(${offsetZ}px)`
        }
    }

    const getFaceColor = (cube, face) => {
        switch (face) {
            case 'front':
                return cube.z === 2 ? 'var(--hue-1-transparent)' : 'transparent'
            case 'right':
                return cube.x === 2 ? 'var(--hue-2-transparent)' : 'transparent'
            case 'back':
                return cube.z === 0 ? 'var(--hue-3-transparent)' : 'transparent'
            case 'left':
                return cube.x === 0 ? 'var(--hue-4-transparent)' : 'transparent'
            case 'top':
                return cube.y === 0 ? 'var(--hue-5-transparent)' : 'transparent'
            case 'bottom':
                return cube.y === 2 ? 'var(--hue-6-transparent)' : 'transparent'
            default:
                return 'transparent'
        }
    }

    // Функция для получения внутренних плоскостей
    const getInternalPlanes = () => {
        const planes = []
        const addedPlanes = new Set() // Избегаем дублирования

        // Для каждого существующего куба проверяем, нет ли рядом пустого места
        cubes.forEach(cube => {
            const { x, y, z } = cube

            // Проверяем все 6 направлений
            const directions = [
                { dx: 1, dy: 0, dz: 0, face: 'right' },
                { dx: -1, dy: 0, dz: 0, face: 'left' },
                { dx: 0, dy: 1, dz: 0, face: 'bottom' },
                { dx: 0, dy: -1, dz: 0, face: 'top' },
                { dx: 0, dy: 0, dz: 1, face: 'front' },
                { dx: 0, dy: 0, dz: -1, face: 'back' }
            ]

            directions.forEach(dir => {
                const neighborX = x + dir.dx
                const neighborY = y + dir.dy
                const neighborZ = z + dir.dz

                // Проверяем, что соседняя позиция в пределах куба 3x3x3
                if (neighborX >= 0 && neighborX < 3 &&
                    neighborY >= 0 && neighborY < 3 &&
                    neighborZ >= 0 && neighborZ < 3) {

                    // Проверяем, есть ли куб в соседней позиции
                    const hasNeighbor = cubes.some(c =>
                        c.x === neighborX && c.y === neighborY && c.z === neighborZ
                    )

                    // Если соседа нет (пустое место), добавляем внутреннюю плоскость
                    if (!hasNeighbor) {
                        const planeKey = `${x}-${y}-${z}-${dir.face}`

                        if (!addedPlanes.has(planeKey)) {
                            addedPlanes.add(planeKey)

                            // Определяем цвет плоскости
                            let color = 'var(--hue-7-transparent, rgba(128, 128, 128, 0.6))'

                            // Если это внешняя грань, используем соответствующий цвет
                            if ((dir.face === 'front' && z === 2) ||
                                (dir.face === 'back' && z === 0) ||
                                (dir.face === 'right' && x === 2) ||
                                (dir.face === 'left' && x === 0) ||
                                (dir.face === 'top' && y === 0) ||
                                (dir.face === 'bottom' && y === 2)) {
                                color = getFaceColor(cube, dir.face)
                            }

                            planes.push({
                                x: x,
                                y: y,
                                z: z,
                                face: dir.face,
                                color: color
                            })
                        }
                    }
                }
            })
        })

        return planes
    }

    const internalPlanes = getInternalPlanes()

    const getPlaneStyle = (plane) => {
        const offsetX = (plane.x - 1) * SMALL_CUBE_SIZE
        const offsetY = (plane.y - 1) * SMALL_CUBE_SIZE
        const offsetZ = (plane.z - 1) * SMALL_CUBE_SIZE

        let transform = `translateX(${offsetX}px) translateY(${offsetY}px) translateZ(${offsetZ}px) `

        switch (plane.face) {
            case 'front':
                transform += `rotateY(0deg) translateZ(${SMALL_CUBE_SIZE / 2}px)`
                break
            case 'right':
                transform += `rotateY(90deg) translateZ(${SMALL_CUBE_SIZE / 2}px)`
                break
            case 'back':
                transform += `rotateY(180deg) translateZ(${SMALL_CUBE_SIZE / 2}px)`
                break
            case 'left':
                transform += `rotateY(-90deg) translateZ(${SMALL_CUBE_SIZE / 2}px)`
                break
            case 'top':
                transform += `rotateX(90deg) translateZ(${SMALL_CUBE_SIZE / 2}px)`
                break
            case 'bottom':
                transform += `rotateX(-90deg) translateZ(${SMALL_CUBE_SIZE / 2}px)`
                break
        }

        return {
            transform,
            backgroundColor: plane.color || 'var(--hue-1-transparent)'
        }
    }
</script>

<template>
    <div class="cube" ref="cubeRef">
        <!-- Основные кубы -->
        <div v-for="(cube, index) in cubes" :key="`cube-${index}`" class="small-cube" :style="getCubeStyle(cube)">
            <div class="side front" :style="{ backgroundColor: getFaceColor(cube, 'front') }" />
            <div class="side left" :style="{ backgroundColor: getFaceColor(cube, 'left') }" />
            <div class="side right" :style="{ backgroundColor: getFaceColor(cube, 'right') }" />
            <div class="side top" :style="{ backgroundColor: getFaceColor(cube, 'top') }" />
            <div class="side bottom" :style="{ backgroundColor: getFaceColor(cube, 'bottom') }" />
            <div class="side back" :style="{ backgroundColor: getFaceColor(cube, 'back') }" />
        </div>

        <!-- Внутренние плоскости на местах вырезанных кубов -->
        <div v-for="(plane, index) in internalPlanes" :key="`plane-${index}`" class="internal-plane"
            :style="getPlaneStyle(plane)" />
    </div>
</template>

<style>
    .container {
        width: 400px;
        height: 400px;
    }

    .cube {
        width: 400px;
        height: 400px;
        position: relative;
        transform-style: preserve-3d;
    }

    .small-cube {
        width: calc(400px / 3);
        height: calc(400px / 3);
        position: absolute;
        transform-style: preserve-3d;
    }

    .side,
    .internal-plane {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.6;
    }

    .internal-plane {
        width: calc(400px / 3);
        height: calc(400px / 3);
    }

    .front {
        transform: rotateY(0deg) translateZ(calc(400px / 6));
    }

    .right {
        transform: rotateY(90deg) translateZ(calc(400px / 6));
    }

    .back {
        transform: rotateY(180deg) translateZ(calc(400px / 6));
    }

    .left {
        transform: rotateY(-90deg) translateZ(calc(400px / 6));
    }

    .top {
        transform: rotateX(90deg) translateZ(calc(400px / 6));
    }

    .bottom {
        transform: rotateX(-90deg) translateZ(calc(400px / 6));
    }
</style>