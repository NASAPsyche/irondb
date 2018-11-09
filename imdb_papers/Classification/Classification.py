#This is my first python program, don't judge especially you Hajar
print("Please enter a number first units will come later")

x = int(input())
print("You entered: %d" % x)
print("Enter the units: ")
units = input()

unitList = ["ng/g", "mg/g", "ug/g"]

if units in unitList:
    print("yes")
else:
    print("no")