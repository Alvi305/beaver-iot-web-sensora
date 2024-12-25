import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash-es';
import { Button, IconButton, Grid2, Switch, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { ArrowBackIcon, EditIcon } from '@milesight/shared/src/components';
import { Tooltip } from '@/components';
import { EditModal, type EditModalProps } from '@/pages/workflow/components';
import './style.less';

/**
 * Workflow Design Mode
 */
export type DesignMode = 'canvas' | 'advanced';

export interface TopbarProps {
    /* Is Data Loading */
    loading?: boolean;

    /** Is Buttons Disabled */
    disabled?: boolean;

    /** Workflow Detail Data */
    data?: {
        id?: ApiKey;
        name?: string;
        remark?: string;
        enabled?: boolean;
    };

    /** Default Workflow Design Mode */
    mode?: DesignMode;

    /** Right Slot */
    rightSlot?: React.ReactNode;

    /** Design Mode Change Callback */
    onDesignModeChange: (mode: DesignMode) => void;

    /** Data Change Callback */
    onDataChange?: (data: TopbarProps['data']) => void;

    /** Button Click Callback */
    // onButtonClick?: (type: 'back' | 'save', data?: TopbarProps['data']) => void;
}

/**
 * Workflow Editor Topbar
 */
const Topbar: React.FC<TopbarProps> = ({
    data,
    loading,
    disabled,
    mode = 'canvas',
    rightSlot,
    onDataChange,
    onDesignModeChange,
}) => {
    const navigate = useNavigate();
    const { getIntlText } = useI18n();
    // const isEdit = !!data?.id;

    // ---------- Workflow Name/Remark/Status Edit ----------
    const [flowData, setFlowData] = useState<TopbarProps['data']>();
    const [openEditModal, setOpenEditModal] = useState(false);

    const handleEditConfirm: EditModalProps['onConfirm'] = async params => {
        setOpenEditModal(false);
        setFlowData(data => {
            const result = { ...data, ...params };

            onDataChange?.(result);
            return result;
        });
    };

    const handleSwitchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setFlowData(data => {
            const result = { ...data, enabled: checked };

            onDataChange?.(result);
            return result;
        });
    };

    useEffect(() => {
        if (data?.id) {
            setFlowData(data);
            return;
        }

        const result = {
            name: `${getIntlText('common.label.workflow')}${Date.now()}`,
            enabled: true,
            ...data,
        };

        if (isEqual(data, result)) return;

        setFlowData(result);
        onDataChange?.(result);
    }, [data, getIntlText, onDataChange]);

    return (
        <div className="ms-workflow-topbar">
            <Grid2 container wrap="nowrap" spacing={1}>
                <Grid2 className="ms-workflow-topbar-left" size={4}>
                    <Button
                        variant="outlined"
                        className="btn-back"
                        startIcon={<ArrowBackIcon />}
                        disabled={disabled || loading}
                        onClick={() => navigate('/workflow', { replace: true })}
                    >
                        {getIntlText('common.label.back')}
                    </Button>
                    {(flowData?.name || loading === false) && (
                        <div className="title">
                            <Tooltip autoEllipsis title={flowData?.name} />
                            <IconButton
                                disabled={disabled || loading}
                                onClick={() => setOpenEditModal(true)}
                            >
                                <EditIcon />
                            </IconButton>
                        </div>
                    )}
                </Grid2>
                <Grid2 className="ms-workflow-topbar-center" size={4}>
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        className="ms-workflow-mode-buttons"
                        disabled={disabled || loading}
                        value={mode}
                        onChange={(_, value) => {
                            if (!value) return;
                            onDesignModeChange(value as DesignMode);
                        }}
                    >
                        <ToggleButton
                            disableRipple
                            aria-label={getIntlText('workflow.label.design_mode_canvas_name')}
                            value="canvas"
                        >
                            {getIntlText('workflow.label.design_mode_canvas_name')}
                        </ToggleButton>
                        <ToggleButton
                            disableRipple
                            aria-label={getIntlText('workflow.label.design_mode_advanced_name')}
                            value="advanced"
                        >
                            {getIntlText('workflow.label.design_mode_advanced_name')}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid2>
                <Grid2 className="ms-workflow-topbar-right" size={4}>
                    <Switch
                        disabled={disabled || loading}
                        checked={!!flowData?.enabled}
                        onChange={handleSwitchChange}
                    />
                    {rightSlot}
                </Grid2>
            </Grid2>
            <EditModal
                data={flowData}
                visible={openEditModal}
                onCancel={() => setOpenEditModal(false)}
                onConfirm={handleEditConfirm}
            />
        </div>
    );
};

export default React.memo(Topbar);
