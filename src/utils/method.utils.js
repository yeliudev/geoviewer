/* Written by Ye Liu */

// Check if an object is empty
const checkEmptyObject = (obj) => {
    for (var _ in obj) {
        return false;
    }
    return true;
}

export { checkEmptyObject };
