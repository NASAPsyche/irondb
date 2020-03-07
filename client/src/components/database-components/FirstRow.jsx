import React from "react";

const FirstRow = () => {
    return (
        <div className="form-row mb-2">
            <div className="col-md-3 offset-md-1">
                <label className="sr-only" for="name"></label>
                <input type="text" name="name" id="name" className="form-control" placeholder="meteorite name" />
            </div>
            <div className="col-md-2">
                <label className="sr-only" for="title"></label>
                <input type="text" name="title" id="title" className="form-control" placeholder="paper title" />
            </div>
            <div className="col-md-2">
                <label className="sr-only" for="author"></label>
                <input type="text" name="author" id="author" className="form-control" placeholder="author" />
            </div>
            <div className="col-md-2">
                <label className="sr-only" for="group">group</label>
                <select className="form-control" name="group">
                    <option value="group">group</option>
                </select>  
            </div>
        </div>
    );
}

export default FirstRow;