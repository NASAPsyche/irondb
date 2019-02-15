# This code resembles the code I will use to allow the user to single out a page and flip it to get a table


    import PyPDF2


    pdf_reader = PyPDF2.PdfFileReader('original.pdf', 'rb')
    pdf_writer = PyPDF2.PdfFileWriter()

    for pagenum in range(pdf_reader.numPages):
        page = pdf_reader.getPage(pagenum)
        page.rotateClockwise(180)
        pdf_writer.addPage(page)

    pdf_out = open('rotated.pdf', 'wb')
    pdf_writer.write(pdf_out)

    read_page(rotated.pdf)
    pdf_out.close()
    pdf_in.close()


