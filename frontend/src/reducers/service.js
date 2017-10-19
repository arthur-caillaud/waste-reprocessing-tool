export function searchInArray(array,value){
    if(value !== '' && value == value.toString()){
        const regEx = new RegExp(value.toString(),'i');
        console.log(regEx);
        let foundElementsArray = [];
        if(array){
            array.forEach(el => {
                console.log("Element",el);
                console.log("Match regex",el.nom.match(regEx));
                if (el.nom.match(regEx)){
                    foundElementsArray.push(el);
                }
            });
        }
        return foundElementsArray;
    }
    return array;
}
