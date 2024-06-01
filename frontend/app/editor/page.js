'use client'

import styles from "./page.module.css"

import { z } from 'zod'
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

import Tiptap from '@/components/Tiptap'

const formSchema = z.object({
    description: z.string()
})

export default function Home() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: '',
        },
    })

    function onSubmit(values) {
        console.log(values)
    }

    return (
        <main className={styles.main}>
            <div className={styles.head}>
                <div className={styles.h1}>Create</div>
                <a className={styles.a} href='/'>Main</a>
            </div>

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
                                        <Tiptap />
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
