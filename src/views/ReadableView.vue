<template>
    <main>
        <div>Readable view.</div>
        <div>All combinations :</div>
        <div class="words-container">
            {{ allCombinations }}
        </div>
    </main>
</template>

<script lang="ts">
import { getDictionnaryWords } from '@/services/utils';

const WORD_MIN_SIZE: number = 2;

export default {
    name: 'ReadableView',
    data() {
        return {
            dictionnaryWords: [] as string[],
            allCombinations: [] as string[]
        };
    },
    async beforeMount() {
        this.dictionnaryWords = await getDictionnaryWords();

        this.findCombinedWords();
    },
    methods: {
        findCombinedWords(): void {
            const sixLettersWords: string[] = this.dictionnaryWords.filter(word => word.length === 6);

            // For each 6 letters words in the dictionnary
            sixLettersWords.forEach((sixLettersWord) => {
                // Get all his prefixes
                const wordPrefixes: string [] = [];

                for (let index = 0; index < sixLettersWord.length - WORD_MIN_SIZE; index++) {
                    const potentialPrefix: string = sixLettersWord.substring(0, index + WORD_MIN_SIZE);

                    const isPrefixInDictionnary: boolean = this.dictionnaryWords.includes(potentialPrefix);

                    if (isPrefixInDictionnary) {
                        wordPrefixes.push(potentialPrefix);
                    }
                }

                // Get all his suffixes
                const wordSuffixes: string [] = [];

                for (let index = 0; index < sixLettersWord.length - WORD_MIN_SIZE; index++) {
                    const potentialSuffix: string = sixLettersWord.substring(1, index + 1 + WORD_MIN_SIZE);

                    const isSuffixInDictionnary: boolean = this.dictionnaryWords.includes(potentialSuffix);

                    if (isSuffixInDictionnary) {
                        wordSuffixes.push(potentialSuffix);
                    }
                }

                // Todo : use promises to parralel

                // Check for combinations
                wordPrefixes.forEach(prefix => {
                    wordSuffixes.forEach(suffix => {
                        const combination: string = prefix + suffix;

                        // The combination text displayed to the user, formated like : prefix + suffix => combination
                        // We use toLowerCase() to avoid duplicates
                        const formatedCombination: string = `${prefix.toLowerCase()} + ${suffix.toLowerCase()} => ${combination}`;

                        if (
                            // If the combination is a real word in the dictionnary
                            this.dictionnaryWords.includes(combination) &&
                            // AND if the combination hasn't been added yet
                            !this.allCombinations.includes(formatedCombination)
                        ) {
                            this.allCombinations.push(formatedCombination);
                        }
                    })
                });
            });
        }
    },
};
</script>

<style scoped>
.words-container {
    max-width: 20vw;
}
</style>
