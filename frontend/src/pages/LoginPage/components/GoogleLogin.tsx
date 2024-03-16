import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

const CLIENT_ID = "827529413912-celsdkun_YOUR_API_KEY_lsn28.apps.googleusercontent.com";

interface UserInfo {
    name: string;
    emailId: string;
}

interface State {
    isLoggedIn: boolean;
    userInfo: UserInfo;
}

class GoogleLoginComponent extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isLoggedIn: false,
            userInfo: {
                name: "",
                emailId: "",
            },
        };
    }

    // Success Handler
    responseGoogleSuccess = (response: any) => {
        const {
            profileObj: { name, email },
        } = response;
        const userInfo = {
            name: name,
            emailId: email,
        };
        this.setState({ userInfo, isLoggedIn: true });
    };

    // Error Handler
    responseGoogleError = (response: any) => {
        console.error(response);
    };

    // Logout Session and Update State
    logout = () => {
        const userInfo = {
            name: "",
            emailId: "",
        };
        this.setState({ userInfo, isLoggedIn: false });
    };

    render() {
        const {
            isLoggedIn,
            userInfo: { name },
        } = this.state;

        return (
            <div className="row mt-5">
                <div className="col-md-12">
                    {isLoggedIn ? (
                        <div>
                            <h1>Welcome, {name}</h1>

                            <GoogleLogout
                                clientId={CLIENT_ID}
                                buttonText="Logout"
                                onLogoutSuccess={this.logout}
                            />
                        </div>
                    ) : (
                        <GoogleLogin
                            clientId={CLIENT_ID}
                            buttonText="Sign In with Google"
                            onSuccess={this.responseGoogleSuccess}
                            onFailure={this.responseGoogleError}
                            isSignedIn
                            cookiePolicy="single_host_origin"
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default GoogleLoginComponent;
