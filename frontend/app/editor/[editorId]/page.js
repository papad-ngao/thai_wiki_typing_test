'use client'

import styles from "./page.module.css"

import { z } from 'zod'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/components/ui/form' 
import { Button } from '@/components/ui/button'

import Tiptap from '@/components/editor_details/Tiptap'

const formSchema = z.object({
    description: z.string()
})

export default function EditorDetail({ params }) {
    const [data, setData] = useState({})

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: '',
        },
    })

    function onSubmit(values) {
        console.log(values)
    }
    const post_req = async () => {
        const post_data = async() => {
        const response = await fetch(`http://localhost:8000/wikis/${params.editorId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        return response.json()
        }
        return await post_data()
    }

    /* ================================================================
    post_req()
      .then((responded_data) => {
        setData(() => { return (responded_data) })
        setDataContent(() => { return (responded_data.content) })
      })
      .catch(() => {
        return ({})
      })
    ================================================================ */

    useEffect(() => {
        post_req()
            .then((responded_data) => {
                setData(() => { return (responded_data) })
                console.log(responded_data)
            })
            .catch(() => {
                return ({})
            })
    }, [])

    return (
        <main className={styles.main}>
            <div className={styles.head}>
                <div className={styles.h1}>Create</div>
                <a className={styles.a} href='/browse'>Browse</a>
                <a className={styles.a} href='/'>Main</a>
            </div>

            {/* <div className={styles.sub_head}>
                "{data?._id}"
            </div> */}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <FormField
                        control={form.control}
                        name='description'
                        render={
                            ({ field }) => (
                                <FormItem>
                                    { /*
                                    <FormLabel>
                                        Description
                                    </FormLabel>
                                    */ }
                                    <FormControl>
                                        {(data?._id == params.editorId) ? (
                                            <Tiptap
                                                params={params.editorId}
                                                data_content={data}
                                            />
                                        ) : <div>invalid entry</div>}
                                        {/* <Tiptap params={params.editorId} /> */}
                                        { /*
                                        <Input
                                            placeholder='shadcn'
                                            {...field}
                                        />
                                        */ }
                                    </FormControl>
                                    { /*
                                    <FormDescription>
                                        This is your description.
                                    </FormDescription>
                                    */ }
                                    <FormMessage />
                                </FormItem>
                            )
                        }
                    />
                    { /*
                    <Button type='submit'>
                        Submit
                    </Button>
                    */ }
                </form>
            </Form>
        </main>
    )
}