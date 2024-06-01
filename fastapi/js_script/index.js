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
    object_keys_ret_obj = Object.keys(ret_obj)
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
                fltr_b += element[j]
                if (thflo(element[j])) {
                    back_b += j + ','
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
                        back_c += j + ','
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
    return {
        "lyr_a": lyr_a(thwo),
        "lyr_b": lyr_b(thwo),
        "lyr_c": lyr_c(thwo)
    }
}

function sortObjectByCreatedTime(data) {
    // Convert the object to an array of entries
    let entries = Object.entries(data);

    const get_raw_timestamp = (created_time_src_str) => {
        const is_leap_year = (year) => {
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                return true;
            } else {
                return false;
            }
        }
        const year_int = parseInt(created_time_src_str.substring(6, 10))
        return parseInt(`${
            (year_int * 365 * 24 * 60 * 60)
            + (([
                0,
                (31 + (is_leap_year(year_int) ? 1 : 0)),
                (59 + (is_leap_year(year_int) ? 1 : 0)),
                (90 + (is_leap_year(year_int) ? 1 : 0)),
                (120 + (is_leap_year(year_int) ? 1 : 0)),
                (151 + (is_leap_year(year_int) ? 1 : 0)),
                (181 + (is_leap_year(year_int) ? 1 : 0)),
                (212 + (is_leap_year(year_int) ? 1 : 0)),
                (243 + (is_leap_year(year_int) ? 1 : 0)),
                (273 + (is_leap_year(year_int) ? 1 : 0)),
                (304 + (is_leap_year(year_int) ? 1 : 0)),
                (304 + (is_leap_year(year_int) ? 1 : 0))
            ][parseInt(created_time_src_str.substring(3, 5)) - 1]
                + (parseInt(created_time_src_str.substring(0, 2)) - 1))
                * (24 * 60 * 60))
                + parseInt(created_time_src_str.substring(11, 13)) * 3600
                + parseInt(created_time_src_str.substring(14, 16)) * 60
                + parseInt(created_time_src_str.substring(17, 19))
                + ((((['+', '-'].indexOf(
                    created_time_src_str.substring(24, 25)) * 2) - 1))
                * parseInt(created_time_src_str.substring(25, 27)) * 3600
                + parseInt(created_time_src_str.substring(27, 29)))
        }`);
    }

    // Sort the entries based on created_time (latest first)
    entries.sort((a, b) => {
        let dateA = get_raw_timestamp(a[1].created_time);
        let dateB = get_raw_timestamp(b[1].created_time);
        console.log(dateB - dateA)
        return dateB - dateA;
    });

    const ret_obj = {}
    for (let i = 0; i < entries.length; i++) {
        ret_obj[i + 1] = entries[i][1]
    }

    return ret_obj;
}

// Example usage
const data = {
    "1": { "_id": "66546d990f066c75f1fc38d6", "created_time": "26/05/2024 14:46:12 GMT +0700" },
    "2": { "_id": "66546d990f066c75f1fc38d7", "created_time": "26/05/2024 14:48:15 GMT +0700" },
    "3": { "_id": "66546d990f066c75f1fc38dd", "created_time": "26/05/2024 15:03:36 GMT +0700" },
    "4": { "_id": "66546d990f066c75f1fc38d8", "created_time": "26/05/2024 14:52:45 GMT +0700" },
    "5": { "_id": "66546d990f066c75f1fc38ca", "created_time": "26/05/2024 13:45:11 GMT +0700" },
    "6": { "_id": "66546d990f066c75f1fc38ce", "created_time": "26/05/2024 14:02:33 GMT +0700" },
    "7": { "_id": "66546d990f066c75f1fc38c5", "created_time": "26/05/2024 13:26:09 GMT +0700" },
    "8": { "_id": "66546d990f066c75f1fc38d2", "created_time": "26/05/2024 14:24:36 GMT +0700" },
    "9": { "_id": "66546d990f066c75f1fc38db", "created_time": "26/05/2024 14:59:15 GMT +0700" },
    "10": { "_id": "66546d990f066c75f1fc38e1", "created_time": "26/05/2024 15:12:02 GMT +0700" }
};

console.log(sortObjectByCreatedTime(data))