import { useMemo, useRef } from 'react';
import { useI18n, useTime, useVirtualList } from '@milesight/shared/src/hooks';
import { ErrorIcon, CheckCircleIcon } from '@milesight/shared/src/components';
import { type WorkflowAPISchema } from '@/services/http';
import { Empty } from '@/components';
import './style.less';

export type LogType = 'test' | 'run';

export interface LogListProps {
    type: LogType;

    data?: WorkflowAPISchema['getLogList']['response']['content'];

    loading?: boolean;

    onSelect?: (record: NonNullable<LogListProps['data']>[number]) => void;
}

const LogList: React.FC<LogListProps> = ({ type, data = [], loading, onSelect }) => {
    const { getIntlText } = useI18n();
    const { getTimeFormat } = useTime();
    // const titlePrefix = useMemo(() => {
    //     switch (type) {
    //         case 'test':
    //             return getIntlText('workflow.editor.log_title_test');
    //         case 'run':
    //             return getIntlText('workflow.editor.log_title_run');
    //         default:
    //             return '';
    //     }
    // }, [type, getIntlText]);

    // ---------- Virtual List ----------
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [virtualList] = useVirtualList(data, {
        containerTarget: containerRef,
        wrapperTarget: wrapperRef,
        itemHeight: 38,
        overscan: 10,
    });

    // TODO: Infinite Scroll Loading ?

    return (
        <div className="ms-workflow-com-log-list" ref={containerRef}>
            <div className="ms-workflow-com-log-list-wrapper" ref={wrapperRef}>
                {!virtualList?.length ? (
                    <Empty loading={loading} />
                ) : (
                    virtualList.map(({ data: record }) => (
                        <div
                            className="ms-workflow-com-log-list-item"
                            key={record.id}
                            onClick={() => {
                                onSelect?.(record);
                            }}
                        >
                            <div className="ms-workflow-com-log-list-item__left">
                                {record.status === 'SUCCESS' ? (
                                    <CheckCircleIcon color="success" />
                                ) : (
                                    <ErrorIcon color="error" />
                                )}
                            </div>
                            <div className="ms-workflow-com-log-list-item__right">
                                <div className="ms-workflow-com-log-list-item__title">
                                    {getTimeFormat(record.start_time)}
                                </div>
                                {/* <div className="ms-workflow-com-log-list-item__time">
                                    {getTimeFormat(record.start_time)}
                                </div> */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LogList;
