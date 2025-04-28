/**
 * Minimum scaling ratio
 */
export const MIN_ZOOM = 0.25;

/**
 * Maximum scaling ratio
 */
export const MAX_ZOOM = 2;

/**
 * Maximum zoom ratio for pretty display
 */
export const MAX_PRETTY_ZOOM = 1.2;

/**
 * Parallel limit
 */
export const PARALLEL_LIMIT = 10;

/**
 * Parallel nesting layer limit
 */
export const PARALLEL_DEPTH_LIMIT = 3;

/**
 * Node minimum number limit
 */
export const NODE_MIN_NUMBER_LIMIT = 2;

/**
 * Entry node number limit
 */
export const ENTRY_NODE_NUMBER_LIMIT = 1;

/**
 * The addable Edge type
 */
export const EDGE_TYPE_ADDABLE: WorkflowEdgeType = 'addable';

/**
 * The default node width
 */
export const DEFAULT_NODE_WIDTH = 240;

/**
 * The default node height
 */
export const DEFAULT_NODE_HEIGHT = 48;

/**
 * Node X-axis spacing
 */
export const NODE_SPACING_X = 48;

/**
 * Node Y-axis spacing
 */
export const NODE_SPACING_Y = 48;

/**
 * The key codes to delete nodes or edges
 */
export const DELETE_KEY_CODE = ['Delete', 'Backspace'];

/**
 * Global parameter reference pattern string
 */
export const PARAM_REFERENCE_PATTERN_STRING = `#\\{properties\\.([^'\\[\\]]+)\\['([^']+)'\\]\\}`;

/**
 * Global parameter reference pattern
 */
export const PARAM_REFERENCE_PATTERN = new RegExp(`^${PARAM_REFERENCE_PATTERN_STRING}$`);

/**
 * Logic operator map
 */
export const logicOperatorMap: Partial<Record<WorkflowLogicOperator, { labelIntlKey: string }>> = {
    OR: {
        labelIntlKey: 'workflow.label.logic_keyword_or',
    },
    AND: {
        labelIntlKey: 'workflow.label.logic_keyword_and',
    },
};

export const DEFAULT_BOOLEAN_DATA_ENUMS = [
    {
        key: 'true',
        labelIntlKey: 'common.label.true',
    },
    {
        key: 'false',
        labelIntlKey: 'common.label.false',
    },
];

/**
 * Condition operator map
 */
export const conditionOperatorMap: Partial<
    Record<WorkflowFilterOperator, { labelIntlKey: string }>
> = {
    CONTAINS: {
        labelIntlKey: 'workflow.label.condition_operator_contains',
    },
    NOT_CONTAINS: {
        labelIntlKey: 'workflow.label.condition_operator_not_contains',
    },
    START_WITH: {
        labelIntlKey: 'workflow.label.condition_operator_start_with',
    },
    END_WITH: {
        labelIntlKey: 'workflow.label.condition_operator_end_with',
    },
    EQ: {
        labelIntlKey: 'workflow.label.condition_operator_is',
    },
    NE: {
        labelIntlKey: 'workflow.label.condition_operator_is_not',
    },
    IS_EMPTY: {
        labelIntlKey: 'workflow.label.condition_operator_is_empty',
    },
    IS_NOT_EMPTY: {
        labelIntlKey: 'workflow.label.condition_operator_is_not_empty',
    },
    GT: {
        labelIntlKey: 'workflow.label.condition_operator_greater_than',
    },
    GE: {
        labelIntlKey: 'workflow.label.condition_operator_greater_than_or_equal',
    },
    LT: {
        labelIntlKey: 'workflow.label.condition_operator_less_than',
    },
    LE: {
        labelIntlKey: 'workflow.label.condition_operator_less_than_or_equal',
    },
};

/**
 * The node property keys that cannot be modified in advance mode and final data
 */
export const FROZEN_NODE_PROPERTY_KEYS: string[] = ['selected', 'dragging'];

/**
 * Pattern for URL parameters
 */
export const URL_PARAM_PATTERN = /\{([^{}]+)\}/g;

/**
 * Pattern for URL path
 */
export const HTTP_URL_PATH_PATTERN = /^\/[a-zA-Z0-9_/{}]+/;
