import React from 'react';
import { AuthUserContext, withAuthorization } from '../session';
import { PasswordForgetForm } from '../password-forget';
import PasswordChangeForm from '../password-change';
 
const AccountPage = () => (
<AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        {/* <PasswordForgetForm /> */}
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);
 
const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(AccountPage);