import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import type { Theme } from '$lib/Model';

export function createBase16Theme(theme: Theme): Extension {
	const { colors } = theme;

	// Base16 Styling Guidelines
	// base00: Default Background
	// base01: Lighter Background (Used for status bars, line number background)
	// base02: Selection Background
	// base03: Comments, Invisibles, Line Highlighting
	// base04: Dark Foreground (Used for status bars)
	// base05: Default Foreground, Caret, Delimiters, Operators
	// base06: Light Foreground (Not often used)
	// base07: Light Background (Not often used)
	// base08: Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
	// base09: Integers, Boolean, Constants, XML Attributes, Markup Link Url
	// base0A: Classes, Markup Bold, Search Text Background
	// base0B: Strings, Inherited Class, Markup Code, Diff Inserted
	// base0C: Support, Regular Expressions, Escape Characters, Markup Quotes
	// base0D: Functions, Methods, Attribute IDs, Headings
	// base0E: Keywords, Storage, Selector, Markup Italic, Diff Changed
	// base0F: Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>

	const invalid = colors.base0f; // Deprecated/invalid
	const variable = colors.base08;
	const keyword = colors.base0e;
	const atom = colors.base09; // Boolean, constants
	const _number = colors.base09;
	const definition = colors.base0d; // Functions/Methods
	const string = colors.base0b;
	const _string2 = colors.base0b;
	const _property = colors.base08; // Variables/Tags? Maybe base05 or base08
	const comment = colors.base03;
	const _meta = colors.base0a; // Classes?
	const _attribute = colors.base09; // XML Attributes

	// Editor UI Theme
	const editorTheme = EditorView.theme(
		{
			'&': {
				color: colors.base05,
				backgroundColor: colors.base00,
				fontFamily: "'Fira Code', 'Roboto Mono', 'Courier New', monospace",
				fontSize: '14px',
				height: '100%'
			},
			'.cm-content': {
				caretColor: colors.base05
			},
			'&.cm-focused .cm-cursor': {
				borderLeftColor: colors.base05
			},
			'&.cm-focused .cm-selectionBackground, ::selection': {
				backgroundColor: colors.base02
			},
			'.cm-gutters': {
				backgroundColor: colors.base01,
				color: colors.base03, // Line numbers
				border: 'none'
			},
			'.cm-activeLine': {
				backgroundColor: colors.base01 + '40' // slight transparency or just base01? base01 is status bar. base02 is selection. base01 is often used for gutter. CodeMirror uses active line. Base16 doesn't strictly define active line.
			},
			'.cm-activeLineGutter': {
				backgroundColor: colors.base02,
				color: colors.base04
			}
		},
		{ dark: true }
	); // Assuming dark theme structure for base16 usually, but base16 can be light. 'dark: true' helps some default fallbacks.

	// Syntax Highlighting
	const highlightStyle = HighlightStyle.define([
		{ tag: t.keyword, color: keyword },
		{ tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: variable },
		{ tag: [t.function(t.variableName), t.labelName], color: definition },
		{ tag: [t.color, t.constant(t.name), t.standard(t.name)], color: atom },
		{ tag: [t.definition(t.name), t.separator], color: colors.base05 },
		{
			tag: [
				t.typeName,
				t.className,
				t.number,
				t.changed,
				t.annotation,
				t.modifier,
				t.self,
				t.namespace
			],
			color: colors.base0a
		}, // Classes -> base0A. Number -> base09? Base16 says base09 is Integers.
		{
			tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
			color: colors.base0c
		},
		{ tag: [t.meta, t.comment], color: comment },
		{ tag: t.strong, fontWeight: 'bold' },
		{ tag: t.emphasis, fontStyle: 'italic' },
		{ tag: t.strikethrough, textDecoration: 'line-through' },
		{ tag: t.link, color: colors.base09, textDecoration: 'underline' },
		{ tag: t.heading, fontWeight: 'bold', color: colors.base0d },
		{ tag: [t.atom, t.bool, t.special(t.variableName)], color: atom },
		{ tag: [t.processingInstruction, t.string, t.inserted], color: string },
		{ tag: t.invalid, color: invalid },
		// Refinements
		{ tag: t.number, color: colors.base09 },
		{ tag: t.string, color: colors.base0b },
		{ tag: t.variableName, color: colors.base08 }, // base08 for variables
		{ tag: t.definition(t.variableName), color: colors.base08 },
		{ tag: t.typeName, color: colors.base0a }, // Classes
		{ tag: t.tagName, color: colors.base08 }, // XML Tags -> base08
		{ tag: t.attributeName, color: colors.base09 } // Attributes -> base09
	]);

	return [editorTheme, syntaxHighlighting(highlightStyle)];
}
