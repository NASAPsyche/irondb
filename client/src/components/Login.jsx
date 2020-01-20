import React from 'react';
import { Route, Redirect, Link, BrowserRouter as Router } from 'react-router-dom';

function Login() {
    return (
<div class="container mt-4">
    <div class="row">
      <div class="col-sm-8 offset-sm-4 text-center">
        <form action="/login" method="POST">
          <h1 class="h3">Log in</h1>
          <!--<% if (Alert !== "") { %>-->
             <!--<% if (AlertType === "error") { %> -->
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <!-- <%= Alert%> -->
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <!-- <% } else if (AlertType === "success") { %> -->
              <div class="alert alert-success alert-dismissible fade show" role="alert">
                  <!-- <%= Alert %> -->
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
            <!-- <% } %> -->
            </form>
          <!-- <% } %> -->
        
          <label class="sr-only" for="username">username</label>
          <input type="text" name="username" id="username" class="form-control" placeholder="username" required
            autofocus minlength="4" maxlength="25">
          <label class="sr-only" for="password">password</label>
          <input type="password" name="password" id="password" class="form-control" placeholder="password" required
            minlength="6" maxlength="25">
          <button class="btn btn-lg btn-danger btn-block mt-2" type="submit">Submit</button>
          <a href="/register">Register Here</a>
        </form>
      </div>
    </div>
  </div>
    );
}

export default Login;