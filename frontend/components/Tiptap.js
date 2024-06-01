'use client'

import styles from "./Tiptap.module.css"

import { useRef, useEffect, useState } from 'react'

import { useEditor, EditorContent, } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

import {
    wrob,
    get_data_length,
    get_curent_local_timestamp
} from '@/components/transform/modify'

export default function Tiptap() {
    const [selectedValue, setSelectedValue] = useState('remove')
    const [wordCount, setWordCount] = useState('-')
    const [info, setInfo] = useState({
        "count": 0,
        "info": "-"
    })

    const ref = useRef(null)
    const keyRef = useRef(null)

    const handleDropdownChange = (event) => {
        setSelectedValue(event.target.value)
    }
    const handleBtn = (event) => {
        const src_demo = (
            editor.getText()
        )
        let demo = src_demo.replace(/ /g, '•')
        let formatted_demo = ''
        for (let i = 0; i < demo.length; i++) {
            let c = demo[i]
            if (i > 0) {
                if (
                    (
                        (demo.charCodeAt(i) < 'ก'.charCodeAt(0))
                        || (demo.charCodeAt(i) > ('ก'.charCodeAt(0) + 90))
                    )
                    && (
                        (demo.charCodeAt(i - 1) >= 'ก'.charCodeAt(0))
                        && (demo.charCodeAt(i - 1) <= ('ก'.charCodeAt(0) + 90))
                    )
                ) {
                    c = `<span style="color: #CCCCCC">${demo[i]}`
                } else if (
                    (
                        (demo.charCodeAt(i) >= 'ก'.charCodeAt(0))
                        && (demo.charCodeAt(i) <= ('ก'.charCodeAt(0) + 90))
                    )
                    && (
                        (demo.charCodeAt(i - 1) < 'ก'.charCodeAt(0))
                        || (demo.charCodeAt(i - 1) > ('ก'.charCodeAt(0) + 90))
                    )
                ) {
                    c = `</span>${demo[i]}`
                }
            }
            formatted_demo += c
        }
        editor.chain().focus().clearContent().insertContent(`<p>${formatted_demo}</p>`).run()
    }
    function get_res(responded_data) {
        let resp_str = ''
        let resp_obj_key = Object.keys(responded_data)
        const key_lead = []
        for (let i = 0; i < resp_obj_key.length; i++) {
            if (!key_lead.includes(resp_obj_key[i].substring(0, 2))) {
                key_lead.push(resp_obj_key[i].substring(0, 2))
            }
        }
        for (let i = 0; i < key_lead.length; i++) {
            if (resp_obj_key.includes(key_lead[i] + '_ty')) {
                resp_str += responded_data[key_lead[i] + '_ty'] + '<span style="color: rgb(204, 204, 204)">'
            }
            if (resp_obj_key.includes(key_lead[i] + '_sk')) {
                resp_str += responded_data[key_lead[i] + '_sk'] + '</span>'
            }
        }
        resp_str = '<p>' + resp_str
        resp_str += '</p>'

        return(resp_str)
    }
    const handleWordSeperateBtn = async () => {
        const data = editor.getHTML()

        let ldta = data
        if ((ldta.substring(0, 3)) == '<p>') {
            ldta = ldta.substring(3, ldta.length)
        }
        if ((ldta.substring(ldta.length, (ldta.length - 4))) == '</p>') {
            ldta = ldta.substring(0, (ldta.length - 4))
        }
        const req_body = {}
        const arr = ldta.split('</span>')
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            const in_arr = item.split('<span style="color: rgb(204, 204, 204)">')
            for (let j = 0; j < in_arr.length; j++) {
                const in_item = in_arr[j]
                let nmtx = (100 + i) + ''
                req_body[`${
                    nmtx.substring(1, nmtx.length)
                }_${
                    ['ty', 'sk'][j]
                }`] = in_item
            }
        }
        const post_data = async() => {
            const response = await fetch('http://localhost:8000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "info": req_body })
            })
            return response.json()
        }
        const responded_data = await post_data()
        const resp_str = get_res(responded_data)

        editor.chain().focus().clearContent().insertContent(resp_str).run()

        console.log(`${JSON.stringify(responded_data, null, 2)}`)
        console.log(`${resp_str}`)
    }

    function wrapText(text, lineLength) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + word).length <= lineLength) {
                currentLine += (currentLine.length ? ' ' : '') + word;
            } else {
                lines.push(currentLine.replace(/ /g, ''));
                currentLine = word;
            }
        }

        if (currentLine.length) {
            lines.push(currentLine.replace(/ /g, ''));
        }

        return lines;
    }

    function fmt_out(html_element) {
        if (html_element.substring(0, 3) == '<p>') {
            html_element = html_element.substring(3, html_element.length)
        }
        if (html_element.substring((html_element.length - 4), html_element.length) == '</p>') {
            html_element = html_element.substring(0, (html_element.length - 4))
        }

        html_element = html_element
            .replace(/•/g, ' !sp')
            .replace(/<span style="color: rgb\(204, 204, 204\)">/g, ' !sk')
            .replace(/<\/span>/g, ' !ty')
        html_element = wrapText(html_element, 60)
        let ret_obj = {}

        for (let i = 0; i < html_element.length; i++) {
            let idx_str = (1000 + i) + ''
            ret_obj[idx_str.substring(1, idx_str.length)] = html_element[i]
        }

        const ret_strfy = JSON.stringify(JSON.parse(`{ "key": { "title": "${
            keyRef.current.value
        }", "content": ${
            JSON.stringify(wrob(ret_obj))
        }, "word_num": ${JSON.stringify(
            get_data_length(wrob(ret_obj))
        )}, "created_time": "${get_curent_local_timestamp()}" } }`), null, 4)

        return ',\n    ' + ret_strfy.substring(13, (ret_strfy.length - 2))
    }

    /*
    const req_body = {
        "length_condition_set": "1-40 41-80 81-120 121-160"
    }
    const post_req = async () => {
        const post_data = async() => {
            const response = await fetch('http://localhost:8000/insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "info": req_body })
            })
            return response.json()
        }
        return await post_data()
    }
    */

    const handleCopyBtn = async () => {
        const req_insert_body = JSON.parse(fmt_out(editor.getHTML()).substring(2,
            fmt_out(editor.getHTML()).length))
        const post_insert_req = async() => {
            const post_data = async() => {
                const response = await fetch('http://localhost:8000/insert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req_insert_body)
                })
                return response.json()
            }
            return await post_data()
        }
        await post_insert_req()
        /*
        navigator.clipboard.writeText(fmt_out(editor.getHTML()))
        console.log(JSON.parse(fmt_out(editor.getHTML()).substring(2,
            fmt_out(editor.getHTML()).length)))
        */
    }
    const handleChange = () => {
        let html_element = editor.getHTML()
        if (html_element.substring(0, 3) == '<p>') {
            html_element = html_element.substring(3, html_element.length)
        }
        if (html_element.substring((html_element.length - 4), html_element.length) == '</p>') {
            html_element = html_element.substring(0, (html_element.length - 4))
        }

        html_element = html_element
            .replace(/•/g, ' !sp')
            .replace(/<span style="color: rgb\(204, 204, 204\)">/g, ' !sk')
            .replace(/<\/span>/g, ' !ty')
        html_element = wrapText(html_element, 60)
        let ret_obj = {}

        for (let i = 0; i < html_element.length; i++) {
            let idx_str = (1000 + i) + ''
            ret_obj[idx_str.substring(1, idx_str.length)] = html_element[i]
        }

        setWordCount(() => { return ((get_data_length(wrob(ret_obj))) + '') })
        // */
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color
        ],
        content: (''),
        editorProps: {
            attributes: {
                class:
                    "rounded-md border w-[900px] h-[400px] border-input bg-background px-3 py-3 overflow-y-scroll"
            },
        },
    })

    // /*
    const req_body = {
        "length_condition_set": "1-40 41-80 81-120 121-160"
    }
    const post_req = async () => {
        const post_data = async() => {
            const response = await fetch('http://localhost:8000/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "info": req_body })
            })
            return response.json()
        }
        return await post_data()
    }

    useEffect(() => {
        if (info.count == 0) {
            post_req().then((response) => {
                setInfo(() => {
                    return {
                        "count": info.count + 1,
                        "info": response
                    }
                })
            })
        }

        const handleClick = event => {
            const selection = window.getSelection().getRangeAt(0);
            const selectedText = selection.toString();
            if (selectedText.length > 0) {
                console.log(`"${selectedValue}"`)
                if (selectedValue == 'grey') {
                    editor.chain().focus().setColor('#CCCCCC').run()
                    console.log('#setColor(\'#CCCCCC\')')
                } else {
                    editor.chain().focus().unsetColor().run()
                    console.log('#unsetColor()')
                }
            }
        }

        const element = ref.current

        element.addEventListener('mouseup', handleClick)

        return () => {
            element.removeEventListener('mouseup', handleClick)
        }
    }, [selectedValue, editor])

    return (
        <>
            <div>
                <p>
                    <button
                        onClick={handleBtn}
                        className={styles.button}
                    >
                        format
                    </button>
                    <button
                        onClick={handleWordSeperateBtn}
                        className={styles.button}
                    >
                        th-word-seperate
                    </button>
                    <input
                        className={styles.key_bar}
                        type="text" ref={keyRef}
                        placeholder="label"
                    />
                    <button
                        onClick={handleCopyBtn}
                        className={styles.button}
                    >
                        submit
                    </button>
                </p>
                <div className={styles.label}>
                    word count: {wordCount}, info: {info.info}
                </div>
                <div className={styles.desc} ref={ref}>
                    <EditorContent editor={editor} onKeyUp={handleChange} />
                </div>
                <select value={selectedValue} onChange={handleDropdownChange}>
                    <option value="grey">Change text color to grey</option>
                    <option value="remove">Remove text color decoration</option>
                </select>
                { /* <p>{selectedValue}</p> */ }
            </div>
        </>
    )
}