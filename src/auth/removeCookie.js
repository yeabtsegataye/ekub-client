import Cookie from 'js-cookie';

const removeCookie =(cookieName)=>{
    // console.log(cookieName,'name')
return Cookie.remove(cookieName);
}
export default removeCookie