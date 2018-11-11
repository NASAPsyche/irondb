from Element import Element

print("Please enter a number first units will come later")

x = float(input())
valid = False
ppm = ""
a = Element(0,"")

#get input from user
print("You entered: %f" % x)

while(valid == False):
    print("Enter the units: ")
    units = input()

    #known measurements
    unitList = ["ng/g", "mg/g", "ug/g", "ppm", "ppb"]

    if units in unitList:
        print("valid unit")
        valid = True
        a = Element(x,units)
    else:
        print("not valid unit")

print(a.classification())