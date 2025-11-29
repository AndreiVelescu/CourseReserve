export type LoginSubmitDataType = {
  email: string;
  password: string;
};

export type LoginError = {
  detail?: {
    email?: string;
    password?: string;
    // Added by frontend to have the same format for firebase errors in order to easily access them
    global?: string;
    email_verified?: boolean;
    disable_login?: boolean;
  };
};
