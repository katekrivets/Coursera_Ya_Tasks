/**
 * @param {Array} collection
 * @params {Function[]} – Функции для запроса
 * @returns {Array}
 */
var collectedKeys = {}; //object wich collects keys from select
var collectedFilters = {};
var counterSelect = 0;

function query(collection) {
    var newCollection = [];
    if (arguments.length == 1) {
        for (var i = 0; i < collection.length; i++) {
            newCollection.push(copyObject(collection[i]));
        }
    } else {
        var filteredCollection = returnFiltered(collection);
        for (var j = 0; j < filteredCollection.length; j++) {
            var newCollectionObject = showSelected(filteredCollection[j], collectedKeys);
            newCollection.push(newCollectionObject);
        }
    }
    collectedKeys = {}; //cleaning
    collectedFilters = {};
    counterSelect = 0;

    return newCollection;
}


/**
 * @params {String[]}
 */
function select() {
    counterSelect++;
    collectedKeys.select = 'function';
    for (var i = 0; i < arguments.length; i++) {
        if (!collectedKeys.hasOwnProperty(arguments[i])) {
            collectedKeys[arguments[i]] = 0;
        }
        collectedKeys[arguments[i]]++; //counting coincidence
    }
    //return collectedKeys;
}

function showSelected(collectionObj, keys) { //function, wich returns only selected elements
    var collectionElement = copyObject(collectionObj);

    var selectParams = {}; //obj of params wich wil be used in checking coincedence
    for (var param in keys) {
        if (keys[param] % counterSelect == 0) {
            selectParams[param] = 1;
        }
    }

    for (var param in selectParams) {
        for (var key in collectionElement) { //checking object's keys for coincidence
            if (!selectParams.hasOwnProperty(key)) { //if key doesn't match - delete from created object copy
                delete collectionElement[key];
            }
        }
    }

    return collectionElement;
}

/**
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Массив разрешённых значений
 */
function filterIn(property, values) {

    if (!collectedFilters.hasOwnProperty(property)) { //
        collectedFilters[property] = {};
        for (var i = 0; i < values.length; i++) {
            collectedFilters[property][values[i]] = 1;
        }
    } else {
        for (var key in collectedFilters[property]) {
            collectedFilters[property][key] = 0;
            for (var k = 0; k < values.length; k++) {
                if (collectedFilters[property].hasOwnProperty(values[k])) {
                    collectedFilters[property][values[k]] = 1;
                }
            }
        }
    }

}

function returnFiltered(unfilteredCollection) {
    var filteredCollection = [];
    var filterParams = {};

    for (var param in collectedFilters) {
        if ((typeof collectedFilters[param]) === "object") {
            filterParams[param] = {};
            for (var value in collectedFilters[param]) {
                if (collectedFilters[param][value] == 1) {
                    filterParams[param][value] = 1;
                }
            }
        }
    }

    for (var elem = 0; elem < unfilteredCollection.length; elem++) {
        var collectionElement = unfilteredCollection[elem];

        var counter = 0;
        var smth = Object.keys(filterParams).length;

        for (var param in filterParams) {
            for (var key in filterParams[param]) {
                if (collectionElement[param] == key) {
                    counter++;
                }
            }
        }
        if (counter == smth) {
            filteredCollection.push(collectionElement);
        }
    }
    return filteredCollection;
}

function copyObject(object) {
    var newObject = {};
        for (var key in object) {
            newObject[key] = object[key];
        }
    return newObject;
}

module.exports = {
    query: query,
    select: select,
    filterIn: filterIn
};
