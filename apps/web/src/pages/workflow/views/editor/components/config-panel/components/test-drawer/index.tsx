import React, { useCallback, useEffect, useMemo, useState } from 'react';
import cls from 'classnames';
import { pick, isEmpty, isObject, cloneDeep, get as objectGet } from 'lodash-es';
import { useRequest } from 'ahooks';
import {
    Backdrop,
    Slide,
    IconButton,
    Button,
    Divider,
    Alert,
    CircularProgress,
    TextField,
} from '@mui/material';
import { useReactFlow } from '@xyflow/react';
import { useI18n } from '@milesight/shared/src/hooks';
import { genRandomString } from '@milesight/shared/src/utils/tools';
import {
    CloseIcon,
    PlayArrowIcon,
    CheckCircleIcon,
    ErrorIcon,
    toast,
} from '@milesight/shared/src/components';
import { CodeEditor, Tooltip } from '@/components';
import { workflowAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import useFlowStore from '../../../../store';
import useWorkflow from '../../../../hooks/useWorkflow';
import { isRefParamKey } from '../../../../helper';
import { PARAM_REFERENCE_PATTERN_STRING } from '../../../../constants';
import EmailContent from '../email-content';
import './style.less';

export interface TestDrawerProps {
    node?: WorkflowNode;
    open: boolean;
    onClose: () => void;
}

const statusDefaultMsgKey: Record<
    WorkflowNodeStatus,
    {
        icon: React.ReactNode;
        intlKey: string;
    }
> = {
    ERROR: {
        icon: <ErrorIcon />,
        intlKey: 'common.label.error',
    },
    SUCCESS: {
        icon: <CheckCircleIcon />,
        intlKey: 'common.label.success',
    },
};

const safeJSONStringify = (value?: string, space: number = 2) => {
    if (!value) return '';
    let result = '';
    try {
        result = JSON.stringify(JSON.parse(value), null, space);
    } catch (e) {
        result = value;
    }

    return result;
};

const TestDrawer: React.FC<TestDrawerProps> = ({ node, open, onClose }) => {
    const { getIntlText } = useI18n();
    const { getNode } = useReactFlow<WorkflowNode, WorkflowEdge>();

    // ---------- Basic Node Info ----------
    const nodeId = node?.id;
    const nodeConfigs = useFlowStore(state => state.nodeConfigs);
    const nodeConfig = useMemo(() => {
        if (!node) return;
        return nodeConfigs[node.type as WorkflowNodeType];
    }, [node, nodeConfigs]);
    const title = useMemo(() => {
        let tit = node?.data.nodeName;
        if (!tit) {
            tit = nodeConfig?.labelIntlKey ? getIntlText(nodeConfig.labelIntlKey) : '';
        }

        return getIntlText('workflow.editor.config_panel_test_title', { 1: tit });
    }, [node, nodeConfig, getIntlText]);
    const testInputKeysMap = useMemo(() => {
        if (!nodeConfig) return {};
        return (nodeConfig?.testInputKeys || []).reduce(
            (acc, item) => {
                acc[item.key] = item;
                return acc;
            },
            {} as Record<string, NonNullable<typeof nodeConfig.testInputKeys>[0]>,
        );
    }, [nodeConfig]);

    // ---------- Generate Demo Data ----------
    const { getReferenceParamDetail } = useWorkflow();
    const [inputData, setInputData] = useState('');
    const genDemoData = useCallback(() => {
        if (!open || !nodeId || !nodeConfig) return;
        // Get the latest node data
        const node = getNode(nodeId);
        const { parameters } = node?.data || {};
        const result: Record<string, any> = {};
        const testInputKeys = Object.keys(testInputKeysMap);
        const inputArgs = pick(parameters, testInputKeys);

        if (testInputKeys.length === 1 && testInputKeysMap[testInputKeys[0]].type === 'string') {
            const originalValue = inputArgs[testInputKeys[0]];
            const regexp = new RegExp(PARAM_REFERENCE_PATTERN_STRING, 'g');

            return originalValue?.replace(regexp, '') || '';
        }
        if (isEmpty(inputArgs)) return result;

        // Use different traversal methods for different param
        Object.entries(inputArgs).forEach(([param, data]) => {
            // TODO: Generate different type data based on reference key type ?
            switch (param) {
                case 'entities': {
                    data.forEach((key: string) => {
                        result[key] = genRandomString(8, { lowerCase: true });
                    });
                    break;
                }
                case 'payload':
                case 'inputArguments':
                case 'serviceInvocationSetting':
                case 'exchangePayload': {
                    if (param === 'serviceInvocationSetting') {
                        data = data.serviceParams;
                    }
                    Object.entries(data).forEach(([key, value]) => {
                        if (!key) return;
                        if (!isRefParamKey(value as string)) {
                            result[key] = value || genRandomString(8, { lowerCase: true });
                            return;
                        }

                        const detail = getReferenceParamDetail(value as string);
                        const valueType = detail?.valueType;

                        switch (valueType) {
                            case 'BOOLEAN': {
                                result[key] = Math.random() > 0.5;
                                break;
                            }
                            case 'LONG':
                            case 'DOUBLE': {
                                result[key] = Math.floor(Math.random() * 100);
                                break;
                            }
                            default: {
                                result[key] = genRandomString(8, { lowerCase: true });
                                break;
                            }
                        }
                    });
                    break;
                }
                default: {
                    result[param] = data || genRandomString(8, { lowerCase: true });
                    break;
                }
            }
        });

        return result;
    }, [open, nodeId, nodeConfig, testInputKeysMap, getNode, getReferenceParamDetail]);

    // ---------- Run Test ----------
    const hasInput = nodeConfig?.testable && !!nodeConfig.testInputKeys?.length;
    const {
        loading,
        data: testResult,
        run: testSingleNode,
    } = useRequest(
        async (value?: string) => {
            if (!open || !nodeId) return;
            let input: Record<string, any> = {};
            // Get the latest node data
            const node = cloneDeep(getNode(nodeId))!;
            const testInputKeys = Object.keys(testInputKeysMap) || [];

            if (node.type === 'email') {
                testInputKeys.forEach(key => {
                    node.data.parameters = node.data.parameters || {};
                    switch (key) {
                        case 'content': {
                            node.data.parameters[key] = value;
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                });
            } else {
                try {
                    input = !value ? undefined : JSON.parse(value || '{}');
                } catch (e) {
                    toast.error({ content: getIntlText('common.message.json_format_error') });
                    return;
                }

                testInputKeys.forEach(key => {
                    const param = objectGet(node?.data?.parameters, key);
                    const params = Array.isArray(param) ? param : [param];

                    params.forEach(item => {
                        if (isObject(item)) {
                            Object.keys(item).forEach(k => {
                                (item as Record<string, any>)[k] = input[k];
                            });
                        }
                    });
                });
            }

            // console.log({ input, node });
            const [error, resp] = await awaitWrap(
                workflowAPI.testSingleNode({ input, node_config: JSON.stringify(node) }),
            );

            if (error || !isRequestSuccess(resp)) return;
            return getResponseData(resp);
        },
        {
            manual: true,
            debounceWait: 300,
            refreshDeps: [open, nodeId, nodeConfig, testInputKeysMap],
        },
    );

    useEffect(() => {
        if (hasInput) {
            const demoData = genDemoData();
            setInputData(
                typeof demoData === 'string' ? demoData : JSON.stringify(demoData, null, 2),
            );
            return;
        }

        testSingleNode();
    }, [hasInput, genDemoData, testSingleNode]);

    // Clear Data when panel closed
    useEffect(() => {
        if (open) return;
        setInputData('');
        testSingleNode();
    }, [open, testSingleNode]);

    return (
        <div className={cls('ms-config-panel-test-drawer-root', { open, loading })}>
            <Backdrop open={open} onClick={onClose}>
                <Slide direction="up" in={open}>
                    <div className="ms-config-panel-test-drawer" onClick={e => e.stopPropagation()}>
                        <div className="ms-config-panel-test-drawer-header">
                            <div className="ms-config-panel-test-drawer-title">
                                <Tooltip autoEllipsis title={title} />
                            </div>
                            <IconButton onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className="ms-config-panel-test-drawer-body">
                            {hasInput && (
                                <div className="input-content-area">
                                    {Object.keys(testInputKeysMap).length === 1 &&
                                    Object.values(testInputKeysMap)[0].type === 'string' ? (
                                        node?.type === 'email' ? (
                                            <EmailContent
                                                upstreamNodeSelectable={false}
                                                value={inputData}
                                                onChange={setInputData}
                                            />
                                        ) : (
                                            <TextField
                                                multiline
                                                fullWidth
                                                rows={8}
                                                value={inputData}
                                                onChange={e => setInputData(e.target.value)}
                                                disabled={loading}
                                                placeholder={getIntlText('common.label.input')}
                                            />
                                        )
                                    ) : (
                                        <CodeEditor
                                            editorLang="json"
                                            title={getIntlText('common.label.input')}
                                            value={inputData}
                                            onChange={setInputData}
                                        />
                                    )}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        className="ms-config-panel-test-drawer-btn"
                                        disabled={loading}
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => testSingleNode(inputData)}
                                    >
                                        {getIntlText('common.label.run')}
                                    </Button>
                                </div>
                            )}
                            {!!testResult && (
                                <>
                                    {hasInput && <Divider />}
                                    <div className="output-content-area">
                                        <Alert
                                            severity={
                                                testResult.status === 'SUCCESS'
                                                    ? 'success'
                                                    : 'error'
                                            }
                                            icon={statusDefaultMsgKey[testResult.status]?.icon}
                                        >
                                            {testResult.error_message ||
                                                getIntlText(
                                                    statusDefaultMsgKey[testResult.status]
                                                        ?.intlKey || '',
                                                )}
                                        </Alert>
                                        {testResult.output && (
                                            <CodeEditor
                                                readOnly
                                                editable={false}
                                                editorLang="json"
                                                title={getIntlText('common.label.output')}
                                                value={safeJSONStringify(testResult.output)}
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {loading && <CircularProgress />}
                    </div>
                </Slide>
            </Backdrop>
        </div>
    );
};

export default React.memo(TestDrawer);
