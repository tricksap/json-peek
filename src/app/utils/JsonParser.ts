'use client'

import addEdgestoGraph from "./core/addEdgestoGraph";
import addNodetoGraph from "./core/addNodetoGraph";
import  {
    Node,
    Edge,} from 'reactflow';

interface IJSON {
    [key: string]: string | boolean | number | object | Array<any>;
}

export type Graph = {
    nodes: Node[];
    edges: Edge[];
};

function initializeStates(): Graph {
    return {
        nodes: [],
        edges: [],

    };
}
export default function JSONparser(text: string) {
    try {
        const validJSON = JSON.parse(text)
        const result = JsonExtractor(validJSON, 0, 0)
        return result
    } catch (error) {
        console.log(error)
    }
}



function JsonExtractor(Json: IJSON, IndexId: number, xCoordinate: number) {
    let positionX = xCoordinate
    const xIncrement = 200
    let rootID: any
    const graph = initializeStates();
    let {nodes,edges} = graph
    
    /// get all the key value with only string number boolean value
    rootID = addNodetoGraph(graph, getNonContainerKeys(Json))
    for (let key in Json) {
        // get all value that is inside an array 
        if (Array.isArray(Json[key])) {
            let parentID = addNodetoGraph(graph, key,'array')
            addEdgestoGraph(graph,rootID,parentID)
            const elements = flattenArray(Json[key])
            elements.forEach(element => {
                const result = nestedObject(graph,element, parentID)
               
            });
        }
        if (typeof Json[key] === 'object' && !Array.isArray(Json[key])) {
            let parentID = addNodetoGraph(graph, key,'object')
            addEdgestoGraph(graph,rootID,parentID)
            const result = nestedObject(graph,Json[key], parentID)
        }

    }

    return graph
}

function nestedObject(graph:Graph,Json:IJSON, parentID:string) {
    let rootID: any
    rootID = addNodetoGraph(graph, getNonContainerKeys(Json))
    addEdgestoGraph(graph,parentID,rootID)
    console.log(rootID)

    for (let key in Json) {
        if (Array.isArray(Json[key])) {
            let newNodeId = addNodetoGraph(graph, key,'array')
            addEdgestoGraph(graph,rootID,newNodeId)
            const elements = flattenArray(Json[key])
            elements.forEach(element => {
                const result = nestedObject(graph,element, newNodeId)
               
            });
        }
        if (typeof Json[key] === 'object' && !Array.isArray(Json[key])) {
            let newNodeId = addNodetoGraph(graph, key,'object')
            //sometinh missing here need to investigate
            addEdgestoGraph(graph,rootID,newNodeId)
            const result = nestedObject(graph,Json[key], newNodeId)
        }
    }
}



function getNonContainerKeys(jsonObject: any) {
    if (typeof jsonObject !== 'object' && !Array.isArray(jsonObject)) {
        return jsonObject
    }
    let nonContainerKeysObj = {};

    function traverse(obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (!Array.isArray(obj[key]) && typeof obj[key] !== 'object') {
                    nonContainerKeysObj[key] = obj[key];
                }
            }
        }
    }

    traverse(jsonObject);
    return nonContainerKeysObj;
}

function flattenArray(arr:any[]) {
    let flattenedArray:[] = [];

    arr.forEach(item => {
        if (Array.isArray(item)) {
            flattenedArray.push(...flattenArray(item));
        } else {
            flattenedArray.push(item);
        }
    });

    return flattenedArray;
}