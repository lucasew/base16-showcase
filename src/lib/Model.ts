/**
 * Represents a standard Base16 theme structure.
 *
 * Base16 is a styling guideline that uses 16 colors (base00-base0f) to define a theme.
 *
 * @see {@link http://chriskempson.com/projects/base16/ | Base16 Documentation}
 */
export interface Theme {
	/** The display name of the theme. */
	name: string;
	/** The author or maintainer of the theme. */
	author: string;
	/**
	 * The 16-color palette defined by the Base16 specification.
	 *
	 * - `base00` - `base07`: Monotone shades (backgrounds, foregrounds).
	 * - `base08` - `base0f`: Accent colors used for syntax highlighting.
	 */
	colors: {
		base00: string;
		base01: string;
		base02: string;
		base03: string;
		base04: string;
		base05: string;
		base06: string;
		base07: string;
		base08: string;
		base09: string;
		base0a: string;
		base0b: string;
		base0c: string;
		base0d: string;
		base0e: string;
		base0f: string;
	};
}

/**
 * Utility type representing a value that might be null.
 *
 * @template T The type of the value.
 */
export type Maybe<T> = T | null;
