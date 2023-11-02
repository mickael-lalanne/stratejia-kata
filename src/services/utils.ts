/**
 * Get words from the wordlist.txt file
 * @returns {string[]} an array containing all the dictionnary words
 */
export async function getDictionnaryWords(): Promise<string[]> {
    // First, read the wordlist.txt file using the fetch api
    // cf https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const wordsResponse: Response = await fetch('smallWordlist.txt');

    // If an error has occured while reading the file, return an empty array
    if (!wordsResponse.ok) {
        return [];
    }

    // Then, get the text content
    const textWords: string = (await wordsResponse.text());
    console.log(textWords);
    console.log(textWords.split(/\r?\n|\r|\n/g));

    // Finally, convert it to a string array
    // \n means a line break
    return textWords.split(/\r?\n|\r|\n/g);
}
