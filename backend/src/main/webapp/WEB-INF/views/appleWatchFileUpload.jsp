<%@taglib prefix="sec"
          uri="http://www.springframework.org/security/tags"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%--
  ~ Developed by Arastoo Bozorgi.
  ~ a.bozorgi67@gmail.com
  --%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
<head>
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

        <%--    For zipping the uploaded files--%>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js"></script>

        <c:url value="/resources/css/styles.css" var="myCSS" />
        <link rel="stylesheet" type="text/css" href="${myCSS}">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.4.0/min/dropzone.min.css" />

    </head>

    <title>Process AppleWatch Data</title>
</head>
<body>



<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">BEAPEngine</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
                <a class="nav-link" href="#">AppleWatch <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="fitbit-nav" href="#">Fitbit</a>
            </li>
        </ul>
        <form class="form-inline my-2 my-lg-0" action="/logoutuser">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>
        </form>
    </div>
</nav>

<div class="container" style="min-height: 800px;">

    <nav style="margin-top: 10px;">
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-process-tab" data-toggle="tab" href="#nav-process" role="tab" aria-controls="nav-process" aria-selected="true">Process Apple Watch Data</a>
            <a class="nav-item nav-link" id="nav-predict-tab" data-toggle="tab" href="#nav-predict" role="tab" aria-controls="nav-predict" aria-selected="false">Predict Activities</a>
        </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.4.0/min/dropzone.min.js"></script>

            <%--the process tab--%>
            <div class="tab-pane fade show active" id="nav-process" role="tabpanel" aria-labelledby="nav-process-tab">
                <div class="row" style="max-height: 300px; overflow: auto;">
                    <form action="" class="dropzone col-12" id="my-awesome-dropzone" style="margin-top: 10px;">
                    </form>
                </div>

                <div class="row">

                    <div class="col-8">

                        <div class="row">
                            <button type="submit" style="margin: 10px 5px 0 0;" class="btn btn-info" id="upload-files">Upload all files</button>

                            <button style="margin: 10px 5px 0 0;" class="btn btn-info" disabled id="process-files">Process uploaded files</button>

                            <button style="margin: 10px 5px 0 0;" class="btn btn-info" disabled id="download">Download processed files</button>

                            <button style="margin: 10px 5px 0 0;" class="btn btn-info" id="zip">Zip files</button>
                        </div>
                    </div>


                    <div class="col-4 text-right">

                        <div id="file-num" style="margin: 15px 5px 0 0;" class="float-left"></div>

                        <button style="margin: 10px 5px 0 0;" class="btn btn-danger" id="reset">Reset</button>

                        <button style="margin: 10px 5px 0 0;" class="btn btn-warning" id="help" data-toggle="modal" data-target="#exampleModalCenter">Need help?</button>

                        <div id="loader" style="margin: 10px 5px 0 0;" class="loader float-right"></div>
                    </div>

                </div>

                <!-- Modal -->
                <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLongTitle">Steps to process your data</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p>
                                    1. Drag your raw activity file to the box. The file should be a .xml file. <br>
                                    2. Hit the "Upload all files" button. <br>
                                    3. Hit the "Process uploaded files" when upload completes. <br>
                                    4. Download the processed file when processing is finished. <br>
                                    5. For identifying the type of your activities, go the "Predict Activities" tab. <br>
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div id="error" style="margin-top: 20px;" class="alert alert-danger" role="alert">
                </div>

                <script>

                    $('#loader').hide();
                    $('#error').hide();
                    $('#file-num').hide();
                    $('#process-files').prop('disabled', true);
                    $('#download').prop('disabled', true);

                    // Init dropzone instance
                    Dropzone.autoDiscover = false
                    const myDropzone = new Dropzone('#my-awesome-dropzone', {
                        url: "/rest/beapengine/applewatch/upload",
                        clickable: true,
                        acceptedFiles: '.xml',
                        enqueueForUpload: true,
                        maxFilesize: 500, // 500MB
                        maxFiles: 300, // maximum number of files allowed to be uploaded
                        uploadMultiple: true,
                        addRemoveLinks: true,
                        autoProcessQueue: false,
                        params: {type: "process"}
                    });

                    // keep the uploading file names
                    const file_names = [];

                    myDropzone.on("sending", function(file, xhr, formData) {
                        // Will send the filesize along with the file as POST data.
                        console.log('in sending ' + file.name);
                        file_names.push(file.name);
                        formData.append(file.name, file);
                    });

                    myDropzone.on("queuecomplete", function(file, xhr, formData) {
                        // Will send the filesize along with the file as POST data.
                        console.log(file_names);
                        $('#process-files').prop('disabled', false);
                    });

                    myDropzone.on("error", function(file, errorMessage, xhr) {
                        var errorDiv = $('#error');
                        errorDiv.html(errorMessage.message);
                        errorDiv.show();
                    });

                    myDropzone.on("maxfilesexceeded", function(file) {
                        console.log('maxfilesexceeded');
                        var errorDiv = $('#error');
                        errorDiv.html("You are not allowed to upload more than " + myDropzone.options.maxFiles + " files.");
                        errorDiv.show();
                    });

                    myDropzone.on("addedfile", function(file) {
                        var draggedFilesNum = myDropzone.files.length;
                        var fileNumDiv = $('#file-num');
                        fileNumDiv.html(draggedFilesNum + " files dropped");
                        fileNumDiv.show();
                    });

                    myDropzone.on("removedfile", function(file) {
                        var draggedFilesNum = myDropzone.files.length;
                        var fileNumDiv = $('#file-num');
                        fileNumDiv.html(draggedFilesNum + " files dropped");
                        fileNumDiv.show();

                        if (draggedFilesNum <= myDropzone.options.maxFiles){
                            var errorDiv = $('#error');
                            errorDiv.hide();
                        }
                    });

                    // upload the files to the server
                    var uploadButton = document.getElementById('upload-files')
                    uploadButton.addEventListener('click', function () {
                        file_names.splice(0, file_names.length);
                        $('#loader').hide();
                        $('#error').hide();
                        $('#process-files').prop('disabled', true);
                        $('#download').prop('disabled', true);


                        // // cleanup the server from the previous files before uploading new files
                        // $.ajax({
                        //     type: 'GET',  // http method
                        //     url: '/beapengine/applewatch/cleanup',
                        //     success: function (data, status, xhr) {
                        //     },
                        //     error: function (jqXhr, textStatus, errorMessage) {
                        //         $('#loader').hide();
                        //         var result = JSON.parse(jqXhr.responseText);
                        //         var errorDiv = $('#error');
                        //         errorDiv.html(result.message);
                        //         errorDiv.show();
                        //     }
                        // });


                        // Retrieve selected files
                        const acceptedFiles = myDropzone.getAcceptedFiles();
                        for (let i = 0; i < acceptedFiles.length; i++) {
                            console.log('acceptedFiles ' + i + ': ' + acceptedFiles[i])
                            myDropzone.processFile(acceptedFiles[i]);
                        }
                    });



                    // zip the uploaded files
                    var zipButton = document.getElementById('zip');
                    zipButton.addEventListener('click', function () {

                        // Retrieve selected files
                        const acceptedFiles = myDropzone.getAcceptedFiles();
                        console.log("acceptedFiles len: " + acceptedFiles.length);
                        var zip = new JSZip();

                        for (let i = 0; i < acceptedFiles.length; i++) {
                            console.log(acceptedFiles[i]);
                            console.log(acceptedFiles[i].name);

                            zip.file(acceptedFiles[i].name, acceptedFiles[i])
                        }

                        zip.generateAsync({
                            type: "blob",
                            compression: "DEFLATE",
                            compressionOptions: {
                                level: 6
                            }
                        }).then(function callback(blob) {

                            console.log(blob);
                            blob.lastModifiedDate = new Date();
                            blob.name = "applewatch.zip";
                            console.log(blob);

                            // window.location = "data:application/zip;base64," + blob;

                            var formData = new FormData();
                            formData.append('fname', 'applewatch.zip');
                            formData.append('data', blob);

                            console.log("formData: " + formData)

                            $.ajax({
                                type: 'POST',
                                url: '/rest/beapengine/applewatch/upload',
                                data: formData,
                                processData: false,
                                contentType: false,
                                success: function (data, status, xhr) {
                                    console.log('status: ' + status + ', data: ' + data);
                                },
                                error: function (jqXhr, textStatus, errorMessage) {
                                    var result = JSON.parse(jqXhr.responseText);
                                    console.log("error: " + result)
                                }
                            });

                        }, function (e) {
                            console.log("error: " + e);
                        });
                    });


                    // process the uploaded files
                    var processButton = document.getElementById('process-files')
                    processButton.addEventListener('click', function () {
                        // show the loader
                        $('#loader').show();
                        $('#error').hide();

                        $.ajax({
                            type: 'POST',  // http method
                            url: '/beapengine/applewatch/process',
                            data: { files: file_names },
                            dataType: 'json',
                            success: function (data, status, xhr) {
                                console.log('status: ' + status + ', data: ' + data);
                                $('#loader').hide();
                                $('#download').prop('disabled', false);
                            },
                            error: function (jqXhr, textStatus, errorMessage) {
                                $('#loader').hide();
                                var result = JSON.parse(jqXhr.responseText);
                                var errorDiv = $('#error');
                                errorDiv.html(result.message);
                                errorDiv.show();
                            }
                        });
                    });


                    // download the processed files
                    var downloadButton = document.getElementById('download')
                    downloadButton.addEventListener('click', function () {
                        $('#error').hide();
                        $('#loader').show();

                        var oReq = new XMLHttpRequest();
                        oReq.open("GET", "/beapengine/applewatch/downloadFile", true);
                        oReq.responseType = "arraybuffer";

                        oReq.send();

                        oReq.onload = function(oEvent) {
                            if (this.status == 200) {
                                $('#loader').hide();
                                var arrayBuffer = oReq.response;

                                console.log(oEvent);
                                console.log(arrayBuffer);

                                var a = $("<a style='display: none;'/>");

                                var blob = new Blob([arrayBuffer], {type: "application/zip"});
                                var url = URL.createObjectURL(blob);
                                console.log(url);

                                a.attr("href", url);
                                a.attr("download", "output.zip");
                                $("body").append(a);
                                a[0].click();
                                window.URL.revokeObjectURL(url);
                                a.remove();

                            } else {
                                $('#loader').hide();
                                var errorDiv = $('#error');
                                errorDiv.html("The requested file can't be downloaded");
                                errorDiv.show();
                            }

                        };

                        oReq.onerror = function (ev) {
                            $('#loader').hide();
                            var errorDiv = $('#error');
                            errorDiv.html(ev);
                            errorDiv.show();
                        };
                    });


                    // reset everything
                    var resetButton = document.getElementById('reset')
                    resetButton.addEventListener('click', function () {
                        $('#loader').show();
                        var draggedFiles = myDropzone.files;
                        for (var i = 0; i < draggedFiles.length; i++) {
                            myDropzone.removeFile(draggedFiles[i]);
                        }

                        // cleanup the server from the previous files before uploading new files
                        $.ajax({
                            type: 'GET',  // http method
                            url: '/beapengine/applewatch/cleanup',
                            success: function (data, status, xhr) {
                                $('#loader').hide();
                            },
                            error: function (jqXhr, textStatus, errorMessage) {
                                $('#loader').hide();
                                var result = JSON.parse(jqXhr.responseText);
                                var errorDiv = $('#error');
                                errorDiv.html(result.message);
                                errorDiv.show();
                            }
                        });

                        $('#error').hide();
                        $('#loader').hide();
                        $('#file-num').hide();
                        $('#process-files').prop('disabled', true);
                        $('#download').prop('disabled', true);

                    });
                </script>
            </div>

            <%--the predict tab--%>
            <div class="tab-pane fade" id="nav-predict" role="tabpanel" aria-labelledby="nav-predict-tab">

                <div class="row" style="max-height: 300px; overflow: auto;">
                    <form action="" class="dropzone col-12" id="my-awesome-dropzone-predict" style="margin-top: 10px;">
                    </form>
                </div>

                <div class="row">

                    <div class="col-8">

                        <div class="row">
                            <button type="submit" style="margin: 10px 5px 0 0" class="btn btn-info" id="upload-files-predict">Upload all files</button>

                            <div class="input-group" style="width: 300px; margin: 10px 5px 0 0">
                                <select class="custom-select" id="predict-model" aria-label="Example select with button addon">
                                    <option selected value="choose">Choose ...</option>
                                    <option value="decissionTree">Decision Tree</option>
                                    <option value="randomForest">Random Forest</option>
                                    <option value="svm">SVM</option>
                                    <option value="rotationForest">Rotation Forest</option>
                                </select>
                                <div class="input-group-append">
                                    <button class="btn btn-info" disabled id="predict-files" type="button">Predict</button>
                                </div>
                            </div>

                            <button style="margin: 10px 5px 0 0" class="btn btn-info" disabled id="download-predict">Download predicted files</button>
                        </div>


                    </div>

                    <div class="col-4 text-right">

                        <div id="file-num-predict" style="margin: 15px 5px 0 0;" class="float-left"></div>

                        <button style="margin: 10px 5px 0 0" class="btn btn-danger" id="reset-predict">Reset</button>

                        <button style="margin: 10px 5px 0 0;" class="btn btn-warning" id="help-predict" data-toggle="modal" data-target="#exampleModalCenter-predict">Need help?</button>

                        <div id="loader-predict" style="margin: 10px 5px 0 0;" class="loader float-right"></div>

                    </div>

                </div>

                <!-- Modal -->
                <div class="modal fade" id="exampleModalCenter-predict" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLongTitle-predict">Steps to predict your activities</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p>
                                    1. Drag your processed activity file to the box. The file should be a ".csv" file. <br>
                                    2. Hit the "Upload all files" button. <br>
                                    3. Choose the classification model for the predictions. <br>
                                    4. Hit the "Predict" when upload completes. <br>
                                    5. Download the predicted file when prediction process is finished. <br>
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="error-predict" style="margin-top: 20px;" class="alert alert-danger" role="alert">
                </div>

                <script>

                    $('#loader-predict').hide();
                    $('#error-predict').hide();
                    $('#file-num-predict').hide();
                    $('#predict-files').prop('disabled', true);
                    $('#download-predict').prop('disabled', true);

                    // Init dropzone instance
                    Dropzone.autoDiscover = false
                    const myDropzonePredict = new Dropzone('#my-awesome-dropzone-predict', {
                        url: "/beapengine/applewatch/uploadFile",
                        clickable: true,
                        acceptedFiles: '.csv',
                        enqueueForUpload: true,
                        maxFilesize: 500, // 500MB
                        uploadMultiple: true,
                        addRemoveLinks: true,
                        autoProcessQueue: false,
                        params: {type: "predict"}
                    });

                    // keep the uploading file names
                    const file_names_predict = [];

                    myDropzonePredict.on("sending", function(file, xhr, formData) {
                        // Will send the filesize along with the file as POST data.
                        file_names_predict.push(file.name);
                        formData.append(file.name, file);
                    });

                    myDropzonePredict.on("queuecomplete", function(file, xhr, formData) {
                        // Will send the filesize along with the file as POST data.
                        console.log(file_names_predict);
                        $('#predict-files').prop('disabled', false);
                    });

                    myDropzonePredict.on("error", function(file, errorMessage, xhr) {
                        var errorDiv = $('#error-predict');
                        errorDiv.html(errorMessage.message);
                        errorDiv.show();
                    });

                    myDropzonePredict.on("maxfilesexceeded", function(file) {
                        console.log('maxfilesexceeded');
                        var errorDiv = $('#error-predict');
                        errorDiv.html("You are not allowed to upload more than " + myDropzonePredict.options.maxFiles + " files.");
                        errorDiv.show();
                    });

                    myDropzonePredict.on("addedfile", function(file) {
                        var draggedFilesNum = myDropzonePredict.files.length;
                        var fileNumDiv = $('#file-num-predict');
                        fileNumDiv.html(draggedFilesNum + " files dropped");
                        fileNumDiv.show();
                    });

                    myDropzonePredict.on("removedfile", function(file) {
                        var draggedFilesNum = myDropzonePredict.files.length;
                        var fileNumDiv = $('#file-num-predict');
                        fileNumDiv.html(draggedFilesNum + " files dropped");
                        fileNumDiv.show();

                        if (draggedFilesNum <= myDropzonePredict.options.maxFiles){
                            var errorDiv = $('#error-predict');
                            errorDiv.hide();
                        }
                    });

                    // upload the files to the server
                    var uploadButton = document.getElementById('upload-files-predict')
                    uploadButton.addEventListener('click', function () {
                        file_names_predict.splice(0, file_names_predict.length);
                        $('#loader-predict').hide();
                        $('#error-predict').hide();
                        $('#process-files-predict').prop('disabled', true);
                        $('#download-predict').prop('disabled', true);


                        // cleanup the server from the previous files before uploading new files
                        $.ajax({
                            type: 'GET',  // http method
                            url: '/beapengine/applewatch/cleanup',
                            success: function (data, status, xhr) {
                            },
                            error: function (jqXhr, textStatus, errorMessage) {
                                $('#loader-predict').hide();
                                var result = JSON.parse(jqXhr.responseText);
                                var errorDiv = $('#error-predict');
                                errorDiv.html(result.message);
                                errorDiv.show();
                            }
                        });


                        // Retrieve selected files
                        const acceptedFilesPredict = myDropzonePredict.getAcceptedFiles();
                        for (let i = 0; i < acceptedFilesPredict.length; i++) {
                            setTimeout(function () {
                                myDropzonePredict.processFile(acceptedFilesPredict[i])
                            }, i * 1000)
                        }
                    });

                    // predict the uploaded files
                    var predictButton = document.getElementById('predict-files')
                    predictButton.addEventListener('click', function () {
                        $('#error-predict').hide();

                        if ($('#predict-model').val() == "choose") {
                            var errorDiv = $('#error-predict');
                            errorDiv.html("Please select a prediction model to continue");
                            errorDiv.show();
                            return;
                        }

                        $('#loader-predict').show();

                        $.ajax({
                            type: 'POST',  // http method
                            url: '/beapengine/applewatch/predict',
                            data: {
                                files: file_names_predict,
                                model: $('#predict-model').val()
                            },
                            dataType: 'json',
                            success: function (data, status, xhr) {
                                console.log('status: ' + status + ', data: ' + data);
                                $('#loader-predict').hide();
                                $('#download-predict').prop('disabled', false);
                            },
                            error: function (jqXhr, textStatus, errorMessage) {
                                $('#loader-predict').hide();
                                var result = JSON.parse(jqXhr.responseText);
                                var errorDiv = $('#error-predict');
                                errorDiv.html(result.message);
                                errorDiv.show();
                            }
                        });
                    });


                    // download the predicted files
                    var downloadButtonPredict = document.getElementById('download-predict')
                    downloadButtonPredict.addEventListener('click', function () {
                        $('#error-predict').hide();
                        $('#loader-predict').show();

                        var oReqP = new XMLHttpRequest();
                        oReqP.open("GET", "/beapengine/applewatch/downloadFile", true);
                        oReqP.responseType = "arraybuffer";

                        oReqP.send();

                        oReqP.onload = function(oEvent) {
                            if (this.status == 200) {
                                $('#loader-predict').hide();
                                var arrayBuffer = oReqP.response;

                                console.log(oEvent);
                                console.log(arrayBuffer);

                                var a = $("<a style='display: none;'/>");

                                var blob = new Blob([arrayBuffer], {type: "application/zip"});
                                var url = URL.createObjectURL(blob);
                                console.log(url);

                                a.attr("href", url);
                                a.attr("download", "output.zip");
                                $("body").append(a);
                                a[0].click();
                                window.URL.revokeObjectURL(url);
                                a.remove();

                            } else {
                                $('#loader-predict').hide();
                                var errorDiv = $('#error-predict');
                                errorDiv.html("The requested file can't be downloaded");
                                errorDiv.show();
                            }

                        };

                        oReqP.onerror = function (ev) {
                            $('#loader-predict').hide();
                            var errorDiv = $('#error-predict');
                            errorDiv.html(ev);
                            errorDiv.show();
                        };
                    });


                    // reset everything
                    var resetButtonPredict = document.getElementById('reset-predict')
                    resetButtonPredict.addEventListener('click', function () {
                        $('#loader-predict').show();
                        var draggedFilesPredict = myDropzonePredict.files;
                        for (var i = 0; i < draggedFilesPredict.length; i++) {
                            myDropzonePredict.removeFile(draggedFilesPredict[i]);
                        }

                        // cleanup the server from the previous files before uploading new files
                        $.ajax({
                            type: 'GET',  // http method
                            url: '/beapengine/applewatch/cleanup',
                            success: function (data, status, xhr) {
                                $('#loader-predict').hide();
                            },
                            error: function (jqXhr, textStatus, errorMessage) {
                                $('#loader-predict').hide();
                                var result = JSON.parse(jqXhr.responseText);
                                var errorDiv = $('#error-predict');
                                errorDiv.html(result.message);
                                errorDiv.show();
                            }
                        });

                        $('#error-predict').hide();
                        $('#loader-predict').hide();
                        $('#file-num-predict').hide();
                        $('#process-files-predict').prop('disabled', true);
                        $('#download-predict').prop('disabled', true);

                    });
                </script>

            </div>
    </div>

</div> <!-- /container -->

<!-- Footer -->
<div class="fixed-bottom navbar-dark bg-dark text-center py-3">
    <span style="color: white;">© 2019 Copyright:</span>
    <a style="color: white;" href="http://www.beaplab.com/"> BEAPLab.com</a>
</div>
<!-- Footer -->

<script type="text/javascript">
    // handling the nav links
    $('#fitbit-nav').click(function () {
        window.location.href = window.location.origin + "/beapengine/fitbit/upload";
    });
</script>

</body>
</html>