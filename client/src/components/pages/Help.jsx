import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Help.scss';
import AuthenticatedHelp from '../AuthenticatedHelp';

const Help = ({ authenticated }) => (
    <div className="Help body-component">
        <div className="container-fluid pt-3 pb-5" id="top-container">
            <div className="row">
                <div className="col-md-8 pt-4 ml-5">
                    <div className="row">
                        <div>
                            <h1>Documentation</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container-fluid pt-3 pb-4" id="bottom-container">
            <div>
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <h5 className="pb-5">
                            Welcome to the Iron Meteorite Database, created as a component of <a href="https://psyche.asu.edu/">NASA's Psyche Mission</a> and aiming to benefit the entire scientific community. As the premiere database for curated information on iron meteorites, we strive to provide the most complete and most accurate collection of meteorite data by using a mixture of natural language processing algorithms and human-guided data entry. Learn more <a href="https://psyche.asu.edu/get-involved/capstone-projects/capstone-projects-iron-class/iron-meteorite-database/">here</a>.
                        </h5>
                    </div>
                    <div className="col-sm-1"></div>
                </div>

                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <center>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/p0ywMqjEHpQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </center>
                    </div>
                    <div className="col-sm-1"></div>
                </div>

                <a id="search"></a><br /><br />
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <h3 className="section-head">Search</h3>
                        <p className="pt-3">
                            If you know the <strong>meteorite name</strong> you are searching for, or the name of the <strong>paper</strong> or <strong>author</strong>, you can search for this on the <Link to="/">landing page</Link>.
                        </p>
                        <p>
                            <center>
                                <img src={require("../../images/help/Search/simple_search.png")} alt="simple search" />
                            </center>
                        </p>
                        <p>
                            <p>
                                For advanced searches, navigate to the <Link to="/database">database page</Link> (or click <Link to="/database">"Enter the Database"</Link>.)
                            </p>
                            <h5 class="pt-4">
                                <u>Search by <strong>source</strong> of meteorite study:</u>
                            </h5>
                            <p>
                                Click on the plus + or minus - square button on the left to expand or minimize search fields for <strong>journal name, volume, or page number</strong> of the research paper in which the meteorite appears:
                            </p>
                            <p>
                                <center>
                                    <img src={require("../../images/help/Search/source_expand.png")} alt="expand source" />
                                </center>
                            </p>
                            <p>
                                Click on the plus + or minus - square button on the right to expand or minimize search fields for <strong>date of publication</strong> of the research paper in which the meteorite appears:
                            </p>
                            <p>
                                <center>
                                    <img src={require("../../images/help/Search/date_expand.png")} alt="expand date" />
                                </center>
                            </p>
                            <h5>
                                <u>Search by meteorite <strong>composition</strong>:</u>
                            </h5>
                            <p>
                                Click the plus + or minus - signs next to "Composition" to expand or minimize search fields for the <strong>chemical composition</strong> of the meteorite:
                            </p>
                            <p>
                                <center>
                                    <img src={require("../../images/help/Search/composition_expand.png")} alt="expand composition" />
                                </center>
                            </p>
                            <p class="pt-3">
                                You can then click "Search" to submit your query, or click "Reset" to clear all fields.
                            </p>
                            <p>
                                <center>
                                    <img src={require("../../images/help/Search/reset_search.png")} alt="expand composition" />
                                </center>
                            </p>
                        </p>
                    </div>
                    <div class="col-sm-1"></div>
                </div>

                <a id="exportData"></a><br /><br />
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <h3 className="section-head">Export Data</h3>
                        <p className="pt-3">
                            If you would like to export a CSV of your search results, submit a query in the <Link to="/database">database page</Link>, then click the "Export" button.
                        </p>
                        <p>
                            <center>
                                <img src={require("../../images/help/Export/export_page.png")} alt="export page" />
                            </center>
                        </p>
                        <p>
                            You will be redirected to the "Export Data" page. Verify that the listed data is what you wish to export and delete any unwanted entries. You can choose to export this data separated by the analysis techniques used for each meteorite (this can result in multiple rows for a single meteorite that has multiple analysis techniques), or you can choose to discard the analysis techniques and export each meteorite in a single row of the CSV.
                        </p>
                        <p>
                            <center>
                                <img src={require("../../images/help/Export/data.png")} alt="data to export" />
                                <img src={require("../../images/help/Export/analysis_vs_row.png")} alt="export by analysis technique vs single row" />
                            </center>
                        </p>
                        <p className="pt-5">
                            Once you are done customizing your export, you can click "Export Data" to download the CSV file on your local machine.
                        </p>
                    </div>
                    <div className="col-sm-1"></div>
                </div>

                <AuthenticatedHelp />

                <a id="registration"></a><br /><br />
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <h3 className="section-head">Registration</h3>
                        <p className="pt-3">
                            To register as a user, navigate to the <Link to="/register">registration page</Link>
                            and fill out all fields.
                        </p>
                        <p>
                            <center>
                                <img src={require("../../images/help/register.png")} alt="register user" />
                            </center>
                        </p>
                        <p>
                            <ul>
                                <li>
                                    Your username must be unique and at least 5 characters long.
                                </li>
                                <li> A valid email that is currently not registered with the Iron Meteorite Database is required.</li>
                                <li>
                                    Your password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number. The minimum length is 8 and the maximum is 25.
                                </li>
                            </ul>
                        </p>
                    </div>
                    <div className="col-sm-1"></div>
                </div>

                {/*<!-- <a id="search"></a><br /><br />
                <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-10">
                        <h3 class="section-head">Search</h3>
                        <p>
                        </p>
                    </div>
                    <div class="col-sm-1"></div>
                </div> -->*/}

            </div>
        </div>
    </div>
);

export default Help;