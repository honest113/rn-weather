const toCapitalize = (inputString) => {
    if(!inputString) {
        return "";
    }
    
    const words = inputString.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
}

const convertText = {
    toCapitalize,
};

export default convertText;