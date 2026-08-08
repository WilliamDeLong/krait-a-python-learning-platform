import { EditorState } from '@codemirror/state';
//import { openSearchPanel, highlightSelectionMatches } from '@codemirror/search';
//import { indentWithTab, history, defaultKeymap, historyKeymap } from '@codemirror/commands';
//import { foldGutter, indentOnInput, indentUnit, bracketMatching, foldKeymap, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
//import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
//import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap, EditorView } from '@codemirror/view';
import {basicSetup} from "codemirror";
import {EditorView, keymap} from "@codemirror/view";
import {defaultKeymap, indentWithTab} from "@codemirror/commands";

// Theme
import { python } from "@codemirror/lang-python";

import { oneDark } from "@codemirror/theme-one-dark";


function createEditorState(initialContents, options = {}) {
    let extensions = [
		keymap.of([defaultKeymap, indentWithTab]), 
		basicSetup, 
        EditorView.lineWrapping
	];

    if (options.oneDark) {
        extensions.push(oneDark);
		//console.log(options);
	}
    if (options.python) {
        extensions.push(python());
    }
    return EditorState.create({
        doc: initialContents,
        extensions
    });
}
//test case
function createEditorView(state, parent) {
    return new EditorView({ state, parent });
}

export { createEditorState, createEditorView };