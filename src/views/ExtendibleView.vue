<template>
    <main>
        <div>Extendible view.</div>

        <!-- PARSING STATE -->
        <div>{{ parsingState }}</div>

        <!-- LOADING INDICATOR -->
        <v-progress-linear
            v-if="
                parsingState !== EParsingState.Complete &&
                parsingState !== EParsingState.Error
            "
            indeterminate
            color="yellow-darken-2"
        ></v-progress-linear>

        <!-- COMPLETED SECTION -->
        <div
            v-if="parsingState === EParsingState.Complete"
            class="completed-section"
        >
            <div>All combinations :</div>
            <div class="words-container">
                {{ formatedCombinations }}
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import Worker from '@/workers/parsingWorker?worker';
import { EParsingState } from '@/services/utils';

export default {
    name: 'ExtendibleView',
    data() {
        return {
            EParsingState: EParsingState,
            allCombinations: [] as string[],
            parsingState: EParsingState.ReadingFile as EParsingState,
            parsingWorker: new Worker() as Worker,
        };
    },
    computed: {
        formatedCombinations() {
            return this.allCombinations.join('\n');
        },
    },
    beforeMount() {
        // Call web worker to start the dictionnary parsing
        this.parsingWorker.postMessage('parse');

        // Listen the parsing worker to :
        // - display the current state
        // - display all the combinations if the parsing is complete
        this.parsingWorker.onmessage = (e) => {
            this.parsingState = e.data.state;

            if (this.parsingState === EParsingState.Complete) {
                this.allCombinations = e.data.combinations;
            }
        };
    },
    beforeUnmount() {
        // Close worker
        this.parsingWorker.terminate();
    },
};
</script>

<style scoped>
.words-container {
    max-width: 20vw;
    white-space: pre-line;
}
</style>
