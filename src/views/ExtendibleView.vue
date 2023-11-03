<template>
    <main>
        <div class="title mb-10">Extendible view.</div>

        <div class="d-flex align-center">
            <div>
                <!-- COMPLETED STEPS -->
                <div v-for="step in completedSteps" :key="step" class="completed-step">
                    ✅ {{ step }}
                </div>
                <!-- CURRENT STATE -->
                <div v-if="parsingState !== EParsingState.Complete" class="current-step">
                    ⌛ {{ parsingState }}
                </div>
            </div>

            <!-- LOADING INDICATOR -->
            <v-progress-circular
                v-if="
                    parsingState !== EParsingState.Complete &&
                    parsingState !== EParsingState.Error
                "
                class="ml-10"
                indeterminate
                color="#32a852"
                width="10"
                size="75"
            ></v-progress-circular>
        </div>



        <!-- COMPLETED SECTION -->
        <div
            v-if="parsingState === EParsingState.Complete"
            class="completed-section mt-10"
        >
            <div style="text-decoration: underline;">All combinations :</div>
            <div class="words-container">
                {{ formatedCombinations }}
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import Worker from '@/workers/parsingWorker?worker';
import { EParsingState, EParsingWorkerMessage } from '@/services/utils';

export default {
    name: 'ExtendibleView',
    data() {
        return {
            EParsingState: EParsingState,
            allCombinations: [] as string[],
            parsingState: EParsingState.ReadingFile as EParsingState,
            parsingWorker: new Worker() as Worker,
            sixLettersWordsNumber: 0 as number,
            analyzedWordsNumber: 0 as number,
            completedSteps: [] as EParsingState[]
        };
    },
    computed: {
        formatedCombinations() {
            return this.allCombinations.join('\n');
        },
    },
    beforeMount() {
        // Call web worker to start the dictionnary parsing
        this.parsingWorker.postMessage(EParsingWorkerMessage.Parse);

        // Listen the parsing worker to :
        // - display the current state
        // - display all the combinations if the parsing is complete
        this.parsingWorker.onmessage = (e) => {
            this.completedSteps.push(this.parsingState);
            this.parsingState = e.data.state;

            if (this.parsingState === EParsingState.Complete) {
                this.allCombinations = e.data.combinations;
                this.completedSteps.push(EParsingState.Complete);
            }

            if (this.parsingState === EParsingState.SearchingCombinations) {
                this.sixLettersWordsNumber = e.data.sixLettersWordsNumber;
                this.analyzedWordsNumber = e.data.analyzedWordsNumber;
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
.title {
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    color: white;
}
.words-container {
    max-width: 20vw;
    white-space: pre-line;
}
.completed-section {
    color: white;
}

.completed-step {
    color: #32a852;
}
.current-step {
    color: #fcba03;
}
</style>
