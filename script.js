const cone = ["t", "c"];
const cylinder = ["c", "s"];
const pyramid = ["s", "t"];
const _3dtri = ["t", "t"];
const _3dcir = ["c", "c"];
const _3dsqu = ["s", "s"];
const dirc = ["left","middle","right"]
const shapes = {"c":"◯","t":"△","s":"▢"}
function getKeyIndex(obj, key) {
    const keys = Object.keys(obj);
    return keys.indexOf(key);
}

const maindict = {
    "1": cone,
    "2": cylinder,
    "3": pyramid,
    "4": _3dtri,
    "5": _3dcir,
    "6": _3dsqu
};

let originalDict = {};
let keysArray = [];

function transformDictionary(originalDict) {
    let transformedDict = {};
    let swaps = [];
    let step = 1;

    for (let key in originalDict) {
        if (new Set(originalDict[key]).size === (Object.keys(originalDict).length - 1) && !originalDict[key].includes(key)) {
            continue;
        }

        while (originalDict[key].includes(key)) {
            for (let otherKey in originalDict) {
                if (otherKey !== key) {
                    for (let value of originalDict[otherKey]) {
                        if (!originalDict[key].includes(value) && value !== key) {
                            originalDict[key].splice(originalDict[key].indexOf(key), 1);
                            originalDict[otherKey].splice(originalDict[otherKey].indexOf(value), 1);
                            originalDict[key].push(value);
                            originalDict[otherKey].push(key);
                            swaps.push(`Step ${step}: select ${shapes[key]} from ${dirc[getKeyIndex(originalDict,key)]} statue and dissect ${shapes[value]} from ${dirc[getKeyIndex(originalDict,otherKey)]} statue`);
                            step++;
                            break;
                        }
                    }
                }
            }
        }
    }

    for (let key in originalDict) {
        transformedDict[key] = originalDict[key];
    }

    return [transformedDict, swaps];
}

function askForContains() {
    const keys = document.getElementById('keys').value.split('');
    keysArray = keys;
    let shapesDiv = document.getElementById('shapesDiv');
    shapesDiv.innerHTML = '';

    keys.forEach(key => {
        let label = document.createElement('label');
        label.innerText = `What does ${dirc[keysArray.indexOf(key)]} contain?`;
        shapesDiv.appendChild(label);

        let select = document.createElement('select');
        select.id = `shape_${key}`;
        select.innerHTML = `
            <option value="1">Cone</option>
            <option value="2">Cylinder</option>
            <option value="3">Pyramid</option>
            <option value="4">3D Triangle</option>
            <option value="5">3D Circle</option>
            <option value="6">3D Square</option>
        `;
        shapesDiv.appendChild(select);
        shapesDiv.appendChild(document.createElement('br'));
    });

    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'block';
    document.getElementById('resetBtn').style.display = 'block';
}

function transformDict() {
    keysArray.forEach(key => {
        let shapeType = document.getElementById(`shape_${key}`).value;
        originalDict[key] = maindict[shapeType];
    });

    const [transformedDict, swaps] = transformDictionary(originalDict);

    let swapsDiv = document.getElementById('swaps');
    swapsDiv.innerHTML = '';
    swaps.forEach(swap => {
        let p = document.createElement('p');
        p.innerText = swap;
        swapsDiv.appendChild(p);
    });

    let transformedDictDiv = document.getElementById('transformedDict');
    transformedDictDiv.innerHTML = JSON.stringify(transformedDict);
}

function resetForm() {
    document.getElementById('shapeForm').reset();
    document.getElementById('shapesDiv').innerHTML = '';
    document.getElementById('swaps').innerHTML = '';
    document.getElementById('transformedDict').innerHTML = '';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    originalDict = {};
    keysArray = [];
}
