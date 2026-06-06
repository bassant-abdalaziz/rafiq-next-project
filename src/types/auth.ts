export type SignUpPayload = {
  email: string;
  password: string;
  data: {
    name: string;
    department: string | null;
  };
};

export type LogiNPayload = {
  email: string;
  password: string;
  rememberMe?:boolean
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
  user: {
    id: string;
    role: string;
    email: string;
    user_metadata?: {
      name: string;
      department?: string;
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
  };
};


