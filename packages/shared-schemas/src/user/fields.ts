import {
  usernameField,
  displayNameField,
  uuidField,
  dateField,
  emailField,
  emailVerifiedField,
  passwordField,
} from "../common";

export const updateUserFields = {
  username: usernameField,
  displayName: displayNameField,
};

export const userFields = {
  id: uuidField,
  username: usernameField,
  password: passwordField,
  displayName: displayNameField,
  email: emailField,
  emailVerified: emailVerifiedField,
  createdAt: dateField,
};
