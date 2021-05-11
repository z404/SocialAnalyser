(function(exp) {
    
    exp.set_success_fail_msg = (color, msg, display) => {
        document.getElementById('status_div').style.display = display;
        document.getElementById('success_fault').style.color = color;
        document.getElementById('success_fault').innerHTML = msg;
    }
    
})(this.updateUI = {});