export const emailExistError = (email: string) => `Email ${email} - already exist`;
export const unableToEnterError = (data: string) => `Unable to login with data ${data}`;
export const unableToSendAnEmail = (email: string) =>
    `The server was unable to send an email - ${email} to confirm registration.`;
