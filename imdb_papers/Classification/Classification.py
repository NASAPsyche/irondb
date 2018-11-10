#This is my first python program, don't judge especially you Hajar
print("Please enter a number first units will come later")

x = float(input())
valid = False
ppm = ""

#get input from user
print("You entered: %f" % x)
print("Enter the units: ")
units = input()

#known measurements
unitList = ["ng/g", "mg/g", "ug/g", "ppm", "ppb"]

if units in unitList:
    print("valid unit")
    valid = True
else:
    print("not valid unit")

#convert from ng/g to ppm
def convert_nanograms(val):
    x = val / 1000
    return x

#convert from mg/g to ppm
def convert_milligram(val):
    x = val * 1000
    return x

#convert from ug/g to ppm
def convert_microgram(val):
    x = val
    return x

#convert from ppb to ppm
def convert_ppb(val):
    x = val / 1000
    return x

#convert input to units
if (valid):
    if units == "ng/g":
        ppm = convert_nanograms(x)
        print("%f ppm" % ppm)
    elif units == "mg/g":
        ppm = convert_milligram(x)
        print("%f ppm" % ppm)
    elif units == "ug/g":
        ppm = convert_microgram(x)
        print("%f ppm" % ppm)
else:
    print("The units were not valid and could not be converted, loser")

#determine the classification of the element
def _classification(ppm):
    if(ppm > 10000):
        classification = "Major"
    elif(ppm >= 100 and ppm < 10000):
        classification = "Minor"
    elif(ppm < 100):
        classification = "Trace"
    return ("The element is a %s element" % classification)

#print results
print(_classification(ppm))

