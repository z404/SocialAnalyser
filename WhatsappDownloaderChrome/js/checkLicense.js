const licenceChecker = (function licenceCheckModule() {
    const CWS_LICENSE_API_URL = 'https://chatsaver.org/php/licensecheck_wa.php?';
    let trialPeriodDays = 10000;
    let verbose = false;
    let cachedResult;
    let tsCacheExpiration = 0;
    let accessToken;


    const init = function init(params) {
        if (params.trialPeriodDays) {
            trialPeriodDays = params.trialPeriodDays;
        }
        if (params.verbose) {
            verbose = true;
        }
    };

    const get = async function get(key, time, cbProcessResult) {
        try {
            if (Date.now() < tsCacheExpiration) {
                if (verbose) {
                    console.log('from cache', cachedResult);
                }
                cbProcessResult(cachedResult);
                return;
            }


            const response = await fetch(CWS_LICENSE_API_URL + new URLSearchParams({
                key: key,
                date: Date.now(),
            }));

            const blob = await response.blob();
            let raw_data = await blob.text();
            if (raw_data) {
                raw_data = raw_data.substring(raw_data.indexOf("{"));
                raw_data = raw_data.slice(0, -2);
                const result = processResponse(raw_data, response.status, time); //JSON.parse(raw_data);
                cbProcessResult(result);
            }
        } catch (error) {
            alert(error.message);
            console.log(error.stack);
        }
    };

    function processResponse(response, status, time) {

        const result = {};
        try {
            if (verbose) {
                console.log(response);
            }

            let data;
            if (status === 200) {
                data = JSON.parse(response);
                result.error = false;
                result.data = parseLicense(data, time);
                result.response = data;
                cachedResult = result;
            } else {
                result.error = true;
                result.response = response;
            }
        } catch (e) {
            result.error = true;
            result.data = response.substring(response.indexOf('"') + 1);
        }
        return result;
    }


    function parseLicense(license, time) {
        tsCacheExpiration = (parseInt(Date.now() / 1000, 10) +
            parseInt(license.maxAgeSecs, 10)) * 1000;
        if (!tsCacheExpiration) {
            tsCacheExpiration = 0;
        }
        if (license.success && license.purchase.price >= 500) {
            return 'FULL';
        }
        //      else if (!license.success || license.message === "That license does not exist for the provided product.") {
        //       
        //      let daysAgoLicenseIssued = Date.now() - time;//parseInt(license.purchase.created_at, 10);
        //      daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
        //      if (trialPeriodDays && daysAgoLicenseIssued <= trialPeriodDays) {
        //        if (verbose) {
        //          console.log('Free trial, still within trial period');
        //        }
        //        return 'FREE_TRIAL';
        //      }
        //      if (verbose) {
        //        console.log('Free trial, trial period expired.');
        //      }
        //      return 'FREE_TRIAL_EXPIRED';
        //    }
        //      else {
        //          
        //      }
        if (verbose) {
            console.log('No license ever issued.');
        }
        return 'FULL';
    }

    function xhrWithAuth(method, url, interactive, callback) {
        let retry = true;
        getToken();

        function getToken() {
            chrome.identity.getAuthToken({ interactive }, (token) => {
                if (chrome.runtime.lastError) {
                    callback(chrome.runtime.lastError);
                    return;
                }
                accessToken = token;
                requestStart();
            });
        }

        function requestStart() {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.onload = requestComplete;
            xhr.send();
        }

        function requestComplete() {
            if (this.status === 401 && retry) {
                retry = false;
                chrome.identity.removeCachedAuthToken({ token: accessToken },
                    getToken);
            } else {
                callback(null, this.status, this.response);
            }
        }
    }

    return {
        init,
        get
    };
}());

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'checkLicence') {

        licenceChecker.init({
            trialPeriodDays: 1,
            verbose: false
        });
        checkLicense(request.key, request.inst_time, function(isAuthorised) {
            sendResponse(isAuthorised);
        });
    }
    return true;
});

function checkLicense(key, time, cbContinue) {
    licenceChecker.get(key, time, function(result) {

        if (result.error) {
            cbContinue({
                error: result.data
            });
        }

        if (result.data === 'FULL' || result.data === 'FREE_TRIAL') {
            cbContinue({

                licenced: true
            });
        } else {
            cbContinue({

                licenced: true
            });
        }

    });
}