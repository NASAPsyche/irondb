import React, { useState } from 'react'
import '../styles/Home.scss'

const Home = () => {
    const [name, setName] = useState();
    const [group, setGroup] = useState("first");
    const [title, setTitle] = useState();
    const [author, setAuthor] = useState();

    const handleChangeName = e => {
        setName(e.target.value);
    }

    const handleChangeGroup = e => {
        setGroup(e.target.value);
    }

    const handleChangeTitle = e => {
        setTitle(e.target.value);
    }

    const handleChangeAuthor = e => {
        setAuthor(e.target.value);
    }

    const handleSubmit = event => {
        console.log("name: " + name + "\ngroup: " + group + "\ntitle: " + title + "\nauthor: " + author);
    }

    return (
    <div className="Search">
          <div className="container-fluid pt-3 pb-5" id="top-container">
              <div className="d-flex flex-row align-items-center justify-content-center mt-5 mb-2">
                  <h1>Iron Meteorite Database</h1>
              </div>
          </div>
          <div className="container-fluid pt-3" id="bottom-container">
              <div className="d-flex flex-row align-items-center justify-content-center mt-5 mb-2">
                  <h3>Start with a simple search:</h3>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center mb-4">
                  <form id="home-search" action="/database" className="border border-dark p-3" onSubmit={handleSubmit}>
                      <div className="d-flex flex-row align-items-center justify-content-center ">
                          <div className="col-md-3">
                              <label className="sr-only" htmlFor ="name">Meteorite Name</label>
                              <input type="text" name="name" id="name" className="form-control" placeholder="meteorite name" onChange={handleChangeName}/>
                          </div>
                          <div className="col-md-2">
                              <label className="sr-only" htmlFor ="group">group</label>
                              <select className="form-control" id="group" name="group" placeholder="group" defaultValue={'DEFAULT'} onChange={handleChangeGroup}>
                                  <option value="DEFAULT" disabled hidden>group</option>
                                  <option>IAB</option>
                                  <option>IC</option>
                                  <option>IIAB</option>
                                  <option>IIG</option>
                                  <option>IIIAB</option>
                                  <option>IIICD</option>
                              </select>
                          </div>
                          <div className="col-md-2">
                              <label className="sr-only" htmlFor ="title">Paper Title</label>
                              <input type="text" name="title" id="title" className="form-control" placeholder="paper title" onChange={handleChangeTitle}/>
                          </div>
                          <div className="col-md-2">
                              <label className="sr-only" htmlFor ="author">Author</label>
                              <input type="text" name="author" id="author" className="form-control" placeholder="author" onChange={handleChangeAuthor}/>
                          </div>
                          <div className="col-md-2 col-sm-3">
                              <button className="btn btn-warning btn-block">Search</button>
                          </div>
                      </div>
                  </form>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center mb-4">
                  <h3> - or - </h3>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center">
                  <a href="/database" className="btn btn-warning">Enter the Database</a>
              </div>
          </div>

          <div className="container-fluid fixed-bottom">
              <div className="d-flex flex-row align-items-center justify-content-center mb-0">
                  <p><small>This website and work were created in partial fulfillment of Arizona State University Capstone Course “SER 401-402.”
                      The work is a result of the Psyche Student Collaborations component of NASA’s Psyche Mission (<a href="https://psyche.asu.edu">https://psyche.asu.edu</a>).
                      “Psyche: A Journey to a Metal World” [Contract number NNM16AA09C] is part of the NASA Discovery Program mission to solar system targets.
                      Trade names and trademarks of ASU and NASA are used in this website htmlFor identification only.
                      Their usage does not constitute an official endorsement, either expressed or implied, by Arizona State University or National Aeronautics and Space Administration.
                      The content is solely the responsibility of the authors and does not necessarily represent the official views of ASU or NASA.
                  </small></p>
              </div>
          </div>
    </div>
    );
}

export default Home;
