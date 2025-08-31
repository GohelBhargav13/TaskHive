import { body } from "express-validator";

class ApiClient{
    constructor(){
        this.baseUrl="http://localhost:8000/api/v1"
        this.allowedHeaders={
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }

    async customFetch(endPoint,options = {}){

       try {
         const url = `${this.baseUrl}${endPoint}`;
         const headers = { ...this.allowedHeaders,...options.headers }
 
         const config = {
             ...options,
             headers,
             credentials:"include" // for cookies
         }

         console.log(`Fetching ${url} from API...`);
         const response = await fetch(url,config);
         const data = await response.json();

         console.log({response,data});

         return data;
       } catch (error) {
            console.error(error);
            throw error;
       }
    }

    async singUp(email,password,username){
        return this.customFetch("/user/register",{
            method:"POST",
            body:JSON.stringify({email,password,username})
        })
    }

    async verifyEmail(token){
        return this.customFetch(`/user/verify/${token}`,{
            method:"GET"
        })
    }

    async login(email,password){
        return this.customFetch("/user/login",{
            method:"POST",
            body:JSON.stringify({ email,password })
        })
    }
    async getMe(){
        return this.customFetch("/user/me",{
            method:"GET",
            credentials:"include"
        })
    }
}

const apiClient = new ApiClient();
export default apiClient;   