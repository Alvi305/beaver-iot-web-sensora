import { type NodeConfigItemType } from '../../config';

export type NodeFormItemValueType = 'string' | 'array' | 'object' | 'number' | 'boolean';

export type NodeFormItemConfig = {
    name: string;
    type: NodeFormItemValueType;
    kind: 'path' | 'parameter';
    multiValue: boolean;
    displayName: string;
    defaultValue: string;
    description: string;
    index: number;
    enum: string[];
    required: boolean;
    secret: boolean;
    autowired: boolean;
    uiComponent?: string;
    // uiComponentTags: string;
    uiComponentGroup?: string;
};

/**
 * The backend node schema
 */
export type NodeConfigSchema = {
    component: {
        /** Unique ID */
        name: string;
        /** Title */
        title: string;
        /** Category */
        type: string;
        /* Description */
        description: string;
        /** Testable */
        testable?: boolean;
    };
    properties: Record<string, NodeFormItemConfig>;
    outputProperties: Record<string, NodeFormItemConfig>;
};

export type NodeConfigItem = NodeConfigItemType & {
    label?: string;
    /** The backend node schema */
    schema?: NodeConfigSchema;
};
