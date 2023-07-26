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

    // Convert all strings to lower case
    toCheck = toCheck.map((element) => element.toLowerCase());
    searchArray = searchArray.map((element) => element.toLowerCase());

    for (let toCheckElement of toCheck) {
        let match: boolean = false;
        searchArray.forEach((searchSubstring) => {
            if (toCheckElement.includes(searchSubstring)) match = true;
        });
        if (match) return true;
    }

    return false;
};
