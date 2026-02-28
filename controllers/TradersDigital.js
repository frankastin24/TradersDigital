const  { view } = require( '../fuseo/view.js');

class TradersDigital {

    static home(request,context) {
        return view('main_site/home',{},context);
    }  
     static signup(request,context) {
        return view('main_site/sign_up',{},context);
    }   
      
} 

module.exports = TradersDigital;