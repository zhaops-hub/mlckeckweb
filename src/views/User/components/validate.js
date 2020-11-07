import store from '@/store/' 
import passwordValidator  from 'password-validator'

export async function validatePass(rule, value, callback){
    var schema = new passwordValidator();
    schema
    .is().min(6)                                   // Minimum length 8
    .is().max(16)                                  // Maximum length 100
     
    if(!schema.validate(value))
    {
        callback(new Error('密码格式不正确(6-16位)'))
    }
    else
    {
        callback()
    }
}