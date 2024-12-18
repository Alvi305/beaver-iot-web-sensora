import React from 'react';
import type { ReactCodeMirrorProps, EditorView, EditorState } from '@uiw/react-codemirror';
import type { SelectChangeEvent } from '@mui/material';

/** Supported languages for the code editor. */
export type EditorSupportLang =
    | 'groovy'
    | 'javascript'
    | 'python'
    | 'mvel'
    | 'json'
    | 'yaml'
    | 'markdown'
    | 'text';

/** Props for the code editor content. */
export interface EditorContentProps extends ReactCodeMirrorProps {
    /** Whether to show line numbers in the editor. */
    showLineNumber?: boolean;
    /** Whether to enable code folding in the editor. */
    showFold?: boolean;
    /** The font size used in the editor. */
    fontSize?: number;
}

/** Props for the code editor component. */
export interface EditorProps extends EditorContentProps {
    /** Default editor language. */
    defaultEditorLang?: EditorSupportLang;
    /** The programming language used in the editor. */
    editorLang?: EditorSupportLang;
    /**
     * Callback function triggered when the language changes.
     * @param value - The new language value.
     */
    onLangChange?: (value: string) => void;

    /** The content value of the editor. */
    value?: string;
    /**
     * Callback function triggered when the content value changes.
     * @param value - The new content value.
     */
    onChange?: (value: string) => void;

    /** Custom editor toolbar header. */
    Header?: React.FC<EditorToolbarProps>;
}

/** Interface for editor language options. */
export interface IEditorLangOption {
    /** The language type. */
    lang: EditorSupportLang;
    /** The label for the language. */
    label: string;
}

/** Props for the editor language selection component. */
export interface EditorSelectProps {
    /** The programming language used in the editor. */
    editorLang?: EditorSupportLang;
    /**
     * Callback function triggered when the editor language changes.
     * @param lang - The new language value.
     * @param e - The selection change event.
     */
    onEditorLangChange?: (lang: EditorSupportLang, e: SelectChangeEvent<EditorSupportLang>) => void;
    /**
     * Method to render language options.
     * @param option - The language option.
     * @returns The rendered node.
     */
    renderOptions?: (option: IEditorLangOption) => React.ReactNode;
}

/** Props for the code editor toolbar. */
export interface EditorToolbarProps extends Pick<EditorSelectProps, 'renderOptions'> {
    /** The content value of the editor. */
    editorValue: string;
    /** The programming language used in the editor. */
    editorLang?: EditorSupportLang;
    /**
     * Method to set the editor language.
     * @param lang - The new language value.
     */
    setEditorLang: (lang: EditorSupportLang) => void;
    /** The title displayed in the toolbar. */
    title?: React.ReactNode;
    /** The icon displayed in the toolbar. */
    icon?: React.ReactNode;
    /** Interface for handling various editor operations. */
    editorHandlers: EditorHandlers;
}

/**
 * Interface for handling various editor operations.
 */
export interface EditorHandlers {
    /**
     * Returns the current EditorView instance.
     * @returns {EditorView} The current EditorView instance.
     */
    getEditorView: () => EditorView | void;

    /**
     * Returns the current EditorState instance.
     * @returns {EditorState} The current EditorState instance.
     */
    getEditorState: () => EditorState | void;

    /**
     * Undoes the last change in the editor.
     */
    undo: () => void;

    /**
     * Redoes the last undone change in the editor.
     */
    redo: () => void;

    /**
     * Inserts text at the current cursor position.
     * @param text - The text to be inserted.
     */
    insert: (text: string) => void;
}
