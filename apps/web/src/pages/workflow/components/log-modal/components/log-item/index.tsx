import React, { useMemo } from 'react';
import cls from 'classnames';
import { useTime } from '@milesight/shared/src/hooks';
import { Tooltip } from '@/components';
import { LogStatusMap } from '@/pages/workflow/config';
import type { LogItemProps } from '../../types';
import './style.less';

export interface IProps {
    isActive?: boolean;
    data: LogItemProps;
    onClick?: (data: LogItemProps) => void;
}
export default React.memo(({ data, isActive, onClick }: IProps) => {
    const { status, title, timestamp } = data || {};
    const { getTimeFormat } = useTime();

    const { className: statusClassName, icon } = useMemo(() => LogStatusMap[status], [status]);
    return (
        <div
            className={cls('ms-log-item', {
                'ms-log-item--active': !!isActive,
            })}
            onClick={() => onClick?.(data)}
        >
            <div className={cls('ms-log-status', statusClassName)}>{icon}</div>
            <div className="ms-log-content">
                <p className="ms-log-title">
                    <Tooltip title={title} autoEllipsis />
                </p>
                <p className="ms-log-timestamp">
                    <Tooltip
                        title={
                            timestamp ? getTimeFormat(timestamp, 'fullDateTimeSecondFormat') : ''
                        }
                        autoEllipsis
                    />
                </p>
            </div>
        </div>
    );
});
