import { ILoginForm } from "@/providers/auth/contexts";


export const handleSignIn = (data: ILoginForm, loginUser) => {
    const userNameOrEmailAddress = data?.userNameOrEmailAddress;
    const password = data?.password;
    const imei = data?.imei;
    const rememberMe = data?.rememberMe;
  
    if(userNameOrEmailAddress && password){
      loginUser({userNameOrEmailAddress, password, imei, rememberMe })
    }else{
      alert("login not allowed");
    }
  }