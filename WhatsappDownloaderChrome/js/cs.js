function inject_script(script_name){
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(script_name);
	(document.head||document.documentElement).appendChild(s);	
}


inject_script('js/moment-with-locales.js');
inject_script('js/lodash.js');
inject_script('js/injectedWA.js');

var callRemote = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
};




function zipBlob(files, doc, title) {
    
    callRemote(chrome.runtime.getURL('css/wa_layout.css'), function(css_file) {
    
        //remove illegal characters
        title = title.replace(/[/\\?%*:|"<>]/g, '-'); 
        
        files.push({name: title + '.html', file: doc});
        files.push({name: 'wa_layout.css', file: css_file});

        zip.createWriter(new zip.BlobWriter("application/zip"), function(writer) {
            var start = new Date().getTime();

            var f = 0;

            function nextFile(f) {

                var fblob = new Blob([files[f].file], { type: "text/plain" });
                writer.add(files[f].name, new zip.BlobReader(fblob), function() {
                    // callback
                    f++;       
                    if (f < files.length) {
                        var msg = '{"number": "' + f + '", "count": ' + files.length + '}';
                        document.dispatchEvent(new CustomEvent('set_progress_text',
                                                               {'detail':msg}));
                        nextFile(f);
                    } else close();
                });
            };

            function close() {
                // close the writer
                writer.close(function(blob) {
                    saveAs(blob, title + '.zip');                                     
                    document.dispatchEvent(new CustomEvent('finish'));   
                });
            };

            nextFile(f);

        }, onerror)
    });
};


window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;
    
    if (event.data.type && (event.data.type == "FROM_PAGE")) {       
       zipBlob(event.data.media, event.data.doc, event.data.title);
        //document.dispatchEvent(new CustomEvent('finish')); 
    }
    
    if (event.data.type && (event.data.type == "FROM_PAGE_CSV")) {
        const blob = new Blob([event.data.doc], { type: "text/csv" });
        saveAs(blob, event.data.title + '.csv'); 
        document.dispatchEvent(new CustomEvent('finish')); 
    }

    if (event.data.type && (event.data.type == "FROM_PAGE_TXT")) {
        const blob = new Blob([event.data.doc], { type: "text/plain" });
        saveAs(blob, event.data.title + '.txt'); 
        document.dispatchEvent(new CustomEvent('finish')); 
    }
});


chrome.runtime.onMessage.addListener(function (request_msg, sender, sendResponse) {   
              
    if (request_msg.key === 'get_data') {
        chrome.storage.local.get(null, function (items) {             

//            var details = '{"firstDate": ' + items.firstDate + ', "lastDate": ' + items.lastDate + ', "css": "' +
//                 chrome.runtime.getURL('css/wa_layout.css') + '", "get_media": ' + items.save_media + ', "export_type": "' + items.export_type + '"}';
           
            var details = JSON.stringify(items);

            document.dispatchEvent(new CustomEvent('to_injected_get_data', {          
                'detail':details
            }));
        });
    }  
});

