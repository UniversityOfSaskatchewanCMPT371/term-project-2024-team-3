<%@taglib prefix="sec"
          uri="http://www.springframework.org/security/tags"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%--
  ~ Developed by Arastoo Bozorgi.
  ~ a.bozorgi67@gmail.com
  --%>

<%--
  ~ Developed by Arastoo Bozorgi.
  ~ a.bozorgi67@gmail.com
  --%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Process Fitbit Data</title>

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

    <%--    For downloading a file--%>
    <script type="text/javascript" src="http://cdn.jsdelivr.net/g/filesaver.js"></script>


    <c:url value="/resources/css/styles.css" var="myCSS" />
    <link rel="stylesheet" type="text/css" href="${myCSS}">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.4.0/min/dropzone.min.css" />


</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">BEAPEngine</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item">
                <a class="nav-link" id="applewatch-nav" href="#">AppleWatch <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item active">
                <a class="nav-link" href="#">Fitbit</a>
            </li>
        </ul>
        <form class="form-inline my-2 my-lg-0" action="/logoutuser">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>
        </form>
    </div>
</nav>

<div class="container">

    <nav style="margin-top: 10px;">
        <div class="nav nav-tabs" id="f-nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="f-nav-process-tab" data-toggle="tab" href="#f-nav-process" role="tab" aria-controls="f-nav-process" aria-selected="true">Process Fitbit Data</a>
            <a class="nav-item nav-link" id="f-nav-predict-tab" data-toggle="tab" href="#f-nav-predict" role="tab" aria-controls="f-nav-predict" aria-selected="false">Predict Activities</a>
        </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.4.0/min/dropzone.min.js"></script>

        <%--the process tab--%>
        <div class="tab-pane fade show active" id="f-nav-process" role="tabpanel" aria-labelledby="f-nav-process-tab">
            <div class="row" style="max-height: 300px; overflow: auto;">
                <form action="" class="dropzone col-12" id="f-my-awesome-dropzone" style="margin-top: 10px;">
                </form>
            </div>

            <div class="row">

                <div class="col-8">

                    <div class="row">
                        <button type="submit" style="margin: 10px 5px 0 0;" class="btn btn-info" id="f-upload-files">Upload all files</button>

                        <button style="margin: 10px 5px 0 0;" class="btn btn-info" disabled id="f-process-files">Process uploaded files</button>

                        <button style="margin: 10px 5px 0 0;" class="btn btn-info" disabled id="f-download">Download processed files</button>

                        <button style="margin: 10px 5px 0 0;" class="btn btn-info" id="f-zip">Zip files</button>

                        <button style="margin: 10px 5px 0 0;" class="btn btn-info" id="f-test-download">Test download</button>
                    </div>
                </div>


                <div class="col-4 text-right">

                    <div id="f-file-num" style="margin: 15px 5px 0 0;" class="float-left"></div>

                    <button style="margin: 10px 5px 0 0;" class="btn btn-danger" id="f-reset">Reset</button>

                    <button style="margin: 10px 5px 0 0;" class="btn btn-warning" id="f-help" data-toggle="modal" data-target="#f-exampleModalCenter">Need help?</button>

                    <div id="f-loader" style="margin: 10px 5px 0 0;" class="loader float-right"></div>
                </div>

            </div>

            <!-- Modal -->
            <div class="modal fade" id="f-exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="f-exampleModalLongTitle">Steps to process your data</h5>
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


            <div id="f-error" style="margin-top: 20px;" class="alert alert-danger" role="alert">
            </div>

            <script>

                $('#f-loader').hide();
                $('#f-error').hide();
                $('#f-file-num').hide();
                $('#f-process-files').prop('disabled', true);
                $('#f-download').prop('disabled', true);

                // Init dropzone instance
                Dropzone.autoDiscover = false
                const myDropzoneF = new Dropzone('#f-my-awesome-dropzone', {
                    url: "/rest/beapengine/fitbit/upload",
                    clickable: true,
                    acceptedFiles: '.json',
                    enqueueForUpload: true,
                    maxFilesize: 3000, // 500MB,
                    maxFiles: 3000, // maximum number of files allowed to be uploaded
                    uploadMultiple: true,
                    addRemoveLinks: true,
                    autoProcessQueue: false
                });

                // keep the uploading file names
                const fileNamesF = [];



                myDropzoneF.on("sending", function(file, xhr, formData) {
                    // Will send the filesize along with the file as POST data.
                    $('#f-loader').show();
                    fileNamesF.push(file.name);
                    formData.append(file.name, file);
                });

                myDropzoneF.on("queuecomplete", function(file, xhr, formData) {
                    // Will send the filesize along with the file as POST data.
                    console.log(fileNamesF);
                    $('#f-loader').hide();
                    $('#f-process-files').prop('disabled', false);
                });

                myDropzoneF.on("error", function(file, errorMessage, xhr) {
                    console.log('error');
                    var errorDiv = $('#f-error');
                    errorDiv.html(errorMessage.message);
                    errorDiv.show();
                });

                myDropzoneF.on("maxfilesexceeded", function(file) {
                    console.log('maxfilesexceeded');
                    var errorDiv = $('#f-error');
                    errorDiv.html("You are not allowed to upload more than " + myDropzoneF.options.maxFiles + " files.");
                    errorDiv.show();
                });

                myDropzoneF.on("addedfile", function(file) {
                    var draggedFilesNum = myDropzoneF.files.length;
                    var fileNumDiv = $('#f-file-num');
                    fileNumDiv.html(draggedFilesNum + " files dropped");
                    fileNumDiv.show();
                });

                myDropzoneF.on("removedfile", function(file) {
                    var draggedFilesNum = myDropzoneF.files.length;
                    var fileNumDiv = $('#f-file-num');
                    fileNumDiv.html(draggedFilesNum + " files dropped");
                    fileNumDiv.show();

                    if (draggedFilesNum <= myDropzoneF.options.maxFiles){
                        var errorDiv = $('#f-error');
                        errorDiv.hide();
                    }
                });

                // upload the files to the server
                var uploadButtonF = document.getElementById('f-upload-files')
                uploadButtonF.addEventListener('click', function () {
                    fileNamesF.splice(0, fileNamesF.length);
                    $('#f-loader').hide();
                    $('#f-error').hide();
                    $('#f-process-files').prop('disabled', true);
                    $('#f-download').prop('disabled', true);


                    // cleanup the server from the previous files before uploading new files
                    // $.ajax({
                    //     type: 'GET',  // http method
                    //     url: '/rest/beapengine/fitbit/cleanup',
                    //     success: function (data, status, xhr) {
                    //     },
                    //     error: function (jqXhr, textStatus, errorMessage) {
                    //         $('#f-loader').hide();
                    //         var result = JSON.parse(jqXhr.responseText);
                    //         var errorDiv = $('#f-error');
                    //         errorDiv.html(result.message);
                    //         errorDiv.show();
                    //     }
                    // });


                    // Retrieve selected files
                    const acceptedFilesF = myDropzoneF.getAcceptedFiles();
                    for (let i = 0; i < acceptedFilesF.length; i++) {
                        // myDropzoneF.processFile(acceptedFilesF[i]);
                        setTimeout(function () {
                            myDropzoneF.processFile(acceptedFilesF[i])
                        }, i * 100)
                    }
                });



                // zip the uploaded files
                var zipButton = document.getElementById('f-zip');
                zipButton.addEventListener('click', function () {

                    // Retrieve selected files
                    const acceptedFiles = myDropzoneF.getAcceptedFiles();
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
                        },
                    }, function updateCallback(metadata) {
                        console.log(metadata.percent + '%');
                    }).then(function callback(blob) {

                        console.log(blob);
                        blob.lastModifiedDate = new Date();
                        blob.name = "fitbit.zip";
                        console.log(blob);

                        var formData = new FormData();
                        formData.append('fname', 'fitbit.zip');
                        formData.append('data', blob);

                        console.log("formData: " + formData)

                        $.ajax({
                            type: 'POST',
                            url: '/rest/beapengine/fitbit/upload',
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
                var processButtonF = document.getElementById('f-process-files')
                processButtonF.addEventListener('click', function () {
                    // show the loader
                    $('#f-loader').show();
                    $('#f-error').hide();

                    $.ajax({
                        type: 'POST',  // http method
                        url: '/rest/beapengine/fitbit/process',
                        data: { files: fileNamesF },
                        dataType: 'json',
                        success: function (data, status, xhr) {
                            console.log('status: ' + status + ', data: ' + data);
                            $('#f-loader').hide();
                            $('#f-download').prop('disabled', false);
                        },
                        error: function (jqXhr, textStatus, errorMessage) {
                            $('#f-loader').hide();
                            var result = JSON.parse(jqXhr.responseText);
                            var errorDiv = $('#f-error');
                            errorDiv.html(result.message);
                            errorDiv.show();
                        }
                    });
                });




                // download a files
                var downloadTestButtonF = document.getElementById('f-test-download')
                downloadTestButtonF.addEventListener('click', function () {

                    $.ajax({
                        type: 'GET',  // http method
                        url: '/rest/beapengine/fitbit/download_file/93/process',
                        // dataType: 'json',
                        success: function (data, status, xhr) {
                            console.log('status: ' + status + ', data: ' + data);
                            console.log('file: ' + data.file);

                            function b64toBlob(b64Data, contentType, sliceSize) {
                                contentType = contentType || '';
                                sliceSize = sliceSize || 512; // sliceSize represent the bytes to be process in each batch(loop), 512 bytes seems to be the ideal slice size for the performance wise

                                var byteCharacters = atob(b64Data);
                                var byteArrays = [];

                                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                                    var byteNumbers = new Array(slice.length);
                                    for (var i = 0; i < slice.length; i++) {
                                        byteNumbers[i] = slice.charCodeAt(i);
                                    }

                                    var byteArray = new Uint8Array(byteNumbers);

                                    byteArrays.push(byteArray);
                                }

                                var blob = new Blob(byteArrays, { type: contentType });
                                return blob;
                            }

                            var blob = b64toBlob(data.file, 'application/octet-stream');

                            saveAs(blob, 'file.zip');
                        },
                        error: function (jqXhr, textStatus, errorMessage) {
                            var result = JSON.parse(jqXhr.responseText);
                            console.log(result.message);
                        }
                    });
                });


                // download the processed files
                var downloadButtonF = document.getElementById('f-download')
                downloadButtonF.addEventListener('click', function () {


                    $('#f-error').hide();
                    $('#f-loader').show();

                    var oReqF = new XMLHttpRequest();
                    oReqF.open("GET", "/rest/beapengine/fitbit/download_file", true);
                    oReqF.responseType = "arraybuffer";

                    oReqF.send();

                    oReqF.onload = function(oEvent) {
                        if (this.status == 200) {
                            $('#f-loader').hide();
                            var arrayBuffer = oReqF.response;

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
                            $('#f-loader').hide();
                            var errorDiv = $('#f-error');
                            errorDiv.html("The requested file can't be downloaded");
                            errorDiv.show();
                        }

                    };

                    oReqF.onerror = function (ev) {
                        $('#f-loader').hide();
                        var errorDiv = $('#f-error');
                        errorDiv.html(ev);
                        errorDiv.show();
                    };
                });


                // reset everything
                var resetButtonF = document.getElementById('f-reset')
                resetButtonF.addEventListener('click', function () {
                    $('#f-loader').show();
                    var draggedFilesF = myDropzoneF.files;
                    for (var i = 0; i < draggedFilesF.length; i++) {
                        myDropzoneF.removeFile(draggedFilesF[i]);
                    }

                    // cleanup the server from the previous files before uploading new files
                    $.ajax({
                        type: 'GET',  // http method
                        url: '/rest/beapengine/fitbit/cleanup',
                        success: function (data, status, xhr) {
                            $('#f-loader').hide();
                        },
                        error: function (jqXhr, textStatus, errorMessage) {
                            $('#f-loader').hide();
                            var result = JSON.parse(jqXhr.responseText);
                            var errorDiv = $('#f-error');
                            errorDiv.html(result.message);
                            errorDiv.show();
                        }
                    });

                    $('#f-error').hide();
                    $('#f-loader').hide();
                    $('#f-file-num').hide();
                    $('#f-process-files').prop('disabled', true);
                    $('#f-download').prop('disabled', true);

                });
            </script>
        </div>

        <%--the predict tab--%>
        <div class="tab-pane fade" id="f-nav-predict" role="tabpanel" aria-labelledby="f-nav-predict-tab">

            <div class="row" style="max-height: 300px; overflow: auto;">
                <form action="" class="dropzone col-12" id="f-my-awesome-dropzone-predict" style="margin-top: 10px;">
                </form>
            </div>

            <div class="row">

                <div class="col-8">

                    <div class="row">
                        <button type="submit" style="margin: 10px 5px 0 0" class="btn btn-info" id="f-upload-files-predict">Upload all files</button>

                        <div class="input-group" style="width: 300px; margin: 10px 5px 0 0">
                            <select class="custom-select" id="f-predict-model" aria-label="Example select with button addon">
                                <option selected value="choose">Choose ...</option>
                                <option value="decissionTree">Decision Tree</option>
                                <option value="randomForest">Random Forest</option>
                                <option value="svm">SVM</option>
                                <option value="rotationForest">Rotation Forest</option>
                            </select>
                            <div class="input-group-append">
                                <button class="btn btn-info" disabled id="f-predict-files" type="button">Predict</button>
                            </div>
                        </div>

                        <button style="margin: 10px 5px 0 0" class="btn btn-info" disabled id="f-download-predict">Download predicted files</button>
                    </div>


                </div>

                <div class="col-4 text-right">

                    <div id="f-file-num-predict" style="margin: 15px 5px 0 0;" class="float-left"></div>

                    <button style="margin: 10px 5px 0 0" class="btn btn-danger" id="f-reset-predict">Reset</button>

                    <button style="margin: 10px 5px 0 0;" class="btn btn-warning" id="f-help-predict" data-toggle="modal" data-target="#f-exampleModalCenter-predict">Need help?</button>

                    <div id="f-loader-predict" style="margin: 10px 5px 0 0;" class="loader float-right"></div>

                </div>

            </div>

            <!-- Modal -->
            <div class="modal fade" id="f-exampleModalCenter-predict" tabindex="-1" role="dialog" aria-labelledby="f-exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="f-exampleModalLongTitle-predict">Steps to predict your activities</h5>
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

            <div id="f-error-predict" style="margin-top: 20px;" class="alert alert-danger" role="alert">
            </div>

            <script>

                $('#f-loader-predict').hide();
                $('#f-error-predict').hide();
                $('#f-file-num-predict').hide();
                $('#f-predict-files').prop('disabled', true);
                $('#f-download-predict').prop('disabled', true);

                // Init dropzone instance
                Dropzone.autoDiscover = false
                const myDropzonePredictF = new Dropzone('#f-my-awesome-dropzone-predict', {
                    url: "/rest/beapengine/fitbit/uploadFile",
                    clickable: true,
                    acceptedFiles: '.csv',
                    enqueueForUpload: true,
                    maxFilesize: 500, // 500MB
                    maxFiles: 300, // maximum number of files allowed to be uploaded
                    uploadMultiple: true,
                    addRemoveLinks: true,
                    autoProcessQueue: false,
                    params: {type: "predict"}
                });

                // keep the uploading file names
                const fileNamesPredictF = [];

                myDropzonePredictF.on("sending", function(file, xhr, formData) {
                    // Will send the filesize along with the file as POST data.
                    fileNamesPredictF.push(file.name);
                    formData.append(file.name, file);
                });

                myDropzonePredictF.on("queuecomplete", function(file, xhr, formData) {
                    // Will send the filesize along with the file as POST data.
                    console.log(fileNamesPredictF);
                    $('#f-predict-files').prop('disabled', false);
                });

                myDropzonePredictF.on("error", function(file, errorMessage, xhr) {
                    var errorDiv = $('#f-error-predict');
                    errorDiv.html(errorMessage.message);
                    errorDiv.show();
                });

                myDropzonePredictF.on("maxfilesexceeded", function(file) {
                    console.log('maxfilesexceeded');
                    var errorDiv = $('#f-error-predict');
                    errorDiv.html("You are not allowed to upload more than " + myDropzonePredictF.options.maxFiles + " files.");
                    errorDiv.show();
                });

                myDropzonePredictF.on("addedfile", function(file) {
                    var draggedFilesNum = myDropzonePredictF.files.length;
                    var fileNumDiv = $('#f-file-num-predict');
                    fileNumDiv.html(draggedFilesNum + " files dropped");
                    fileNumDiv.show();
                });

                myDropzonePredictF.on("removedfile", function(file) {
                    var draggedFilesNum = myDropzonePredictF.files.length;
                    var fileNumDiv = $('#f-file-num-predict');
                    fileNumDiv.html(draggedFilesNum + " files dropped");
                    fileNumDiv.show();

                    if (draggedFilesNum <= myDropzonePredictF.options.maxFiles){
                        var errorDiv = $('#f-error-predict');
                        errorDiv.hide();
                    }
                });

                // upload the files to the server
                var uploadButtonF = document.getElementById('f-upload-files-predict')
                uploadButtonF.addEventListener('click', function () {
                    fileNamesPredictF.splice(0, fileNamesPredictF.length);
                    $('#f-loader-predict').hide();
                    $('#f-error-predict').hide();
                    $('#f-process-files-predict').prop('disabled', true);
                    $('#f-download-predict').prop('disabled', true);


                    // cleanup the server from the previous files before uploading new files
                    $.ajax({
                        type: 'GET',  // http method
                        url: '/rest/beapengine/fitbit/cleanup',
                        success: function (data, status, xhr) {
                        },
                        error: function (jqXhr, textStatus, errorMessage) {
                            $('#f-loader-predict').hide();
                            var result = JSON.parse(jqXhr.responseText);
                            var errorDiv = $('#f-error-predict');
                            errorDiv.html(result.message);
                            errorDiv.show();
                        }
                    });


                    // Retrieve selected files
                    const acceptedFilesPredictF = myDropzonePredictF.getAcceptedFiles();
                    for (let i = 0; i < acceptedFilesPredictF.length; i++) {
                        myDropzonePredictF.processFile(acceptedFilesPredictF[i]);
                        // setTimeout(function () {
                        //     myDropzonePredictF.processFile(acceptedFilesPredictF[i])
                        // }, i * 1000)
                    }
                });

                // predict the uploaded files
                var predictButtonF = document.getElementById('f-predict-files')
                predictButtonF.addEventListener('click', function () {
                    $('#f-error-predict').hide();

                    if ($('#f-predict-model').val() == "choose") {
                        var errorDiv = $('#f-error-predict');
                        errorDiv.html("Please select a prediction model to continue");
                        errorDiv.show();
                        return;
                    }

                    $('#f-loader-predict').show();

                    $.ajax({
                        type: 'POST',  // http method
                        url: '/rest/beapengine/fitbit/predict',
                        data: {
                            files: fileNamesPredictF,
                            model: $('#f-predict-model').val()
                        },
                        dataType: 'json',
                        success: function (data, status, xhr) {
                            console.log('status: ' + status + ', data: ' + data);
                            $('#f-loader-predict').hide();
                            $('#f-download-predict').prop('disabled', false);
                        },
                        error: function (jqXhr, textStatus, errorMessage) {
                            $('#f-loader-predict').hide();
                            var result = JSON.parse(jqXhr.responseText);
                            var errorDiv = $('#f-error-predict');
                            errorDiv.html(result.message);
                            errorDiv.show();
                        }
                    });
                });


                // download the predicted files
                var downloadButtonPredictF = document.getElementById('f-download-predict')
                downloadButtonPredictF.addEventListener('click', function () {
                    $('#f-error-predict').hide();
                    $('#f-loader-predict').show();

                    var oReqPF = new XMLHttpRequest();
                    oReqPF.open("GET", "/rest/beapengine/fitbit/downloadFile", true);
                    oReqPF.responseType = "arraybuffer";

                    oReqPF.send();

                    oReqPF.onload = function(oEvent) {
                        if (this.status == 200) {
                            $('#f-loader-predict').hide();
                            var arrayBuffer = oReqPF.response;

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
                            $('#f-loader-predict').hide();
                            var errorDiv = $('#f-error-predict');
                            errorDiv.html("The requested file can't be downloaded");
                            errorDiv.show();
                        }

                    };

                    oReqPF.onerror = function (ev) {
                        $('#f-loader-predict').hide();
                        var errorDiv = $('#f-error-predict');
                        errorDiv.html(ev);
                        errorDiv.show();
                    };
                });


                // reset everything
                var resetButtonPredictF = document.getElementById('f-reset-predict')
                resetButtonPredictF.addEventListener('click', function () {
                    $('#f-loader-predict').show();

                    var draggedFilesPredictF = myDropzonePredictF.files;
                    for (var i = 0; i < draggedFilesPredictF.length; i++) {
                        myDropzonePredictF.removeFile(draggedFilesPredictF[i]);
                    }

                    // cleanup the server from the previous files before uploading new files
                    $.ajax({
                        type: 'GET',  // http method
                        url: '/rest/beapengine/fitbit/cleanup',
                        success: function (data, status, xhr) {
                            $('#f-loader-predict').hide();
                        },
                        error: function (jqXhr, textStatus, errorMessage) {
                            $('#f-loader-predict').hide();
                            var result = JSON.parse(jqXhr.responseText);
                            var errorDiv = $('#f-error-predict');
                            errorDiv.html(result.message);
                            errorDiv.show();
                        }
                    });

                    $('#f-error-predict').hide();
                    $('#f-loader-predict').hide();
                    $('#f-file-num-predict').hide();
                    $('#f-process-files-predict').prop('disabled', true);
                    $('#f-download-predict').prop('disabled', true);

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
    $('#applewatch-nav').click(function () {
        window.location.href = window.location.origin + "/rest/beapengine/applewatch/upload";
    });
</script>

</body>
</html>