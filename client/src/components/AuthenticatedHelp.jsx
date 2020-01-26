import React from 'react'
import { Link } from 'react-router-dom'

const  AuthenticatedHelp = ({ authenticated }) => {
    if (authenticated === false)
        return null;
    else {
        return (
            <div>
                <a id="dataEntry"></a><br /><br />
                            <div className="row">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-10">
                                    <h3 className="section-head">Data Entry</h3>
                                    <p className="pt-3">
                                        Data entry is limited to pre-approved users. If you are an approved user, log in and go to the <Link to="/data-entry">data entry page</Link>.
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/entry_approach.png")} alt="data entry approach" />
                                        </center>
                                    </p>
                                    <h5>
                                        <u>Automated Tool: (recommended)</u>
                                    </h5>
                                    <p>
                                        If you would like to use the automated tool to extract information from the paper, select "With PDF", choose a PDF to upload, then click "Submit".
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/with_pdf.png")} alt="data entry with pdf" />
                                        </center>
                                    </p>
                                    <p>
                                        In the next page, select your preferences from a list of options.
                                    </p>
                                    <p className="pt-2">
                                        <strong>Extract Attributes and/or All Tables:</strong>
                                    </p>
                                    <p>
                                        Check the "Extract Attributes" box to automatically extract basic information of the research paper from the uploaded PDF (e.g. paper title, journal name, author(s), year published), and/or check the "Extract All Tables" box to automatically extract all tables recognized by the tool. Click submit and wait for the data to be automatically extracted (this may take a few minutes as the tool runs some natural language processing algorithms in the background.)
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/attributes_tables.png")} alt="automatically extract attributes and/or all tables" />
                                            <img src={require("../images/help/DataEntry/attributes_tables_form.png")} alt="data entry form for automatically extracted attributes and tables" />
                                        </center>
                                    </p>
                                    <p className="text-green">
                                        Note: This works fairly well for newer publications (post 1999.) It will try its best to extract info from older publications, but will often return nothing. You are still welcome to try!
                                    </p>
                                    <p className="pt-2">
                                        <strong>Extract Tables by Page:</strong>
                                    </p>
                                    <p>
                                        This option offers basic tools to extract tables from a PDF one page at a time in case “Extract All Tables” fails for any reason.
    
                                    </p>
                                    <p>
                                        <u>Page Number:</u>
                                        You can choose the page number from which you want to extract tables. You can add tables one by one to append to the list of tables that are already extracted.
    
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/page_num.png")} alt="list of page numbers" />
                                        </center>
                                    </p>
                                    <p>
                                        <u>Flip Direction:</u>
                                        If a table on a particular page is presented sideways instead of horizontally, the “Extract all Tables” tool will have a difficult time extracting it. You can fix this by using the tool to rotate the table in degrees (clockwise).
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/sideways_table.png")} alt="sidways table" />
                                            <img src={require("../images/help/DataEntry/flip_tool.png")} alt="flip table tool" />
                                        </center>
                                    </p>
                                    <p>
                                        <u>Coordinates:</u>
                                        If a table is still not found after selecting the page that it is on or using all of the other tools, you can go in and select the area of the PDF page that contains the table.
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/coordinates.png")} alt="table coordinates" />
                                        </center>
                                    </p>
                                    <p>
                                        To find the coordinates using MacOs, you can use the Preview application. Open the PDF in Preview, then scroll to the page of the table you are trying to extract. Under the "<strong>Tools</strong>"" menu option, select "<strong>Show Inspector</strong>".
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/mac_inspect.png")} alt="finding coordinates in mac" />
                                            <img src={require("../images/help/DataEntry/mac_coords.png")} alt="coordinates in mac" />
                                        </center>
                                    </p>
                                    <p>
                                        Make sure Rectangular Selection is selected as your pointer in Preview (under "<strong>Tools</strong>""). This will allow you to drag your curser over the PDF to find the coordinates of the selection. Try to be as precise as possible. You will notice that the numbers may include  a decimal in them. Please round to whole numbers when you enter them into the coordinates tool. (Helpful hint: round down for the "Left" and the "Top" edge, and round up for the "Width" and "Height".)
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/coords_select.png")} alt="coordinates of a selection" />
                                        </center>
                                    </p>
                                    <p className="pt-2">
                                        <strong>No Automatic Data Extraction:</strong>
                                    </p>
                                    <p>
                                        You can also choose not to extract any data automatically by checking the "No Automatic Data Extraction" box. This allows you to enter data manually but with the PDF hosted next to the form for a more interactive data entry experience.
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/no_automatic.png")} alt="no automatic extractions" />
                                            <img src={require("../images/help/DataEntry/no_auto_form.png")} alt="data entry form no automatic extractions" />
                                        </center>
                                    </p>
                                    <p>
                                        <strong className="text-red"><u>Please Note:</u></strong>
                                    </p>
                                    <p className="text-red">
                                        When selecting to use the automated tool, you will be presented with a selection of data extracted from your PDF. While we strive to have the highest levels of accuracy, that isn't always possible. Because of this, the information extracted must be verified for accuracy before submitting your entry. After submitting a paper to the Iron Meteorite Database, your information will be pending approval by the admins.
                                    </p>
                                    <h5 className="pt-4">
                                        <u>Manual Data Entry:</u>
                                    </h5>
                                    <p>
                                        If you would like to enter data manually without uploading a PDF, navigate to the <Link to="/data-entry">data entry page</Link>, and select "Without PDF".
                                    </p>
                                    <p>
                                        This allows you to manually enter data directly into the editor, validate your data, and submit the form for approval. You may also choose to "Save" your progress and return to it later.
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/without_pdf.png")} alt="data entry without pdf" />
                                            <img src={require("../images/help/DataEntry/manual.png")} alt="manual data entry tool" />
                                        </center>
                                    </p>
                                </div>
                                <div className="col-sm-1"></div>
                            </div>
    
                            <a id="dataEntry"></a><br /><br />
                            <div className="row">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-10">
                                    <h3 className="section-head">Submission</h3>
                                    <p className="pt-3">
                                        Before you can submit an entry to the database, it needs to be validated. Check all your entries carefully. If you have automatically extracted tables, click "Validate Tables" first. Invalid values will be highlighted in red. Update those values then validate again. After validating all your table entries, click "Validate All" (or simply "Validate" if no tables exist), then check the "Basic Information" section for any invalid values. Update those values as well and validate again until all entries have been marked as valid.
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/invalid.png")} alt="invalid entry" />
                                            <img src={require("../images/help/DataEntry/valid.png")} alt="valid entry" />
                                        </center>
                                    </p>
                                    <p className="pt-2">
                                        <strong>Table Validation Guide:</strong>
                                    </p>
                                    <p>
                                        The following is a guide on how to input proper table data for validations.
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/table_guide.png")} alt="table guide" />
                                        </center>
                                    </p>
                                    <p>
                                        <strong><u>Elements</u></strong> - Must be a <emp>symbol</emp> from the periodic table, not full element names.
                                    </p>
                                    <p>
                                        <strong><u>Measurements</u></strong> - Measurements can be any number, but decimals in the form of .08 must be written as 0.08. The less than &lt; symbol can be included before a measurement.
                                    </p>
                                    <p>
                                        <strong><u>Units</u></strong> - Accepted units are: wt%, ppm, ppb, mg/g, µ/g, ug/g, lg/g, ng/g. Note: our table extraction tool extracts “µ/g” as “ug/g” or “lg/g” but we accept µ as an input.
                                    </p>
                                    <p>
                                        <strong><u>Page Number</u></strong> - Please enter the printed page number of the PDF in this field.
                                    </p>
                                    <p>
                                        <strong><u>Blank Values</u></strong> - For fields that are meant to be left blank intentionally, write “empty” (no quotation marks) in the field. Please keep in mind that some tables have blank spots for measurements; those need to be replaced with “empty” as well.
                                    </p>
                                    <p>
                                        <strong><u>Analysis technique</u></strong> - You will ideally have an analysis technique to put in this field, if not you can leave it blank.
                                    </p>
                                    <p>
                                        <strong><u>Meteorite Name</u></strong> - The meteorite name must contain at least one letter.
                                    </p>
                                    <p className="pt-4">
                                        Once all your entries have been marked as valid, you can click "Submit" and your entry will show up in your user panel under "Approval Needed". They will be added to the database pending admin approval. 
                                    </p>
                                    <p>
                                        <center>
                                            <img src={require("../images/help/DataEntry/panel.png")} alt="user panel" />
                                            <img src={require("../images/help/DataEntry/approvals.png")} alt="approval form" />
                                        </center>
                                    </p>
                                </div>
                                <div className="col-sm-1"></div>
                            </div>
                        </div>
        )
    }
}

export default AuthenticatedHelp