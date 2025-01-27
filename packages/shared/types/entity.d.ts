/**
 * Entity Access Mode
 * @param R Readonly
 * @param W Writable
 * @param RW Readable and writable
 */
declare type EntityAccessMode = 'R' | 'W' | 'RW';

/**
 * Entity Type
 * @param SERVICE Service
 * @param PROPERTY Property
 * @param EVENT Event
 */
declare type EntityType = 'SERVICE' | 'PROPERTY' | 'EVENT';

/**
 * Entity Value Data Type
 */
declare type EntityValueDataType =
    | 'STRING'
    | 'LONG'
    | 'DOUBLE'
    | 'BOOLEAN'
    | 'BINARY'
    | 'OBJECT'
    | 'ENUM';

/**
 * Data Aggregate Type
 * @param LAST Last
 * @param MIN Minimum
 * @param MAX Maximum
 * @param AVG Average
 * @param SUM Sum
 * @param COUNT Count
 */
declare type DataAggregateType = 'LAST' | 'MIN' | 'MAX' | 'AVG' | 'SUM' | 'COUNT';

/**
 * Entity Data Model
 */
declare interface EntitySchema {
    /** Entity ID */
    id: ApiKey;

    /** Entity Key */
    key: ApiKey;

    /** Entity Name */
    name: string;

    /** Entity Type */
    type: EntityType;

    /** Access mode */
    access_mod: EntityAccessMode;

    /** Whether to synchronously call the service */
    sync_call: boolean;

    /** Parent ID */
    parent_id: ApiKey;

    /** Attach Target */
    attach_target: string;

    /** Attach Target ID */
    attach_target_id: ApiKey;

    /** Value Attribute */
    value_attribute: any;

    /** Value Type */
    value_type: string;

    /** Creation Time (ms) */
    create_at: number;

    /** Update Time (ms) */
    update_at: number;
}

/**
 * Entity Value Attribute Type
 */
declare interface EntityValueAttributeType {
    /** Unit */
    unit: string;
    /** Maximum */
    max: number;
    /** Minimum */
    min: number;
    /** Max Length */
    max_length: number;
    /** Min Length */
    min_length: number;
    /** Enums */
    enum: Record<string, string>;
    /** Format */
    format: string;
    /** Fraction Digits */
    fraction_digits: number;
}

/**
 * Entity Data
 */
declare interface EntityData {
    /** Entity ID */
    entity_id: ApiKey;
    /** Device Name */
    device_name: string;
    /** Integration Name */
    integration_name: string;
    /** Entity Key */
    entity_key: string;
    /** Entity Name */
    entity_name: string;
    /** Entity Type */
    entity_type: EntityType;
    /** Entity Value Attribute */
    entity_value_attribute: Record<string, any>;
    /** Entity Value Type */
    entity_value_type: EntityValueDataType;
    /** Entity Access Mode */
    entity_access_mod: EntityAccessMode;
    /** Identifier */
    identifier: string;
    /** Entity Parent Name */
    entity_parent_name?: string;
}

/**
 * Entity History Data
 */
declare interface EntityHistoryData {
    value: any;
    timestamp: number;
    value_type: EntityValueDataType;
}
