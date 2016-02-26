def one_off_words(str, word_list):
    if str is None or len(str) == 0:
        return []
    if not word_list or len(word_list) == 0:
        return []
    resp = []
    str_len = len(str)
    for ele in word_list:
        if len(ele) != str_len:
            continue
        idx = 0
        match_count = 0
        while idx < str_len:
            if str[idx] == ele[idx]:
                match_count += 1
            idx += 1
        if match_count == str_len -1:
            resp.append(ele)
    return resp
