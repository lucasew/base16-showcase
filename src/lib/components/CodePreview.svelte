<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { EditorState, Compartment } from "@codemirror/state";
  import { javascript } from "@codemirror/lang-javascript";
  import { rust } from "@codemirror/lang-rust";
  import { createBase16Theme } from "$lib/codemirrorTheme";
  import type { Theme } from "$lib/Model";

  export let theme: Theme;
  export let language: "javascript" | "rust" = "javascript";

  let editorContainer: HTMLElement;
  let view: EditorView;

  const themeCompartment = new Compartment();
  const languageCompartment = new Compartment();

  const EXAMPLE_JS = `import React, { useState } from 'react';

// Calculate the nth Fibonacci number
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const App = () => {
  const [count, setCount] = useState(0);
  return <div>{fibonacci(count)}</div>;
};`;

  const EXAMPLE_RUST = `use std::io;

// Calculate the nth Fibonacci number
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    let mut n = String::new();
    io::stdin().read_line(&mut n).unwrap();
}`;

  $: initialDoc = language === "javascript" ? EXAMPLE_JS : EXAMPLE_RUST;

  $: cssVars = `
    --b1: ${theme.colors.base00}; /* base-100 */
    --b2: ${theme.colors.base01}; /* base-200 */
    --b3: ${theme.colors.base02}; /* base-300 */
    --bc: ${theme.colors.base05}; /* base-content */
  `;

  onMount(() => {
    const langExtension = language === "javascript" ? javascript() : rust();
    const themeExtension = createBase16Theme(theme);

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        basicSetup,
        themeCompartment.of(themeExtension),
        languageCompartment.of(langExtension),
        EditorView.editable.of(false),
        EditorView.lineWrapping,
        EditorView.theme({
            "&": { backgroundColor: "transparent !important" },
            ".cm-gutters": { backgroundColor: "transparent !important" }
        })
      ],
    });

    view = new EditorView({
      state,
      parent: editorContainer,
    });
  });

  onDestroy(() => {
    if (view) {
      view.destroy();
    }
  });

  $: if (view && theme) {
    view.dispatch({
      effects: themeCompartment.reconfigure(createBase16Theme(theme))
    });
  }
</script>

<div class="mockup-window border border-base-300 w-full" style={cssVars}>
  <div class="bg-base-100 p-0 overflow-hidden">
     <div bind:this={editorContainer} class="w-full h-full text-base"></div>
  </div>
</div>

<style>
    /* DaisyUI overrides using styles to ensure they apply to the specific instance */
    .mockup-window {
        background-color: var(--b2);
        border-color: var(--b3);
    }
    .bg-base-100 {
        background-color: var(--b1);
    }
</style>
