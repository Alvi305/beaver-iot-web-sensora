import { omitBy } from 'lodash-es';
import { genRandomString, checkPrivateProperty } from '@milesight/shared/src/utils/tools';
import {
    checkRequired,
    checkRangeLength,
    type Validate,
} from '@milesight/shared/src/utils/validators';
import { PARAM_REFERENCE_PATTERN, URL_PARAM_PATTERN } from './constants';

/**
 * Node Data Validators Config
 */
export const validatorsConfig: Record<string, Record<string, Validate>> = {
    name: {
        checkRequired: checkRequired(),
        checkRangeLength: checkRangeLength({ min: 1, max: 50 }),
    },
    remark: {
        checkRangeLength: checkRangeLength({ min: 1, max: 1000 }),
    },
};

/**
 * Generate Reference Param Key
 */
export const genRefParamKey = (nodeId: ApiKey, valueKey: ApiKey) => {
    return `#{properties.${nodeId}['${valueKey}']}`;
};

/**
 * Check if the value is a reference param key
 */
export const isRefParamKey = (key?: string) => {
    return key && PARAM_REFERENCE_PATTERN.test(key);
};

/**
 * Parse the reference param key
 */
export const parseRefParamKey = (key?: string) => {
    if (!key || !isRefParamKey(key)) return;
    const matches = key.match(PARAM_REFERENCE_PATTERN);

    if (!matches) return;
    const [, nodeId, valueKey] = matches;
    return {
        nodeId,
        valueKey,
    };
};

/**
 * Generate Workflow Node, Edge or Condition uuid, format as `{node}:{8-bit random string}:{timestamp}`
 * @param type node/edge
 */
export const genUuid = (type: 'node' | 'edge' | 'condition' | 'subcondition' | 'temp') => {
    return `${type}_${genRandomString(8, { lowerCase: true })}`;
};

/**
 * Normalize nodes data
 * @description Remove private properties and exclude keys
 */
export const normalizeNodes = (nodes: WorkflowNode[], excludeKeys?: string[]): WorkflowNode[] => {
    return nodes.map(node => {
        const result = omitBy(node, (_, key) => excludeKeys?.includes(key));

        result.data = omitBy(node.data, (_, key) => checkPrivateProperty(key));
        return result as WorkflowNode;
    });
};

/**
 * Normalize edges data
 * @description Remove private properties
 */
export const normalizeEdges = (edges: WorkflowEdge[]) => {
    return edges.map(edge => {
        delete edge.selected;
        edge.data = omitBy(edge.data, (_, key) => checkPrivateProperty(key));
        return edge;
    });
};

/**
 * Extract path parameters from the URL
 * @param url - The URL string to parse (e.g. '/users/{userId}/posts/{postId}')
 * @returns An array of parameter names found in the URL (e.g. ['userId', 'postId'])
 */
export const getUrlParams = (url?: string) => {
    const result: string[] = [];
    if (!url) return result;

    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = URL_PARAM_PATTERN.exec(url)) !== null) {
        result.push(match[1]);
    }

    return result;
};
