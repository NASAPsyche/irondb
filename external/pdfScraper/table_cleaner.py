import pandas as pd


def row_by_row(mdf, mdf2):
    for rbr_row in reversed(range(mdf.shape[0])):
        row_remove = 0
        row_null = 0
        for rbr_col in range(mdf.shape[1]):
            if str(mdf.iat[rbr_row, rbr_col]) == "REMOVE":
                row_remove += 1
            if str(mdf.iat[rbr_row, rbr_col]) == "nan":
                row_null += 1

        if mdf.shape[1] - (row_remove + row_null) < 2:
            mdf = mdf.drop(rbr_row)
            mdf2 = mdf2.drop(rbr_row)
            if mdf.empty:
                empty_df = pd.DataFrame()
                return empty_df, empty_df
    return [mdf, mdf2]


def column_by_column(mdf, mdf2):
    for cbc_col in reversed(range(mdf.shape[1])):
        col_remove = 0
        col_null = 0
        for cbc_row in range(mdf.shape[0]):
            if str(mdf.iat[cbc_row, cbc_col]) == "REMOVE":
                col_remove += 1
            if str(mdf.iat[cbc_row, cbc_col]) == "nan":
                col_null += 1
        if mdf.shape[0] - (col_remove + col_null) < 2 or(col_remove + col_null) / mdf.shape[0] > .85:
            mdf = mdf.drop(mdf.columns[cbc_col], axis=1)
            mdf2 = mdf2.drop(mdf2.columns[cbc_col], axis=1)
            if mdf.empty:
                empty_df = pd.DataFrame()
                return empty_df, empty_df
    return [mdf, mdf2]


# Start Marking the fields for removal
def mark_fields_for_removal(tables_for_marking):
    if len(tables_for_marking) > 0:
        for table_df in tables_for_marking:
            for removal_row in range(table_df.shape[0]):
                for removal_col in range(table_df.shape[1]):
                    if len(str(table_df.iat[removal_row, removal_col])) > 20:
                        table_df.iat[removal_row, removal_col] = "REMOVE"
    return tables_for_marking
# End Marking the fields for removal


# START Remove dead tables from list after row by row and col by col
def empty_table_remover(loc_tables_rec_from_pages, loc_pages_with_tables_pristine, loc_json_master_pages_with_tables_confirmed):
    for remover in reversed(range(len(loc_tables_rec_from_pages))):
        if loc_tables_rec_from_pages[remover].empty:
            del loc_tables_rec_from_pages[remover]
            del loc_pages_with_tables_pristine[remover]
            del loc_json_master_pages_with_tables_confirmed
# END Remove dead tables from list after row by row and col by col


# START Put original values back in fields marked for removal by mistake
def marked_field_clean_up(tables_dirty, tables_clean):
    if len(tables_dirty) > 0:
        for tt in range(len(tables_dirty)):
            for row in range(tables_dirty[tt].shape[0]):
                for col in range(tables_dirty[tt].shape[1]):
                    if str(tables_dirty[tt].iat[row, col]) == "REMOVE":
                        tables_dirty[tt].iat[row, col] = tables_clean[tt].iat[row, col]
# END Put original values back in fields marked for removal by mistake
