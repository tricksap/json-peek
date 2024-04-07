'use client'
import { useState } from "react";

export default function nodeGenerator(text: string) {
    try {
        const validJSON = JSON.parse(text)
        let id = 0
        let positionX = 0
        const xIncrement = 200
        let nodes = []
        let edges = []

        nodes.push(
            {
                id: `node-${id += 1}`, type: 'textUpdater', position: { x: positionX, y: 200 }, data: {
                    value: getNonContainerKeys(validJSON)

                }
            })
        const arrays = getArrayKeys(validJSON)
        for (const key of Object.keys(arrays)) {
            edges.push({ id: `node-${id}-node-${id + 1}`, source: `node-${id}`, target: `node-${id + 1}` });
            nodes.push(
                {
                    id: `node-${id += 1}`, type: 'textUpdater', position: { x: positionX += 200, y: 200 }, data: {
                        value: key

                    }
                })
            edges.push({ id: `node-${id}-node-${id + 1}`, source: `node-${id}`, target: `node-${id + 1}` });

            nodes.push(
                {
                    id: `node-${id += 1}`, type: 'textUpdater', position: { x: positionX += 200, y: 200 }, data: {
                        value: arrays[key]

                    }
                })
        }
        return { nodes, edges }
    } catch (error) {
        console.log(error)
    }
}

function getArrayKeys(jsonObject) {
    let arrayKeysObj = {};

    function traverse(obj) {
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

function getNonContainerKeys(jsonObject) {
    let nonContainerKeysObj = {};

    function traverse(obj) {
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