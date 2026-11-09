export type CustomerSignInInput = {
  identity: string;
  password: string;
};

export type CustomerSignUpInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

export type CustomerSignInResult =
  | { status: "authenticated" }
  | { status: "unavailable"; message: string };

export type CustomerSignUpResult =
  | { status: "registered" }
  | { status: "unavailable"; message: string };

export interface CustomerAuthService {
  signIn(input: CustomerSignInInput): Promise<CustomerSignInResult>;
  signUp(input: CustomerSignUpInput): Promise<CustomerSignUpResult>;
}

export const customerAuthService: CustomerAuthService = {
  async signIn() {
    return {
      status: "unavailable",
      message: "Giriş servisi henüz bağlı değil. Gerçek kullanıcı girişi yapılmadı.",
    };
  },
  async signUp() {
    return {
      status: "unavailable",
      message: "Kayıt servisi henüz bağlı değil. Gerçek hesap oluşturulmadı.",
    };
  },
};
