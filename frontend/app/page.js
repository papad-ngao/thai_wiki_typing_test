'use client'

import { useState, useEffect, useRef } from "react"
import styles from "./page.module.css"
import {
  lyrs,
  thcs,
  accu_idx,
  format_date_time,
  get_data_length
} from '@/components/transform/modify'
import { ServerInsertedHTMLContext } from "next/navigation"

export default function Home() {
  const [data, setData] = useState({})
  const root_obj = accu_idx(data)

  const ref = useRef(null)
  const [txt, setTxt] = useState('')
  const [num, setNum] = useState({
    "run": 0,
    "total": 0
  })
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedValue, setSelectedValue] = useState('all')
  const intervalIdRef = useRef(null)
  const startTimeRef = useRef(0)

  const handleEvent = event => {
    setTxt(() => event.target.value.split('\n')[
      event.target.value.split('\n').length - 1
    ])

    if (!isRunning) {
      startTimeRef.current = Date.now()
      setIsRunning(() => {
        return true
      })
    }
    if (event.target.value.length >= root_obj["total"]) {
      setIsRunning(() => {
        return false
      })
    }
    if ((event.target.value.length - root_obj["total"]) == 1) {
      if (!isRunning) {
        setTxt(() => { return ('') })
      }
    }

  }

  const handleRetry = event => {
    setTxt(() => '')
    setIsRunning(() => { return false })
    setElapsedTime(() => 0)
    return () => {
      clearInterval(intervalIdRef.current)
    }
  }

 const total_words = get_data_length(data)

  const post_req = async (req_body) => {
    const post_data = async() => {
      const response = await fetch('http://localhost:8000/pickarticle', {
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
    if (Object.keys(data).length == 0) {
      post_req({ "length_condition": "1-160" })
        .then((responded_data) => {
          setData(() => { return (responded_data["picked_obj"]["content"]) })
        })
    }

    let run_val = 0
    Object.keys(data).map((line) => {
      Object.keys(data[line]).map((outer_wor) => {
        const outer_element = data[line][outer_wor]
        if (outer_element.substring(0, 3) == '!ty') {
          const element = outer_element.substring(3, outer_element.length).replace(/-$/g, '')
          let base_len = (
            root_obj["root"][line][(
              (1000 + parseInt(outer_wor)) + ''
            ).substring(1, (
              (1000 + parseInt(outer_wor)) + ''
            ).length)])
          element.split('-').map((wor) => {
            if (txt.length >= base_len) {
              const match_val = (txt.substring(base_len, base_len + wor.length) == wor) ? 1 : 0
              run_val += match_val
              console.log(`${match_val} txt.substring(${base_len}, ${base_len + wor.length}): ${
                txt.substring(base_len, base_len + wor.length)
              } ${wor}`)
            }
            base_len += wor.length
          })
        }
      })
    })

    setNum(() => {
      return {
        "run": run_val,
        "total": (total_words == 0) ? '-' : total_words
      }
    })

    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(
          Date.now() - startTimeRef.current)
      }, 100)
    }
    return () => {
      clearInterval(intervalIdRef.current)
    }
  }, [txt])

  return(
    <div className={styles.main}>
      <div className={styles.head}>
        <div className={styles.h1}>Main</div>
        <a className={styles.a} href='/editor'>Editor</a>
        <a className={styles.a} href='/browse'>Browse</a>
      </div>
      <p className={styles.subhead}>
        {format_date_time(elapsedTime)} || {num.run}/{num.total}
        { /* &nbsp;|| JSON.stringify({ "length_condition": {
          "all": "1-160",
          "short": "1-40",
          "medium": "41-80",
          "long": "81-120",
          "extra": "121-160"
        }[selectedValue] }) */ }
        <select
          value={selectedValue}
          onChange={(event) => {
            setSelectedValue(() => {
              return (event.target.value)
            })

            // copied from re-pick button
            setTxt(() => { return ('') })
            setIsRunning(() => { return false })
            setElapsedTime(() => { return (0) })
            post_req({ "length_condition": {
              "all": "1-160",
              "short": "1-40",
              "medium": "41-80",
              "long": "81-120",
              "extra": "121-160"
            }[event.target.value] })
              .then((responded_data) => {
                setData(() => { return (responded_data["picked_obj"]["content"]) })
                setNum(() => { return {
                  "run": 0,
                  "total": get_data_length(responded_data["picked_obj"]["content"])
                } })
              })
            return () => {
              clearInterval(intervalIdRef.current)
            }
            // =========================
          }}
        >
            <option value="all">all</option>
            <option value="short">short</option>
            <option value="medium">medium</option>
            <option value="long">long</option>
            <option value="extra">extra</option>
        </select>
        <button className={styles.a} onClick={() => {
          setTxt(() => { return ('') })
          setIsRunning(() => { return false })
          setElapsedTime(() => { return (0) })
          post_req({ "length_condition": {
            "all": "1-160",
            "short": "1-40",
            "medium": "41-80",
            "long": "81-120",
            "extra": "121-160"
          }[selectedValue] })
            .then((responded_data) => {
              setData(() => { return (responded_data["picked_obj"]["content"]) })
              setNum(() => { return {
                "run": 0,
                "total": get_data_length(responded_data["picked_obj"]["content"])
              } })
            })
          return () => {
            clearInterval(intervalIdRef.current)
          }
        }}>re-pick</button>
        <button className={styles.a} onClick={handleRetry}>retry</button>
      </p>
      <div className={styles.p}>
        { (txt.length < root_obj["total"]) ? Object.keys(data).map((line) => {
          const lyrs_data_line = lyrs(data[line])
          const lyr_c = lyrs_data_line["lyr_c"]
          const lyr_b = lyrs_data_line["lyr_b"]
          const lyr_a = lyrs_data_line["lyr_a"]
          let ttl_len = 0
          if ((parseInt(line) + 2) > parseInt(Object.keys(data)[Object.keys(data).length - 1])) {
            ttl_len = root_obj["total"]
          } else {
            let nxl = (1000 + (parseInt(line) + 2)) + ''
            nxl = nxl.substring(1, nxl.length)
            ttl_len = root_obj["root"][nxl][
              Object.keys(root_obj["root"][nxl])[0]
            ]
          }
          if (ttl_len > txt.length) {
            return (
              <div key={line} className={styles.lines}>
                <div className={styles.line_fl}>
                  { Object.keys(lyr_c).map((wor_c) => {
                    const outer_wor_c = wor_c
                    const accu_idx_val = root_obj["root"][line][wor_c]
                    if (typeof(lyr_c[wor_c]) == 'object') {
                      const lyr_c_obj = {}
                      const lyr_c_arr = lyr_c[wor_c]["front"]
                        .split('-')
                      const base_len_arr = []
                      let base_len_int = 0
                      let idx = 0
                      for (let i = 0; i < lyr_c_arr.length;
                        i++) {
                        if (lyr_c_arr[i].length > 0) {
                          lyr_c_obj[idx] = lyr_c_arr[i]
                          base_len_int += lyr_c_arr[i].length
                          base_len_arr.push(base_len_int)
                          idx += 1
                        }
                      }
                      return (
                        <span
                          key={wor_c}
                          className={`${
                            styles.tysp
                          } ${
                            styles.lyr_c
                          }`}
                        >{
                          Object.keys(lyr_c_obj)
                            .map((wor_c) => {
                            const sntnce = {}
                            let stni = 0
                            thcs(lyr_c_obj[wor_c]).split('-').map((item) => {
                              sntnce[stni] = item
                              stni += item.length
                            })
                            /*
                            if (txt.length >= (
                              accu_idx_val + base_len_arr[wor_c]
                            )) {
                              console.log(`txt.substring(${
                                accu_idx_val + base_len_arr[wor_c]
                                - lyr_c_obj[wor_c].length
                              }:${
                                accu_idx_val + base_len_arr[wor_c]
                              }): "${
                                txt.substring(
                                  accu_idx_val + base_len_arr[wor_c]
                                    - lyr_c_obj[wor_c].length,
                                  accu_idx_val + base_len_arr[wor_c]
                                )
                              }" ==  ${
                                lyr_c_obj[wor_c]
                              }`)
                            }
                            */
                            return (
                              <span
                                key={wor_c}
                                className={styles.wor}
                              >{Object.keys(sntnce).map((cs) => {
                                let added_style = styles.unknown_result
                                let cspd = 1
                                if (sntnce[cs].length == 3) {
                                  if (
                                    (sntnce[cs][2] == 'อำ'[1])
                                    && (
                                      (sntnce[cs][1] >= 'อ่'[1])
                                      && (sntnce[cs][1] <= 'อ๋'[1])
                                    )
                                  ) {
                                    cspd = 2
                                  }
                                }
                                if (txt.length > (
                                  (accu_idx_val + base_len_arr[wor_c]
                                  + parseInt(cs) - lyr_c_obj[wor_c].length)
                                  + (sntnce[cs].length - cspd)
                                )) {
                                  added_style = styles.correct_result
                                  if (txt[
                                    (accu_idx_val + base_len_arr[wor_c]
                                    + parseInt(cs) - lyr_c_obj[wor_c].length)
                                    + (sntnce[cs].length - cspd)
                                  ] != sntnce[cs][sntnce[cs].length - 1]) {
                                    added_style = styles.wrong_result
                                  }
                                }
                                return (
                                  <span key={cs} className={added_style}>{sntnce[cs]}</span>
                                )
                              })}</span>
                            )
                          })
                        }</span>
                      )
                    } else {
                      return (
                        <span
                          key={wor_c}
                          className={styles.sksp}
                        >
                          {lyr_c[wor_c].substring(
                            3, lyr_c[wor_c].length)
                            .replace(/ /g, '\u2022')}
                        </span>
                      )
                    }
                  }) }
                </div>
                <div className={`${styles.line_fl} ${styles.fl_b}`}>
                  { Object.keys(lyr_b).map((wor_b) => {
                    const accu_idx_val = root_obj["root"][line][wor_b]
                    if (typeof(lyr_b[wor_b]) == 'object') {
                      const outer_wor_b = wor_b
                      const lyr_b_obj = {}
                      const lyr_b_arr = lyr_b[wor_b]["front"]
                        .split('-')
                      let base_len_int = 0
                      let idx = 0
                      for (let i = 0; i < lyr_b_arr.length;
                        i++) {
                        if (lyr_b_arr[i].length > 0) {
                          lyr_b_obj[idx] = lyr_b_arr[i]
                          base_len_int += lyr_b_arr[i].length
                          idx += 1
                        }
                      }
                      const lyr_b_arr_c = lyr_c[wor_b]["front"].split('-')
                      const base_len_arr_c = []
                      base_len_int = 0
                      for (let i = 0; i < lyr_b_arr_c.length; i++) {
                        if (lyr_b_arr_c[i].length > 0) {
                          base_len_int += lyr_b_arr_c[i].length
                          base_len_arr_c.push(base_len_int)
                        }
                      }
                      return (
                        <span
                          key={wor_b}
                          className={`${
                            styles.tysp
                          } ${
                            styles.lyr_b
                          }`}
                        >{
                          Object.keys(lyr_b_obj)
                            .map((wor_b) => {
                            const sntnce = {}
                            let stni = 0
                            thcs(lyr_b_obj[wor_b]).split('-').map((item) => {
                              sntnce[stni] = item
                              stni += 1
                            })
                            return (
                              <span
                                key={wor_b}
                              >
                                {Object.keys(sntnce).map((cs) => {
                                  let trg_id = (
                                    accu_idx_val + base_len_arr_c[wor_b]
                                    - lyr_c[outer_wor_b]["front"].split('-')[wor_b].length
                                  )
                                  // /*
                                  let bvl = (
                                    lyr_b[outer_wor_b]["back"]
                                      .split('-')[wor_b].split(',')[cs]
                                  )
                                  if (bvl != 'x') {
                                    trg_id += parseInt(bvl)
                                  }
                                  // */
                                  // let bvl = 0
                                  let added_style = styles.unknown_result
                                  if (txt.length > trg_id) {
                                    added_style = styles.correct_result
                                  }
                                  const trgch = (
                                    (accu_idx_val
                                      + base_len_arr_c[wor_b])
                                    - lyr_c[outer_wor_b]["front"]
                                      .split('-')[wor_b].length
                                    + parseInt(bvl)
                                  )
                                  if (typeof(txt[trgch]) == 'string') {
                                    if (txt[trgch] != (
                                      lyr_c[outer_wor_b]["front"].split('-')[wor_b][parseInt(bvl)]
                                    )) {
                                      added_style = styles.wrong_result
                                    }
                                  }
                                  return (
                                    <span key={cs} className={added_style}>{sntnce[cs]}</span>
                                  )
                                })}
                              </span>
                            )
                          })
                        }</span>
                      )
                    } else {
                      return (
                        <span
                          key={wor_b}
                          className={styles.sksp}
                        >
                          {lyr_b[wor_b].substring(
                            3, lyr_b[wor_b].length)
                            .replace(/ /g, '\u2022')}
                        </span>
                      )
                    }
                  }) }
                </div>
                <div className={`${styles.line_fl} ${styles.fl_a}`}>
                  { Object.keys(lyr_a).map((wor_a) => { // 346G
                    const accu_idx_val = root_obj["root"][line][wor_a]
                    if (typeof(lyr_a[wor_a]) == 'object') {
                      const outer_wor_a = wor_a
                      const lyr_a_obj = {}
                      const lyr_a_arr = lyr_a[wor_a]["front"]
                        .split('-')
                      const base_len_arr = []
                      let base_len_int = 0
                      let idx = 0
                      for (let i = 0; i < lyr_a_arr.length;
                        i++) {
                        if (lyr_a_arr[i].length > 0) {
                          lyr_a_obj[idx] = lyr_a_arr[i]
                          base_len_int += lyr_a_arr[i].length
                          base_len_arr.push(base_len_int)
                          idx += 1
                        }
                      }
                      const lyr_a_arr_c = lyr_c[wor_a]["front"].split('-')
                      const base_len_arr_c = []
                      base_len_int = 0
                      for (let i = 0; i < lyr_a_arr_c.length;
                        i++) {
                        if (lyr_a_arr_c[i].length > 0) {
                          base_len_int += lyr_a_arr_c[i].length
                          base_len_arr_c.push(base_len_int)
                        }
                      }
                      return (
                        <span
                          key={wor_a}
                          className={`${
                            styles.tysp
                          } ${
                            styles.lyr_a
                          }`}
                        >{
                          Object.keys(lyr_a_obj)
                            .map((wor_a) => {
                              const sntnce = {}
                              let stni = 0
                              thcs(lyr_a_obj[wor_a]).split('-').map((item) => {
                                sntnce[stni] = item
                                stni += item.length
                              })
                              return (
                                <span
                                  key={wor_a}
                                >{Object.keys(sntnce).map((cs) => {
                                  let added_style = styles.unknown_result
                                  let bvl = (
                                    lyr_a[outer_wor_a]["back"]
                                      .split('-')[wor_a].split(',')[cs]
                                  )
                                  if (txt.length > (
                                    (accu_idx_val
                                      + base_len_arr_c[wor_a])
                                    - lyr_c[outer_wor_a]["front"]
                                      .split('-')[wor_a].length
                                    + parseInt(bvl)
                                  )) {
                                    added_style = styles.correct_result
                                  }
                                  const trgch = (
                                    (accu_idx_val
                                      + base_len_arr_c[wor_a])
                                    - lyr_c[outer_wor_a]["front"]
                                      .split('-')[wor_a].length
                                    + parseInt(bvl)
                                  )
                                  if (typeof(txt[trgch]) == 'string') {
                                    let ref_txt_c = lyr_c[outer_wor_a]["front"].split('-')[wor_a]
                                    let ref_txt = lyr_a[outer_wor_a]["front"].split('-')[wor_a]
                                    let nstn = txt[trgch]
                                    if (nstn != (
                                      ref_txt[cs]
                                    )) {
                                      added_style = styles.wrong_result
                                    }
                                  }
                                  if (sntnce[cs] == 'า') {
                                    return (
                                      <span key={cs} className={styles.unset}>{
                                        sntnce[cs]
                                      }</span>
                                    )
                                  } else {
                                    return (
                                      <span key={cs} className={added_style}>{
                                        sntnce[cs]
                                      }</span>
                                    )
                                  }
                                })}</span>
                              )})
                        }</span>
                      )
                    } else {
                      return (
                        <span
                          key={wor_a}
                          className={styles.sksp}
                        >
                          {lyr_a[wor_a].substring(
                            3, lyr_a[wor_a].length)
                            .replace(/ /g, '\u2022')}
                        </span>
                      )
                    }
                  }) }
                </div>
              </div>
            )
          }
        }) : (
          <div className={styles.h1}>{ (
            (Object.keys(data).length > 0)
          ) ? `${
            (num.run * (60 / Math.floor(elapsedTime / 1000))).toFixed(1)
          } WPM` : '-'}</div>
        ) }
      </div>
      <textarea
        className={styles.text_input}
        onChange={handleEvent}
        value={txt}
      >
      </textarea>
    </div>
  )
}