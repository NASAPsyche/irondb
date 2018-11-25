
def look_for_tables(pages, num_pages):
    pages_with_tables = []
    iterate = 0
    while iterate <= num_pages - 1:
        print("test " + str(iterate))
        splitted = pages[iterate].split()
        if pages[iterate].find('\nTable ') > 0 or splitted[0] == "Table":
            print("############# Table exists on Page " + str(iterate + 1) + " #############" + "\n Word: "
                  + str(pages[iterate].find('\nTable ')))
            pages_with_tables.append(iterate + 1)
        iterate += 1

    return pages_with_tables

