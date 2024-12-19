import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Modal, type ModalProps } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';
import { Empty, Tooltip } from '@/components';
import { LogItem } from './components';
import { useRenderList, useSourceData } from './hooks';
import ActionLog from '../action-log';
import type { LogRenderListType } from './types';
import './style.less';

// TODO mock Data
import traceData from './trace.json';
import workflowData from './workflow.json';

export type IProps = ModalProps;
export default React.memo(({ visible, ...props }: IProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const { getIntlText } = useI18n();
    const [activeItem, setActiveItem] = useState<LogRenderListType>();

    const { getLogList } = useSourceData();
    const { scrollItem, virtualList, getLogListLoading } = useRenderList({
        containerRef,
        listRef,
        getLogList,
    });

    /** When initializing, set the first as the default value */
    useEffect(() => {
        if (activeItem) return;

        const [firstItem] = scrollItem?.list || [];
        setActiveItem(firstItem);
    }, [scrollItem, activeItem]);

    /** handle click left bar */
    const handleClick = useCallback((data: LogRenderListType) => {
        setActiveItem(data);
    }, []);

    const isLoading = !!getLogListLoading;
    const isEmpty = !getLogListLoading && !scrollItem?.list?.length;
    return (
        <Modal
            size="xl"
            footer={null}
            showCloseIcon
            visible={visible}
            title={getIntlText('workflow.modal.running_log')}
            className="ms-log-modal"
            {...props}
        >
            <div className="ms-log-container">
                {isLoading && (
                    <div className="ms-log-loading">
                        <CircularProgress />
                    </div>
                )}
                {isEmpty && (
                    <div className="ms-log-empty">
                        <Empty text={getIntlText('workflow.label.no_log_record')} />
                    </div>
                )}
                {!isLoading && !isEmpty && (
                    <>
                        <div className="ms-log-left-bar">
                            <div className="ms-log-left-bar__scroll" ref={containerRef}>
                                <div className="ms-log-left-bar__list" ref={listRef}>
                                    {virtualList.map(({ data }) => {
                                        if (data?.$$isFooterNode) {
                                            return (
                                                <div className="ms-log-left-bar__more">
                                                    <CircularProgress size={22} />
                                                </div>
                                            );
                                        }
                                        return (
                                            <LogItem
                                                data={data}
                                                key={data.id}
                                                isActive={data.id === activeItem?.id}
                                                onClick={handleClick}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="ms-log-right-bar">
                            <div className="ms-log-right-bar__title">
                                <Tooltip title={activeItem?.title || ''} autoEllipsis />
                            </div>
                            <div className="ms-log-right-bar__detail">
                                <ActionLog
                                    // TODO mock Data
                                    traceData={traceData.traceInfo as any}
                                    workflowData={workflowData as any}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
});
