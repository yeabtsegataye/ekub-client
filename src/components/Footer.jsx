import React from 'react'

function Footer() {
  return (
   <>
        <footer className="small p-3 px-md-4 mt-auto">
            <div className="row justify-content-between">
                <div className="col-lg text-center text-lg-left mb-3 mb-lg-0">
                    <ul className="list-dot list-inline mb-0">
                        <li className="list-dot-item list-dot-item-not list-inline-item mr-lg-2"><a className="link-dark" href="#">FAQ</a></li>
                        <li className="list-dot-item list-inline-item mr-lg-2"><a className="link-dark" href="#">Support</a></li>
                        <li className="list-dot-item list-inline-item mr-lg-2"><a className="link-dark" href="#">Contact us</a></li>
                    </ul>
                </div>

                <div className="col-lg text-center mb-3 mb-lg-0">
                    <ul className="list-inline mb-0">
                        <li className="list-inline-item mx-2"><a className="link-muted" href="#"><i className="gd-twitter-alt"></i></a></li>
                        <li className="list-inline-item mx-2"><a className="link-muted" href="#"><i className="gd-facebook"></i></a></li>
                        <li className="list-inline-item mx-2"><a className="link-muted" href="#"><i className="gd-github"></i></a></li>
                    </ul>
                </div>

                <div className="col-lg text-center text-lg-right">
                    &copy; 2019 Graindashboard. All Rights Reserved.
                </div>
            </div>
        </footer>
   </>
  )
}

export default Footer