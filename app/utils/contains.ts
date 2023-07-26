import { strict } from "assert";

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
    // Edge case: Remove empty strings from array
    searchArray = searchArray.filter((element) => element != "");

    // Convert all strings to lower case
    toCheck = toCheck.map((element) => element.toLowerCase());
    searchArray = searchArray.map((element) => element.toLowerCase());

    let strictMatch = true;
    for (let searchSubstring of searchArray) {
        let singleMatch = false;
        for (let toCheckElement of toCheck) {
            if (toCheckElement.includes(searchSubstring)) {
                singleMatch = true;
                break;
            }
        }
        if (!singleMatch) {
            strictMatch = false;
        }
    }

    return strictMatch;
};
