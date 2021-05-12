var open_settings = function() {
    chrome.runtime.openOptionsPage(function() {

    });
};

var download_chat = function(type) {

    const firstTStamp = new Date(document.getElementById('firstDate').value).getTime() / 1000;

    const interm_value = new Date(document.getElementById('lastDate').value);
    const lastTStamp = new Date(interm_value.getFullYear(), interm_value.getMonth(), interm_value.getDate(), 0, 0, 0).getTime() / 1000;
    //const lastTStamp = new Date(interm_value2).getTime() / 1000;

    if (lastTStamp > 0) {
        chrome.storage.local.set({
            'firstDate': firstTStamp,
            'lastDate': lastTStamp,
            'save_media': document.getElementById('media_cb').checked,
            'export_type': document.getElementById("exportType").value,
            'css': chrome.runtime.getURL('css/wa_layout.css'),
            'is_skip_msg': document.getElementById('skip_cb').checked,
            'is_background': document.getElementById('background_cb').checked,
            'is_dark': document.getElementById('dark_cb').checked,
            'download_type': type

        }, function() {

            // chrome.storage.local.get(null, function(items) {
            //     document.getElementById('info_lbl').innerHTML = 'Checking license status...';
            //     chrome.runtime.sendMessage({
            //         cmd: 'checkLicence',
            //         key: items.key,
            //         inst_time: items.inst_time
            //     }, (licenceData) => {
            //         document.getElementById('info_lbl').innerHTML = '';
            //         chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

            //             chrome.tabs.sendMessage(tabs[0].id, {
            //                 key: "get_data"
            //             }, null);
            //         });
            //     });
            // });
            document.getElementById('info_lbl').innerHTML = '';
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                document.getElementById('info_lbl').innerHTML = 'Working';
                chrome.tabs.sendMessage(tabs[0].id, {
                    key: "get_data"
                }, null);
            });
        });
    }
};

var select_type = function() {
    if (document.getElementById("exportType").value === 'CSV (chat)') {
        document.getElementById('media_cb').disabled = true;
        document.getElementById('skip_cb').disabled = true;
        document.getElementById('firstDate').disabled = false;
        document.getElementById('lastDate').disabled = false;
        document.getElementById('csv_settings').style = 'visibility:visible;';
        document.getElementById('dark_cb').disabled = true;
    }


    if (document.getElementById("exportType").value === 'CSV (group participants)') {
        document.getElementById('media_cb').disabled = true;
        document.getElementById('skip_cb').disabled = true;
        document.getElementById('firstDate').disabled = true;
        document.getElementById('lastDate').disabled = true;
        document.getElementById('csv_settings').style = 'visibility:visible;';
        document.getElementById('dark_cb').disabled = true;
    }

    if (document.getElementById("exportType").value === 'HTML') {
        document.getElementById('media_cb').disabled = false;
        document.getElementById('skip_cb').disabled = false;
        document.getElementById('firstDate').disabled = false;
        document.getElementById('lastDate').disabled = false;
        document.getElementById('dark_cb').disabled = false;
        document.getElementById('csv_settings').style = 'visibility: hidden;';
    }

    if (document.getElementById("exportType").value === 'Text') {
        document.getElementById('media_cb').disabled = true;
        document.getElementById('skip_cb').disabled = true;
        document.getElementById('firstDate').disabled = false;
        document.getElementById('lastDate').disabled = false;
        document.getElementById('csv_settings').style = 'visibility:hidden;';
        document.getElementById('dark_cb').disabled = true;

    }
};

var setUp = function() {

    chrome.storage.local.get(null, function(items) {

        const firstDateField = document.getElementById('firstDate');
        const lastDateField = document.getElementById('lastDate');


        if (firstDateField !== null) {
            firstDateField.addEventListener('blur', function(field) {
                if (moment(lastDateField.value).isBefore(firstDateField.value)) {
                    firstDateField.value = lastDateField.value;
                }
            });
        }

        if (lastDateField !== null) {
            lastDateField.addEventListener('blur', function(field) {
                if (moment(lastDateField.value).isBefore(firstDateField.value)) {
                    firstDateField.value = lastDateField.value;
                }
            });
        }



        var lastDate = Date.now(),
            firstDate = 978307201000;
        if (items.lastDate) {
            lastDate = new Date(Number(items.lastDate * 1000));
            //lastDate.setDate(lastDate.getDate() - 1);
        }
        if (items.firstDate) {
            firstDate = new Date(Number(items.firstDate * 1000));
        }

        if (moment(lastDate).isBefore(firstDate)) {
            firstDate = lastDate;
        }

        var lastDateString = moment(lastDate).format('YYYY-MM-DD');
        lastDateField.value = lastDateString;


        var firstDateString = moment(firstDate).format('YYYY-MM-DD');
        firstDateField.value = firstDateString;


        if (document.getElementById('download') != null) {
            document.getElementById('download').addEventListener('click', download_chat.bind(this, 'one'));
        }
        if (document.getElementById('download_all') != null) {
            document.getElementById('download_all').addEventListener('click', download_chat.bind(this, 'all'));
        }

        document.getElementById('media_cb').checked = items.save_media;
        document.getElementById('skip_cb').checked = items.is_skip_msg;
        document.getElementById('background_cb').checked = items.is_background;
        document.getElementById('dark_cb').checked = items.is_dark;

        document.getElementById('skip_cb').disabled = !document.getElementById('media_cb').checked;


        document.getElementById("exportType").value = (items.export_type ? items.export_type : 'HTML');
        if (document.getElementById("exportType").value === 'CSV (chat)') {
            document.getElementById('media_cb').disabled = true;
            document.getElementById('dark_cb').disabled = true;
            document.getElementById('csv_settings').style = 'visibility:visible;';
        }
        if (document.getElementById("exportType").value === 'CSV (group participants)') {
            document.getElementById('media_cb').disabled = true;
            document.getElementById('dark_cb').disabled = true;
            document.getElementById('csv_settings').style = 'visibility:visible;';
            firstDateField.disabled = true;
            lastDateField.disabled = true;
        }
        if (document.getElementById("exportType").value === 'Text') {
            document.getElementById('media_cb').disabled = true;
            document.getElementById('dark_cb').disabled = true;
        }

        document.getElementById("exportType").addEventListener("change", select_type, false);

        document.getElementById('csv_settings').addEventListener('click', open_settings);


        document.querySelector('#media_cb').addEventListener('click', function() {
            document.getElementById('skip_cb').disabled = !document.getElementById('media_cb').checked;
        });


    });
};

document.addEventListener('DOMContentLoaded', setUp);