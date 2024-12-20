import { useState } from 'react';
import { IconButton, Popover } from '@mui/material';
import { useI18n, useCopy } from '@milesight/shared/src/hooks';
import { MoreHorizIcon, ContentCopyIcon } from '@milesight/shared/src/components';
import { Tooltip } from '@/components';
import useWorkflow from '../../../../hooks/useWorkflow';
import './style.less';

const MoreMenu = () => {
    const { getIntlText } = useI18n();
    const { handleCopy } = useCopy();
    const { getSelectedNode } = useWorkflow();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const selectedNode = getSelectedNode();

    return (
        <div className="ms-config-panel-more-menu">
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <MoreHorizIcon />
            </IconButton>
            <Popover
                className="ms-config-panel-more-menu-popover"
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={() => {
                    setAnchorEl(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <div className="node-info-root">
                    <div className="node-info-item">
                        <div className="node-info-item-title">
                            {getIntlText('workflow.label.node_id')}
                        </div>
                        <div className="node-info-item-content">
                            <Tooltip autoEllipsis title={selectedNode?.id} />
                            <IconButton onClick={() => handleCopy(selectedNode?.id || '')}>
                                <ContentCopyIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </Popover>
        </div>
    );
};

export default MoreMenu;
