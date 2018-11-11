from Element import Element

def test_classifications():
    a = Element(10,"mg/g")
    b = Element(9, "mg/g")
    c = Element(10, "ng/g")

    assert a.value == 10
    assert b.value == 9
    assert a.classification() == "The element is a Major element"
    assert b.classification() == "The element is a Minor element"
    assert c.classification() == "The element is a Trace element"

def test_conversion():
    a = Element(10,"mg/g")
    b = Element(9, "mg/g")
    c = Element(1000, "ng/g")
    d = Element(7, "ppm")
    e = Element(15, "ug/g")
    f = Element(7000, "ppb")

    assert a.ppm_conversion() == 10000
    assert b.ppm_conversion() == 9000
    assert c.ppm_conversion() == 1
    assert d.ppm_conversion() == 7
    assert e.ppm_conversion() == 15
    assert f.ppm_conversion() == 7
