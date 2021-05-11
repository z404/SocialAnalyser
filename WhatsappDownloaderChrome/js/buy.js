(function() {

    
    var validate_license_key = async function() {
        try {
            updateUI.set_success_fail_msg('', '', 'none');
                        
            const key = document.getElementById('key_field').value;    
           
            const response = await fetch('https://chatsaver.org/php/licensecheck_wa.php?' + new URLSearchParams({
                key: key,
                date: Date.now(),
                from_buy: true
            }));

            const blob = await response.blob();
            let raw_data = await blob.text();

            if (raw_data) {
                if (raw_data.indexOf('Too many requests') !== -1) {
                    alert(raw_data);
                }   
                else {
                    raw_data = raw_data.substring(raw_data.indexOf("{"));
                    raw_data = raw_data.slice(0, -2); 
                    const parsed = JSON.parse(raw_data);

                    if (parsed.success) {

                        chrome.storage.local.set({
                            'key': key
                        }, function() {

                            updateUI.set_success_fail_msg('green', 'Validation successful!', 'block');                     

                        //chrome.runtime.sendMessage({msg: "close"}, function(response) {

                            setTimeout(function() {  
                                window.close();
                            }, 1000);
                        });
                       // });

                    }
                    else {
                        updateUI.set_success_fail_msg('red', 'Error validation, please <a href="https://chatsaver.org/contact">contact</a> us.', 'block');  
                    } 
                }
            }            
        }
        catch (e) {
            alert(e.message);
            console.log(e.stack);
        }
    };
    
    var connect_button = () => {
        document.getElementById('validate').addEventListener('click', validate_license_key.bind(this));
    };
            
   document.addEventListener('DOMContentLoaded', connect_button);
})()