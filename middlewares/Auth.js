const createError = require('http-errors');
const { verify } = require('./../functions/token');

class Auth{

  constructor(req, res, next){
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async isAuthenticated(){
    if (this.req.cookies.token !== undefined){
        verify(this.req.cookies.token).then((result) => {
            if (result === "error"){
                this.res.clearCookie('token');
                this.next(createError(403));
            }
            else {
                this.next();
            }
        });
    }
    else {
      this.res.redirect("/login");
    }
  }

  async isUnauthenticated(){
    if (this.req.cookies.token !== undefined){
        this.res.redirect("/dashboard");
    }
    else {
        this.next();
    }
  }
  
  // PRIVATE METHODS 
  
  // #unauthorized_login(){
  //   this.req.session['query_result'] = {
  //     status: "error",
  //     type: "invalid_login",
  //     message: "Invalid Username or Password."
  //   }
  // }

  // #internal_error(){
  //   this.req.session['query_result'] = {
  //     status: "error",
  //     type: "internal_error",
  //     message: "Unexpected Error. Please try again."
  //   }
  // }
};

module.exports = Auth;
