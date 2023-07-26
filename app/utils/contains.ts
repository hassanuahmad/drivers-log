/**
 * Compares toCheck, the array of strings, to the Search string
 * To search, the Search string, will be split up by spaces, then each of those parts will be matched with all elements in the toCheck array
 * @param toCheck An array of Strings, that you would like to search
 * @param search A String that will be split up by spaces to search with
 * @returns True if the Search String is a substring in any element inside toCheck
 */
export let contains = (toCheck: Array<String>, search: String): Boolean => {
    let searchArray: Array<String> = search.split(" ");

    for (let element of toCheck) {
        console.log(element);
    }

    return false;
};
