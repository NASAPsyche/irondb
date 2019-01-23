##################################################################################################################################
# Function Name: value_equals_REMOVE
# Function Purpose: This function determines whether or not a value in a is equal to the string "REMOVE"
# Function Inputs: str_to_test, which is the value being tested.
# Function Output: True if the value is equal to "REMOVE" and false if it is not.
##################################################################################################################################


def value_equals_REMOVE(str_to_test):
    return bool(str_to_test == "REMOVE")
##################################################################################################################################


##################################################################################################################################
# Function Name: value_is_lc_frag
# Function Purpose: This function determines whether or not a value is a lower case sentence fragment.
# Function Inputs: str_to_test, which is the value being tested.
# Function Output: True if the value is a lower case sentence fragment and false if it is not.
##################################################################################################################################


def value_is_lc_frag(str_to_test):
    local_test = str_to_test
    count_white_space = len(local_test) - len(local_test.replace(" ", ""))
    white_space_stripped = local_test.replace(" ", "")
    print("White Space Stripped: " + white_space_stripped)
    if count_white_space > 0 and white_space_stripped.islower:
        return True
    else:
        return False

##################################################################################################################################



##################################################################################################################################
# Function Name:
# Function Purpose:
# Function Inputs:
# Function Output:
##################################################################################################################################



##################################################################################################################################


##################################################################################################################################
# Function Name:
# Function Purpose:
# Function Inputs:
# Function Output:
##################################################################################################################################



##################################################################################################################################


##################################################################################################################################
# Function Name:
# Function Purpose:
# Function Inputs:
# Function Output:
##################################################################################################################################



##################################################################################################################################
