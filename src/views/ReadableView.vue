<template>
    <main>
        <div>Readable view.</div>
        <div>All combinations :</div>
        <div class="words-container">
            {{ formatedCombinations }}
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
    computed: {
        formatedCombinations() {
            return this.allCombinations.join('\n');
        }
    },
    // Called right before the component is to be mounted
    async beforeMount() {
        this.dictionnaryWords = await getDictionnaryWords();

        this.parseDictionnaryWords();
    },
    methods: {
        /**
         * Called once all word have been retrieved from the dictionnary file
         * For all 6 letters words, check if we can have a combination of 2 words
         */
        parseDictionnaryWords(): void {
            const sixLettersWords: string[] = this.dictionnaryWords.filter(word => word.length === 6);

            // For each 6 letters words in the dictionnary
            sixLettersWords.forEach((sixLettersWord) => {
                // Get all prefixes and suffixes in parallel
                Promise.all([
                    this.findAllPrefixes(sixLettersWord),
                    this.findAllSuffixes(sixLettersWord)
                ]).then(results => {
                        // Once we got all the prefixes and suffixes, check for combinations
                        const wordPrefixes = results[0];
                        const wordSuffixes = results[1];

                        this.findForCombinations(wordPrefixes, wordSuffixes);
                }).catch(err => {
                    console.error(err);
                });
            });
        },
        /**
         * Find all word prefixes for a six letters word 
         * @param {string} sixLettersWord the word we have to find all his prefixes
         * @returns {Promise<string[]>} all prefixes contained in the given word
         */
        findAllPrefixes(sixLettersWord: string): Promise<string[]> {
            return new Promise((resolve) => {
                const wordPrefixes: string [] = [];

                // Loop through all the characters contained in the word (except the last two)
                for (let index = 0; index < sixLettersWord.length - WORD_MIN_SIZE; index++) {
                    const potentialPrefix: string = sixLettersWord.substring(0, index + WORD_MIN_SIZE);

                    // Check if the suffix is a real word
                    const isPrefixInDictionnary: boolean = this.dictionnaryWords.includes(potentialPrefix);

                    if (isPrefixInDictionnary) {
                        wordPrefixes.push(potentialPrefix);
                    }
                }

                resolve(wordPrefixes);
            });
        },
        /**
         * Find all word suffixes for a six letters word 
         * @param {string} sixLettersWord the word we have to find all his suffixes
         * @returns {Promise<string[]>} all suffixes contained in the given word
         */
        findAllSuffixes(sixLettersWord: string): Promise<string[]> {
            return new Promise((resolve) => {
                const wordSuffixes: string [] = [];

                // Loop through all the characters contained in the word
                // with this loop we have access to basic suffixes
                // Ex for "albums" => "lb", "lbu", "lbum", "lbums" 
                for (let i = 0; i < sixLettersWord.length - WORD_MIN_SIZE; i++) {
                    // But we need a second loop to check all possibilities
                    // Ex for "albums" => "bu", "bum", "bums", "um", "ums", ...
                    for (let j = 1; j < sixLettersWord.length - WORD_MIN_SIZE; j++) {  
                        const potentialSuffix: string = sixLettersWord.substring(j, i + 1 + WORD_MIN_SIZE);

                        // Check if the suffix is a real word
                        const isSuffixInDictionnary: boolean = this.dictionnaryWords.includes(potentialSuffix);

                        if (isSuffixInDictionnary) {
                            wordSuffixes.push(potentialSuffix);
                        }
                    }
                }

                resolve(wordSuffixes);
            });
        },
        /**
         * Find real words with given prefixes and suffixes
         * @param {string[]} prefixes array containing real words we have to use as prefixes 
         * @param {string[]} suffixes array containing real words we have to use as suffixes 
         */
        findForCombinations(prefixes: string[], suffixes: string[]): void {
            prefixes.forEach(prefix => {
                suffixes.forEach(suffix => {
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
}
    },
};
</script>

<style scoped>
.words-container {
    max-width: 20vw;
    white-space: pre-line;
}
</style>
