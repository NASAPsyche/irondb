import json
import re


# START Reading text on each page to find page number.
def find_journal_page_num(total_pages, text):
    list_of_text_pages = []
    for page in range(total_pages):
        text_nums_found = re.findall(r'^\d+', text[page], re.IGNORECASE)
        if len(text_nums_found) == 0:
            list_of_text_pages.append(int(0))
        else:
            list_of_text_pages.append(int(text_nums_found[0]))
    return list_of_text_pages
# END Reading text on each page to find page number.


# START Filling in the pages that are 0s
def deduce_remaining_journal_page_nums(total_pages, text):
    list_of_text_pages = find_journal_page_num(total_pages, text)
    zero_test = True
    zero_loop_count = 0
    while zero_test and zero_loop_count < len(list_of_text_pages):
        zero_test = False
        for text_page in range(len(list_of_text_pages)):
            if list_of_text_pages[text_page] <= 0:
                zero_test = True
                if text_page + 1 < len(list_of_text_pages):
                    list_of_text_pages[text_page] = list_of_text_pages[text_page + 1] - 1
                else:
                    list_of_text_pages[text_page] = list_of_text_pages[text_page - 1] + 1
        zero_loop_count += 1
    return list_of_text_pages
# END Filling in the pages that are 0s


# START Getting pages that have tables on them.
def find_pages_with_tables(total_pages, text):
    list_of_text_pages = deduce_remaining_journal_page_nums(total_pages, text)
    json_of_pages_with_tables = []
    for iterate in range(total_pages):
        if bool(re.search(r'^Table|\nTable |\w\n\w\n\w\n', text[iterate])) and \
                bool(re.search(r'\d+\n\d+\n|\d+\n\n\d+\n\n\d+', text[iterate])):
            single_json = '{\"actual_page\": ' + str(list_of_text_pages[iterate]) + ',\"pdf_page\": ' \
                          + str(iterate + 1) + '}'
            json_loads = json.loads(single_json)
            json_of_pages_with_tables.append(json_loads)

    return json_of_pages_with_tables
# END Getting pages that have tables on them.
