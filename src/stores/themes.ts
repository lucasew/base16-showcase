import { writable } from "svelte/store";
import { Maybe, Theme } from "../Model";

const _themeStore = writable<Maybe<Record<string,Theme>>>(null);

const themeStore = {
  subscribe: _themeStore.subscribe.bind(_themeStore)
};

function handleOneStructure(obj: any) {
    const slug = obj.scheme || obj.slug
    const {author} = obj
    const colors = obj.colors || obj
    const {
        base00,
        base01,
        base02,
        base03,
        base04,
        base05,
        base06,
        base07,
        base08,
        base09
    } = colors
    const base0a = colors.base0a || colors.base0A
    const base0b = colors.base0b || colors.base0B
    const base0c = colors.base0c || colors.base0C
    const base0d = colors.base0d || colors.base0D
    const base0e = colors.base0e || colors.base0E
    const base0f = colors.base0f || colors.base0F
    const theme: Theme = {
        author,
        name: slug,
        colors: {
            base00,
            base01,
            base02,
            base03,
            base04,
            base05,
            base06,
            base07,
            base08,
            base09,
            base0a,
            base0b,
            base0c,
            base0d,
            base0e,
            base0f
        }
    }
    _themeStore.update((old) => {
        return {
            ...(old || {}),
            [slug]: theme
        }
    })
}

function handleFilesInput(_files: FileList) {
    let files: File[] = []
    for (let i = 0; i < _files.length; i++) {
        files.push(_files.item(i))
    }
    return Promise.all(files.map(async file => {
        switch (file.type) {
            case "application/json":
                const json = JSON.parse(await file.text())
                if (json.slug === undefined) {
                    Object.values(json).map(handleOneStructure)
                } else {
                    handleOneStructure(json)
                }
                break
            case "application/x-yaml":
                const yaml = await file.text()
                // It's safe (i expect) to parse it as only one level depth
                let structure = {}
                yaml.split("\n").map(line => line.split(":")).forEach(([key, value]) => {
                    if (key.trim().length > 0) {
                        structure[key] = JSON.parse(value)
                    }
                })
                handleOneStructure(structure)
                break
            default:
                return
        }
        // const text = await file.text()
    }))
}
document.addEventListener('drop', (ev: DragEvent) => {
    ev.preventDefault()
    handleFilesInput(ev.dataTransfer.files)
})

document.addEventListener('dragover', (ev) => {
    ev.preventDefault()
})

let doubleclickEngaged = false
document.addEventListener('dblclick', () => {
    if (!doubleclickEngaged) {
        document.getElementById("data-input").addEventListener('change', (ev: InputEvent) => {
            handleFilesInput((ev.target as HTMLInputElement).files)
        })
        doubleclickEngaged = true
    }
    document.getElementById("data-input").click()
})

export default themeStore;
