export const emailExistError = (email: string) => `Email ${email} - already exist`;
export const unableToSendAnEmail = (email: string) =>
    `The server was unable to send an email - ${email} to confirm registration.`;
