import React from 'react';
import '../styles/Database.scss'

const DatabaseSearch = () => {
    return (
        <body>
            <div class="container-fluid fixed-top p-2 border-bottom border-dark" id="search-panel">
      <div class="row ml-2 mt-2">
        <div class="col-sm-2 align-self-end">
          <div class="d-flex flex-row">
            <form action="/database/export" method="POST" id="export-form">
              <label class="sr-only" for="entries">entry ids of currently viewed entries</label>
              <div id="entry-ids">
                <% for(var i=0; i < Entries.length; i++) { %>
                  <input type="hidden" name="entries" value=<%= Entries[i].entry_id %>>
                <% } %>
              </div>
              <button class="btn btn-outline-light btn-block mt-2" type="submit">Export Data</button>
            </form>
          </div>
        </div>
        <div class="col-sm-10">
          <form action="/database" method="POST" id="search-form">
            <div class="form-row mb-2">
              <div class="col-md-3 offset-md-1">
                <label class="sr-only" for="name"></label>
                <input type="text" name="name" id="name" class="form-control" placeholder="meteorite name">
              </div>
              <div class="col-md-2">
                <label class="sr-only" for="title"></label>
                <input type="text" name="title" id="title" class="form-control" placeholder="paper title">
              </div>
              <div class="col-md-2">
                <label class="sr-only" for="author"></label>
                <input type="text" name="author" id="author" class="form-control" placeholder="author">
              </div>
              <div class="col-md-2">
                <label class="sr-only" for="group">group</label>
                <select class="form-control" name="group">
                  <option value="group">group</option>
                  <% for(var i=0; i < Groups.length; i++) { %>
                    <option value="<%= Groups[i].classification_group %>"><%= Groups[i].classification_group %></option>
                  <% } %>                
                </select>  
              </div>

              <span class="expandSearch">
                <i id="additional" class="far fa-minus-square fa-lg hide-journal text-warning" title="Hide additional options" hidden=""></i>
                <i id="additional" class="far fa-plus-square fa-lg show-journal text-warning" title="Show additional options"></i>
              </span>

            </div>

        
            
            <div class="form-row journal" hidden="true">
              <div class="form-group col-md-3 offset-md-1">
                <label class="sr-only" for="journal_name"></label>
                <input type="text" name="journal_name" id="journal_name" class="form-control" placeholder="journal name" disabled="true">
              </div>
              <div class="form-group col-md-2">
                <label class="sr-only" for="volume"></label>
                <input type="number" name="volume" id="volume" class="form-control" placeholder="volume" step="1" disabled="true">
              </div>
              <div class="form-group col-md-1">
                <label class="sr-only" for="page_number"></label>
                <input type="text" name="page_number" id="page_number" class="form-control" placeholder="pg" disabled="true">
              </div>
              <div class="form-group col-md-1 year">
                <label class="sr-only" for="pub_yr_sign">published year modifier sign</label>
                <select class="form-control" name="pub_yr_sign" >
                  <option value="equal" default>=</option>
                  <option value="less">&lt;</option>
                  <option value="greater">&gt;</option>
                </select>
              </div>
              <div class="form-group col-md-2 year" >
                <label class="sr-only" for="pub_year">published year</label>
                <input type="number" class="form-control" name="pub_year" id="pub_year" min="1900" Max="2019" step="1" placeholder="year" disabled="true">
              </div>
            </div>
            
            <div class="form-row mt-3" id="composition0">
              <div class="col-md-2">
                <h4 class="text-light">Composition:</h4>
              </div>
              <div class="col-md-1 mt-1">
                  <i class="fas fa-plus-circle fa-lg text-warning show-element" title="Add element constraint"></i>
                  <i class="fas fa-minus-circle fa-lg text-warning hide-element" title="Remove element constraint"></i>
              </div>
              <div class="form-group col-md-1 hide-target" hidden="true">
                <label class="sr-only" for="element0_mod">Element modifier</label>
                <select class="form-control" name="element0_mod" title="Select whether to search for an element that appears in the data or not" disabled="true">
                  <option value="IN" default>IN</option>
                  <option value="NOT">NOT</option>
                </select>
              </div>
              <div class="form-group col-sm-3 element hide-target" hidden="true">
                <label class="sr-only" for="element0">element</label>
                <select class="form-control custom-select element" name="element0" multiple disabled="true" id="element0">
                  <option disabled>Element</option>
                  <% for(var i=0; i < Elements.length; i++) { %>
                    <option value="<%= Elements[i].symbol.toLowerCase()%>"><%= Elements[i].symbol %></option> 
                  <% } %>             
                </select>
              </div>
              <div class="form-group col-sm-3 hide-target" hidden="true">
                <label class="sr-only" for="range0">Range</label>
                <select class="form-control" name="range0" disabled="true">
                  <option>Range</option>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                  <option value="trace">Trace</option>
                </select>
              </div>
            </div>
            <div class="form-row mt-2" id="composition1" hidden="true">
              <div class="form-group col-md-1 offset-md-3">
                <label class="sr-only" for="element1_mod">Element modifier</label>
                <select class="form-control" name="element1_mod" title="Select whether to search for an element that appears in the data or not" disabled="true">
                  <option value="IN" default>IN</option>
                  <option value="NOT">NOT</option>
                </select>
              </div>
              <div class="form-group col-sm-3 element">
                <label class="sr-only" for="element1">element</label>
                <select class="form-control custom-select element" name="element1" multiple disabled="true">
                  <option disabled>Element</option>
                  <% for(var i=0; i < Elements.length; i++) { %>
                    <option value="<%= Elements[i].symbol.toLowerCase()%>"><%= Elements[i].symbol %></option> 
                  <% } %>                  
                </select>
              </div>
              <div class="form-group col-sm-3">
                <label class="sr-only" for="range1">Range</label>
                <select class="form-control" name="range1" disabled="true">
                  <option>Range</option>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                  <option value="trace">Trace</option>
                </select>
              </div>
            </div>
            <div class="form-row mt-2" id="composition2" hidden="true">
              <div class="form-group col-md-1 offset-md-3">
                <label class="sr-only" for="element2_mod">Element modifier</label>
                <select class="form-control" name="element2_mod" title="Select whether to search for an element that appears in the data or not" disabled="true">
                  <option value="IN" default>IN</option>
                  <option value="NOT">NOT</option>
                </select>
              </div>
              <div class="form-group col-sm-3 element">
                <label class="sr-only" for="element2">element</label>
                <select class="form-control custom-select element" name="element2" multiple disabled="true">
                  <option disabled>Element</option>
                  <% for(var i=0; i < Elements.length; i++) { %>
                    <option value="<%= Elements[i].symbol.toLowerCase()%>"><%= Elements[i].symbol %></option> 
                  <% } %>                   
                </select>
              </div>
              <div class="form-group col-sm-3">
                <label class="sr-only" for="range2">Range</label>
                <select class="form-control" name="range2" disabled="true">
                  <option>Range</option>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                  <option value="trace">Trace</option>
                </select>
              </div>
            </div>

            <div class="row mt-1">

              <div class=" col-md-2 offset-md-6 col-sm-3 offset-sm-6">
                <a class="btn btn-outline-light btn-block mt-2" id="reset-btn">Reset</a>
              </div>
              <div class="col-md-2 col-sm-3">
                <button class="btn btn-outline-warning btn-block mt-2">Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
        </body>
    );
}

export default DatabaseSearch;