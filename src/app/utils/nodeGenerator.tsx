'use client'
import { useState } from "react";

export default function nodeGenerator(text: string) {
    try {
        const validJSON = JSON.parse(text)

        const JSONKeys = Object.keys(validJSON)



        const result = JsonExtractor(validJSON, 0)
        console.log(result, "rere")
        return result
    } catch (error) {
        console.log(error)
    }
}

function getArrayKeys(jsonObject: any) {
    let arrayKeysObj = {};

    function traverse(obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (Array.isArray(obj[key])) {
                    arrayKeysObj[key] = obj[key];
                }
            }
        }
    }

    traverse(jsonObject);
    return arrayKeysObj;
}

function getNonContainerKeys(jsonObject: any) {
    let nonContainerKeysObj = {};

    function traverse(obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (!Array.isArray(obj[key])) {
                    nonContainerKeysObj[key] = obj[key];
                }
            }
        }
    }

    traverse(jsonObject);
    return nonContainerKeysObj;
}

function JsonExtractor(Json, IndexId) {
    let positionX = 0
    const xIncrement = 200
    let nodes = []
    let edges = []
    let rootID

    nodes.push(
        {
            id: `node-${IndexId += 1}`, type: 'textUpdater', position: { x: positionX, y: 200 }, data: {
                value: getNonContainerKeys(Json)

            }
        })


    for (let key in Json) {
        if (Array.isArray(Json[key])) {
            edges.push({ id: `node-${IndexId}-node-${IndexId + 1}`, source: `node-${IndexId}`, target: `node-${IndexId + 1}` });
            nodes.push(
                {
                    id: `node-${IndexId += 1}`, type: 'textUpdater', position: { x: positionX += xIncrement, y: 200 }, data: {
                        value: key

                    }
                })
            rootID = IndexId
            Json[key].forEach(element => {
                edges.push({ id: `node-${rootID}-node-${IndexId + 1}`, source: `node-${rootID}`, target: `node-${IndexId + 1}` });
                nodes.push(
                    {
                        id: `node-${IndexId += 1}`, type: 'textUpdater', position: { x: positionX += xIncrement, y: 200 }, data: {
                            value: element

                        }
                    })
            });
        }
        // TODO: start processing recursion
        if (typeof Json[key] === 'object' && !Array.isArray(Json[key])) {
            let rere = JsonExtractor(Json[key], IndexId)
            console.log(rere, 'recur')
        }

    }
    return { nodes, edges }
}