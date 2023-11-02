/**
 * Get words from the wordlist.txt file
 * @param {string} filePath path of the wordlist.txt path
 * @returns {string[]} an array containing all the dictionnary words
 */
export async function getDictionnaryWords(filePath: string = 'wordlist.txt'): Promise<string[]> {
    // First, read the wordlist.txt file using the fetch api
    // cf https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const wordsResponse: Response = await fetch(filePath);

    // If an error has occured while reading the file, return an empty array
    if (!wordsResponse.ok) {
        return [];
    }

    // Then, get the text content
    const textWords: string = (await wordsResponse.text());

    // Finally, convert it to a string array
    // \n means a line break
    return textWords.split(/\r?\n|\r|\n/g);
}

export enum EParsingState {
    ReadingFile = 'Retrieving dictionnary words from wordlist.txt file...',
    SearchingCombinations = 'Searching for combinations...',
    Complete = 'Parsing completed :)',
    Error = 'An error has occured :( Please try again.'
}
