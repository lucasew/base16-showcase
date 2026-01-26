<script lang="ts">
	import type { Theme } from '$lib/Model';

	export let theme: Theme;
	export let language: string = 'javascript';

	// Base16 Color Mapping
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

	$: styles = `
    --base00: ${theme.colors.base00};
    --base01: ${theme.colors.base01};
    --base02: ${theme.colors.base02};
    --base03: ${theme.colors.base03};
    --base04: ${theme.colors.base04};
    --base05: ${theme.colors.base05};
    --base06: ${theme.colors.base06};
    --base07: ${theme.colors.base07};
    --base08: ${theme.colors.base08};
    --base09: ${theme.colors.base09};
    --base0A: ${theme.colors.base0a};
    --base0B: ${theme.colors.base0b};
    --base0C: ${theme.colors.base0c};
    --base0D: ${theme.colors.base0d};
    --base0E: ${theme.colors.base0e};
    --base0F: ${theme.colors.base0f};
  `;
</script>

<div class="code-preview-container" style={styles}>
	<div class="editor-window">
		<div class="editor-header">
			<div class="window-controls">
				<span class="control close"></span>
				<span class="control minimize"></span>
				<span class="control maximize"></span>
			</div>
			<div class="filename">example.{language === 'javascript' ? 'js' : 'rs'}</div>
		</div>
		<div class="editor-content">
			<div class="gutter">
				<span>1</span>
				<span>2</span>
				<span>3</span>
				<span>4</span>
				<span>5</span>
				<span>6</span>
				<span>7</span>
				<span>8</span>
				<span>9</span>
				<span>10</span>
				<span>11</span>
				<span>12</span>
				<span>13</span>
				<span>14</span>
			</div>
			<div class="code">
				{#if language === 'javascript'}
					<pre>
<span class="keyword">import</span> <span class="variable">React</span>, &#123; <span
							class="variable">useState</span
						> &#125; <span class="keyword">from</span> <span class="string">'react'</span>;

<span class="comment">// Calculate the nth Fibonacci number</span>
<span class="keyword">function</span> <span class="function">fibonacci</span>(<span class="variable"
							>n</span
						>) &#123;
  <span class="keyword">if</span> (<span class="variable">n</span> &lt;= <span class="integer"
							>1</span
						>) &#123;
    <span class="keyword">return</span> <span class="variable">n</span>;
  &#125;
  <span class="keyword">return</span> <span class="function">fibonacci</span>(<span class="variable"
							>n</span
						> - <span class="integer">1</span>) + <span class="function">fibonacci</span>(<span
							class="variable">n</span
						> - <span class="integer">2</span>);
&#125;

<span class="keyword">const</span> <span class="variable">App</span> = () =&gt; &#123;
  <span class="keyword">const</span> [<span class="variable">count</span>, <span class="variable"
							>setCount</span
						>] = <span class="function">useState</span>(<span class="integer">0</span>);
  <span class="keyword">return</span> <span class="tag">&lt;div&gt;</span>&#123;<span
							class="function">fibonacci</span
						>(<span class="variable">count</span>)&#125;<span class="tag">&lt;/div&gt;</span>;
&#125;;
        </pre>
				{:else if language === 'rust'}
					<pre>
<span class="keyword">use</span> <span class="variable">std</span>::<span class="variable">io</span
						>;

<span class="comment">// Calculate the nth Fibonacci number</span>
<span class="keyword">fn</span> <span class="function">fibonacci</span>(<span class="variable"
							>n</span
						>: <span class="type">u32</span>) -&gt; <span class="type">u32</span> &#123;
    <span class="keyword">match</span> <span class="variable">n</span> &#123;
        <span class="integer">0</span> =&gt; <span class="integer">0</span>,
        <span class="integer">1</span> =&gt; <span class="integer">1</span>,
        <span class="variable">_</span> =&gt; <span class="function">fibonacci</span>(<span
							class="variable">n</span
						> - <span class="integer">1</span>) + <span class="function">fibonacci</span>(<span
							class="variable">n</span
						> - <span class="integer">2</span>),
    &#125;
&#125;

<span class="keyword">fn</span> <span class="function">main</span>() &#123;
    <span class="keyword">let</span> <span class="keyword">mut</span> <span class="variable">n</span
						> = <span class="string">String</span>::<span class="function">new</span>();
    <span class="variable">io</span>::<span class="variable">stdin</span>().<span class="function"
							>read_line</span
						>(&amp;<span class="keyword">mut</span> <span class="variable">n</span>).<span
							class="function">unwrap</span
						>();
&#125;
        </pre>
				{/if}
			</div>
		</div>
		<div class="status-bar">
			<span>NORMAL</span>
			<span>master</span>
			<span>{language === 'javascript' ? 'JavaScript' : 'Rust'}</span>
			<span>14:1</span>
		</div>
	</div>
</div>

<style>
	.code-preview-container {
		width: 100%;
		margin: 2rem 0;
		font-family: 'Fira Code', 'Roboto Mono', 'Courier New', monospace;
	}

	.editor-window {
		background-color: var(--base00);
		color: var(--base05);
		border-radius: 8px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.editor-header {
		background-color: var(--base01);
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		position: relative;
	}

	.window-controls {
		display: flex;
		gap: 8px;
	}

	.control {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.control.close {
		background-color: #ff5f56;
	}
	.control.minimize {
		background-color: #ffbd2e;
	}
	.control.maximize {
		background-color: #27c93f;
	}

	.filename {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		color: var(--base04);
		font-size: 0.9rem;
	}

	.editor-content {
		display: flex;
		padding: 1rem 0;
		overflow-x: auto;
	}

	.gutter {
		display: flex;
		flex-direction: column;
		padding: 0 1rem;
		color: var(--base03);
		text-align: right;
		user-select: none;
		border-right: 1px solid var(--base01);
		background-color: var(--base00);
	}

	.code {
		padding-left: 1rem;
		flex: 1;
		overflow-x: auto;
	}

	pre {
		margin: 0;
		font-family: inherit;
		font-size: 1rem;
		line-height: 1.5;
	}

	.status-bar {
		background-color: var(--base01);
		color: var(--base04);
		padding: 0.25rem 1rem;
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
	}

	/* Syntax Highlighting */
	.comment {
		color: var(--base03);
		font-style: italic;
	}
	.keyword {
		color: var(--base0E);
	}
	.variable {
		color: var(--base08);
	}
	.string {
		color: var(--base0B);
	}
	.function {
		color: var(--base0D);
	}
	.integer {
		color: var(--base09);
	}
	.tag {
		color: var(--base0A);
	} /* Using base0A for classes/tags usually */
	.type {
		color: var(--base0A);
	}
</style>
