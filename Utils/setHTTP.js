export function setHTTP (urlImage,link){

    if(urlImage.includes('http')){
        return urlImage
    }else{
        return link+urlImage
    }
}

