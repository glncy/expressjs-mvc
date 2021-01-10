const { GenericView } = require("../../generics");

class Login extends GenericView{
  constructor(req, res){
    super();
    this.req = req;
    this.res = res;
  }

  view(){
    this.template_view = "login";
    this.template_options = {
      title: "Login",
      _csrf: this.req.csrfToken()
    }
    super.view();
  }

  process(){
    // CREATE PROCESS HERE
  }
};

module.exports = Login;
