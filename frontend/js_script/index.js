/*

*/

function fltr_wor(wor) {
    return wor
        .replace(/!ty/g, '')
        .replace(/!sk/g, '')
        .replace(/!sp/g, ' ')
}

function wrob(src) {
    const ret_obj = {}
    const src_object_keys_array = Object.keys(src)
    const lnlng = 60
    let stt = ''
    let itm = ''
    let obj_idx = 0
    let key_val = ''
    for (let i = 0; i < src_object_keys_array.length; i++) {
        const element = src[src_object_keys_array[i]]
        let wor = ''
        for (let j = 0; j < element.length; j++) {
            wor += element[j]
            if ((j + 3) < element.length) {
                const stt_i = element.substring((j + 1), (j + 4))
                if (
                    (stt_i == '!ty')
                    || (stt_i == '!sk')
                ) {
                        if ((itm + fltr_wor(wor)).length < lnlng) {
                            itm += wor
                        } else if ((itm + fltr_wor(wor)).length > lnlng) {
                            key_val = (1000 + obj_idx) + ''
                            ret_obj[key_val.substring(1, key_val.length)] = itm
                            obj_idx += 1
                            itm = wor
                        }
                        wor = ''
                }
            } else if ((j + 1) == element.length) {
                if ((itm + fltr_wor(wor)).length < lnlng) {
                    itm += wor
                } else if ((itm + fltr_wor(wor)).length > lnlng) {
                    key_val = (1000 + obj_idx) + ''
                    ret_obj[key_val.substring(1, key_val.length)] = itm
                    obj_idx += 1
                    itm = wor
                }
            }
            if ((wor == '!ty') || wor == '!sk') {
                stt = wor
            }
            if (element[j] == '-') {
                if (stt == '!ty') {
                    if (wor.length > 0) {
                        if ((itm + fltr_wor(wor)).length < lnlng) {
                            itm += wor
                        } else if (
                            ((itm + fltr_wor(wor)).length > lnlng)
                        ) {
                            key_val = (1000 + obj_idx) + ''
                            ret_obj[key_val.substring(1, key_val.length)] = itm
                            obj_idx += 1
                            itm = wor
                        }
                        wor = ''
                    }
                }
            }
        }
    }
    key_val = (1000 + obj_idx) + ''
    ret_obj[key_val.substring(1, key_val.length)] = itm
    obj_idx += 1
    const mod_ret_obj = {}
    const object_keys_ret_obj = Object.keys(ret_obj)
    for (let i = 0; i < object_keys_ret_obj.length; i++) {
        let element = ret_obj[object_keys_ret_obj[i]]
        if (
            (element.substring(0, 3) != '!ty')
            && (element.substring(0, 3) != '!sk')
        ) {
            element = '!ty' + element
        }
        const item_obj = {}
        let txt = ''
        let item_idx = 0
        for (let j = 0; j < element.length; j++) {
            txt += element[j]
            let breakpoint_found = 0
            if ((j + 3) < element.length) {
                if (
                    (element.substring((j + 1), (j + 4)) == '!ty')
                    || (element.substring((j + 1), (j + 4)) == '!sk')
                ) {
                    breakpoint_found = 1
                }
            } else if ((j + 1) == element.length) {
                breakpoint_found = 1
            }
            if (breakpoint_found == 1) {
                item_obj[item_idx] = txt.replace(/!sp/g, ' ')
                item_idx += 1
                txt = ''
            }
        }
        mod_ret_obj[object_keys_ret_obj[i]] = item_obj
    }
    return mod_ret_obj
}

function thflo(character) {
    const idx = (
        character.charCodeAt(0)
        - 'ก'.charCodeAt(0)
    )
    if (
        (idx == 48)
        || (
            (idx >= 50)
            && (idx <= 57)
        )
        || (
            (idx >= 70)
            && (idx <= 77)
        )
    ) {
        return true
    }
    return false
}

function thcs(thwo) {
    let txt = ''
    for (let i = 0; i < thwo.length; i++) {
        const element = thwo[i]
        if (i > 0) {
            if (!thflo(element)) {
                txt += '-'
            }
        }
        txt += element
    }
    return txt
}

function lyr_a(thwo) {
    const tycnt = thwo
        .substring(3, thwo.length)
        .split('-')
    let fltr_a = ''
    let back_a = ''
    for (let i = 0; i < tycnt.length; i++) {
        const element = tycnt[i]
            .replace(/\u0E33/g, 'า')
        for (let j = 0; j < element.length; j++) {
            const inner_elment = element[j]
            if (!thflo(inner_elment)) {
                fltr_a += inner_elment
                back_a += j + ','
            }
        }
        back_a = back_a.substring(0, (back_a.length - 1))
        if ((i + 1) < tycnt.length) {
            fltr_a += '-'
            back_a += '-'
        }
    }
    return {
        "front": fltr_a,
        "back": back_a
    }
}

function lyr_b(thwo) {
    const tycnt = thwo
        .substring(3, thwo.length)
        .split('-')
    let fltr_b = ''
    let back_b = ''
    for (let i = 0; i < tycnt.length; i++) {
        const element = tycnt[i]
        for (let j = 0; j < element.length; j++) {
            let stt = 1
            let spc = 0
            if (
                (j > 0)
                && ((j + 1) < element.length)
            ) {
                if (
                    (!thflo(element[j + 1]))
                    && (thflo(element[j]))
                    && (thflo(element[j - 1]))
                ) {
                    stt = 0
                }
            } else if ((j + 1) == element.length) {
                if (
                    (thflo(element[j]))
                    && (thflo(element[j - 1]))
                ) {
                    stt = 0
                }
            }
            if (stt == 1) {
                if (
                    (
                        ((
                            element.charCodeAt(j)
                            - 'ก'.charCodeAt(0)
                        ) >= 71)
                        && ((
                            element.charCodeAt(j)
                            - 'ก'.charCodeAt(0)
                        ) <= 74)
                    )
                    && ((
                        element.charCodeAt(j + 1)
                        - 'ก'.charCodeAt(0)
                    ) == 50)
                ) {
                    fltr_b += element[j + 1]
                    spc = 1
                }
                else {
                    fltr_b += element[j]
                }
                if (thflo(element[j])) {
                    back_b += (j + spc) + ','
                } else if ((j + 1) < element.length) {
                    if (!thflo(element[j + 1])) {
                        back_b += 'x,'
                    }
                } else if ((j + 1) == element.length) {
                    back_b += 'x,'
                }
            }
        }
        back_b = back_b.substring(0, (back_b.length - 1))
        if ((i + 1) < tycnt.length) {
            fltr_b += '-'
            back_b += '-'
        }
    }
    return {
        "front": fltr_b,
        "back": back_b
    }
}

function lyr_c(thwo) {
    const tycnt = thwo
        .substring(3, thwo.length)
        .split('-')
    let back_c = ''
    for (let i = 0; i < tycnt.length; i++) {
        const element = tycnt[i]
        for (let j = 0; j < element.length; j++) {
            let stt = 0
            if ((j + 1) < element.length) {
                if (!thflo(element[j + 1])) {
                    stt = 1
                }
            } else if ((j + 1) == element.length) {
                stt = 1
            }
            if (stt == 1) {
                if (j > 0) {
                    if (thflo(element[j]) && thflo(element[j - 1])) {
                        if (
                            (
                                ((
                                    element.charCodeAt(j - 1)
                                    - 'ก'.charCodeAt(0)
                                ) >= 71)
                                && ((
                                    element.charCodeAt(j - 1)
                                    - 'ก'.charCodeAt(0)
                                ) <= 74)
                            )
                            && ((
                                element.charCodeAt(j)
                                - 'ก'.charCodeAt(0)
                            ) == 50)
                        ) {
                            back_c += (j - 1) + ','
                        } else {
                            back_c += j + ','
                        }
                    } else {
                        back_c += 'x,'
                    }
                } else {
                    back_c += 'x,'
                }
            }
        }
        if ((i + 1) < tycnt.length) {
            back_c = back_c.substring(0, (back_c.length - 1))
            back_c += '-'
        }
    }
    return {
        "front": thwo.substring(3, thwo.length),
        "back": back_c
    }
}

function lyrs(thwo) {
    const object_keys_thwo = Object.keys(thwo)

    const thwo_lyr_a = {}
    for (let i = 0; i < object_keys_thwo.length; i++) {
        const element = thwo[i]
        const idx_a = (1000 + i) + ''
        if (element.substring(0, 3) == '!sk') {
            thwo_lyr_a[idx_a.substring(1, idx_a.length)] = element
        } else if (element.substring(0, 3) == '!ty') {
            thwo_lyr_a[idx_a.substring(1, idx_a.length)] = lyr_a(element)
        }
    }

    const thwo_lyr_b = {}
    for (let i = 0; i < object_keys_thwo.length; i++) {
        const element = thwo[i]
        const idx_b = (1000 + i) + ''
        if (element.substring(0, 3) == '!sk') {
            thwo_lyr_b[idx_b.substring(1, idx_b.length)] = element
        } else if (element.substring(0, 3) == '!ty') {
            thwo_lyr_b[idx_b.substring(1, idx_b.length)] = lyr_b(element)
        }
    }

    const thwo_lyr_c = {}
    for (let i = 0; i < object_keys_thwo.length; i++) {
        const element = thwo[i]
        const idx_c = (1000 + i) + ''
        if (element.substring(0, 3) == '!sk') {
            thwo_lyr_c[idx_c.substring(1, idx_c.length)] = element
        } else if (element.substring(0, 3) == '!ty') {
            thwo_lyr_c[idx_c.substring(1, idx_c.length)] = lyr_c(element)
        }
    }

    return {
        "lyr_a": thwo_lyr_a,
        "lyr_b": thwo_lyr_b,
        "lyr_c": thwo_lyr_c
    }
}

function accu_idx(wrob_src) {
    const object_keys_wrob_src = Object.keys(wrob_src)
    let totl_len = 0
    const root_obj = {}
    for (let i = 0; i < object_keys_wrob_src.length; i++) {
        const root_idx = (1000 + i) + ''
        const element = wrob_src[object_keys_wrob_src[i]]
        const object_keys_elements = Object.keys(lyrs(element)["lyr_c"])
        const inner_obj = {}
        for (let j = 0; j < object_keys_elements.length; j++) {
            const inner_element = lyrs(element)["lyr_c"][object_keys_elements[j]]
            const inner_idx = (1000 + j) + ''
            inner_obj[inner_idx.substring(
                1, inner_idx.length
            )] = totl_len
            if (typeof(inner_element) == 'object') {
                totl_len += inner_element['front'].replace(/-/g, '').length
            } else {
                totl_len += 1
            }
        }
        root_obj[root_idx.substring(1, root_idx.length)] = inner_obj
    }
    return root_obj
}

src = {
    "000": "แอร์บัส!sk!sp!tyเอ!sk!sp300-600!sp!tyเอส-ที!sk!sp(ST",
    "001": "!sp!tyย่อ-มา-จาก!sk!spSuper!spTransporter)!sp!tyหรือ!sk",
    "002": "!sp!tyแอร์บัส!sk!sp!tyเบลูกา!sk!sp(Beluga)!sp",
    "003": "!tyเป็น-เครื่องบิน-ของ-แอร์บัส-ที่-ปรับปรุง-มา-จาก-เครื่อง-แอร์บัส",
    "004": "!sk!spA300-600!sp!tyรุ่น-ลำตัว-กว้าง!sk!sp",
    "005": "!tyให้-มี-ช่อง-บรรทุก-ใหญ่-เป็น-พิเศษ-เพื่อ-ใช้-บรรทุก-ชิ้นส่วน-ของ-อากาศยาน",
    "006": "!sk!sp!tyและ-คาร์โก-ขนาด-ใหญ่!sk!sp",
    "007": "!tyเดิม-เครื่อง-รุ่น-นี้-มี-ชื่อ-เรียก-ว่า!sk!spSuper",
    "008": "!spTransporter!sp!tyแต่-นิยม-เรียก-ว่า!sk!sp\"!tyเบลูกา",
    "009": "!sk\"!sp!tyตาม-ลักษณะ-ที่-คล้าย-กับ-วาฬ-ขาว!sk!sp",
    "010": "!tyชื่อ-นี้-ได้-รับ-ความ-นิยม-จน-แอร์บัส-นำ-มา-ใช้-เป็น-ชื่อ-ทางการ-ของ-เครื่องบิน-รุ่น-นี้"
}

const fmt = (
    ''
    + 'แอร์บัส เอ เอสที ย่อ'
    + 'มาจาก หรือ แอร์บัส '
    + 'เบลูกา เป็นเครื่องบินของแอร์บัส'
    + 'ที่ปรับปรุงมาจากเครื่องแอร์บัส รุ่น'
    + 'ลำตัวกว้าง ให้มีช่องบรรทุกใหญ่เป็นพิเศษ'
    + 'เพื่อใช้บรรทุกชิ้นส่วนของอากาศยาน และคาร์โก'
    + 'ขนาดใหญ่ เดิมเครื่องรุ่นนั้มีชื่อเรียกว่า'
    + ' แต่นิยมเรียกว่า '
    + 'เบลูกา ตามลักษณะที่คล้ายกับวาฬขาว '
    + 'ชื่อนั้ได้รับความนิยมจนแอร์บัสนำมาใช้เป็น'
    + 'ชื่อทางการของเครื่องบินรุ่นนั้'
)

const wrob_src = wrob(src)
const root_obj = accu_idx(wrob_src)

function get_curent_local_timestamp() {
    return (`${
    (new Date()).getDate().toString().padStart(2, '0')
}/${
    (new Date()).getMonth().toString().padStart(2, '0')
}/${
    (new Date()).getFullYear()
} ${
    (new Date()).getHours().toString().padStart(2, '0')
}:${
    (new Date()).getMinutes().toString().padStart(2, '0')
}:${
    (new Date()).getSeconds().toString().padStart(2, '0')
} GMT ${
    (
        ['+', '-'][(((new Date()).getTimezoneOffset()
        / Math.abs((new Date()).getTimezoneOffset())
            + 1) / 2)]
    )
}${
    Math.floor(Math.abs((new Date()).getTimezoneOffset()) / 60)
        .toString().padStart(2, '0')
}${
    (Math.abs((new Date()).getTimezoneOffset()) % 60)
        .toString().padStart(2, '0')
}`)
}