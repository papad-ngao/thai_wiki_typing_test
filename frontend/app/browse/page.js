'use client'

import React, { useEffect, useState } from 'react'
import styles from "./page.module.css"
import { sortObjectByCreatedTime } from "@/components/transform/modify"

function page() {

    // =============================================================
    const post_del_req = async (id) => {
        const post_data = async() => {
            const response = await fetch('http://localhost:8000/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "info": id })
            })
            return response.json()
        }
        return await post_data()
    }
    // =============================================================

    const handleQuery = (id) => {
        if (selectedValue == 'view') {
            window.location.replace(`/browse/${id}`, '_blank')
        } else if (selectedValue == 'edit') {
            window.location.replace(`/editor/${id}`, '_blank')
        } else if (selectedValue == 'delete') {
            post_del_req(id)
            location.reload()
        }
        // navigator.clipboard.writeText(id)
    }

    const handleDropdownChange = (event) => {
        setSelectedValue(() => { return (event.target.value) })
    }

    const req_body = {
        "length_condition": "1-160"
    }
    const post_req = async () => {
        const post_data = async() => {
            const response = await fetch('http://localhost:8000/wikis', {
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

    const [data, setData] = useState({})
    const [selectedValue, setSelectedValue] = useState('view')

    useEffect(() => {
        post_req()
            .then((responded_data) => {
                setData(() => { return (sortObjectByCreatedTime(responded_data)) })
            })
    }, [])

    return (
        <main className={styles.main}>
            <div className={styles.head}>
                <div className={styles.h1}>Browse</div>
                <a className={styles.a} href='/'>Main</a>
            </div>
            <select value={selectedValue} onChange={handleDropdownChange}>
                <option value="view">View Content</option>
                <option value="edit">Edit Content</option>
                <option value="delete">Delete Content</option>
            </select>
            <div className={styles.p}>
                {
                    (Object.keys(data).length > 0 ? (
                        Object.keys(data).map((item) => {
                            return (
                                <div
                                    key={item}
                                    className={styles.line_fl}
                                    onClick={() => { handleQuery(data[item]["_id"]) }}
                                >
                                    {data[item]["created_time"]}
                                    <br /> {data[item]["title"]}
                                    &nbsp;{data[item]["word_num"]}
                                </div>
                            )
                        })
                    ) : (
                        null
                    ))
                }
            </div>
        </main>
    )
}

export default page