import React from "react";

const MeteoriteFormGroup = ({ elements, techniques }) => (
    <React.Fragment>
        <div className="form-row meteorite-header" id="meteorite0">
            <h5 className="pt-1 mr-2"><strong>Meteorite</strong></h5>
            <i className="fas fa-plus-circle fa-lg mt-2 text-danger add-meteorite"></i>
        </div>

        <div className="form-row">
            <div className="col-md-1">
                <i className="far fa-times-circle fa-lg remove remove-meteorite pt-4 text-danger" title="Press to remove meteorite and all associated measurements."></i>
            </div>
            <div className="form-group col-md-6">
                <label for="bodyName">Meteorite</label>
                <input type="text" className="form-control" id="bodyName0" name="bodyName0" required="true" />
            </div>
            <div className="form-group col-md-2">
                <label for="group">Group</label>
                <input type="text" className="form-control" id="group0" name="group0" required="true" />
            </div>
        </div>

        <div className="form-row">
            <h5 className="pt-1 mr-2 pl-3"><strong>Measurements</strong></h5>
            <i className="fas fa-plus-circle fa-lg mt-2 text-danger add-measurement"></i>
        </div>

        <div className="form-row">
            <div className="col-md-1 p-0">
                <i className="far fa-times-circle fa-lg remove remove-inline pt-4 text-danger" title="Press to remove measurement."></i>
            </div>
            <div className="form-group col-md-1 mr-3">
                <label for="element0_0">Element</label>
                <select className="form-control p-1" id="element0_0" name="element0_0" required="true">
                    {elements.map(element => (
                        <option value={element.symbol.toLowerCase()}>{element.symbol}</option>
                    ))}
                </select>
            </div>
            <div className="form-check-inline col-md-1">
                <input className="form-check-input" type="checkbox" id="lessThan0_0" />
                <label className="form-check-label" for="lessThan0_0">&lt;</label>
            </div>
            <div className="form-group col-md-2">
                <label for="measurement">Measurement</label>
                <input type="text" className="form-control" id="measurement0_0" name="measurement0_0" required="true" min="0" />
            </div>
            <div className="form-group col-md-1">
                <label for="deviation">(&plusmn;)</label>
                <input type="number" className="form-control p-2" id="deviation0_0" name="deviation0_0" value="0" min="0" />
            </div>
            <div className="form-group col-md-2">
                <label for="units">Units</label>
                <select className="form-control" id="units0_0" name="units0_0" required="true">
                    <option value="wt_percent">wt%</option>
                    <option value="ppm">ppm</option>
                    <option value="ppb">ppb</option>
                    <option value="mg_g">mg/g</option>
                    <option value="ug_g">&micro;g/g</option>
                    <option value="ng_g">ng/g</option>
                </select>
            </div>
            <div className="form-group col-md-2">
                <label for="technique0_0">Technique</label>
                <select className="form-control p-1" id="technique0_0" name="technique0_0" required="true">
                    {techniques.map(technique => (
                        <option value={technique.abbreviation}>{technique.abbreviation}</option>
                    ))}
                </select>
            </div>
            <div className="form-group col-md-1">
                <label for="page">Page</label>
                <input type="number" className="form-control p-1" id="page0_0" name="page0_0" min="1" required />
            </div>
            <div className="form-group">
                <input type="hidden" id="sigfig0_0" name="sigfig0_0" value="0" />
                <input type="hidden" id="convertedMeasurement0_0" name="convertedMeasurement0_0" value="0" />
                <input type="hidden" id="convertedDeviation0_0" name="convertedDeviation0_0" value="0" />
            </div>
        </div>
    </React.Fragment>
)

export default MeteoriteFormGroup;