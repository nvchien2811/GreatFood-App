export const validateName = (name) =>{
    if(name==undefined){
        return false
    }else{
        var re = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]{2,30}$/;
        return re.test(String(name).toLowerCase());
    }
}
export const validateUserName = (username) =>{
    if(username==undefined){
        return false
    }else{
        var regex = /^[0-9a-zA-Z ]{2,30}$/;
        return regex.test(String(username).toLowerCase());
    }
}
export const validatePass = (pass)=>{
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/
    return re.test(pass)
}
export const validateEmail = (email)=>{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase().trim());
}
export const validatePhoneNumber = (phone)=>{
    const re = /(84[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})\b/g
    return re.test(String(phone).toLowerCase().trim());
}