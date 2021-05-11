function restore_options() {
    
    if (document.getElementById('save') != null) {
        document.getElementById('save').addEventListener('click', save_options);
    }
    
    chrome.storage.local.get(null, function (items) {  
                
        if (items.delimiter) {
            if (items.delimiter === 'semicolon')
                document.getElementById('semicolon_option').checked = true;
            else 
                document.getElementById('comma_option').checked = true;
        }
        
        if (items.columns) {
            for (let i = 0; i < items.columns.length; i++) {
                document.getElementById(items.columns[i]).checked = true;
            }
        }
        else {
            const checkboxes = document.querySelectorAll('input[type=checkbox]');
            for (let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = true;
            }
        }
    });
};


function save_options() {
    const select = document.getElementsByTagName('input');
    let columns = [];
    let delimiter = 'semicolon';
    
    for (let i = 0; i < select.length; i++) {
       
        if (select[i].type != null && select[i].type === 'radio' && select[i].checked) {
            delimiter = select[i].value;            
        }
        
        if (select[i].type != null && select[i].type == 'checkbox') {		
            if (select[i].checked) {                       
                columns.push(select[i].value);
            }
        }
    }
    
    if (columns.length === 0) 
        columns = ['Date1','Date2','Time','UserPhone','UserName','MessageBody','MediaType','MediaLink','QuotedMessage','QuotedMessageDate',
                   'QuotedMessageTime'];       
    
    chrome.storage.local.set({
        'delimiter': delimiter,
        'columns': columns 
    }, function(){
        window.close();
    });	
    
};


document.addEventListener('DOMContentLoaded', restore_options);

