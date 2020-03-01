import React from 'react';

const myName = 'Cody';
var showSave = "true";

function ShowName(name) {
    return <span>
        {name}
    </span>
}

function ShowEdit() {
    showSave = "false";
}

const Account = () => {

    return (
        <div class='container-fluid mt-5 col-8 pb-4'>
            <div class='card mt-5'>
                <div class="container-fluid">
                    <div class="pt-3 h1">
                        <label>User: {ShowName(myName)}</label>
                    </div>

                    {/* TODO: add action and method */}
                    <form id="user-update-form">
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" class="form-control" id="username" value="User" readonly />
                        </div>
                        <div class="form-row form-group">
                            <div class="col">
                                <label>First Name</label>
                                <input type="text" class="form-control" id="firstname" value="First" readonly required />
                            </div>
                            <div class="col">
                                <label>Last Name</label>
                                <input type="text" class="form-control" id="lastname" value="Last" readonly required />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Email address</label>
                            <input type="email" class="form-control" id="email" value="email@email.com" readonly />
                        </div>
                        <div class="form-group">
                            <label>Role</label>
                            <input type="text" class="form-control" id="role" value="Admin" readonly />
                        </div>
                        <div class="form-group">
                            <label id="passwordLabel">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="************" readonly />
                        </div>

                        <div class="text-right form-group pb-2">
                            <button class='btn btn-warning' type="button" id='update-btn' onClick={ShowEdit()}>Edit</button>
                            <button class='btn btn-warning' type='submit' id='save-btn' disabled="false" hidden={showSave}>Save</button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}
export default Account;
