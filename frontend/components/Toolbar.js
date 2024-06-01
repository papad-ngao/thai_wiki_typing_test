'use client'

import styles from "./Toolbar.module.css"

export default function Toolbar({ editor }) {
    if (!editor) {
        return null
    }

    return (
        <div className={styles.container}>
            { /*
            <input
                type='color'
                onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                value={editor.getAttributes('textStyle').color}
                data-testid='setColor'
            ></input>
            */ }
            <button
                onClick={() => editor.chain().focus().setColor('#808080').run()}
                className={styles.button}
                data-testid="setGrey"
            >
                grey
            </button>
            <button
                onClick={() => editor.chain().focus().unsetColor().run()}
                className={styles.button}
                data-testid="unsetColor"
            >
                unsetColor
            </button>
        </div>
    )
}