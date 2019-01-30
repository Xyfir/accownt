import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

export default class LoginStep2 extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Send the 2FA data to the API's 'step 2' login controller.
   */
  onLogin() {
    request
      .post('/api/login/verify')
      .send({
        auth: this.props.tfa.auth,
        uid: this.props.tfa.uid,
        otpCode: this.props.tfa.security.otp ? this.refs.otpCode.value : 0
      })
      .end((err, res) => {
        if (err) {
          location.href = '/login';
          this.props.save({ tfa: {} });
          swal('Error', 'Could not validate 2FA data', 'error');
        } else {
          location.replace(res.body.redirect || '/user/account');
        }
      });
  }

  render() {
    if (!this.props.tfa) {
      location.href = '/login';
      return <div />;
    }

    return (
      <form className="login-2 md-paper md-paper--1 section flex">
        {this.props.tfa.security.otp ? (
          <TextField
            id="text--otp-code"
            ref="otpCode"
            type="text"
            label="App Verification Code"
            onKeyDown={e => (e.key == 'Enter' ? this.onLogin() : null)}
          />
        ) : null}

        <Button raised primary onClick={() => this.onLogin()}>
          Login
        </Button>
      </form>
    );
  }
}