<template>
    <main>
        <div>Readable view.</div>
        <div>All dictionnary words :</div>
        <div class="words-container">
            {{ dictionnaryWords }}
        </div>
    </main>
</template>

<script lang="ts">
export default {
    name: 'ReadableView',
    data() {
        return {
            dictionnaryWords: [] as string[],
        };
    },
    async beforeMount() {
        this.dictionnaryWords = await this.getDictionnaryWords();
    },
    methods: {
        /**
         * Get words from the wordlist.txt file
         * @returns {string[]} an array containing all the dictionnary words
         */
        async getDictionnaryWords(): Promise<string[]> {
            // First, read the wordlist.txt file using the fetch api
            // cf https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
            const wordsResponse: Response = await fetch('wordlist.txt');

            // If an error has occured while reading the file, return an empty array
            if (!wordsResponse.ok) {
                return [];
            }

            // Then, get the text content
            const textWords: string = await wordsResponse.text();

            // Finally, convert it to a string array
            // \n means a line break
            return textWords.split('\n');
        },
    },
};
</script>

<style scoped>
.words-container {
    max-width: 20vw;
}
</style>
