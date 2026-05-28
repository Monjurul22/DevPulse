export interface SignupInput {
  name:     string;
  email:    string;
  password: string;
  role?:    "contributor" | "maintainer";
}

export interface logInInput {
  
  email:    string;
  password: string;
  
}