class Element:
    def __init__(self, value, measurement):
        self.value = value
        self.measurement = measurement

    #convert from ng/g to ppm
    def convert_nanograms(self):
        self.value = self.value / 1000
        return self.value

    #convert from mg/g to ppm
    def convert_milligram(self):
        self.value = self.value * 1000
        return self.value

    #convert from ug/g to ppm
    def convert_microgram(self):
        self.value = self.value
        return self.value

    #convert from ppb to ppm
    def convert_ppb(self):
        self.value = self.value / 1000 
        return self.value

    #classification of element
    def ppm_conversion(self):
        if self.measurement == "ng/g":
            self.value = self.convert_nanograms() 
            print("%f ppm" % self.value)
        elif self.measurement == "mg/g":
            self.value = self.convert_milligram()
            print("%f ppm" % self.value)
        elif self.measurement == "ug/g":
            self.value = self.convert_microgram()
            print("%f ppm" % self.value)
        elif self.measurement == "ppm":
            print("%f ppm" % self.value)
        elif self.measurement == "ppb":
            self.value = self.convert_ppb()
            print("%f ppm" % self.value)

    #Print classification
    def classification(self):
        classification = ""
        self.ppm_conversion()
        if(self.value > 10000):
            classification = "Major"
        elif(self.value >= 100 and self.value < 10000):
            classification = "Minor"
        elif(self.value < 100):
            classification = "Trace"
        return ("The element is a %s element" % classification)