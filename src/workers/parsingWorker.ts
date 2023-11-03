import { EParsingState, getDictionnaryWords } from '@/services/utils';

const WORD_MIN_SIZE: number = 2;
let dictionnaryWords: string[] = [];
let allCombinations: string[] = [];
let firstCombinationFound: boolean = false;

// Listen for main to start dictionnary parsing
onmessage = async function (message) {
    // Read wordlist.txt file to get all words
    dictionnaryWords = await getDictionnaryWords('../../wordlist.txt');

    postMessage({ state: EParsingState.AnalyzingPrefixesAndSuffixes });

    // Parse words and check for combinations
    parseDictionnaryWords();
};

/**
 * Called once all word have been retrieved from the dictionnary file
 * For all 6 letters words, check if we can have a combination of 2 words
 */
const parseDictionnaryWords = function (): void {
    const sixLettersWords: string[] = dictionnaryWords.filter(
        (word) => word.length === 6
    );

    const wordsCombinationsPromises: Promise<void>[] = [];

    // For each 6 letters words in the dictionnary
    sixLettersWords.forEach((sixLettersWord) => {
        wordsCombinationsPromises.push(getWordCombinations(sixLettersWord));
    });

    // Once all words haven been analyzed, notify the web browser
    Promise.all(wordsCombinationsPromises)
        .then(() =>
            postMessage({
                state: EParsingState.Complete,
                combinations: allCombinations,
            })
        )
        .catch((err) => postMessage({ state: EParsingState.Error, err }));
};

/**
 * Called for each 6 letters word
 * Find his prefixes and suffixes, then check for combinations
 * @param {string} sixLettersWord word to analyze
 * @returns {Promise<void>} promise to know when the analyze of the word is completed
 */
const getWordCombinations = async function (
    sixLettersWord: string
): Promise<void> {
    return new Promise((resolve) => {
        // Get all prefixes and suffixes in parallel
        Promise.all([
            findAllPrefixes(sixLettersWord),
            findAllSuffixes(sixLettersWord),
        ])
            .then((results) => {
                // Once we got all the prefixes and suffixes, check for combinations
                const wordPrefixes = results[0];
                const wordSuffixes = results[1];

                resolve(findForCombinations(wordPrefixes, wordSuffixes));
            })
            .catch((err) => {
                postMessage({ state: EParsingState.Error });
                console.error(err);
            });
    });
};

/**
 * Find all word prefixes for a six letters word
 * @param {string} sixLettersWord the word we have to find all his prefixes
 * @returns {Promise<string[]>} all prefixes contained in the given word
 */
const findAllPrefixes = function (sixLettersWord: string): Promise<string[]> {
    return new Promise((resolve) => {
        const wordPrefixes: string[] = [];

        // Loop through all the characters contained in the word to get potential prefixes
        for (
            let index = 0;
            index < sixLettersWord.length - WORD_MIN_SIZE;
            index++
        ) {
            const potentialPrefix: string = sixLettersWord.substring(
                0,
                index + WORD_MIN_SIZE
            );

            // Check if the suffix is a real word
            const isPrefixInDictionnary: boolean =
                dictionnaryWords.includes(potentialPrefix);

            if (isPrefixInDictionnary) {
                wordPrefixes.push(potentialPrefix);
            }
        }

        resolve(wordPrefixes);
    });
};
/**
 * Find all word suffixes for a six letters word
 * @param {string} sixLettersWord the word we have to find all his suffixes
 * @returns {Promise<string[]>} all suffixes contained in the given word
 */
const findAllSuffixes = function (sixLettersWord: string): Promise<string[]> {
    return new Promise((resolve) => {
        const wordSuffixes: string[] = [];

        // Loop through all the characters contained in the word
        // with this loop we have access to basic suffixes
        // Ex for "albums" => "lb", "lbu", "lbum", "lbums"
        for (let i = 0; i < sixLettersWord.length - WORD_MIN_SIZE; i++) {
            // But we need a second loop to check all possibilities
            // Ex for "albums" => "bu", "bum", "bums", "um", "ums", ...
            for (let j = 1; j < sixLettersWord.length - WORD_MIN_SIZE; j++) {
                const potentialSuffix: string = sixLettersWord.substring(
                    j,
                    i + 1 + WORD_MIN_SIZE
                );

                // Check if the suffix is a real word
                const isSuffixInDictionnary: boolean =
                    dictionnaryWords.includes(potentialSuffix);

                if (isSuffixInDictionnary) {
                    wordSuffixes.push(potentialSuffix);
                }
            }
        }

        resolve(wordSuffixes);
    });
};

/**
 * Find real words with given prefixes and suffixes
 * @param {string[]} prefixes array containing real words we have to use as prefixes
 * @param {string[]} suffixes array containing real words we have to use as suffixes
 */
const findForCombinations = function (
    prefixes: string[],
    suffixes: string[]
): void {
    prefixes.forEach((prefix) => {
        suffixes.forEach((suffix) => {
            const combination: string = prefix + suffix;

            // The combination text displayed to the user, formated like : prefix + suffix => combination
            // We use toLowerCase() to avoid duplicates
            const formatedCombination: string = `${prefix.toLowerCase()} + ${suffix.toLowerCase()} => ${combination}`;

            if (
                // If the combination is a real word in the dictionnary
                dictionnaryWords.includes(combination) &&
                // AND if the combination hasn't been added yet
                !allCombinations.includes(formatedCombination)
            ) {
                allCombinations.push(formatedCombination);

                // If it isn't already, notify main a combination has been found
                if (!firstCombinationFound) {
                    postMessage({ state: EParsingState.FirstCombinationFound});
                    firstCombinationFound = true;
                }
            }
        });
    });
};
