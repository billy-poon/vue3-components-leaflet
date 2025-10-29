<script lang="ts">
export type LMapState = {
    el: HTMLElement
    map: L.Map
}

</script>

<script lang="ts" setup>
import { shallowReactive, toRef, useAttrs, watchEffect, type PropType } from 'vue';
import { _L } from './leaflet';

defineOptions({
    inheritAttrs: false
})

const props = defineProps({
    options: Object as PropType<L.MapOptions>,
    initialOptions: Object as PropType<L.MapOptions>,
})

const emit = defineEmits<{
    (event: 'ready' | 'remove', state: LMapState): void
}>()

const state = shallowReactive({
    el: null as HTMLElement | null,
    map: null as L.Map | null
})

const refEl = toRef(state, 'el')

const { initialOptions } = props
watchEffect((onCleanup) => {
    const { el } = state
    if (el == null) return;

    const map = _L.map(el, props.options ?? initialOptions)

    state.map = map
    emit('ready', { el, map })
    onCleanup(() => {
        map.remove()
        state.map = null
        emit('remove', { el, map })
    })
})


const attrs = useAttrs()

</script>

<template>
    <div ref="refEl" class="l-map" v-bind="attrs"></div>
</template>

<style lang="scss">
.l-map {
    width: 100%;
    height: 100%;
}
</style>
