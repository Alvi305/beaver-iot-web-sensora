import React, { useMemo, useEffect, useLayoutEffect } from 'react';
import { useDynamicList, useControllableValue } from 'ahooks';
import { isEqual } from 'lodash-es';
import {
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Button,
    IconButton,
    TextField,
    Stack,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useI18n, useTime } from '@milesight/shared/src/hooks';
import { AddIcon, DeleteOutlineIcon } from '@milesight/shared/src/components';
import './style.less';

export type TimerInputValueType = Partial<
    NonNullable<TimerNodeDataType['parameters']>['timerSettings']
>;

export interface TimerInputProps {
    // label?: string;

    required?: boolean;

    /**
     * Param Select Placeholder
     */
    // placeholder?: string;

    value?: TimerInputValueType;

    defaultValue?: TimerInputValueType;

    onChange?: (value: TimerInputValueType) => void;
}

const timerTypeConfigs: Record<
    NonNullable<TimerInputValueType['type']>,
    {
        labelIntlKey: string;
    }
> = {
    ONCE: {
        labelIntlKey: 'workflow.editor.form_param_timer_type_once',
    },
    SCHEDULE: {
        labelIntlKey: 'workflow.editor.form_param_timer_type_cycle',
    },
    INTERVAL: {
        labelIntlKey: 'workflow.editor.form_param_timer_type_interval',
    },
};

const periodConfigs: Record<
    TimePeriodType,
    {
        labelIntlKey: string;
    }
> = {
    // EVERYDAY: {
    //     labelIntlKey: 'workflow.editor.form_param_timer_period_everyday',
    // },
    MONDAY: {
        labelIntlKey: 'workflow.editor.form_param_timer_period_monday',
    },
    TUESDAY: {
        labelIntlKey: 'workflow.editor.form_param_timer_period_tuesday',
    },
    WEDNESDAY: {
        labelIntlKey: 'workflow.editor.form_param_timer_period_wednesday',
    },
    THURSDAY: {
        labelIntlKey: 'workflow.editor.form_param_timer_period_thursday',
    },
    FRIDAY: {
        labelIntlKey: 'workflow.editor.form_param_timer_period_friday',
    },
    SATURDAY: {
        labelIntlKey: 'workflow.editor.form_param_timer_period_saturday',
    },
    SUNDAY: {
        labelIntlKey: 'workflow.editor.form_param_timer_period_sunday',
    },
};

const intervalConfigs: Partial<
    Record<
        TimerIntervalType,
        {
            labelIntlKey: string;
        }
    >
> = {
    HOURS: {
        labelIntlKey: 'common.label.hours',
    },
    MINUTES: {
        labelIntlKey: 'common.label.minutes',
    },
    // SECONDS: {
    //     labelIntlKey: 'common.label.seconds',
    // },
};

const MAX_VALUE_LENGTH = 10;
const DEFAULT_SCHEDULE_HOUR = 9;
const DEFAULT_SCHEDULE_MINUTE = 0;
const DEFAULT_SCHEDULE_EXPIRATION = '2035/01/01 00:00:00';

/**
 * Timer Input Component
 *
 * Note: use in TimerNode
 */
const TimerInput: React.FC<TimerInputProps> = ({ required, ...props }) => {
    const { getIntlText } = useI18n();
    const { timezone, getTime } = useTime();
    const [data, setData] = useControllableValue<TimerInputValueType | undefined>(props);
    const { list, remove, getKey, insert, replace, resetList } = useDynamicList<
        Partial<NonNullable<TimerInputValueType['rules']>[number]>
    >(data?.rules);
    const typeOptions = useMemo(() => {
        return Object.entries(timerTypeConfigs).map(([type, config]) => (
            <MenuItem key={type} value={type}>
                {getIntlText(config.labelIntlKey)}
            </MenuItem>
        ));
    }, [getIntlText]);
    const periodOptions = useMemo(() => {
        return Object.entries(periodConfigs).map(([period, config]) => (
            <MenuItem key={period} value={period}>
                {getIntlText(config.labelIntlKey)}
            </MenuItem>
        ));
    }, [getIntlText]);
    const intervalTypeOptions = useMemo(() => {
        return Object.entries(intervalConfigs).map(([interval, config]) => (
            <MenuItem key={interval} value={interval}>
                {getIntlText(config.labelIntlKey, { 1: '' }).trim()}
            </MenuItem>
        ));
    }, [getIntlText]);

    useLayoutEffect(() => {
        if (data?.type !== 'SCHEDULE' || isEqual(data?.rules, list)) return;
        resetList(data?.rules || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, resetList]);

    useEffect(() => {
        setData(d => ({
            ...d,
            rules: list || [],
        }));
    }, [list, setData]);

    return (
        <Stack className="ms-timer-input" spacing={3}>
            <FormControl fullWidth required={required}>
                <InputLabel id="time-input-type-label">
                    {getIntlText('workflow.editor.form_param_timer_type')}
                </InputLabel>
                <Select<TimerInputValueType['type'] | ''>
                    notched
                    labelId="time-input-type-label"
                    label={getIntlText('workflow.editor.form_param_timer_type')}
                    value={data?.type || ''}
                    onChange={e => {
                        const type = e.target.value as TimerInputValueType['type'];
                        const result: TimerInputValueType = { type, timezone };

                        switch (type) {
                            case 'SCHEDULE': {
                                result.rules = [
                                    {
                                        hour: DEFAULT_SCHEDULE_HOUR,
                                        minute: DEFAULT_SCHEDULE_MINUTE,
                                    },
                                ];
                                result.expirationEpochSecond = getTime(
                                    DEFAULT_SCHEDULE_EXPIRATION,
                                ).unix();
                                break;
                            }
                            case 'INTERVAL': {
                                result.intervalTimeUnit = 'HOURS';
                                break;
                            }
                            default: {
                                break;
                            }
                        }

                        setData(result);
                    }}
                >
                    {typeOptions}
                </Select>
            </FormControl>
            {data?.type === 'ONCE' && (
                <DateTimePicker
                    ampm={false}
                    label={getIntlText('workflow.editor.form_param_execution_time')}
                    value={
                        data.executionEpochSecond ? getTime(data.executionEpochSecond * 1000) : null
                    }
                    sx={{ width: '100%' }}
                    onChange={time => {
                        setData({
                            ...data,
                            executionEpochSecond: getTime(time, true).unix(),
                            rules: undefined,
                            expirationEpochSecond: undefined,
                        });
                    }}
                />
            )}
            {data?.type === 'SCHEDULE' && (
                <>
                    <div className="ms-timer-input-exec-queue">
                        <span className="label">
                            {getIntlText('workflow.editor.form_param_execution_time_queue')}
                        </span>
                        {list.map((item, index) => (
                            <div className="queue-item" key={getKey(index) || index}>
                                <FormControl fullWidth required={required}>
                                    <InputLabel id="time-input-period-label">
                                        {getIntlText('workflow.editor.form_param_timer_type')}
                                    </InputLabel>
                                    <Select
                                        notched
                                        multiple
                                        labelId="time-input-period-label"
                                        label={getIntlText('workflow.editor.form_param_timer_type')}
                                        value={item.daysOfWeek || []}
                                        onChange={e => {
                                            const { value } = e.target;
                                            const daysOfWeek = Array.isArray(value)
                                                ? value
                                                : value.split(',');
                                            replace(index, {
                                                ...item,
                                                daysOfWeek: daysOfWeek as TimePeriodType[],
                                            });
                                        }}
                                    >
                                        {periodOptions}
                                    </Select>
                                </FormControl>
                                <TimePicker
                                    ampm={false}
                                    sx={{ width: '100%' }}
                                    label={getIntlText('common.label.time')}
                                    value={getTime(Date.now())
                                        .hour(item.hour || 0)
                                        .minute(item.minute || 0)}
                                    onChange={time => {
                                        const date = getTime(time, true);
                                        replace(index, {
                                            ...item,
                                            hour: date.hour(),
                                            minute: date.minute(),
                                        });
                                    }}
                                />
                                {list.length > 1 && (
                                    <IconButton onClick={() => remove(index)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                        <Button
                            fullWidth
                            variant="outlined"
                            className="ms-timer-input-exec-queue-add-btn"
                            startIcon={<AddIcon />}
                            disabled={list.length >= MAX_VALUE_LENGTH}
                            onClick={() => {
                                if (list.length >= MAX_VALUE_LENGTH) return;
                                insert(list.length, {
                                    hour: DEFAULT_SCHEDULE_HOUR,
                                    minute: DEFAULT_SCHEDULE_MINUTE,
                                });
                            }}
                        >
                            {getIntlText('common.label.add')}
                        </Button>
                    </div>
                    <DateTimePicker
                        ampm={false}
                        label={getIntlText('workflow.editor.form_param_expire_time')}
                        value={
                            data.expirationEpochSecond
                                ? getTime(data.expirationEpochSecond * 1000)
                                : null
                        }
                        sx={{ width: '100%' }}
                        onChange={time => {
                            setData({
                                ...data,
                                executionEpochSecond: undefined,
                                expirationEpochSecond: getTime(time, true).unix(),
                            });
                        }}
                    />
                </>
            )}
            {data?.type === 'INTERVAL' && (
                <div className="ms-timer-input-exec-interval">
                    <TextField
                        required={required}
                        autoComplete="off"
                        label={getIntlText('common.label.value')}
                        value={isNaN(+data.intervalTime!) ? '' : data.intervalTime}
                        onChange={e => {
                            const { value } = e.target;
                            if (isNaN(+value)) return;
                            setData({
                                ...data,
                                intervalTime: value === '' ? '' : +value,
                            });
                        }}
                    />
                    <FormControl fullWidth required={required}>
                        <InputLabel id="time-input-type-label">
                            {getIntlText('common.label.unit')}
                        </InputLabel>
                        <Select<TimerInputValueType['intervalTimeUnit'] | ''>
                            notched
                            labelId="time-input-interval-type-label"
                            label={getIntlText('common.label.unit')}
                            value={data.intervalTimeUnit || ''}
                            onChange={e => {
                                setData(data => ({
                                    ...data,
                                    intervalTimeUnit: e.target
                                        .value as TimerInputValueType['intervalTimeUnit'],
                                }));
                            }}
                        >
                            {intervalTypeOptions}
                        </Select>
                    </FormControl>
                </div>
            )}
        </Stack>
    );
};

export default TimerInput;
