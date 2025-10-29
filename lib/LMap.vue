<script lang="ts">
export type LMapState = {
    el: HTMLElement
    map: L.Map
}

</script>

<script lang="ts" setup>
import { shallowReactive, toRef, watchEffect, type PropType } from 'vue';
import { useEventAttrs } from './hooks/eventAttrs';
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

const { attrs, eventAttrs } = useEventAttrs()

const { initialOptions } = props
watchEffect((onCleanup) => {
    const { el } = state
    if (el == null) return;

    const map = _L.map(el, props.options ?? initialOptions)

    state.map = map
    map.on(eventAttrs)
    emit('ready', { el, map })
    onCleanup(() => {
        state.map = null
        map.off(eventAttrs).remove()
        emit('remove', { el, map })
    })
})

const refEl = toRef(state, 'el')
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
