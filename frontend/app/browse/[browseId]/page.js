'use client'
import React, { useEffect, useState } from 'react'
import styles from "./page.module.css"

export default function BrowseDetails({ params }) {
  // /*
  const [data, setData] = useState({})
  const [dataContent, setDataContent] = useState({})

  const post_req = async () => {
    const post_data = async() => {
      const response = await fetch(`http://localhost:8000/wikis/${params.browseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return response.json()
    }
    return await post_data()
  }

  useEffect(() => {
    post_req()
      .then((responded_data) => {
        setData(() => { return (responded_data) })
        setDataContent(() => { return (responded_data.content) })
      })
      .catch(() => {
        return ({})
      })
  }, [])
  // */

  return (
    <div className={styles.main}>
      <div className={styles.head}>
        <a className={styles.a} href='/browse'>Browse</a>
        <a className={styles.a} href='/'>Main</a>
      </div>
      <div className={styles.subhead}>
        <div className={styles.h1}>Browse "{data?.title}"</div>
      </div>
      <div className={styles.p}>
        {
          Object.keys(dataContent).map((line) => {
            return (
              <div key={line} className={styles.lines}>
                <div className={styles.line_fl}>
                  {Object.keys(dataContent[line]).map((wor) => {
                    const sentence_object = {}
                    let idx = 1
                    dataContent[line][wor]
                      .substring(3,
                        dataContent[line][wor].length)
                        .split('-')
                        .map((elem) => {
                          sentence_object[idx] = elem
                          idx += 1
                        })
                    return (
                      <div key={wor} className={
                        (dataContent[line][wor]
                          .substring(0, 3) == '!ty')
                        ? styles.tysp : styles.sksp
                      }>
                        {
                        (dataContent[line][wor]
                          .substring(0, 3) == '!ty')
                          ? (
                            Object.keys(
                              sentence_object).map((th_wor) => {
                              return (
                                <div
                                  key={th_wor}
                                  className={styles.wor}
                                >
                                  {sentence_object[th_wor]}
                                </div>
                              )
                            })) : (
                            dataContent[line][wor]
                              .substring(3,
                                dataContent[line][wor].length)
                                .replace(/ /g, '\u2022'))
                        }
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
