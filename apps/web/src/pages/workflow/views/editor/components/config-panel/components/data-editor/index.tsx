import React, { useState, useCallback, useRef } from 'react';
import { IconButton, DialogTitle, Popover } from '@mui/material';
import { useCopy } from '@milesight/shared/src/hooks';
import {
    Modal,
    AddCircleOutlineIcon,
    ContentCopyIcon,
    OpenInFullIcon,
    CloseIcon,
} from '@milesight/shared/src/components';
import {
    CodeEditor,
    type EditorProps,
    type EditorHandlers,
    type EditorSupportLang,
} from '@/components';
import UpstreamNodeList from '../upstream-node-list';
import './style.less';

export interface DataEditorProps {
    title?: string;
    lang?: EditorSupportLang;
    placeholder?: EditorProps['placeholder'];
    value: string;
    onChange: (value: string) => void;
}

const DataEditor: React.FC<DataEditorProps> = ({ title, lang, placeholder, value, onChange }) => {
    const { handleCopy } = useCopy();
    const editorRef = useRef<EditorHandlers>(null);

    // ---------- Modal Editor ----------
    const [showModal, setShowModal] = useState(false);
    const modalEditorRef = useRef<EditorHandlers>(null);
    const [modalEditorCont, setModalEditorCont] = useState('');

    // ---------- Render Upstream Node Select ----------
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const renderNodeParamSelect = useCallback(
        (editorInstance?: EditorHandlers | null) => {
            return (
                <>
                    <IconButton
                        onClick={e => {
                            e.stopPropagation();
                            setAnchorEl(e.currentTarget);
                        }}
                    >
                        <AddCircleOutlineIcon />
                    </IconButton>
                    <Popover
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        sx={{
                            '.MuiList-root': {
                                width: 230,
                            },
                        }}
                    >
                        <UpstreamNodeList
                            onChange={node => {
                                setAnchorEl(null);
                                editorInstance?.insert(node.valueKey);
                                setTimeout(() => {
                                    editorInstance?.getEditorView()?.focus();
                                }, 0);
                            }}
                        />
                    </Popover>
                </>
            );
        },
        [anchorEl],
    );

    // ---------- Render Common Header ----------
    const renderHeader = useCallback(
        (value?: string, inModal?: boolean) => {
            return (
                <div className="ms-data-editor-header">
                    <div className="ms-data-editor-header-title">
                        <span>{title || lang}</span>
                    </div>
                    <div className="ms-data-editor-header-actions">
                        <div className="ms-data-editor-header-action">
                            {renderNodeParamSelect(
                                !inModal ? editorRef.current : modalEditorRef.current,
                            )}
                            <IconButton
                                disabled={!value}
                                onClick={e => {
                                    e.stopPropagation();
                                    if (!value) return;
                                    handleCopy(value, e.currentTarget.parentNode as HTMLElement);
                                }}
                            >
                                <ContentCopyIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    if (!inModal) setModalEditorCont(value || '');
                                    setShowModal(!inModal);
                                }}
                            >
                                {inModal ? <CloseIcon /> : <OpenInFullIcon />}
                            </IconButton>
                        </div>
                    </div>
                </div>
            );
        },
        [lang, title, renderNodeParamSelect, handleCopy],
    );

    return (
        <div className="ms-data-editor-container">
            <CodeEditor
                ref={editorRef}
                editorLang={lang}
                placeholder={placeholder}
                renderHeader={({ editorValue }) => renderHeader(editorValue)}
                value={value}
                onChange={onChange}
            />
            {showModal && (
                <Modal
                    visible
                    size="xl"
                    className="ms-data-editor-modal"
                    title={
                        <DialogTitle className="ms-data-editor-modal-title">
                            {renderHeader(modalEditorCont, true)}
                        </DialogTitle>
                    }
                    onCancel={() => {
                        setShowModal(false);
                        setModalEditorCont('');
                    }}
                    onOk={() => {
                        onChange(modalEditorCont);
                        setShowModal(false);
                    }}
                >
                    <CodeEditor
                        ref={modalEditorRef}
                        editorLang={lang}
                        placeholder={placeholder}
                        renderHeader={() => null}
                        value={modalEditorCont}
                        onChange={val => setModalEditorCont(val)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default DataEditor;
