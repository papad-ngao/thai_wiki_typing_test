export default function Home() {
  return(
    <div className={styles.main}>
      <div className={styles.p}>
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
      </div>
    </div>
  )
}