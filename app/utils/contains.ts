/**
 * Compares toCheck, the array of strings, to the Search string
 * To search, the Search string, will be split up by spaces, then each of those parts will be matched with all elements in the toCheck array
 * @param toCheck An array of Strings, that you would like to search
 * @param search A String that will be split up by spaces to search with
 * @returns True if the Search String is a substring in any element inside toCheck
 */
export let contains = (toCheck: Array<string>, search: string): Boolean => {
    // Edge case
    if (search == "") return true;

    let searchArray: Array<string> = search.split(" ");

    for (let element of toCheck) {
        searchArray.forEach((searchSubstring) => {
            if (element.includes(searchSubstring)) return true;
        });
    }

    return false;
};
