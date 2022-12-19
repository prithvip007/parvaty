import React from 'react'
import { Link } from 'react-router-dom';

class Logout extends React.Component {

    render() {
        return (
            <div className="wrapper">
                <div className="container-fluid">
                    <div className="row">

                        <div style={{ textAlign: "center", margin: "auto" }} className="col-sm-6  login-page-fields">
                            <div className="login-box m-auto">
                                <div className="login-logo mt-5">
                                    <a href="/"><b>Parvaty Cloud Hosting</b></a>
                                </div>
                                <div className="card form-card" >
                                    <div className="card-body login-card-body">
                                        <h4 className="login-box-msg ">Logedout Successfully</h4>

                                        <div className="row">
                                            <div className="col-12">

                                            </div>
                                            <div className="col-6">
                                                <p className="mb-1 font-weight-lighter un">
                                                    <Link to="/forgot-password" className="text-center">
                                                        <small><u>Forgot Password?</u></small>
                                                    </Link>
                                                </p>
                                            </div>
                                            <div className="col-6">
                                                <p className="mb-0 font-weight-lighter">
                                                    <Link to="/register" className="text-center">
                                                        <small><u>New to Parvaty? SignUp</u></small>
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Logout;
