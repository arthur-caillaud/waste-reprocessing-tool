export function searchInArray(array,value){
    if(value !== '' && value === value.toString()){
        const regEx = new RegExp(value.toString(),'i');
        let foundElementsArray = [];
        if(array){
            array.forEach(el => {
                if (el.nom.match(regEx)){
                    foundElementsArray.push(el);
                }
            });
        }
        return foundElementsArray;
    }
    return [];
}
