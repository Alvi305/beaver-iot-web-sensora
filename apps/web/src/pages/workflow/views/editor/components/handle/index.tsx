import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import cls from 'classnames';
import { useDebounceFn } from 'ahooks';
import { Handle as XHandle, useEdges, type HandleProps, type NodeProps } from '@xyflow/react';
import { Stack } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { AddCircleIcon } from '@milesight/shared/src/components';
import NodeMenu from '../node-menu';
import './style.less';

export interface Props extends HandleProps {
    /**
     * Node Props
     */
    nodeProps: NodeProps<WorkflowNode>;
}

/**
 * Custom Handle Component
 */
const Handle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & Props>(
    ({ nodeProps, className, ...props }, ref) => {
        const { getIntlHtml } = useI18n();
        const edges = useEdges();
        const targetAddEnabled = edges.every(edge => edge.target !== nodeProps.id);

        // ---------- Handle Tooltip Open ----------
        const [showTooltip, setShowTooltip] = useState(false);
        const { run: handleMouseEnter, cancel: cancelHandleMouseEnter } = useDebounceFn(
            () => {
                if (props.type === 'target' && !targetAddEnabled) return;
                setShowTooltip(true);
            },
            { wait: 500 },
        );

        // ---------- Handle Click Callback ----------
        const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
        const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setAnchorEl(e.currentTarget);
            e.stopPropagation();
        }, []);

        const closestNodeProps = useMemo(() => {
            return props.type === 'target'
                ? {
                      nextNodeId: nodeProps.id,
                      nextNodeTargetHandle: props.id,
                  }
                : {
                      prevNodeId: nodeProps.id,
                      prevNodeSourceHandle: props.id,
                  };
        }, [props, nodeProps]);

        return (
            <>
                <XHandle
                    {...props}
                    ref={ref}
                    className={cls('ms-workflow-handle', className, {
                        'target-enable-add': props.type === 'target' && targetAddEnabled,
                        'is-menu-open': !!anchorEl,
                    })}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => {
                        setShowTooltip(false);
                        cancelHandleMouseEnter();
                    }}
                >
                    {/* Use Custom Tooltip, resolve the issue of Edge connect failure when Mui Tooltip component is enabled */}
                    <span
                        className={cls('ms-workflow-handle-tooltip', {
                            hidden: !showTooltip || !!anchorEl,
                        })}
                    >
                        {getIntlHtml('workflow.label.handle_tooltip')}
                    </span>
                    <Stack sx={{ pointerEvents: 'none' }}>
                        <AddCircleIcon />
                    </Stack>
                </XHandle>
                <NodeMenu
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    {...closestNodeProps}
                    onClose={() => setAnchorEl(null)}
                />
            </>
        );
    },
);

export default Handle;
